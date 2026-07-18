import { Response } from 'express';
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { RequestModel } from '../models/Request';

const router = Router();

// Check if database is connected
const isDbConnected = () => true;

// Check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id) && String(new mongoose.Types.ObjectId(id)) === id;

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
      if (isDbConnected() && isValidObjectId(userId!)) {
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
        const newRequest: any = {
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

        ({} as any).requests.push(newRequest);
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
    if (isDbConnected() && isValidObjectId(userId!)) {
      let requests;
      if (userRole === 'admin') {
        requests = await RequestModel.find().populate('user', 'name email avatarUrl').sort({ createdAt: -1 });
      } else {
        requests = await RequestModel.find({ user: userId }).sort({ createdAt: -1 });
      }
      return res.json(requests);
    } else {
      // Fallback: Query ({} as any).requests
      let results = [];

      if (userRole === 'admin') {
        // Return all with user profile details populated from ({} as any).users
        results = ({} as any).requests.map(r => {
          const userObj = ({} as any).users.find(u => u._id === r.user);
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
        results = ({} as any).requests.filter(r => r.user === userId);
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
      const reqIndex = ({} as any).requests.findIndex(r => r._id === requestId);
      if (reqIndex === -1) {
        return res.status(404).json({ message: 'Project request not found' });
      }

      const requestItem = ({} as any).requests[reqIndex];

      // Check ownership
      const requestOwnerId = typeof requestItem.user === 'object' ? requestItem.user._id : requestItem.user;
      if (requestOwnerId !== userId && userRole !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to delete this request' });
      }

      ({} as any).requests.splice(reqIndex, 1);
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


// @route   PATCH /api/requests/:id/status
// @desc    Update request status (Admin only) — approve / reject / mark in-progress / completed
router.patch('/:id/status', authenticateToken, async (req: AuthRequest, res: Response) => {
  const requestId = req.params.id;
  const userRole = req.user?.role;
  const { status } = req.body;

  if (userRole !== 'admin') {
    return res.status(403).json({ message: 'Only admins can update request status' });
  }

  const validStatuses = ['pending', 'in-progress', 'completed', 'rejected'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    if (isDbConnected() && isValidObjectId(requestId)) {
      const updated = await RequestModel.findByIdAndUpdate(
        requestId,
        { status },
        { new: true }
      ).populate('user', 'name email avatarUrl');

      if (!updated) {
        return res.status(404).json({ message: 'Request not found' });
      }
      return res.json(updated);
    } else {
      // MemoryDB fallback
      const reqItem = ({} as any).requests.find(r => r._id === requestId);
      if (!reqItem) {
        return res.status(404).json({ message: 'Request not found' });
      }
      reqItem.status = status;
      return res.json(reqItem);
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating status' });
  }
});

export default router;
