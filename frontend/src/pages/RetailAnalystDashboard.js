import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { getCurrentUser } from '../api/userService';
import './RoleDashboard.css';

function RetailAnalystDashboard() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});
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
    ]).then(([userData, scoresRes]) => {
      setUser(userData);
      setScores(scoresRes.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [navigate]);

  return (
    <div className="role-dashboard-page">
      <Navbar />
      <main className="role-dashboard-content">
        <h2>Retail Analyst Dashboard</h2>
        {user && <p className="welcome-text">Welcome back, {user.name}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h3>Consumer Behavior Analytics</h3>
            <div className="report-table">
              <div className="report-row header-row">
                <span>Shelf</span>
                <span>Engagement</span>
                <span>Visibility</span>
              </div>
              {Object.entries(scores).map(([shelf, data]) => (
                <div key={shelf} className="report-row">
                  <span>{shelf}</span>
                  <span>{data.engagement_score}</span>
                  <span>{data.shelf_visibility_score}</span>
                </div>
              ))}
            </div>

            <h3>Attention Heatmaps</h3>
            <p className="welcome-text">
              View detailed attention heatmaps on the <a href="/heatmaps" style={{ color: '#1c7bb0' }}>Heatmaps page</a>.
            </p>

            <h3>Product Attractiveness Reports</h3>
            <div className="report-table">
              <div className="report-row header-row">
                <span>Shelf</span>
                <span>Score</span>
                <span>Purchases</span>
              </div>
              {Object.entries(scores).map(([shelf, data]) => (
                <div key={shelf} className="report-row">
                  <span>{shelf}</span>
                  <span>{data.attractiveness_score}</span>
                  <span>{data.purchased_count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default RetailAnalystDashboard;