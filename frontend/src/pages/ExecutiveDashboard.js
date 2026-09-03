import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './ExecutiveDashboard.css';

function ExecutiveDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    api.get('/executive-summary')
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  return (
    <div className="exec-page">
      <Navbar />
      <main className="exec-content">
        <h2>Executive Dashboard</h2>
        <p className="exec-subtitle">A high-level summary of overall system performance, across all stores and shelves.</p>

        {loading || !data ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="exec-stats-row">
              <div className="exec-stat-box">
                <span className="exec-stat-value">{data.total_stores}</span>
                <span className="exec-stat-label">Stores</span>
              </div>
              <div className="exec-stat-box">
                <span className="exec-stat-value">{data.total_shelves}</span>
                <span className="exec-stat-label">Shelves</span>
              </div>
              <div className="exec-stat-box">
                <span className="exec-stat-value">{data.total_cameras}</span>
                <span className="exec-stat-label">Cameras</span>
              </div>
              <div className="exec-stat-box highlight">
                <span className="exec-stat-value">{data.average_shelf_score}</span>
                <span className="exec-stat-label">Avg. Shelf Score</span>
              </div>
              <div className="exec-stat-box">
                <span className="exec-stat-value">{data.unique_shoppers_tracked}</span>
                <span className="exec-stat-label">Shoppers Tracked</span>
              </div>
              <div className="exec-stat-box alert-box">
                <span className="exec-stat-value">{data.critical_alerts}</span>
                <span className="exec-stat-label">Critical Alerts</span>
              </div>
            </div>

            <h3>Overall Shelf Performance</h3>
            <div className="exec-chart-card">
              <ResponsiveContainer width="100%" height={Object.keys(data.shelf_scores).length * 60}>
                <BarChart
                  layout="vertical"
                  data={Object.entries(data.shelf_scores).map(([shelf, d]) => ({
                    shelf, Score: d.attractiveness_score
                  }))}
                  margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef2f6" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <YAxis type="category" dataKey="shelf" width={170} tick={{ fontSize: 12, fill: '#14324d' }} />
                  <Tooltip />
                  <Bar dataKey="Score" fill="#1c7bb0" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="exec-two-col">
              <div className="exec-col-card">
                <h3>🏆 Top Performing Shelves</h3>
                {data.top_shelves.map((s, i) => (
                  <div key={i} className="exec-rank-row top">
                    <span>#{i + 1} {s.shelf}</span>
                    <strong>{s.score}</strong>
                  </div>
                ))}
              </div>
              <div className="exec-col-card">
                <h3>⚠️ Needs Attention</h3>
                {data.bottom_shelves.map((s, i) => (
                  <div key={i} className="exec-rank-row bottom">
                    <span>{s.shelf}</span>
                    <strong>{s.score}</strong>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default ExecutiveDashboard;