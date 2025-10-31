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

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const daysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        setIsLoading(true);
        const data = await getAPOD();
        setApodData(data);
      } catch (err) {
        if (err.response && err.response.status === 429) {
          setError("O limite de acesso gratuito à API da NASA para hoje foi atingido. Por favor, tente novamente amanhã.");
        } else if (err.response && err.response.data && err.response.data.msg && err.response.data.msg.includes("API rate limit exceeded")) {
          setError("O limite de acesso gratuito à API da NASA para hoje foi atingido. Por favor, tente novamente amanhã.");
        } else {
          setError("Falha ao buscar a imagem do dia. Por favor, tente novamente mais tarde.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAPOD();
  }, []);

  useEffect(() => {
    const year = selectedYear;
    const month = selectedMonth < 10 ? `0${selectedMonth}` : selectedMonth;
    const day = selectedDay < 10 ? `0${selectedDay}` : selectedDay;
    setDate(`${year}-${month}-${day}`);
  }, [selectedYear, selectedMonth, selectedDay]);

  const handleSearch = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formattedDate = date ? new Date(date).toISOString().split('T')[0] : '';
      const data = await searchAPOD(formattedDate);
      setApodData(data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 429) {
        setError("O limite de acesso gratuito à API da NASA para hoje foi atingido. Por favor, tente novamente amanhã.");
      } else if (err.response && err.response.status === 404) {
        setError(`Nenhuma imagem encontrada para a data selecionada. A última imagem disponível é de ${apodData.date}. Por favor, escolha uma data anterior.`);
      } else {
        setError("Falha ao buscar a imagem para a data especificada. Verifique o formato da data e tente novamente.");
      }
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
          <div className="date-select-group">
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {Array.from({ length: new Date().getFullYear() - 1994 }, (_, i) => 1995 + i).map(
                (year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              )}
            </select>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {[ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez" ].map((monthName, index) => (
                <option key={monthName} value={index + 1}>
                  {monthName}
                </option>
              ))}
            </select>
            <select
              id="day"
              value={selectedDay}
              onChange={(e) => setSelectedDay(parseInt(e.target.value))}
            >
              {Array.from({ length: daysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1).map(
                (day) => (
                  <option key={day} value={day}>
                    {day < 10 ? `0${day}` : day}
                  </option>
                )
              )}
            </select>
          </div>
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
