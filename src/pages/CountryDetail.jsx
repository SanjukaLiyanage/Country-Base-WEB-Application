import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper, Chip, CircularProgress, Divider, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getCountryByCode } from '../services/countriesApi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import FavoriteButton from '../components/FavoriteButton';

const CountryDetail = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchCountryDetails = async () => {
      try {
        setLoading(true);
        const data = await getCountryByCode(code);
        setCountry(data);
      } catch (error) {
        console.error('Error fetching country details:', error);
        setError('Failed to fetch country details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCountryDetails();
    }
  }, [code, isAuthenticated]);

  const handleGoBack = () => {
    navigate(-1);
  };

  // Helper function to extract languages
  const getLanguages = (languagesObj) => {
    if (!languagesObj) return [];
    return Object.values(languagesObj);
  };

  // Helper function to extract currencies
  const getCurrencies = (currenciesObj) => {
    if (!currenciesObj) return [];
    return Object.entries(currenciesObj).map(([code, currency]) => ({
      code,
      name: currency.name,
      symbol: currency.symbol
    }));
  };

  if (!isAuthenticated) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: 'calc(100vh - 64px)',
          width: '100%',
          p: 3,
          bgcolor: theme === 'dark' ? 'background.default' : '#dadada'
        }}
      >
        <Paper 
          elevation={3}
          sx={{
            p: 5,
            borderRadius: 2,
            maxWidth: 600,
            textAlign: 'center',
            bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff',
            color: 'text.primary'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Country Details
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please sign in to view country details
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: theme === 'dark' ? 'background.default' : '#dadada',
        minHeight: 'calc(100vh - 64px)',
        transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)'
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4, flexGrow: 1 }}>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          sx={{ 
            mb: 4,
            borderRadius: '10px',
            px: 2,
            py: 0.75,
            minWidth: 'auto',
            width: 'fit-content',
            fontSize: '0.875rem',
            bgcolor: '#222222',
            '&:hover': {
              bgcolor: '#333333'
            }
          }}
          size="small"
        >
          Back
        </Button>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress size={60} color="primary" />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography color="error" variant="h5">
              {error}
            </Typography>
          </Box>
        ) : country ? (
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 'var(--border-radius)',
              bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff',
              color: 'text.primary',
              boxShadow: theme === 'dark' 
                ? '0 4px 20px rgba(0,0,0,0.4)'
                : '0 4px 20px rgba(0,0,0,0.08)'
            }}
            className="country-detail-container"
          >
            <Grid container spacing={6}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 0, 
                    overflow: 'hidden', 
                    borderRadius: 'var(--border-radius)',
                    bgcolor: theme === 'dark' ? '#1e1e2a' : '#ffffff',
                    boxShadow: theme === 'dark' 
                      ? '0 4px 12px rgba(0,0,0,0.3)'
                      : '0 4px 12px rgba(0,0,0,0.05)'
                  }}
                >
                  <img
                    src={country.flags.svg || country.flags.png}
                    alt={`Flag of ${country.name.common}`}
                    style={{ width: '100%', objectFit: 'cover' }}
                    className="country-flag-large"
                  />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {country.name.common}
                  </Typography>
                  <FavoriteButton country={country} size="large" />
                </Stack>
                
                {country.name.official !== country.name.common && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Official: {country.name.official}
                  </Typography>
                )}

                <Grid container spacing={4} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                      <strong>Population:</strong> {country.population.toLocaleString()}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                      <strong>Region:</strong> {country.region}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                      <strong>Sub Region:</strong> {country.subregion || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                      <strong>Capital:</strong> {country.capital?.join(', ') || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                      <strong>Top Level Domain:</strong> {country.tld?.join(', ') || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                      <strong>Currencies:</strong>{' '}
                      {getCurrencies(country.currencies)
                        .map(c => `${c.name} (${c.symbol || c.code})`)
                        .join(', ') || 'N/A'}
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 1, color: 'text.primary' }}>
                      <strong>Languages:</strong> {getLanguages(country.languages).join(', ') || 'N/A'}
                    </Typography>
                  </Grid>
                </Grid>

                {country.borders && country.borders.length > 0 && (
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: 'text.primary' }}>
                      Border Countries:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {country.borders.map(border => (
                        <Chip
                          key={border}
                          label={border}
                          onClick={() => navigate(`/country/${border}`)}
                          clickable
                          sx={{ 
                            mb: 1,
                            bgcolor: theme === 'dark' ? 'rgba(122, 162, 247, 0.15)' : 'rgba(13, 110, 253, 0.08)',
                            color: theme === 'dark' ? '#a9b1d6' : 'primary.main',
                            '&:hover': {
                              bgcolor: theme === 'dark' ? 'rgba(122, 162, 247, 0.25)' : 'rgba(13, 110, 253, 0.15)',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </Grid>

              {country.maps?.googleMaps && (
                <Grid item xs={12}>
                  <Divider sx={{ 
                    my: 4,
                    borderColor: theme === 'dark' ? 'rgba(169, 177, 214, 0.15)' : 'rgba(0, 0, 0, 0.12)'
                  }} />
                  <Typography variant="h6" gutterBottom sx={{ color: 'text.primary' }}>
                    Location
                  </Typography>
                  <Button 
                    variant="contained" 
                    color="primary"
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      mt: 1,
                      borderRadius: '10px',
                      py: 1,
                      px: 2.5,
                      bgcolor: '#222222',
                      '&:hover': {
                        bgcolor: '#333333'
                      }
                    }}
                  >
                    View on Google Maps
                  </Button>
                </Grid>
              )}
            </Grid>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography variant="h5" sx={{ color: 'text.primary' }}>
              Country not found.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CountryDetail; 