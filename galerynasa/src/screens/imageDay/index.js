import React, { useEffect, useState, useRef } from "react";
import "./imageDay.css";
import InputMask from "react-input-mask";
import { getAPOD, searchAPOD } from "../../nasa.js";

export default function ImageDay() {
  const [apodData, setApodData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchDate, setSearchDate] = useState(null);
  const [date, setDate] = useState("");
  const inputElement = useRef(null);

  useEffect(() => {
    const fetchAPOD = async () => {
      const data = await getAPOD();
      setApodData(data);
    };
    fetchAPOD();
  }, []);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchDate = inputElement.current.value;
    const data = await searchAPOD(searchDate);
    setApodData(data);
    setShowDetails(false);
    setSearchDate(searchDate);
  };

  return (
    <div className="screen-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="date">Data:</label>
          <InputMask
            ref={inputElement}
            id="date"
            mask="9999-99-99"
            placeholder="Ano-Mês-Dia"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </div>
        <button type="submit">Buscar</button>
      </form>
      <div className="library-body">
        <div className="image-card" onClick={toggleDetails}>
          {apodData && (
            <>
              <img
                className="image-image"
                src={apodData.url}
                alt={apodData.title}
                loading="lazy"
              />
              <div className="image-fade">
                <h3 className="image-title">{apodData.title}</h3>
              </div>
            </>
          )}
        </div>
        <div
          className="image-details"
          style={{ display: showDetails ? "block" : "none" }}
        >
          {apodData && (
            <>
              <p className="image-subtitle">{searchDate || apodData.date}</p>
              <p className="image-subtitle">{apodData.explanation}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
