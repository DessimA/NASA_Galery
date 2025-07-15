import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./screens/home";
import ImageDay from "./screens/imageDay";
import ImageSearch from "./screens/imageSearch";
import ImageView from "./screens/imageView";
import Sidebar from "./components/sidebar";

import FreeSearch from "./screens/freeSearch";
import Favorites from "./screens/favorites";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function App() {
  return (
    <FavoritesProvider>
      <Router>
        <div className="main-body">
          <Sidebar />
          <div className="content-container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/image-of-the-day" element={<ImageDay />} />
              <Route path="/image-search" element={<ImageSearch />} />
              <Route path="/free-search" element={<FreeSearch />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/image-view/:id" element={<ImageView />} />
            </Routes>
          </div>
        </div>
      </Router>
    </FavoritesProvider>
  );
}