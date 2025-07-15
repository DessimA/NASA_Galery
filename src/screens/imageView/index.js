import React from 'react';
import { useParams } from 'react-router-dom';
import { useFavorites } from '../../context/FavoritesContext';
import { FaHeart, FaRegHeart, FaHeartBroken } from 'react-icons/fa'; // Import FaRegHeart and FaHeartBroken
import './imageView.css';

export default function ImageView({ image, isModal = false, isFromFavorites = false }) {
  const { id } = useParams();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  // Determine the image data source
  const imageData = image || (id ? { links: [{ href: decodeURIComponent(id) }], data: [{ nasa_id: decodeURIComponent(id) }] } : null);

  if (!imageData || !imageData.links || !imageData.links[0] || !imageData.data || !imageData.data[0]) {
    return <p className="no-image-message">Imagem não encontrada.</p>;
  }

  const imageUrl = imageData.links[0].href;
  const nasaId = imageData.data[0].nasa_id;
  const title = imageData.data[0].title || 'N/A';
  const description = imageData.data[0].description || 'N/A';
  const dateCreated = imageData.data[0].date_created ? new Date(imageData.data[0].date_created).toLocaleDateString() : 'N/A';

  const handleFavoriteClick = () => {
    if (isFavorite(nasaId)) {
      removeFavorite(nasaId);
    } else {
      addFavorite(imageData);
    }
  };

  return (
    <div className="image-view-container">
      <div className="image-view-content">
        <img src={imageUrl} alt={title} />
        <button
          className={`favorite-button ${isFavorite(nasaId) ? 'favorited' : ''}`}
          onClick={handleFavoriteClick}
        >
          {isFromFavorites ? <FaHeartBroken /> : (isFavorite(nasaId) ? <FaHeart /> : <FaRegHeart />)}
          <span className="button-text">
            {isFromFavorites ? 'Remover dos Favoritos' : (isFavorite(nasaId) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos')}
          </span>
        </button>
        <div className="image-view-details">
          <h2>{title}</h2>
          <p><strong>ID NASA:</strong> {nasaId}</p>
          <p><strong>Data de Criação:</strong> {dateCreated}</p>
          <p><strong>Descrição:</strong> {description}</p>
        </div>
      </div>
      {!isModal && (
        <button className="back-button" onClick={() => window.history.back()}>
          Voltar
        </button>
      )}
    </div>
  );
}