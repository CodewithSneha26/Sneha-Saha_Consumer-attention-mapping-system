import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import './Dashboard.css';

function Dashboard() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.get('/alerts')
      .then((res) => {
        setAlerts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Consumer Attention Mapping</h1>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </header>

      <main className="dashboard-content">
        <h2>Recent Alerts</h2>
        {loading ? (
          <p>Loading...</p>
        ) : alerts.length === 0 ? (
          <p>No alerts found.</p>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert) => (
              <div key={alert.id} className={`alert-card severity-${alert.severity.toLowerCase()}`}>
                <span className="alert-type">{alert.alert_type}</span>
                <p>{alert.message}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;