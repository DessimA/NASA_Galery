import axios from "axios";
import React, { } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "../../components/sidebar";
import ImageDetails from "../ImageDetails/ImageDetails";
import Library from "../library";
import Player from "../player/player";
import "./home.css";


export default function Home() {
  
  axios.defaults.baseURL = "https://api.nasa.gov/planetary/";

  return (
 
    <div className="main-body">
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/player" element={<Player />} />
          <Route path="/image-details" element={ImageDetails} />
        </Routes>
      </Router>
    </div>
  );
}
