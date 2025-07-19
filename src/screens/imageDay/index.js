import React, { useEffect, useState } from "react";
import "./imageDay.css";
import "../../components/modal/modal.css";
import { getAPOD, searchAPOD } from "../../api/apod";
import { useFavorites } from "../../context/FavoritesContext";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ImageDay() {
  const [apodData, setApodData] = useState(null);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setIsLoading(true);
        const data = await getAPOD();
        setApodData(data);
      } catch (err) {
        setError("Failed to fetch a imagem do dia. Por favor, tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAPOD();
  }, []);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formattedDate = date ? new Date(date).toISOString().split('T')[0] : '';
      const data = await searchAPOD(formattedDate);
      setApodData(data);
      setError(null);
    } catch (err) {
      setError("Falha ao buscar a imagem para a data especificada. Verifique o formato da data e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    const favoriteItem = {
      data: [{
        nasa_id: apodData.date, 
        title: apodData.title,
        description: apodData.explanation,
        date_created: apodData.date,
        copyright: apodData.copyright
      }],
      links: [{
        href: apodData.url
      }]
    };

    if (isFavorite(apodData.date)) {
      removeFavorite(apodData.date);
    } else {
      addFavorite(favoriteItem);
    }
  };

  return (
    <div className="image-day-container">
      <h1 className="image-day-title">Imagem Astronômica do Dia</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="date">Pesquisar por data:</label>
          <input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {isLoading && <p>Carregando...</p>}
      {error && <p className="error-text">{error}</p>}

      {apodData && (
        <div className="image-card">
          {apodData.media_type === "video" ? (
            <iframe
              title="nasa-video"
              src={apodData.url}
              frameBorder="0"
              allowFullScreen
              className="apod-video"
            ></iframe>
          ) : (
            <img src={apodData.url} alt={apodData.title} className="apod-image" />
          )}
          <button
            className={`favorite-button ${isFavorite(apodData.date) ? 'favorited' : ''}`}
            onClick={handleFavoriteClick}
          >
            {isFavorite(apodData.date) ? <FaHeart /> : <FaRegHeart />}
          </button>
          <div className="image-details">
            <h2 className="image-title">{apodData.title}</h2>
            <p className="image-explanation">{apodData.explanation}</p>
            <p><strong>Data:</strong> {apodData.date}</p>
            {apodData.copyright && (
              <p className="image-copyright">
                <strong>Créditos:</strong> {apodData.copyright}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
