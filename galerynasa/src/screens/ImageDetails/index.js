import React from "react";
import "./index.css";

export default function ImageDetails({ onClose, props }) {
  
    const { image } = props;
  return (
    <div className="image-details">
      <div className="image-details-header">
        <h3 className="image-details-title">{image.title}</h3>
        <button className="image-details-close-button" onClick={onClose}>
          X
        </button>
      </div>
      <img src={image.url} alt={image.title} className="image-details-image" />
      <p className="image-details-date">{image.date}</p>
      <p className="image-details-explanation">{image.explanation}</p>
    </div>
  );
}
