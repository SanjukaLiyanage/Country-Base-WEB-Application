import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

// API base URL - using only local development URL
const API_BASE_URL = 'http://localhost:5000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverStatus, setServerStatus] = useState('unknown'); // 'unknown', 'online', 'offline'

  // Function to check server status
  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        console.log('Server is online');
        setServerStatus('online');
        return true;
      } else {
        console.error('Server responded with error:', response.status);
        setServerStatus('offline');
        return false;
      }
    } catch (error) {
      console.error('Error checking server status:', error);
      setServerStatus('offline');
      return false;
    }
  };

  // Function to clear user authentication
  const clearAuthentication = () => {
    console.log('Clearing authentication data due to server offline');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Watch for server status changes
  useEffect(() => {
    if (serverStatus === 'offline') {
      clearAuthentication();
    }
  }, [serverStatus]);

  useEffect(() => {
    // Initial server check
    checkServerStatus();

    // Check if user is logged in from localStorage (only if we haven't checked server yet)
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);

    // Set up periodic server check every 10 seconds
    const serverCheckInterval = setInterval(() => {
      console.log('Performing periodic server check');
      checkServerStatus();
    }, 10000); // Check every 10 seconds (reduced from 30s for faster response)

    // Clean up interval on unmount
    return () => {
      if (serverCheckInterval) {
        clearInterval(serverCheckInterval);
      }
    };
  }, []);

  // Register user
  const register = async (username, email, password) => {
    if (serverStatus === 'offline') {
      return { 
        success: false, 
        message: 'Server is offline. Please make sure the backend server is running.' 
      };
    }

    try {
      console.log('Attempting to register user:', username);
      
      const response = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.message || 'Registration failed. Please try again later.' 
      };
    }
  };

  // Login user
  const login = async (username, password) => {
    if (serverStatus === 'offline') {
      return { 
        success: false, 
        message: 'Server is offline. Please make sure the backend server is running.' 
      };
    }

    try {
      console.log('Attempting to login user:', username);
      
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed. Please check your credentials.' 
      };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        serverStatus,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 