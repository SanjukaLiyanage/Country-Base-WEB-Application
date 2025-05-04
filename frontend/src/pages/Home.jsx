import { useState, useEffect, useContext } from 'react';
import { Container, Grid, Box, TextField, FormControl, InputLabel, Select, MenuItem, Typography, CircularProgress, InputAdornment, Paper } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CountryCard from '../components/CountryCard';
import { getAllCountries, searchCountriesByName, getCountriesByRegion } from '../services/countriesApi';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const Home = () => {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);

  // Fetch all countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const data = await getAllCountries();
        setCountries(data);
        setFilteredCountries(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        setError('Failed to fetch countries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Handle search input change
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === '') {
      // If search is empty, reset to all countries or filtered by region
      if (selectedRegion) {
        const regionFiltered = await getCountriesByRegion(selectedRegion);
        setFilteredCountries(regionFiltered);
      } else {
        setFilteredCountries(countries);
      }
    } else {
      try {
        // Search by name
        const results = await searchCountriesByName(value);
        
        // Apply region filter if selected
        if (selectedRegion) {
          const regionFiltered = results.filter(country => country.region === selectedRegion);
          setFilteredCountries(regionFiltered);
        } else {
          setFilteredCountries(results);
        }
      } catch (error) {
        // If search fails (e.g., no results), show empty
        setFilteredCountries([]);
      }
    }
  };

  // Handle region filter change
  const handleRegionChange = async (e) => {
    const region = e.target.value;
    setSelectedRegion(region);

    if (region === '') {
      // If no region selected, show all countries or search results
      if (searchTerm) {
        const results = await searchCountriesByName(searchTerm);
        setFilteredCountries(results);
      } else {
        setFilteredCountries(countries);
      }
    } else {
      try {
        // Filter by region
        const regionData = await getCountriesByRegion(region);
        
        // Apply search filter if there's a search term
        if (searchTerm) {
          const searchFiltered = regionData.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setFilteredCountries(searchFiltered);
        } else {
          setFilteredCountries(regionData);
        }
      } catch (error) {
        console.error('Error filtering by region:', error);
        setFilteredCountries([]);
      }
    }
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
            bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff'
          }}
        >
          <Typography variant="h4" gutterBottom>
            Welcome to Countries Explorer
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Please sign in to explore countries from around the world
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      width: '100%', 
      flexGrow: 1, 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: theme === 'dark' ? 'background.default' : '#dadada'
    }}>
      <Box 
        sx={{ 
          bgcolor: theme === 'dark' ? 'background.paper' : '#ffffff', 
          pt: 3, 
          pb: 3,
          boxShadow: 1
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2
            }}
          >
            <TextField
              label="Search for a country"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ width: { xs: '100%', sm: '50%' } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl sx={{ width: { xs: '100%', sm: '200px' } }}>
              <InputLabel id="region-select-label">Filter by Region</InputLabel>
              <Select
                labelId="region-select-label"
                id="region-select"
                value={selectedRegion}
                label="Filter by Region"
                onChange={handleRegionChange}
              >
                <MenuItem value="">All Regions</MenuItem>
                <MenuItem value="Africa">Africa</MenuItem>
                <MenuItem value="Americas">Americas</MenuItem>
                <MenuItem value="Asia">Asia</MenuItem>
                <MenuItem value="Europe">Europe</MenuItem>
                <MenuItem value="Oceania">Oceania</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>
      </Box>

      <Container 
        maxWidth="xl" 
        sx={{ 
          py: 4, 
          flexGrow: 1,
          px: { xs: 2, sm: 3, md: 4, lg: 5 }
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <CircularProgress size={60} />
          </Box>
        ) : error ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography color="error" variant="h5">
              {error}
            </Typography>
          </Box>
        ) : filteredCountries.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography variant="h5">
              No countries found. Try a different search term or filter.
            </Typography>
          </Box>
        ) : (
          <Grid 
            container 
            spacing={4} 
            justifyContent="center" 
            alignItems="stretch"
            className="countries-grid"
            sx={{ 
              mt: 1,
              maxWidth: 1400,
              mx: 'auto'
            }}
          >
            {filteredCountries.map((country) => (
              <Grid 
                item 
                xs={12} 
                sm={12} 
                md={6} 
                lg={4} 
                key={country.cca3}
                sx={{ 
                  display: 'flex',
                  minHeight: 340,
                  mb: 3,
                  '& > *': {
                    width: '100%',
                    height: '100%'
                  }
                }}
              >
                <Box 
                  sx={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Box sx={{ width: '100%', maxWidth: 400 }}>
                    <CountryCard country={country} />
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

export default Home; 