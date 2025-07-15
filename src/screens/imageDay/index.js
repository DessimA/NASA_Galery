import React, { useEffect, useState } from "react";
import "./imageDay.css";
import { getAPOD, searchAPOD } from "../../api/apod";

export default function ImageDay() {
  const [apodData, setApodData] = useState(null);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      // Ensure date is in YYYY-MM-DD format before sending to API
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
