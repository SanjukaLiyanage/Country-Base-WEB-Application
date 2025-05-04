import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Container, 
  Alert, 
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { API_BASE_URL } from '../config/apiConfig';

// API base URL now imported from config
// const API_BASE_URL = 'http://localhost:5000';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if server is running
    const checkServer = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/test`);
        if (response.ok) {
          setServerStatus('connected');
        } else {
          setServerStatus('error');
        }
      } catch (error) {
        console.error('Server connection error:', error);
        setServerStatus('error');
      }
    };

    checkServer();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      const result = await login(username, password);
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Error connecting to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box sx={{ bgcolor: theme === 'dark' ? 'background.default' : '#dadada', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff'
        }}>
          <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 2,
              p: 2,
              bgcolor: '#333',
              borderRadius: '50%',
              width: 64,
              height: 64,
              mx: 'auto'
            }}>
              <LockOutlinedIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            
            <Typography variant="h4" align="center" sx={{ mb: 3, fontWeight: 'bold', color: '#222' }}>
              Sign In
            </Typography>
            
            {serverStatus === 'connected' && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, color: '#444' }}>
                <CheckCircleIcon sx={{ mr: 1, color: '#444' }} /> Server connected
              </Box>
            )}
            
            {serverStatus === 'error' && (
              <Alert severity="error" sx={{ mb: 3 }}>
                Cannot connect to server. Please make sure the backend is running.
                <Box mt={1} fontSize="0.85rem">
                  Note: If you were previously logged in, your session has been cleared for security reasons.
                </Box>
              </Alert>
            )}
            
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}
            
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: '10px' }
              }}
            />
            
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: '10px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <Button
              type="submit"
              variant="contained"
              disabled={loading || serverStatus === 'error'}
              sx={{ 
                py: 1.5,
                bgcolor: '#222222',
                '&:hover': {
                  bgcolor: '#333333'
                },
                '&:disabled': {
                  bgcolor: '#777777'
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
            
            <Link to="/register" style={{ 
              color: '#444', 
              marginTop: '1.5rem', 
              textAlign: 'center',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}>
              Don't have an account? Register here
            </Link>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login; 