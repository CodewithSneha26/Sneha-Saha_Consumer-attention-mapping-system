import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './ShelfDetail.css';

function ShelfDetail() {
  const { shelfName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/shelf-detail/${encodeURIComponent(shelfName)}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [shelfName]);

  if (loading) {
    return (
      <div className="shelf-detail-page">
        <Navbar />
        <main className="shelf-detail-content"><p>Loading...</p></main>
      </div>
    );
  }

  if (!data || !data.score) {
    return (
      <div className="shelf-detail-page">
        <Navbar />
        <main className="shelf-detail-content">
          <p>No data found for this shelf yet. Run a tracking session first.</p>
          <Link to="/stores" className="back-link">← Back to Stores & Shelves</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="shelf-detail-page">
      <Navbar />
      <main className="shelf-detail-content">
        <Link to="/analytics" className="back-link">← Back to Analytics</Link>
        <h2>{data.shelf_name}</h2>

        <div className="stats-row">
          <div className="stat-box">
            <span className="stat-label">Attractiveness Score</span>
            <span className="stat-value">{data.score.attractiveness_score}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Total Interactions</span>
            <span className="stat-value">{data.score.total_interactions}</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Attention Duration</span>
            <span className="stat-value">{data.score.attention_duration_seconds}s</span>
          </div>
          <div className="stat-box">
            <span className="stat-label">Purchases</span>
            <span className="stat-value">{data.score.purchased_count}</span>
          </div>
        </div>

        <h3>Recommendations</h3>
        <div className="rec-list">
          {data.recommendations.map((r, i) => (
            <div key={i} className="rec-item-detail">
              <span className="rec-type-badge">{r.type}</span>
              <p>{r.text}</p>
            </div>
          ))}
        </div>

        <h3>Recent Product Interactions</h3>
        <div className="history-table">
          <div className="history-row header-row">
            <span>Person ID</span>
            <span>Interaction</span>
            <span>Duration</span>
          </div>
          {data.recent_interactions.slice(0, 10).map((i, idx) => (
            <div key={idx} className="history-row">
              <span>#{i.person_track_id}</span>
              <span>{i.interaction_type}</span>
              <span>{i.duration_seconds}s</span>
            </div>
          ))}
        </div>

        <h3>Recent Attention Records</h3>
        <div className="history-table">
          <div className="history-row header-row">
            <span>Person ID</span>
            <span>Status</span>
            <span>Duration</span>
          </div>
          {data.recent_attention.slice(0, 10).map((a, idx) => (
            <div key={idx} className="history-row">
              <span>#{a.person_track_id}</span>
              <span className={a.attention_status === 'Attentive' ? 'status-good' : 'status-neutral'}>
                {a.attention_status}
              </span>
              <span>{a.duration_seconds}s</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default ShelfDetail;