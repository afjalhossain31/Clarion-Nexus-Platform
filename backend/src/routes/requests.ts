import { Response } from 'express';
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { RequestModel } from '../models/Request';
import * as memoryDb from '../memoryDb';

const router = Router();

// Check if database is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   POST /api/requests
// @desc    Create a new custom project request
router.post(
  '/',
  authenticateToken,
  [
    body('title', 'Title is required').notEmpty(),
    body('shortDesc', 'Short description is required').notEmpty(),
    body('fullDesc', 'Full description is required').notEmpty(),
    body('budget', 'Budget must be a positive number').isNumeric().custom((val) => val > 0)
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, shortDesc, fullDesc, budget, imageUrl } = req.body;
    const userId = req.user?.id;

    try {
      if (isDbConnected()) {
        const newRequest = new RequestModel({
          user: userId,
          title,
          shortDesc,
          fullDesc,
          budget,
          imageUrl: imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${title}`
        });

        const savedRequest = await newRequest.save();
        return res.status(201).json(savedRequest);
      } else {
        // Fallback to MemoryDB
        const newRequest: memoryDb.MemoryRequest = {
          _id: `req_mem_${Date.now()}`,
          user: userId || 'anonymous',
          title,
          shortDesc,
          fullDesc,
          budget,
          imageUrl: imageUrl || `https://api.dicebear.com/7.x/identicon/svg?seed=${title}`,
          status: 'pending',
          createdAt: new Date()
        };

        memoryDb.requests.push(newRequest);
        return res.status(201).json(newRequest);
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: 'Server error creating project request' });
    }
  }
);

// @route   GET /api/requests
// @desc    Get user's requests (Admin gets all, Client gets their own)
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  const userRole = req.user?.role;

  try {
    if (isDbConnected()) {
      let requests;
      if (userRole === 'admin') {
        requests = await RequestModel.find().populate('user', 'name email avatarUrl').sort({ createdAt: -1 });
      } else {
        requests = await RequestModel.find({ user: userId }).sort({ createdAt: -1 });
      }
      return res.json(requests);
    } else {
      // Fallback: Query memoryDb.requests
      let results = [];

      if (userRole === 'admin') {
        // Return all with user profile details populated from memoryDb.users
        results = memoryDb.requests.map(r => {
          const userObj = memoryDb.users.find(u => u._id === r.user);
          return {
            ...r,
            user: userObj ? {
              _id: userObj._id,
              name: userObj.name,
              email: userObj.email,
              avatarUrl: userObj.avatarUrl
            } : { name: 'Unknown User', email: 'unknown@nexus.com' }
          };
        });
      } else {
        // Client sees only their own
        results = memoryDb.requests.filter(r => r.user === userId);
      }

      // Sort newest first
      results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      return res.json(results);
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving requests' });
  }
});

// @route   DELETE /api/requests/:id
// @desc    Delete a request (Owner or Admin only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  const requestId = req.params.id;
  const userId = req.user?.id;
  const userRole = req.user?.role;

  try {
    if (isDbConnected()) {
      const requestItem = await RequestModel.findById(requestId);
      if (!requestItem) {
        return res.status(404).json({ message: 'Project request not found' });
      }

      if (requestItem.user.toString() !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to delete this request' });
      }

      await RequestModel.findByIdAndDelete(requestId);
      return res.json({ message: 'Project request deleted successfully', id: requestId });
    } else {
      // Fallback to MemoryDB
      const reqIndex = memoryDb.requests.findIndex(r => r._id === requestId);
      if (reqIndex === -1) {
        return res.status(404).json({ message: 'Project request not found' });
      }

      const requestItem = memoryDb.requests[reqIndex];

      // Check ownership
      const requestOwnerId = typeof requestItem.user === 'object' ? requestItem.user._id : requestItem.user;
      if (requestOwnerId !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to delete this request' });
      }

      memoryDb.requests.splice(reqIndex, 1);
      return res.json({ message: 'Project request deleted successfully', id: requestId });
    }
  } catch (err: any) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Project request not found' });
    }
    res.status(500).json({ message: 'Server error deleting request' });
  }
});

export default router;
