import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { getCurrentUser } from '../api/userService';
import './RoleDashboard.css';

function StoreManagerDashboard() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      getCurrentUser(),
      api.get('/shelf-scores'),
      api.get('/alerts'),
    ]).then(([userData, scoresRes, alertsRes]) => {
      setUser(userData);
      setScores(scoresRes.data);
      setAlerts(alertsRes.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [navigate]);

  const totalShelves = Object.keys(scores).length;
  const avgScore = totalShelves > 0
    ? (Object.values(scores).reduce((sum, s) => sum + s.attractiveness_score, 0) / totalShelves).toFixed(1)
    : 0;
  const criticalAlerts = alerts.filter(a => a.severity === 'High' || a.severity === 'Critical').length;

  return (
    <div className="role-dashboard-page">
      <Navbar />
      <main className="role-dashboard-content">
        <h2>Store Manager Dashboard</h2>
        {user && <p className="welcome-text">Welcome back, {user.name}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-box">
                <span className="stat-label">Total Shelves</span>
                <span className="stat-value">{totalShelves}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Avg. Attractiveness Score</span>
                <span className="stat-value">{avgScore}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Critical Alerts</span>
                <span className="stat-value alert-number">{criticalAlerts}</span>
              </div>
            </div>

            <h3>Shelf Performance Reports</h3>
            <div className="report-table">
              <div className="report-row header-row">
                <span>Shelf</span>
                <span>Score</span>
                <span>Conversion</span>
              </div>
              {Object.entries(scores).map(([shelf, data]) => (
                <div key={shelf} className="report-row">
                  <span>{shelf}</span>
                  <span>{data.attractiveness_score}</span>
                  <span>{data.conversion_potential_score}%</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default StoreManagerDashboard;