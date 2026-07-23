import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import interviewRoutes from './routes/interview.js';
import questionRoutes from './routes/question.js';
import adminRoutes from './routes/admin.js';
import aiRoutes from './routes/ai.js';
import resumeRoutes from './routes/resume.js';

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/interview', interviewRoutes);
app.use('/api/v1/question', questionRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/resume', resumeRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({ success: true, message: 'API is running', mode: 'demo' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Running in DEMO mode (no MongoDB required)');
});

export default app;