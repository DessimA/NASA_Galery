import React, { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import Modal from '../../components/modal';
import { FaHeartBroken } from 'react-icons/fa';
import './favorites.css';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const favoriteList = Object.values(favorites);
  const [selectedImage, setSelectedImage] = useState(null);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="favorites-container">
      <h1 className="favorites-title">Meus Favoritos</h1>
      {favoriteList.length === 0 ? (
        <p className="no-favorites-message">Você ainda não adicionou nenhuma imagem aos favoritos.</p>
      ) : (
        <div className="favorites-grid">
          {favoriteList.map((item) => (
            <div key={item.data[0].nasa_id} className="photo-card">
              <img src={item.links[0].href} alt={item.data[0].title} onClick={() => openModal(item)} />
              <div className="photo-details">
                <p className="photo-title">{item.data[0].title}</p>
                <button className="remove-favorite-button" onClick={() => removeFavorite(item.data[0].nasa_id)}>
                  <FaHeartBroken /> Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal isOpen={!!selectedImage} onClose={closeModal} imageContent={selectedImage} isFromFavorites={true} />
    </div>
  );
}