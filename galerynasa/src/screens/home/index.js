import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "../../components/sidebar";
import ImageDetails from "../ImageDetails";
import Library from "../library";
import Player from "../player/player";
import "./home.css";

export default function Home() {
  return (
    <div className="main-body">
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/player" element={<Player />} />
          <Route path="/image-details" element={<ImageDetails />} />
        </Routes>
      </Router>
    </div>
  );
}
