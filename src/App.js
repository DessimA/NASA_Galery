import React, { useState } from "react";
import Home from "./screens/home";
import ImageDay from "./screens/imageDay";
import ImageSearch from "./screens/imageSearch";
import Sidebar from "./components/sidebar";

import FreeSearch from "./screens/freeSearch";
import Favorites from "./screens/favorites";
import { FavoritesProvider } from "./context/FavoritesContext";

export default function App() {
  const [activeComponent, setActiveComponent] = useState("Home");

  const renderComponent = () => {
    switch (activeComponent) {
      case "Home":
        return <Home />;
      case "ImageDay":
        return <ImageDay />;
      case "ImageSearch":
        return <ImageSearch />;
      case "FreeSearch":
        return <FreeSearch />;
      case "Favorites":
        return <Favorites />;
      default:
        return <Home />;
    }
  };

  return (
    <FavoritesProvider>
      <div className="main-body">
        <Sidebar setActiveComponent={setActiveComponent} />
        <div className="content-container">{renderComponent()}</div>
      </div>
    </FavoritesProvider>
  );
}