import { useContext, useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem, 
  Avatar, 
  Divider,
  Container,
  useMediaQuery,
  useTheme,
  Badge
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PublicIcon from '@mui/icons-material/Public';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { AuthContext } from '../context/AuthContext';
import { FavoritesContext } from '../context/FavoritesContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, isAuthenticated, logout, serverStatus } = useContext(AuthContext);
  const { favorites } = useContext(FavoritesContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  // Force logout when server goes offline
  useEffect(() => {
    if (serverStatus === 'offline' && isAuthenticated) {
      console.log('Server is offline, forcing logout from Navbar');
      logout();
      // Don't navigate here to avoid conflicts with other redirects
    }
  }, [serverStatus, isAuthenticated, logout]);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
    handleMobileMenuClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleClose();
    handleMobileMenuClose();
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0} 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1, 
        background: 'rgba(0, 0, 0, 0.95)', 
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <IconButton
              component={RouterLink}
              to="/"
              sx={{ 
                mr: 1.5, 
                background: 'linear-gradient(45deg, #222222, #444444)',
                borderRadius: '12px',
                p: 1.2,
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                },
                transition: 'all 0.3s'
              }}
            >
              <PublicIcon sx={{ fontSize: 28, color: 'white' }} />
            </IconButton>
            <Typography
              variant="h5"
              component={RouterLink}
              to="/"
              sx={{ 
                textDecoration: 'none', 
                color: 'white',
                fontWeight: '700',
                letterSpacing: '0.5px',
                backgroundImage: 'linear-gradient(45deg, #ffffff, #cccccc)',
                backgroundSize: '100%',
                backgroundRepeat: 'repeat',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            >
              Country Base
            </Typography>
          </Box>

          {/* Theme Toggle always visible */}
          <ThemeToggle />

          {isMobile ? (
            <>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
                sx={{ 
                  ml: 1,
                  borderRadius: '10px',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)'
                  }
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={mobileMenuAnchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(mobileMenuAnchorEl)}
                onClose={handleMobileMenuClose}
                sx={{
                  '& .MuiPaper-root': {
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    mt: 1.5
                  }
                }}
              >
                <MenuItem onClick={() => handleNavigate('/')} sx={{ py: 1.5, px: 2 }}>
                  <PublicIcon sx={{ mr: 1.5, fontSize: 20 }} />
                  Home
                </MenuItem>
                {isAuthenticated && (
                  <MenuItem onClick={() => handleNavigate('/favorites')} sx={{ py: 1.5, px: 2 }}>
                    <FavoriteIcon sx={{ mr: 1.5, fontSize: 20, color: '#555555' }} />
                    Favorites
                    {favorites.length > 0 && (
                      <Badge
                        badgeContent={favorites.length}
                        color="primary"
                        sx={{ ml: 1 }}
                      />
                    )}
                  </MenuItem>
                )}
                {isAuthenticated ? (
                  <>
                    <MenuItem disabled sx={{ py: 1.5, px: 2 }}>
                      <Typography variant="body2">
                        Signed in as {user?.username}
                      </Typography>
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, color: '#555555' }}>
                      <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleNavigate('/login')} sx={{ py: 1.5, px: 2 }}>
                      <LoginIcon fontSize="small" sx={{ mr: 1.5 }} />
                      Login
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/register')} sx={{ py: 1.5, px: 2 }}>
                      <PersonIcon fontSize="small" sx={{ mr: 1.5 }} />
                      Register
                    </MenuItem>
                  </>
                )}
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/"
                sx={{ 
                  textTransform: 'none', 
                  fontWeight: 500,
                  mx: 1,
                  borderRadius: '10px',
                  px: 2,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}
                startIcon={<PublicIcon />}
              >
                Home
              </Button>
              
              {isAuthenticated && (
                <Button 
                  color="inherit" 
                  component={RouterLink} 
                  to="/favorites"
                  sx={{ 
                    textTransform: 'none', 
                    fontWeight: 500,
                    mx: 1,
                    borderRadius: '10px',
                    px: 2,
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.3s'
                  }}
                  startIcon={
                    <Badge badgeContent={favorites.length} color="primary" invisible={favorites.length === 0}>
                      <FavoriteIcon sx={{ color: '#555555' }} />
                    </Badge>
                  }
                >
                  Favorites
                </Button>
              )}
              
              {isAuthenticated ? (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={handleMenu}
                      sx={{ 
                        ml: 2,
                        border: '2px solid',
                        borderColor: 'primary.main',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Avatar sx={{ 
                        width: 32, 
                        height: 32, 
                        bgcolor: '#444444',
                        fontWeight: 'bold'
                      }}>
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </Avatar>
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      sx={{
                        '& .MuiPaper-root': {
                          borderRadius: '12px',
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          mt: 1.5,
                          width: '200px'
                        }
                      }}
                    >
                      <Box sx={{ py: 2, px: 2, textAlign: 'center' }}>
                        <Avatar sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: '#444444',
                          mx: 'auto',
                          mb: 1,
                          fontWeight: 'bold',
                          fontSize: '1.5rem'
                        }}>
                          {user?.username?.charAt(0).toUpperCase() || 'U'}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                          {user?.username}
                        </Typography>
                      </Box>
                      <Divider />
                      <MenuItem onClick={handleLogout} sx={{ py: 1.5, px: 2, color: '#555555' }}>
                        <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                        Logout
                      </MenuItem>
                    </Menu>
                  </Box>
                </>
              ) : (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/login"
                    sx={{ 
                      ml: 1,
                      textTransform: 'none', 
                      fontWeight: 500,
                      borderRadius: '10px',
                      py: 1,
                      px: 2,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s'
                    }}
                    startIcon={<LoginIcon />}
                  >
                    Login
                  </Button>
                  <Button 
                    variant="contained"
                    component={RouterLink} 
                    to="/register"
                    sx={{ 
                      ml: 1.5,
                      textTransform: 'none', 
                      fontWeight: 500,
                      borderRadius: '10px',
                      py: 1,
                      px: 2.5,
                      background: 'linear-gradient(45deg, #222222, #333333)',
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                      '&:hover': {
                        boxShadow: '0 6px 15px rgba(0, 0, 0, 0.3)',
                        transform: 'translateY(-2px)',
                        background: 'linear-gradient(45deg, #1a1a1a, #2a2a2a)'
                      },
                      transition: 'all 0.3s'
                    }}
                    startIcon={<PersonIcon />}
                  >
                    Register
                  </Button>
                </>
              )}
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 