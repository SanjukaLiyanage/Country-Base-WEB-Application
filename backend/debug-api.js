// Simplified API for testing MongoDB connection
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Debug API is running' });
});

// MongoDB connection test endpoint
app.get('/api/mongo-test', async (req, res) => {
  try {
    // Connection status
    const connectionState = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    // Try to connect if not already connected
    if (connectionState !== 1) {
      const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user1:user1@afassignment.sdwzpdb.mongodb.net/?retryWrites=true&w=majority&appName=AFAssignment';
      
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      
      console.log('MongoDB connected from test endpoint');
    }
    
    // Define a simple test schema
    const testSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now }
    });
    
    // Create or retrieve model
    const TestModel = mongoose.models.Test || mongoose.model('Test', testSchema);
    
    // Create a new test document
    const testDoc = new TestModel({ name: 'Test_' + Date.now() });
    await testDoc.save();
    
    // Count documents
    const count = await TestModel.countDocuments();
    
    res.json({
      success: true,
      connectionState: stateMap[mongoose.connection.readyState],
      databaseName: mongoose.connection.name,
      modelCreated: true,
      docsSaved: count,
      env: {
        nodeEnv: process.env.NODE_ENV,
        mongodbUri: process.env.MONGODB_URI ? '(defined)' : '(not defined)',
        jwtSecret: process.env.JWT_SECRET ? '(defined)' : '(not defined)'
      }
    });
  } catch (error) {
    console.error('MongoDB test error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error caught in debug-api:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: err.message
  });
});

// Export for Vercel serverless function
export default app; 