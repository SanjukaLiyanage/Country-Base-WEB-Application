import { useContext, useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  CircularProgress,
  Alert,
  Paper,
  IconButton,
  Zoom
} from '@mui/material';
import { Link } from 'react-router-dom';
import { FavoritesContext } from '../context/FavoritesContext';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FavoriteButton from '../components/FavoriteButton';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { favorites, loading, error, removeFavorite } = useContext(FavoritesContext);
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState(null);

  const handleRemove = async (e, countryCode) => {
    e.stopPropagation();
    e.preventDefault();
    
    setDeletingId(countryCode);
    try {
      await removeFavorite(countryCode);
    } catch (err) {
      console.error('Error removing favorite:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewCountry = (countryCode) => {
    navigate(`/country/${countryCode}`);
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)' }}>
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff' }}>
            <Typography variant="h4" gutterBottom>Please Log In</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You need to be logged in to view your favorite countries.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/login"
              sx={{ mt: 2 }}
            >
              Go to Login
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', minHeight: 'calc(100vh - 64px)' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{ 
            fontWeight: 'bold',
            mb: 3,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #222222, #444444)',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text'
          }}
        >
          My Favorite Countries
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : favorites.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center', bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff' }}>
            <Typography variant="h5" gutterBottom>No Favorites Yet</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              You haven't added any countries to your favorites list.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/"
              sx={{ mt: 2 }}
            >
              Explore Countries
            </Button>
          </Paper>
        ) : (
          <Grid 
            container 
            spacing={4} 
            justifyContent="center" 
            alignItems="flex-start"
            className="countries-grid"
            sx={{ 
              mt: 1,
              maxWidth: 1400,
              mx: 'auto',
              px: 2
            }}
          >
            {favorites.map((favorite, index) => (
              <Grid 
                item 
                xs={12} 
                sm={6} 
                md={4} 
                key={favorite.countryCode}
                sx={{ 
                  height: { xs: 'auto', sm: 420 },
                  display: 'flex',
                  mb: 3
                }}
              >
                <Box 
                  sx={{ 
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Box 
                    sx={{ 
                      width: '100%', 
                      maxWidth: 350,
                      height: 420,
                      display: 'flex'
                    }}
                  >
                    <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                      <Card 
                        elevation={3} 
                        sx={{ 
                          height: 420,
                          width: '100%',
                          display: 'flex', 
                          flexDirection: 'column',
                          position: 'relative',
                          overflow: 'hidden',
                          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                          },
                          borderRadius: 3,
                          bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff'
                        }}
                        onClick={() => handleViewCountry(favorite.countryCode)}
                      >
                        <CardMedia
                          component="img"
                          height="200"
                          image={favorite.flagUrl}
                          alt={`${favorite.countryName} flag`}
                          sx={{ 
                            objectFit: 'cover',
                            width: '100%'
                          }}
                        />
                        <CardContent sx={{ 
                          p: 2,
                          height: 110,
                          display: 'flex',
                          flexDirection: 'column'
                        }}>
                          <Typography 
                            variant="h6" 
                            component="div" 
                            sx={{
                              mb: 1,
                              fontWeight: 'bold',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical'
                            }}
                          >
                            {favorite.countryName}
                          </Typography>
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                          >
                            Added on {new Date(favorite.addedAt).toLocaleDateString()}
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ 
                          p: 2, 
                          pt: 0,
                          height: 110,
                          justifyContent: 'space-between',
                          mt: 'auto'
                        }}>
                          <Button 
                            size="small" 
                            startIcon={<VisibilityIcon />} 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewCountry(favorite.countryCode);
                            }}
                          >
                            View Details
                          </Button>
                          <IconButton
                            color="error"
                            disabled={deletingId === favorite.countryCode}
                            onClick={(e) => handleRemove(e, favorite.countryCode)}
                            size="small"
                          >
                            {deletingId === favorite.countryCode ? 
                              <CircularProgress size={20} /> : 
                              <DeleteOutlineIcon />
                            }
                          </IconButton>
                        </CardActions>
                      </Card>
                    </Zoom>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default Favorites; 