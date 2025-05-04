/**
 * API Configuration
 * 
 * This file centralizes API URL configuration for the application.
 * It prioritizes environment variables and falls back to localhost for development.
 */

// Backend API URL - uses environment variable if available, defaults to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Countries API URL (this is an external API so it remains hardcoded)
export const COUNTRIES_API_URL = 'https://restcountries.com/v3.1';

// Debug log the API URL being used
console.log('Using API URL:', API_BASE_URL); 