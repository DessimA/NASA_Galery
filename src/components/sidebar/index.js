import React, { useState } from 'react';
import SidebarButton from './sidebarButton';
import './sidebar.css';
import { FaHome, FaImage, FaSearch, FaChevronUp, FaChevronDown, FaStar } from 'react-icons/fa'; // Import new icons for vertical toggle
import NasaLogo from '../../assets/nasa-logo.svg'; // Import the NASA logo SVG

export default function Sidebar({ setActiveComponent }) {
  const [isOpen, setIsOpen] = useState(true); // Start with sidebar open

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={`sidebar-container ${isOpen ? 'open' : 'collapsed'}`}>
      <div className="sidebar-header">
        <img src={NasaLogo} alt="NASA Logo" className="nasa-logo" /> {/* Use the NASA logo SVG */}
        {isOpen && <h1 className="sidebar-title">Galeria NASA</h1>}
      </div>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />} {/* Conditional icon for vertical toggle */}
      </button>
      <ul className="sidebar-nav">
        <SidebarButton title="Início" onClick={() => setActiveComponent("Home")} icon={<FaHome />} isCollapsed={!isOpen} />
        <SidebarButton title="Imagem do Dia" onClick={() => setActiveComponent("ImageDay")} icon={<FaImage />} isCollapsed={!isOpen} />
        <SidebarButton title="Busca Livre" onClick={() => setActiveComponent("FreeSearch")} icon={<FaSearch />} isCollapsed={!isOpen} />
        <SidebarButton title="Favoritos" onClick={() => setActiveComponent("Favorites")} icon={<FaStar />} isCollapsed={!isOpen} />
      </ul>
    </nav>
  );
}