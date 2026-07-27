import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { getCurrentUser } from '../api/userService';
import './RoleDashboard.css';

function MarketingManagerDashboard() {
  const [user, setUser] = useState(null);
  const [scores, setScores] = useState({});
  const [recommendations, setRecommendations] = useState([]);
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
      api.get('/recommendations'),
    ]).then(([userData, scoresRes, recsRes]) => {
      setUser(userData);
      setScores(scoresRes.data);
      setRecommendations(recsRes.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [navigate]);

  const promoRecs = recommendations.flatMap(r =>
    r.recommendations.filter(rec => rec.type === 'Promotional Placement')
      .map(rec => ({ shelf: r.shelf, text: rec.text }))
  );

  return (
    <div className="role-dashboard-page">
      <Navbar />
      <main className="role-dashboard-content">
        <h2>Marketing Manager Dashboard</h2>
        {user && <p className="welcome-text">Welcome back, {user.name}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h3>Product Visibility Analytics</h3>
            <div className="report-table">
              <div className="report-row header-row">
                <span>Shelf</span>
                <span>Visibility</span>
                <span>Marketing Effectiveness</span>
              </div>
              {Object.entries(scores).map(([shelf, data]) => (
                <div key={shelf} className="report-row">
                  <span>{shelf}</span>
                  <span>{data.shelf_visibility_score}</span>
                  <span>{data.marketing_effectiveness_score}%</span>
                </div>
              ))}
            </div>

            <h3>Promotional Placement Suggestions</h3>
            <div className="report-table">
              {promoRecs.length === 0 ? (
                <div className="report-row"><span>No promotional suggestions at this time.</span></div>
              ) : (
                promoRecs.map((rec, i) => (
                  <div key={i} className="report-row" style={{ gridTemplateColumns: '1fr 3fr' }}>
                    <span>{rec.shelf}</span>
                    <span>{rec.text}</span>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default MarketingManagerDashboard;