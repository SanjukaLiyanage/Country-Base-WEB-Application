// Simple Express server to test Vercel deployment
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'API endpoint' });
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

export default app; 