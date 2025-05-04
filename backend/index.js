// Vercel serverless adapter for Express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initializeRoutes from './server.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [/\.vercel\.app$/, /localhost/] 
    : [/localhost:\d+$/],
  credentials: true
}));
app.use(express.json());

// Add explicit root routes
app.get('/', (req, res) => {
  res.json({ message: 'Country Base API is running' });
});

app.get('/api', (req, res) => {
  res.json({ message: 'API endpoint root' });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API test endpoint is working!' });
});

// Database connection
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user1:user1@afassignment.sdwzpdb.mongodb.net/?retryWrites=true&w=majority&appName=AFAssignment';
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // In serverless, we don't want to exit the process
  }
};

// Connect to database
connectDB();

// Initialize routes from server.js
initializeRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Export for Vercel serverless function
export default app; 