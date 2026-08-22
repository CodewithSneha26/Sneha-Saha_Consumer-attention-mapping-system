import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { getCurrentUser } from '../api/userService';
import './RoleDashboard.css';

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [cameras, setCameras] = useState([]);
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
      api.get('/stores'),
      api.get('/cameras'),
      api.get('/alerts'),
      api.get('/users'),
    ]).then(([userData, storesRes, camerasRes, alertsRes, usersRes]) => {
      setUser(userData);
      setStores(storesRes.data);
      setCameras(camerasRes.data);
      setAlerts(alertsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, [navigate]);

  
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      alert('Failed to delete user.');
    }
  };

  const platformAlerts = alerts.filter(a => a.alert_type === 'Platform Notification');
  const cameraAlerts = alerts.filter(a => a.alert_type === 'Camera Health');

  return (
    <div className="role-dashboard-page">
      <Navbar />
      <main className="role-dashboard-content">
        <h2>Admin Dashboard</h2>
        {user && <p className="welcome-text">Welcome back, {user.name}</p>}

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="stats-row">
              <div className="stat-box">
                <span className="stat-label">Total Stores</span>
                <span className="stat-value">{stores.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Total Cameras</span>
                <span className="stat-value">{cameras.length}</span>
              </div>
              <div className="stat-box">
                <span className="stat-label">Camera Health Issues</span>
                <span className="stat-value alert-number">{cameraAlerts.length}</span>
              </div>
            </div>

            <h3>User Management</h3>
            <div className="report-table">
              <div className="report-row header-row">
                <span>Name</span>
                <span>Email</span>
                <span>Role</span>
              </div>
              {users.map((u) => (
                <div key={u.id} className="report-row user-row-with-action">
                  <span>{u.name}</span>
                  <span>{u.email}</span>
                  <span>
                    {u.role}
                    <button className="delete-user-btn" onClick={() => handleDeleteUser(u.id, u.name)}>✕</button>
                  </span>
                </div>
              ))}
            </div>
            <h3>Platform Analytics</h3>
            <div className="admin-table">
              {platformAlerts.map((a) => (
                <div key={a.id} className="report-row">
                  <span>{a.message}</span>
                </div>
              ))}
            </div>

            <h3>Camera Management</h3>
            <div className="report-table">
              <div className="report-row header-row">
                <span>Camera</span>
                <span>Store</span>
                <span>Location</span>
              </div>
              {cameras.map((cam) => (
                <div key={cam.id} className="report-row">
                  <span>{cam.camera_name}</span>
                  <span>Store #{cam.store_id}</span>
                  <span>{cam.location_description || '-'}</span>
                </div>
              ))}
            </div>

            <h3>System Monitoring</h3>
            <div className="admin-table">
              {alerts.length === 0 ? (
                <div className="report-row"><span>No system alerts.</span></div>
              ) : (
                alerts.slice(0, 5).map((a) => (
                  <div key={a.id} className="report-row" style={{ gridTemplateColumns: '1fr 3fr' }}>
                    <span>{a.severity}</span>
                    <span>{a.message}</span>
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

export default AdminDashboard;