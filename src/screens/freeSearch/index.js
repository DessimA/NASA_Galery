import React, { useState } from "react";
import "./freeSearch.css";
import { searchImages } from "../../api/images";
import Modal from "../../components/modal";

export default function FreeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      const items = await searchImages(query);
      setResults(items);
    } catch (err) {
      setError("Failed to fetch images. Please try again later.");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="free-search-container">
      <h1 className="search-title">Busca Livre de Imagens</h1>
      <form onSubmit={handleSubmit} className="search-bar">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          placeholder="Pesquise por qualquer coisa na biblioteca de imagens da NASA..."
        />
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {isLoading && <p>Carregando...</p>}

      {hasSearched && !isLoading && results.length === 0 && (
        <div className="no-results">
          <h2>Nenhuma Imagem Encontrada</h2>
          <p>Tente um termo de busca diferente.</p>
        </div>
      )}

      <div className="results-grid">
        {results
          .filter((item) => item.data && item.data.length > 0 && item.links && item.links.length > 0)
          .map((item) => (
            <div key={item.data[0].nasa_id} className="photo-card" onClick={() => setSelectedImage(item)}>
              <img src={item.links[0].href} alt={(item.data[0].title || '').replace(/image|photo|picture/gi, '').trim()} />
              <div className="photo-details">
                <p className="photo-title">{item.data[0].title}</p>
              </div>
            </div>
        ))}
      </div>

      <Modal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} imageContent={selectedImage} />
    </div>
  );
}
