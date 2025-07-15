import React from 'react';
import ImageView from '../../screens/imageView'; // Import ImageView
import './modal.css';

export default function Modal({ isOpen, onClose, imageContent, isFromFavorites }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={onClose}>&times;</button>
        {imageContent && <ImageView image={imageContent} isModal={true} isFromFavorites={isFromFavorites} />} {/* Render ImageView with imageContent */}
      </div>
    </div>
  );
}
