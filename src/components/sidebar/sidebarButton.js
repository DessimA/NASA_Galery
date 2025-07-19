import React from 'react';
import './sidebarButton.css';

export default function SidebarButton({ title, onClick, icon, active, isCollapsed }) {
  const handleClick = (e) => {
    e.preventDefault();
    onClick();
  }

  return (
    <button onClick={handleClick} className={`sidebar-button ${active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      {icon && <span className="button-icon">{icon}</span>}
      {!isCollapsed && <span className="button-text">{title}</span>}
    </button>
  );
}