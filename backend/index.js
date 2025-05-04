// Vercel serverless adapter for Express
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import initializeRoutes from './server.js';

// Initialize environment variables
dotenv.config();

// Make JWT_SECRET globally available for route handlers in server.js
global.JWT_SECRET = process.env.JWT_SECRET || 'countries-app-secret-key';

// Create Express app
const app = express();

// Enable more detailed error logging
console.log('Starting backend server in environment:', process.env.NODE_ENV);
console.log('MongoDB URI is defined:', !!process.env.MONGODB_URI);
console.log('JWT_SECRET is defined:', !!process.env.JWT_SECRET);

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

// Add a detailed database test endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const connectionState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({ 
      status: 'ok', 
      dbState: stateMap[connectionState] || 'unknown',
      mongooseVersion: mongoose.version,
      nodeEnv: process.env.NODE_ENV
    });
  } catch (error) {
    console.error('Error in db-test endpoint:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'production' ? null : error.stack
    });
  }
});

// Database connection with improved error handling
const connectDB = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user1:user1@afassignment.sdwzpdb.mongodb.net/?retryWrites=true&w=majority&appName=AFAssignment';
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    console.log('Attempting to connect to MongoDB...');
    
    // Use a more robust connection config for serverless environments
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,  // Timeout after 5 seconds
      socketTimeoutMS: 45000,          // Close sockets after 45 seconds
    });
    
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    // Continue serving routes even if DB connection fails
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Connect to database
await connectDB();

// Initialize routes from server.js
initializeRoutes(app);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler with more detailed logging
app.use((err, req, res, next) => {
  console.error('Express error handler caught:', err.message);
  console.error('Stack trace:', err.stack);
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message,
    path: req.path
  });
});

// Export for Vercel serverless function
export default app; 