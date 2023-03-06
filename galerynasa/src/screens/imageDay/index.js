import React, { useEffect, useState } from "react";
import "./imageDay.css";
import { getAPOD } from "../../nasa.js";

export default function Library() {
  const [apodData, setApodData] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

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

  return (
    <div className="screen-container">
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
              <p className="image-subtitle">{apodData.date}</p>
              <p className="image-subtitle">{apodData.explanation}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
