import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { useContext, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import ServerStatusAlert from './components/ServerStatusAlert';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CountryDetail from './pages/CountryDetail';
import Favorites from './pages/Favorites';
// Import force logout utility
import './utils/forceLogoutOnServerDisconnect';

// App component that uses the theme context
const AppContent = () => {
  const { theme } = useContext(ThemeContext);
  
  // Create a theme instance that changes based on theme context
  const muiTheme = useMemo(() => createTheme({
    typography: {
      fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    palette: {
      mode: theme,
      primary: {
        main: theme === 'dark' ? '#333333' : '#222222',
        light: theme === 'dark' ? '#444444' : '#444444',
        dark: theme === 'dark' ? '#111111' : '#111111',
      },
      secondary: {
        main: theme === 'dark' ? '#f78faa' : '#f50057',
      },
      background: {
        default: theme === 'dark' ? '#1a1c23' : '#dadada',
        paper: theme === 'dark' ? '#252836' : '#ffffff',
      },
      text: {
        primary: theme === 'dark' ? '#eef1fb' : '#212529',
        secondary: theme === 'dark' ? '#a9b1d6' : '#6c757d',
      },
      success: {
        main: theme === 'dark' ? '#60d394' : '#198754',
      },
      error: {
        main: theme === 'dark' ? '#f77' : '#dc3545',
      },
      warning: {
        main: theme === 'dark' ? '#ffb74d' : '#ffc107',
      },
      info: {
        main: theme === 'dark' ? '#64b5f6' : '#0dcaf0',
      },
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingLeft: 0,
            paddingRight: 0,
            '@media (min-width: 600px)': {
              paddingLeft: 0,
              paddingRight: 0,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: theme === 'dark' ? '#252836' : '#ffffff',
            boxShadow: theme === 'dark' 
              ? '0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.08)',
            borderRadius: 12,
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          }
        }
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: theme === 'dark' ? '#242736' : 'rgba(255, 255, 255, 0.8)',
            color: theme === 'dark' ? '#eef1fb' : '#212529',
            boxShadow: theme === 'dark' 
              ? '0 2px 10px rgba(0, 0, 0, 0.3)'
              : '0 2px 10px rgba(0, 0, 0, 0.1)'
          }
        }
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            boxShadow: 'none',
            transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            },
          },
          containedPrimary: {
            background: theme === 'dark' 
              ? 'linear-gradient(45deg, #333333, #444444)'
              : 'linear-gradient(45deg, #222222, #333333)',
            boxShadow: theme === 'dark'
              ? '0 4px 10px rgba(0, 0, 0, 0.3)'
              : '0 4px 10px rgba(0, 0, 0, 0.2)',
            '&:hover': {
              boxShadow: theme === 'dark'
                ? '0 6px 15px rgba(0, 0, 0, 0.4)'
                : '0 6px 15px rgba(0, 0, 0, 0.3)',
              background: theme === 'dark'
                ? 'linear-gradient(45deg, #222222, #333333)'
                : 'linear-gradient(45deg, #111111, #222222)',
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            marginBottom: 16,
            '& .MuiOutlinedInput-root': {
              borderRadius: 10,
              transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
            },
          },
        },
      },
      MuiInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: theme === 'dark'
              ? '0 4px 20px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(0,0,0,0.08)',
          },
        },
      },
    },
  }), [theme]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <FavoritesProvider>
          <Router>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                minHeight: '100vh',
                width: '100%',
                overflow: 'hidden',
                background: theme === 'dark' 
                  ? 'linear-gradient(135deg, #1a1c23 0%, #252836 100%)'
                  : '#dadada',
                transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
              }}
              className="app-container"
            >
              <Navbar />
              <ServerStatusAlert />
              <Box 
                component="main" 
                className="main-content"
                sx={{ 
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  overflow: 'auto',
                  bgcolor: theme === 'dark' ? 'background.default' : '#dadada',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
                }}
              >
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/country/:code" element={<CountryDetail />} />
                  <Route path="/favorites" element={<Favorites />} />
                </Routes>
              </Box>
            </Box>
          </Router>
        </FavoritesProvider>
      </AuthProvider>
    </MuiThemeProvider>
  );
};

// Main App component that wraps everything with ThemeProvider
function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
