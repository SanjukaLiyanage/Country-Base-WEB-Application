import axios from 'axios';

const API_URL = 'https://restcountries.com/v3.1';

// Get all countries
export const getAllCountries = async () => {
  try {
    const response = await axios.get(`${API_URL}/all`);
    return response.data;
  } catch (error) {
    console.error('Error fetching all countries:', error);
    throw error;
  }
};

// Search countries by name
export const searchCountriesByName = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/name/${name}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error('Error searching countries by name:', error);
    throw error;
  }
};

// Get countries by region
export const getCountriesByRegion = async (region) => {
  try {
    const response = await axios.get(`${API_URL}/region/${region}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching countries by region:', error);
    throw error;
  }
};

// Get country by alpha code
export const getCountryByCode = async (code) => {
  try {
    const response = await axios.get(`${API_URL}/alpha/${code}`);
    return response.data[0];
  } catch (error) {
    console.error('Error fetching country by code:', error);
    throw error;
  }
}; 