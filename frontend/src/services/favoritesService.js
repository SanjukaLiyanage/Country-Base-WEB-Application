import axios from 'axios';
import { API_BASE_URL } from '../config/apiConfig';

// Use API_URL from config instead of hardcoded value
// const API_URL = 'http://localhost:5000';

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Get all favorites for the current user
export const getUserFavorites = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_BASE_URL}/api/favorites`, {
      headers: {
        'auth-token': token
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
};

// Add a country to favorites
export const addToFavorites = async (country) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const favoriteData = {
      countryCode: country.cca3 || country.alpha3Code,
      countryName: country.name.common || country.name,
      flagUrl: country.flags.png || country.flag
    };

    const response = await axios.post(`${API_BASE_URL}/api/favorites`, favoriteData, {
      headers: {
        'auth-token': token
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

// Remove a country from favorites
export const removeFromFavorites = async (countryCode) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.delete(`${API_BASE_URL}/api/favorites/${countryCode}`, {
      headers: {
        'auth-token': token
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
};

// Check if a country is in favorites
export const isCountryFavorite = async (countryCode) => {
  try {
    const token = getToken();
    if (!token) {
      return false;
    }

    const response = await axios.get(`${API_BASE_URL}/api/favorites/${countryCode}`, {
      headers: {
        'auth-token': token
      }
    });
    
    return response.data.isFavorite;
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return false;
  }
}; 