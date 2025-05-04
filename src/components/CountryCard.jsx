import { Card, CardContent, CardMedia, Typography, CardActionArea, Box, CardActions, Button, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const CountryCard = ({ country }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  const muiTheme = useTheme();

  // Handle undefined or missing values
  const name = country.name?.common || 'Unknown';
  const flag = country.flags?.png || country.flags?.svg || '';
  const population = country.population ? country.population.toLocaleString() : 'Unknown';
  const region = country.region || 'Unknown';
  const capital = country.capital?.length > 0 ? country.capital[0] : 'Unknown';

  const handleClick = () => {
    navigate(`/country/${country.cca3}`);
  };

  return (
    <Card 
      elevation={3}
      sx={{ 
        width: '100%',
        height: 360,
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
        },
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        bgcolor: theme === 'dark' ? muiTheme.palette.background.paper : '#ffffff'
      }}
    >
      <CardActionArea 
        onClick={handleClick} 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'stretch',
          height: 'calc(100% - 40px)', // Adjust for the favorite button space
          padding: 0
        }}
      >
        <Box 
          sx={{ 
            height: 200,
            width: '100%', 
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#f0f0f0'
          }}
        >
          <CardMedia
            component="img"
            sx={{ 
              height: '100%',
              width: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              display: 'block',
              aspectRatio: '16 / 9'
            }}
            image={flag}
            alt={`Flag of ${name}`}
          />
        </Box>
        <CardContent 
          sx={{ 
            flexGrow: 1, 
            p: 3,
            width: '100%', 
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start'
          }}
        >
          <Typography 
            gutterBottom 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 'bold', 
              mb: 2,
              height: 60,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              width: '100%'
            }}
          >
            {name}
          </Typography>
          <Box sx={{ mt: 1, width: '100%' }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              <strong>Population:</strong> {population}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              <strong>Region:</strong> {region}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              <strong>Capital:</strong> {capital}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pt: 0 }}>
        <Button 
          size="small" 
          startIcon={<VisibilityIcon />}
          onClick={handleClick}
          sx={{
            color: '#333',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.05)'
            }
          }}
        >
          View
        </Button>
        <FavoriteButton country={country} />
      </CardActions>
    </Card>
  );
};

export default CountryCard;