import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define JWT_SECRET globally so it's accessible in route handlers
const JWT_SECRET = process.env.JWT_SECRET || 'countries-app-secret-key';
global.JWT_SECRET = JWT_SECRET;

// Function to initialize routes - for Vercel serverless
const initializeRoutes = (app) => {
  // User Schema
  const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
  });

  const User = mongoose.model('User', userSchema);

  // Favorite Schema
  const favoriteSchema = new mongoose.Schema({
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    countryCode: { 
      type: String, 
      required: true 
    },
    countryName: { 
      type: String, 
      required: true 
    },
    flagUrl: { 
      type: String, 
      required: true 
    },
    addedAt: { 
      type: Date, 
      default: Date.now 
    }
  });

  // Compound index to prevent duplicate favorites
  favoriteSchema.index({ userId: 1, countryCode: 1 }, { unique: true });

  const Favorite = mongoose.model('Favorite', favoriteSchema);

  // Register endpoint
  app.post('/api/register', async (req, res) => {
    try {
      console.log('Registration request received:', req.body);
      const { username, email, password } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create new user
      const user = new User({
        username,
        email,
        password: hashedPassword
      });
      
      await user.save();
      console.log('User registered successfully:', username);
      
      // Create and assign token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      
      res.status(201).json({ token, user: { id: user._id, username, email } });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Login endpoint
  app.post('/api/login', async (req, res) => {
    try {
      console.log('Login request received:', req.body.username);
      const { username, password } = req.body;
      
      // Check if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      
      console.log('User logged in successfully:', username);
      
      // Create and assign token
      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
      
      res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Verify token middleware
  const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'Access denied' });
    
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };

  // Protected route example
  app.get('/api/user', verifyToken, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Favorites endpoints
  // Get all favorites for a user
  app.get('/api/favorites', verifyToken, async (req, res) => {
    try {
      const favorites = await Favorite.find({ userId: req.user.id });
      res.json(favorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Add a country to favorites
  app.post('/api/favorites', verifyToken, async (req, res) => {
    try {
      const { countryCode, countryName, flagUrl } = req.body;
      
      if (!countryCode || !countryName) {
        return res.status(400).json({ message: 'Country code and name are required' });
      }

      // Check if country is already in favorites
      const existing = await Favorite.findOne({ 
        userId: req.user.id, 
        countryCode: countryCode 
      });
      
      if (existing) {
        return res.status(400).json({ message: 'Country is already in favorites' });
      }

      // Create a new favorite
      const favorite = new Favorite({
        userId: req.user.id,
        countryCode,
        countryName,
        flagUrl,
      });

      await favorite.save();
      res.status(201).json(favorite);
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Remove a country from favorites
  app.delete('/api/favorites/:countryCode', verifyToken, async (req, res) => {
    try {
      const { countryCode } = req.params;
      
      const result = await Favorite.findOneAndDelete({ 
        userId: req.user.id,
        countryCode: countryCode
      });

      if (!result) {
        return res.status(404).json({ message: 'Favorite not found' });
      }

      res.json({ message: 'Favorite removed successfully' });
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Check if a country is in favorites
  app.get('/api/favorites/:countryCode', verifyToken, async (req, res) => {
    try {
      const { countryCode } = req.params;
      
      const favorite = await Favorite.findOne({ 
        userId: req.user.id,
        countryCode: countryCode
      });

      res.json({ isFavorite: !!favorite });
    } catch (error) {
      console.error('Error checking favorite status:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Basic test route
  app.get('/api/test', (req, res) => {
    res.json({ message: 'API is working!' });
  });
};

// Constants
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://user1:user1@afassignment.sdwzpdb.mongodb.net/?retryWrites=true&w=majority&appName=AFAssignment';
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// For direct execution (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const app = express();
  
  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? [/\.vercel\.app$/, /localhost/] 
      : [/localhost:\d+$/],
    credentials: true
  }));
  app.use(express.json());

  console.log('Starting server...');
  console.log('Attempting to connect to MongoDB Atlas...');

  // Connect to MongoDB Atlas
  mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB Atlas successfully'))
    .catch(err => {
      console.error('MongoDB Atlas connection error:', err);
      console.error('Please check your connection string and network connectivity');
    });
  
  // Initialize routes
  initializeRoutes(app);
  
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export routes for serverless
export default initializeRoutes; 