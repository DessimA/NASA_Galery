import React from "react";
import { useLocation } from "react-router-dom";

export default function ImageDetails() {
  const location = useLocation();
  const { title, date, explanation, url } = location.state;

  return (
    <div className="screen-container flex">
      <h1>{title}</h1>
      <h2>{date}</h2>
      <p>{explanation}</p>
      <img src={url} alt={title} />
    </div>
  );
}
