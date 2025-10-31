import React, { useState, useEffect } from "react";
import "./imageSearch.css";
import { searchMarsPhotos, getRoverManifest } from "../../api/marsRover";
import Modal from "../../components/modal";
import { useFavorites } from "../../context/FavoritesContext";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function ImageSearch() {
  const [rover, setRover] = useState("curiosity");
  // eslint-disable-next-line no-unused-vars
  const [searchType, setSearchType] = useState("earth_date");
  // eslint-disable-next-line no-unused-vars
  const [earthDate, setEarthDate] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [sol, setSol] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [camera, setCamera] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [photos, setPhotos] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [manifest, setManifest] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchManifest = async () => {
      try {
        const manifestData = await getRoverManifest(rover);
        setManifest(manifestData);
      } catch (err) {
        setError("Failed to load rover mission data.");
      }
    };
    fetchManifest();
  }, [rover]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      const params = {
        page: currentPage,
        camera,
        [searchType]: searchType === "earth_date" ? earthDate : sol,
      };
      const response = await searchMarsPhotos(rover, params);
      setPhotos(response.photos || []);
    } catch (err) {
      setError("Failed to fetch photos. Please try again later.");
      setPhotos([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteClick = (photo) => {
    const favoriteItem = {
      data: [{
        nasa_id: photo.id,
        title: `Mars Rover ${photo.rover.name} - ${photo.id}`,
        description: `Photo taken by ${photo.camera.full_name} on ${photo.earth_date} (Sol ${photo.sol}).`,
        date_created: photo.earth_date
      }],
      links: [{
        href: photo.img_src
      }]
    };

    if (isFavorite(photo.id)) {
      removeFavorite(photo.id);
    } else {
      addFavorite(favoriteItem);
    }
  };

  return (
    <div className="image-search-container">
      <h1 className="search-title">Pesquisar Fotos do Rover de Marte</h1>
      <form onSubmit={handleSubmit} className="search-bar">
        <select value={rover} onChange={(e) => setRover(e.target.value)}>
          <option value="curiosity">Curiosity</option>
          <option value="opportunity">Opportunity</option>
          <option value="spirit">Spirit</option>
        </select>
        <input
          type="date"
          value={earthDate}
          onChange={(e) => setEarthDate(e.target.value)}
        />
        <button type="submit">Pesquisar</button>
      </form>

      {/* Manifest info remains the same */}

      {error && <p className="error-text">{error}</p>}
      {isLoading && <p>Carregando...</p>}

      {hasSearched && !isLoading && photos.length === 0 && (
        <div className="no-results">
          <h2>Nenhuma Foto Encontrada</h2>
          <p>Tente ajustar seus critérios de busca.</p>
        </div>
      )}

      <div className="results-grid">
        {photos.map((photo) => (
          <div key={photo.id} className="photo-card">
            <img src={photo.img_src} alt={`Rover de Marte ${rover} - ${photo.id}`} onClick={() => setSelectedImage(photo)} />
            <button
              className={`favorite-button ${isFavorite(photo.id) ? 'favorited' : ''}`}
              onClick={() => handleFavoriteClick(photo)}
            >
              {isFavorite(photo.id) ? <FaHeart /> : <FaRegHeart />}
            </button>
            <div className="photo-details">
              <p className="photo-date">{photo.earth_date}</p>
              <p className="photo-camera">{photo.camera.full_name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination remains the same */}

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} imageContent={selectedImage} />
    </div>
  );
}