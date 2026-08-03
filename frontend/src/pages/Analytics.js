import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './Analytics.css';
import { Link } from 'react-router-dom';

function Analytics() {
  const [scores, setScores] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/shelf-scores'),
      api.get('/recommendations'),
    ]).then(([scoresRes, recsRes]) => {
      setScores(scoresRes.data);
      setRecommendations(recsRes.data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const sortedShelves = Object.entries(scores).sort(
    (a, b) => b[1].attractiveness_score - a[1].attractiveness_score
  );

  return (
    <div className="analytics-page">
      <Navbar />
      <main className="analytics-content">
        <h2>Shelf Attractiveness Scores</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="scores-grid">
            {sortedShelves.map(([shelf, data], index) => (
              <div key={shelf} className="score-card">
                <div className="score-rank">#{index + 1}</div>
                <Link to={`/shelf-detail/${encodeURIComponent(shelf)}`} className="shelf-link">
                  <h3>{shelf}</h3>
                </Link>
                <div className="score-value">{data.attractiveness_score}<span>/100</span></div>
                <div className="score-bar-track">
                  <div
                    className="score-bar-fill"
                    style={{ width: `${data.attractiveness_score}%` }}
                  ></div>
                </div>
                <div className="score-metrics">
                  <div><span>Visibility</span><strong>{data.shelf_visibility_score}</strong></div>
                  <div><span>Engagement</span><strong>{data.engagement_score}</strong></div>
                  <div><span>Conversion</span><strong>{data.conversion_potential_score}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        <h2>Recommendations</h2>
        <div className="recommendations-list">
          {recommendations.map((rec, i) => (
            <div key={i} className="rec-card">
              <h3>{rec.shelf} <span className="rec-score">Score: {rec.attractiveness_score}</span></h3>
              {rec.recommendations.map((r, j) => (
                <div key={j} className="rec-item">
                  <span className="rec-type">{r.type}</span>
                  <p>{r.text}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default Analytics;