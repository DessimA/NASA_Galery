import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const localFavorites = localStorage.getItem('nasaFavorites');
      return localFavorites ? JSON.parse(localFavorites) : {};
    } catch (error) {
      console.error("Failed to load favorites from localStorage", error);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites to localStorage", error);
    }
  }, [favorites]);

  const addFavorite = (item) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [item.data[0].nasa_id]: item,
    }));
  };

  const removeFavorite = (nasa_id) => {
    setFavorites((prevFavorites) => {
      const newFavorites = { ...prevFavorites };
      delete newFavorites[nasa_id];
      return newFavorites;
    });
  };

  const isFavorite = (nasa_id) => {
    return !!favorites[nasa_id];
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  return useContext(FavoritesContext);
};