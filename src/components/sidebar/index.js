import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarButton from './sidebarButton';
import './sidebar.css';
import { FaHome, FaImage, FaSearch, FaChevronUp, FaChevronDown, FaStar } from 'react-icons/fa'; // Import new icons for vertical toggle
import NasaLogo from '../../assets/nasa-logo.svg'; // Import the NASA logo SVG

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true); // Start with sidebar open

  const isActive = (path) => location.pathname === path;

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
        <SidebarButton title="Início" to="/" icon={<FaHome />} active={isActive('/')} isCollapsed={!isOpen} />
        <SidebarButton title="Imagem do Dia" to="/image-of-the-day" icon={<FaImage />} active={isActive('/image-of-the-day')} isCollapsed={!isOpen} />
        <SidebarButton title="Busca Livre" to="/free-search" icon={<FaSearch />} active={isActive('/free-search')} isCollapsed={!isOpen} />
        <SidebarButton title="Favoritos" to="/favorites" icon={<FaStar />} active={isActive('/favorites')} isCollapsed={!isOpen} />
      </ul>
    </nav>
  );
}