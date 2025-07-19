import React from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import { FaHeart, FaRegHeart, FaHeartBroken } from 'react-icons/fa';
import './modal.css';

export default function Modal({ isOpen, onClose, imageContent, isFromFavorites }) {
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  if (!isOpen || !imageContent) {
    return null;
  }

  const imageUrl = imageContent.links[0].href;
  const nasaId = imageContent.data[0].nasa_id;
  const title = imageContent.data[0].title || 'N/A';
  const description = imageContent.data[0].description || 'N/A';
  const dateCreated = imageContent.data[0].date_created ? new Date(imageContent.data[0].date_created).toLocaleDateString() : 'N/A';

  const handleFavoriteClick = () => {
    if (isFavorite(nasaId)) {
      removeFavorite(nasaId);
    } else {
      addFavorite(imageContent);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        <img src={imageUrl} alt={title} />
        <button
          className={`favorite-button ${isFavorite(nasaId) ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFromFavorites ? <FaHeartBroken /> : (isFavorite(nasaId) ? <FaHeart /> : <FaRegHeart />)}
        </button>
        <div className="image-view-details">
          <h2>{title}</h2>
          <p><strong>ID NASA:</strong> {nasaId}</p>
          <p><strong>Data de Criação:</strong> {dateCreated}</p>
          <p><strong>Descrição:</strong> {description}</p>
          {imageContent.data[0].copyright && (
            <p><strong>Créditos:</strong> {imageContent.data[0].copyright}</p>
          )}
        </div>
      </div>
    </div>
  );
}
