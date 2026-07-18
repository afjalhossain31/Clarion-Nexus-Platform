import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/User';
import * as memoryDb from '../memoryDb';
import dotenv from 'dotenv';
import { authenticateToken, AuthRequest } from '../middleware/auth';

dotenv.config();

const router = Router();

// Lazy configuration helper functions
const getJwtSecret = () => process.env.JWT_SECRET || 'clarion_nexus_super_secret_session_token_key_123!';
const getGoogleClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  return {
    client: new OAuth2Client(clientId),
    clientId
  };
};


// Helper to sign JWT - includes user info for MemoryDB recovery
const signToken = (userId: string, role: string, extra?: { name?: string; email?: string; avatarUrl?: string }) => {
  return jwt.sign({ id: userId, role, ...extra }, getJwtSecret(), { expiresIn: '7d' });
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
        const token = signToken(user.id, user.role, { name: user.name, email: user.email });

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
        const token = signToken(newUser._id, newUser.role, { name: newUser.name, email: newUser.email });

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

        const token = signToken(user.id, user.role, { name: user.name, email: user.email, avatarUrl: user.avatarUrl });

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

        const token = signToken(user._id, user.role, { name: user.name, email: user.email, avatarUrl: user.avatarUrl });

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

      const token = signToken(user.id, user.role, { name: user.name, email: user.email, avatarUrl: user.avatarUrl });

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

      const token = signToken(user._id, user.role, { name: user.name, email: user.email, avatarUrl: user.avatarUrl });

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
// @desc    Verify real Google ID Token (from Google One Tap / OAuth popup) and issue JWT
router.post('/google', async (req: Request, res: Response) => {
  const { credential } = req.body; // Google ID token from frontend

  if (!credential) {
    return res.status(400).json({ message: 'Google credential token is required' });
  }

  try {
    // --- Verify Google ID token ---
    const { client, clientId } = getGoogleClient();
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ message: 'Invalid Google token' });
    }

    const { sub: googleId, email, name, picture: avatarUrl } = payload;
    const lowerEmail = email.toLowerCase().trim();

    // --- Find or create user ---
    if (isDbConnected()) {
      let user = await User.findOne({ $or: [{ googleId }, { email: lowerEmail }] });

      if (user) {
        // Link Google account if not already linked
        if (!user.googleId) {
          user.googleId = googleId;
          if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
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

      const token = signToken(user.id, user.role, { name: user.name, email: user.email, avatarUrl: user.avatarUrl });
      return res.json({
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }
      });

    } else {
      // --- MemoryDB fallback ---
      let user = memoryDb.users.find(u => u.googleId === googleId || u.email === lowerEmail);

      if (user) {
        if (!user.googleId) {
          user.googleId = googleId;
          if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
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

      const token = signToken(user._id, user.role, { name: user.name, email: user.email, avatarUrl: user.avatarUrl });
      return res.json({
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }
      });
    }

  } catch (err: any) {
    console.error('[Google Auth Error]', err.message);
    return res.status(401).json({ message: 'Google authentication failed. Token may be invalid or expired.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile details
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'User ID missing' });

  try {
    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      });
    } else {
      // MemoryDB fallback — try to find in memory first
      const user = memoryDb.users.find(u => u._id === userId);
      if (!user) {
        // User not found in MemoryDB (server may have restarted) — fall back to JWT payload data
        const jwtUser = req.user!;
        if (!jwtUser.name || !jwtUser.email) {
          return res.status(404).json({ message: 'User not found. Please log in again.' });
        }
        return res.json({
          id: jwtUser.id,
          name: jwtUser.name,
          email: jwtUser.email,
          role: jwtUser.role,
          avatarUrl: jwtUser.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${jwtUser.email}`,
          createdAt: null
        });
      }
      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

export default router;

