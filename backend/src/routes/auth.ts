import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { User } from '../models/User';
import * as memoryDb from '../memoryDb';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'clarion_nexus_super_secret_session_token_key_123!';

// Helper to sign JWT
const signToken = (userId: string, role: string) => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '7d' });
};

// Check if mongoose is connected
const isDbConnected = () => mongoose.connection.readyState === 1;

// @route   POST /api/auth/register
// @desc    Register a new client user
router.post(
  '/register',
  [
    body('name', 'Name is required').notEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password must be 6 or more characters').isLength({ min: 6 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const lowerEmail = email.toLowerCase().trim();

    try {
      if (isDbConnected()) {
        let user = await User.findOne({ email: lowerEmail });
        if (user) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
          name,
          email: lowerEmail,
          password: hashedPassword,
          role: 'client'
        });

        await user.save();
        const token = signToken(user.id, user.role);

        return res.status(201).json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        });
      } else {
        // Fallback to MemoryDB
        const userExists = memoryDb.users.some(u => u.email === lowerEmail);
        if (userExists) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser: memoryDb.MemoryUser = {
          _id: `user_mem_${Date.now()}`,
          name,
          email: lowerEmail,
          password: hashedPassword,
          role: 'client',
          createdAt: new Date()
        };

        memoryDb.users.push(newUser);
        const token = signToken(newUser._id, newUser.role);

        return res.status(201).json({
          token,
          user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }
        });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: 'Server error during registration' });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase().trim();

    try {
      if (isDbConnected()) {
        const user = await User.findOne({ email: lowerEmail }).select('+password');
        if (!user || !user.password) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user.id, user.role);

        return res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
          }
        });
      } else {
        // Fallback to MemoryDB
        const user = memoryDb.users.find(u => u.email === lowerEmail);
        if (!user || !user.password) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = signToken(user._id, user.role);

        return res.json({
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl
          }
        });
      }
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: 'Server error during login' });
    }
  }
);

// @route   POST /api/auth/demo-login
// @desc    Demo Login for Client or Admin roles (instant access)
router.post('/demo-login', async (req: Request, res: Response) => {
  const { role } = req.body; // 'client' or 'admin'
  const targetRole = role === 'admin' ? 'admin' : 'client';
  const demoEmail = targetRole === 'admin' ? 'admin@nexus.com' : 'demo@nexus.com';

  try {
    if (isDbConnected()) {
      let user = await User.findOne({ email: demoEmail });

      if (!user) {
        const demoName = targetRole === 'admin' ? 'Clarion Admin' : 'Demo Client';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('nexuspass123', salt);

        user = new User({
          name: demoName,
          email: demoEmail,
          password: hashedPassword,
          role: targetRole,
          avatarUrl: targetRole === 'admin' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' : 'https://api.dicebear.com/7.x/avataaars/svg?seed=client'
        });
        await user.save();
      }

      const token = signToken(user.id, user.role);

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } else {
      // Fallback to MemoryDB
      let user = memoryDb.users.find(u => u.email === demoEmail);

      if (!user) {
        const demoName = targetRole === 'admin' ? 'Clarion Admin' : 'Demo Client';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('nexuspass123', salt);

        user = {
          _id: targetRole === 'admin' ? 'user_admin_demo_id' : 'user_client_demo_id',
          name: demoName,
          email: demoEmail,
          password: hashedPassword,
          role: targetRole,
          avatarUrl: targetRole === 'admin' ? 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' : 'https://api.dicebear.com/7.x/avataaars/svg?seed=client',
          createdAt: new Date()
        };
        memoryDb.users.push(user);
      }

      const token = signToken(user._id, user.role);

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error during demo login' });
  }
});

// @route   POST /api/auth/google
// @desc    Handle simulated or actual Google OAuth authentication
router.post('/google', async (req: Request, res: Response) => {
  const { name, email, googleId, avatarUrl } = req.body;

  if (!email || !googleId) {
    return res.status(400).json({ message: 'Email and Google ID are required' });
  }

  const lowerEmail = email.toLowerCase().trim();

  try {
    if (isDbConnected()) {
      let user = await User.findOne({ $or: [{ googleId }, { email: lowerEmail }] });

      if (user) {
        if (!user.googleId) {
          user.googleId = googleId;
          if (avatarUrl && !user.avatarUrl) {
            user.avatarUrl = avatarUrl;
          }
          await user.save();
        }
      } else {
        user = new User({
          name: name || 'Google User',
          email: lowerEmail,
          role: 'client',
          googleId,
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lowerEmail}`
        });
        await user.save();
      }

      const token = signToken(user.id, user.role);

      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    } else {
      // Fallback to MemoryDB
      let user = memoryDb.users.find(u => u.googleId === googleId || u.email === lowerEmail);

      if (user) {
        if (!user.googleId) {
          user.googleId = googleId;
          if (avatarUrl && !user.avatarUrl) {
            user.avatarUrl = avatarUrl;
          }
        }
      } else {
        user = {
          _id: `user_google_${Date.now()}`,
          name: name || 'Google User',
          email: lowerEmail,
          role: 'client',
          googleId,
          avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${lowerEmail}`,
          createdAt: new Date()
        };
        memoryDb.users.push(user);
      }

      const token = signToken(user._id, user.role);

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl
        }
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error during Google auth' });
  }
});

export default router;
