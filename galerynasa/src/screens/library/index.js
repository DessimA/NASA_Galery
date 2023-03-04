import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './library.css';
import ImageDetails from '../ImageDetails';
import { getAPOD, getRoverPhotos, NASA_API_KEY } from '../../nasa';

export default function Library() {
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    Promise.all([
      getAPOD(NASA_API_KEY),
      getRoverPhotos('curiosity', '2023-02-27'), // exemplo de chamada para rover photos
     
    ]).then(([apod, roverPhotos]) => {
      const images = [apod, ...roverPhotos];
      setImageList(images);
    }).catch((error) => console.log(error));
  }, []);

  const showImageDetails = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        {imageList.map((image) => (
          <Link
            to={{
              pathname: '/image-details',
              state: {
                image: image,
              },
            }}
            className="playlist-card"
            key={image.date || image.id}
            onClick={() => showImageDetails(image)}
          >
            <img
              src={image.url || image.img_src || ''}
              className="playlist-image"
              alt={image.title || ''}
            />
            <p className="playlist-title">{image.title || image.rover?.name}</p>
            <p className="playlist-subtitle">{image.date || image.earth_date}</p>
            <div className="library-fade"></div>
          </Link>
        ))}
      </div>
      {selectedImage && (
        <ImageDetails image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
}
