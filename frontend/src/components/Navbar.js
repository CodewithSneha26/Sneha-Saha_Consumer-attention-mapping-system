import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-brand">Consumer Attention Mapping</div>
      <nav className="navbar-links">
        <Link to="/dashboard" className={isActive('/dashboard') ? 'active' : ''}>Dashboard</Link>
        <Link to="/stores" className={isActive('/stores') ? 'active' : ''}>Stores & Shelves</Link>
        <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>Analytics</Link>
        <Link to="/heatmaps" className={isActive('/heatmaps') ? 'active' : ''}>Heatmaps</Link>
        <Link to="/reports" className={isActive('/reports') ? 'active' : ''}>Reports</Link>
      </nav>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </header>
  );
}

export default Navbar;