import ShelfDetail from './pages/ShelfDetail';
import ShelfDetection from './pages/ShelfDetection';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Stores from './pages/Stores';
import Analytics from './pages/Analytics';
import Heatmaps from './pages/Heatmaps';
import Reports from './pages/Reports';
import VideoAnalysis from './pages/VideoAnalysis';
import StoreManagerDashboard from './pages/StoreManagerDashboard';
import RetailAnalystDashboard from './pages/RetailAnalystDashboard';
import MarketingManagerDashboard from './pages/MarketingManagerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Navigate to="/login" />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/heatmaps" element={<Heatmaps />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/store-manager-dashboard" element={<StoreManagerDashboard />} />
          <Route path="/retail-analyst-dashboard" element={<RetailAnalystDashboard />} />
          <Route path="/marketing-manager-dashboard" element={<MarketingManagerDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/shelf-detection" element={<ShelfDetection />} />
          <Route path="/shelf-detail/:shelfName" element={<ShelfDetail />} />
          <Route path="/video-analysis" element={<VideoAnalysis />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;