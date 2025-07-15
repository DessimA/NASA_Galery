import React, { useState, useEffect } from "react";
import "./imageSearch.css";
import { searchMarsPhotos, getRoverManifest } from "../../api/marsRover";
import Modal from "../../components/modal";

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

  return (
    <div className="image-search-container">
      <h1 className="search-title">Pesquisar Fotos do Rover de Marte</h1>
      <form onSubmit={handleSubmit} className="search-bar">
        {/* Form inputs remain the same */}
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
          <div key={photo.id} className="photo-card" onClick={() => setSelectedImage(photo)}>
            <img src={photo.img_src} alt={`Rover de Marte ${rover} - ${photo.id}`} />
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