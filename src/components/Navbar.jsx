import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar({ currentUser, onLogout }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">📈</div>
          <div className="brand-text">
            <div className="brand-title">MRU Trading Platform</div>
            <div className="brand-subtitle">Malla Reddy University - Full Stack Demo</div>
          </div>
        </div>

        <div className="navbar-menu">
          <Link 
            to="/dashboard" 
            className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            Dashboard
          </Link>
          <Link 
            to="/market" 
            className={`nav-item ${location.pathname === '/market' ? 'active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            Market
          </Link>
          <Link 
            to="/portfolio" 
            className={`nav-item ${location.pathname === '/portfolio' ? 'active' : ''}`}
          >
            <span className="nav-icon">💼</span>
            Portfolio
          </Link>
        </div>

        <div className="navbar-actions">
          <div className="user-info">
            <span className="user-icon">👤</span>
            <span className="user-email">{currentUser}</span>
          </div>
          <button className="btn-logout" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
