import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser } from '../api/userService';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [dashboardPath, setDashboardPath] = useState('/dashboard');

  useEffect(() => {
    getCurrentUser().then((user) => {
      const roleRoutes = {
        'Store Manager': '/store-manager-dashboard',
        'Retail Analyst': '/retail-analyst-dashboard',
        'Marketing Manager': '/marketing-manager-dashboard',
        'Admin': '/admin-dashboard',
      };
      setDashboardPath(roleRoutes[user.role] || '/dashboard');
    }).catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-brand">Consumer Attention Mapping</div>
      <nav className="navbar-links">
        <Link to={dashboardPath} className={isActive(dashboardPath) ? 'active' : ''}>Dashboard</Link>
        <Link to="/stores" className={isActive('/stores') ? 'active' : ''}>Stores & Shelves</Link>
        <Link to="/analytics" className={isActive('/analytics') ? 'active' : ''}>Analytics</Link>
        <Link to="/heatmaps" className={isActive('/heatmaps') ? 'active' : ''}>Heatmaps</Link>
        <Link to="/shelf-detection" className={isActive('/shelf-detection') ? 'active' : ''}>Shelf Detection</Link>
        <Link to="/video-analysis" className={isActive('/video-analysis') ? 'active' : ''}>Video Analysis</Link>
        <Link to="/reports" className={isActive('/reports') ? 'active' : ''}>Reports</Link>
      </nav>
      <button onClick={handleLogout} className="logout-btn">Logout</button>
    </header>
  );
}

export default Navbar;