import React, { useState, useRef } from "react";
import "./imageSearch.css";
import { searchMarsPhotos } from "../../nasa";
import InputMask from "react-input-mask";
import { BsFillArrowRightSquareFill, BsFillArrowLeftSquareFill } from "react-icons/bs";

export default function ImageSearch() {
  const [rover, setRover] = useState("");
  const [date, setDate] = useState("");
  const [photos, setPhotos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [noPhotosFound, setNoPhotosFound] = useState(false);
  const dateInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (rover && date) {
      const response = await searchMarsPhotos(rover, date);
      console.log(response);
      if (response && response.photos && response.photos.length > 0) {
        setPhotos(response.photos);
        setCurrentPage(1); // Reset current page when new photos are loaded
        setNoPhotosFound(false);
      } else {
        setPhotos([]);
        setCurrentPage(1);
        setNoPhotosFound(true);
      }
    } else {
      console.log("Preencha todos os campos");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * 10;
  const endIndex = startIndex + 10;
  const currentPhotos = photos.slice(startIndex, endIndex);

  return (
    <div className="screen-container">
      <form onSubmit={handleSubmit} className="navbar-body">
        <div className="form-group">
          <label htmlFor="rover">Rover: </label>
          <select
            id="rover"
            value={rover}
            onChange={(event) => setRover(event.target.value)}
          >
            <option value="">Selecione</option>
            <option value="curiosity">Curiosity</option>
            <option value="opportunity">Opportunity</option>
            <option value="spirit">Spirit</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Data: </label>
          <InputMask
            id="date"
            mask="9999-99-99"
            placeholder="Ano-Mês-Dia"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
            inputRef={dateInputRef}
          />
        </div>
        <button type="submit">Buscar</button>
      </form>
      {noPhotosFound ? (
        <p className="no-photos-message">
          Nenhuma imagem encontrada para esta data e rover.
        </p>
      ) : (
        <div className="photos-container">
          {currentPhotos.map((photo) => (
            <div key={photo.id} className="photo-card">
              <img
                src={photo.img_src}
                alt={photo.id}
                width="150"
                height="100"
              />
              <div className="photo-details">
                <p>Título: {photo.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <BsFillArrowLeftSquareFill />
        </button>
        <span>{currentPage}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={endIndex >= photos.length}
        >
          <BsFillArrowRightSquareFill />
        </button>
      </div>
    </div>
  );
}
