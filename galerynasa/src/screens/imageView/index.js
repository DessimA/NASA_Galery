import React from "react";
import "./imageView.css";
import { useLocation } from "react-router-dom";

export default function ImageView() {
  const location = useLocation();
  const imgSrc = location.search.split('=')[1];

  return (
    <div className="screen-container">
      {imgSrc ? (
        <div className="image-view">
          <img src={imgSrc} alt="Mars Rover" />
        </div>
      ) : (
        <div className="no-image">
          Busque e selecione uma imagem para visualizar.
        </div>
      )}
    </div>
  );
}
