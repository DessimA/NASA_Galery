import axios from "axios";
import React, { useEffect, useState } from "react";
import { IconContext } from "react-icons";
import { AiFillPlayCircle } from "react-icons/ai";
import ImageDetails from "../components/ImageDetails/ImageDetails";
import "./library.css";

export default function Library() {
  const [playlists, setPlaylists] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    axios
      .get("https://api.nasa.gov/planetary/apod?count=3&api_key=DEMO_KEY")
      .then((response) => setPlaylists(response.data))
      .catch((error) => console.log(error));
  }, []);

   const showImageDetails = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="screen-container">
      <div className="library-body">
        {playlists?.map((playlist) => (
          <div
            className="playlist-card"
            key={playlist.date}
            onClick={() => showImageDetails(playlist)}
          >
            <img
              src={playlist.url}
              className="playlist-image"
              alt={playlist.title}
            />
            <p className="playlist-title">{playlist.title}</p>
            <p className="playlist-subtitle">{playlist.date}</p>
            <div className="library-fade">
              <IconContext.Provider value={{ size: "50px", color: "#1ed760" }}>
                <AiFillPlayCircle />
              </IconContext.Provider>
            </div>
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageDetails
          title={selectedImage.title}
          date={selectedImage.date}
          explanation={selectedImage.explanation}
          url={selectedImage.url}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </div>
  );
}
