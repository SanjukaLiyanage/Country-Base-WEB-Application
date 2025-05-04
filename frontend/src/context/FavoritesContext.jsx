import { createContext, useState, useContext, useEffect } from 'react';
import { getUserFavorites, addToFavorites, removeFromFavorites, isCountryFavorite } from '../services/favoritesService';
import { AuthContext } from './AuthContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  // Load favorites when user is authenticated
  useEffect(() => {
    const loadFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getUserFavorites();
        setFavorites(data);
        setError(null);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites');
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated]);

  // Add a country to favorites
  const addFavorite = async (country) => {
    try {
      const newFavorite = await addToFavorites(country);
      setFavorites(prev => [...prev, newFavorite]);
      return { success: true };
    } catch (err) {
      console.error('Error adding favorite:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to add to favorites' 
      };
    }
  };

  // Remove a country from favorites
  const removeFavorite = async (countryCode) => {
    try {
      await removeFromFavorites(countryCode);
      setFavorites(prev => prev.filter(fav => fav.countryCode !== countryCode));
      return { success: true };
    } catch (err) {
      console.error('Error removing favorite:', err);
      return { 
        success: false, 
        message: err.response?.data?.message || 'Failed to remove from favorites' 
      };
    }
  };

  // Check if a country is in favorites
  const isFavorite = (countryCode) => {
    return favorites.some(fav => fav.countryCode === countryCode);
  };

  // Toggle favorite status
  const toggleFavorite = async (country) => {
    const countryCode = country.cca3 || country.alpha3Code;
    
    if (isFavorite(countryCode)) {
      return await removeFavorite(countryCode);
    } else {
      return await addFavorite(country);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        error,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}; 