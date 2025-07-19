import React from 'react';
import './sidebarButton.css';

export default function SidebarButton({ title, onClick, icon, active, isCollapsed }) {
  return (
    <button onClick={onClick} className={`sidebar-button ${active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      {icon && <span className="button-icon">{icon}</span>}
      {!isCollapsed && <span className="button-text">{title}</span>}
    </button>
  );
}