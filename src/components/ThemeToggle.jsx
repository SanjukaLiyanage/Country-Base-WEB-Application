import { useContext } from 'react';
import { IconButton, Tooltip, Box } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <Tooltip title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
      <Box sx={{ 
        position: 'relative',
        mx: 1,
        borderRadius: '24px',
        background: theme === 'light' ? 'linear-gradient(145deg, #e6e6e6, #ffffff)' : 'linear-gradient(145deg, #2d2d2d, #252525)',
        boxShadow: theme === 'light' 
          ? 'inset 2px 2px 5px rgba(0,0,0,0.05), inset -2px -2px 5px rgba(255,255,255,0.5)'
          : 'inset 2px 2px 5px rgba(0,0,0,0.3), inset -2px -2px 5px rgba(255,255,255,0.05)',
        padding: '2px',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}>
        <IconButton 
          onClick={toggleTheme} 
          color="inherit" 
          aria-label="toggle theme"
          sx={{ 
            p: 1,
            transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
            position: 'relative',
            zIndex: 2,
            '&:hover': {
              transform: 'rotate(45deg)'
            }
          }}
        >
          {theme === 'light' ? (
            <Brightness4Icon 
              sx={{ 
                color: '#5c6bc0',
                filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.1))'
              }} 
            />
          ) : (
            <Brightness7Icon 
              sx={{ 
                color: '#FFD700',
                filter: 'drop-shadow(0 0 5px rgba(255,215,0,0.3))'
              }} 
            />
          )}
        </IconButton>
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.3,
            background: theme === 'light' 
              ? 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(173,216,230,0.5) 100%)' 
              : 'radial-gradient(circle, rgba(41,41,41,1) 0%, rgba(17,17,17,0.8) 100%)',
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />
      </Box>
    </Tooltip>
  );
};

export default ThemeToggle; 