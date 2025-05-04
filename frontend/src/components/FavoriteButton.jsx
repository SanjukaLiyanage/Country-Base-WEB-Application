import { useState, useContext } from 'react';
import { IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = ({ country, size = 'medium' }) => {
  const { isFavorite, toggleFavorite } = useContext(FavoritesContext);
  const { isAuthenticated } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate();
  
  const countryCode = country.cca3 || country.alpha3Code;
  const isFav = isFavorite(countryCode);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (!isAuthenticated) {
      setSnackbar({
        open: true,
        message: 'You need to login to add favorites',
        severity: 'warning'
      });
      return;
    }
    
    try {
      setLoading(true);
      const result = await toggleFavorite(country);
      
      if (result.success) {
        setSnackbar({
          open: true,
          message: isFav 
            ? `${country.name.common || country.name} removed from favorites` 
            : `${country.name.common || country.name} added to favorites`,
          severity: 'success'
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update favorites',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Tooltip title={isFav ? "Remove from favorites" : "Add to favorites"}>
        <IconButton
          onClick={handleToggleFavorite}
          disabled={loading}
          size={size}
          color={isFav ? "error" : "default"}
          sx={{
            transition: 'all 0.3s',
            color: isFav ? '#f44336' : '#555555',
            '&:hover': {
              transform: 'scale(1.1)',
              color: isFav ? '#d32f2f' : '#333333'
            },
            ...(isFav && {
              animation: 'pulse 1s',
              '@keyframes pulse': {
                '0%': { transform: 'scale(1)' },
                '50%': { transform: 'scale(1.2)' },
                '100%': { transform: 'scale(1)' }
              }
            })
          }}
        >
          {isFav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </Tooltip>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default FavoriteButton; 