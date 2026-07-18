import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Route imports
import authRoutes from './routes/auth';
import serviceRoutes from './routes/services';
import requestRoutes from './routes/requests';
import aiRoutes from './routes/ai';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/clarion-nexus';

// 1. Middlewares
app.use(cors({
  origin: '*', // For testing purposes, allows frontend connections from anywhere
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// 2. Database Connection
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
  })
  .catch((err) => {
    console.error('MongoDB connection failure details:', err);
  });

// 3. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 4. API Routes Mapping
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ai', aiRoutes);

// 5. Catch-all for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
});

// 6. Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error occurred',
    error: process.env.NODE_ENV === 'development' ? err : undefined
  });
});

// 7. Start Server
app.listen(PORT, () => {
  console.log(`Clarion Nexus Backend running on http://localhost:${PORT}`);
});
