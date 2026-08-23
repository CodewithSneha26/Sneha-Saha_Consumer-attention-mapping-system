import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { getCurrentUser } from '../api/userService';
import './RoleDashboard.css';

function RetailAnalystDashboard() {
  const [user, setUser] = useState(null);
  const [shoppers, setShoppers] = useState([]);
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
      api.get('/behavior-analysis-all'),
    ]).then(([userData, scoresRes, behaviorRes]) => {
      setUser(userData);
      setScores(scoresRes.data);
      setShoppers(behaviorRes.data);
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
              Full heatmap visualizations with explanations are available on the <a href="/heatmaps" style={{ color: '#1c7bb0' }}>Heatmaps page</a>.
            </p>

            <h3>Consumer Behavior Analytics</h3>
            <div className="stats-row">
              {['Explorer', 'Quick Buyer', 'Comparison Shopper', 'Impulse Buyer', 'Brand Loyal Customer'].map((seg) => {
                const count = shoppers.filter(s => s.segment === seg).length;
                return (
                  <div key={seg} className="stat-box">
                    <span className="stat-label">{seg}</span>
                    <span className="stat-value">{count}</span>
                  </div>
                );
              })}
            </div>

            <h3>Customer Journey Analytics</h3>
            <div className="report-table">
              <div className="report-row header-row">
                <span>Person ID</span>
                <span>Journey Path</span>
              </div>
              {shoppers.filter(s => s.journey_path && s.journey_path.length > 0).slice(0, 6).map((s, idx) => (
                <div key={idx} className="report-row">
                  <span>#{s.person_track_id}</span>
                  <span>{s.journey_path.join(' → ')}</span>
                </div>
              ))}
            </div>

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