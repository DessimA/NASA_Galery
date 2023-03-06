import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "../../components/sidebar";
import ImageSearch from "../imageSearch";
import ImageDay from "../imageDay";
import ImagesView from "../imageView/index"
import "./home.css";

export default function Home() {
  return (
    <div className="main-body">
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<ImageDay />} />
          <Route path="/imageView" element={<ImagesView />} />
          <Route path="/image-search" element={<ImageSearch />} />
        </Routes>
      </Router>
    </div>
  );
}
