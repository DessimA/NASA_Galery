import React from 'react';
import { Link } from 'react-router-dom';
import './sidebarButton.css';

export default function SidebarButton({ title, to, icon, active, isCollapsed }) {
  return (
    <Link to={to}>
      <button className={`sidebar-button ${active ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
        {icon && <span className="button-icon">{icon}</span>}
        {!isCollapsed && <span className="button-text">{title}</span>}
      </button>
    </Link>
  );
}