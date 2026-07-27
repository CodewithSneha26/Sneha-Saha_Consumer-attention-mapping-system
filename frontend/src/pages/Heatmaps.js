import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './Heatmaps.css';

const HEATMAP_FILES = [
  { file: 'heatmap_1_store.png', title: 'Store Presence Heatmap', desc: 'Shows overall areas where shoppers spent the most time.' },
  { file: 'heatmap_2_shelves.png', title: 'Shelf Dwell Time', desc: 'Total attention duration recorded per shelf.' },
  { file: 'heatmap_3_product_attention.png', title: 'Product Attention Matrix', desc: 'Interaction type breakdown by shelf.' },
  { file: 'heatmap_4_traffic.png', title: 'Customer Traffic Heatmap', desc: 'Movement density across the store.' },
];

function Heatmaps() {
  const [generating, setGenerating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const handleRegenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/heatmaps/generate');
      setRefreshKey(Date.now()); // forces images to reload
    } catch (err) {
      console.error(err);
      alert('Failed to generate heatmaps. Make sure tracking data exists.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="heatmaps-page">
      <Navbar />
      <main className="heatmaps-content">
        <div className="heatmaps-header">
          <div>
            <h2>Attention Heatmaps</h2>
            <p className="heatmaps-subtitle">Visual analysis of shopper attention and movement patterns.</p>
          </div>
          <button onClick={handleRegenerate} disabled={generating}>
            {generating ? 'Generating...' : 'Regenerate Heatmaps'}
          </button>
        </div>

        <div className="heatmaps-grid">
          {HEATMAP_FILES.map((h) => (
            <div key={h.file} className="heatmap-card">
              <h3>{h.title}</h3>
              <p>{h.desc}</p>
              <img
                src={`http://127.0.0.1:8000/heatmaps/${h.file}?t=${refreshKey}`}
                alt={h.title}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Heatmaps;