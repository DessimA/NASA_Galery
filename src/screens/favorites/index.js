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
          {favoriteList.map((item) => {
            const nasaId = item.data[0].nasa_id;
            const title = item.data[0].title;
            const imageUrl = item.links[0].href;

            return (
              <div key={nasaId} className="photo-card">
                <img src={imageUrl} alt={title} onClick={() => openModal(item)} />
                <div className="photo-details">
                  <p className="photo-title">{title}</p>
                  <button className="remove-favorite-button" onClick={() => removeFavorite(nasaId)}>
                    <FaHeartBroken /> Remover
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Modal isOpen={!!selectedImage} onClose={closeModal} imageContent={selectedImage} isFromFavorites={true} />
    </div>
  );
}