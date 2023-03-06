import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Sidebar from "../../components/sidebar";
import ImageDetails from "../imageDetails";
import Library from "../imageDay";
import ImagesView from "../imageView/index"
import "./home.css";

export default function Home() {
  return (
    <div className="main-body">
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<Library />} />
          <Route path="/imageView" element={<ImagesView />} />
          <Route path="/image-details" element={<ImageDetails />} />
        </Routes>
      </Router>
    </div>
  );
}
