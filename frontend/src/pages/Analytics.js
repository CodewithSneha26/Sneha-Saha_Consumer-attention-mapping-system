import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './Analytics.css';
import { Link } from 'react-router-dom';

function Analytics() {
  const [scores, setScores] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [shoppers, setShoppers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/shelf-scores'),
      api.get('/recommendations'),
      api.get('/behavior-analysis-all'),
    ]).then(([scoresRes, recsRes, shoppersRes]) => {
      setScores(scoresRes.data);
      setRecommendations(recsRes.data);
      setShoppers(shoppersRes.data);
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

        <h2>Consumer Behavior Segments</h2>
        <div className="shoppers-grid">
          {shoppers.length === 0 ? (
            <p>No shopper behavior data yet. Run a tracking session first.</p>
          ) : (
            shoppers.map((shopper) => (
              <div key={shopper.person_track_id} className="shopper-card">
                <div className="shopper-header">
                  <span className="shopper-id">Person #{shopper.person_track_id}</span>
                  <span className="segment-badge">{shopper.segment}</span>
                </div>
                <div className="shopper-stats">
                  <div><span>Zones Visited</span><strong>{shopper.zones_visited.length}</strong></div>
                  <div><span>Total Time</span><strong>{shopper.total_time_seconds}s</strong></div>
                  <div><span>Interactions</span><strong>{shopper.total_interactions}</strong></div>
                </div>
                {shopper.journey_path && shopper.journey_path.length > 0 && (
                  <div className="journey-path">
                    <span className="journey-label">Journey:</span>
                    <div className="journey-steps">
                      {shopper.journey_path.map((step, idx) => (
                        <React.Fragment key={idx}>
                          <span className="journey-step">{step}</span>
                          {idx < shopper.journey_path.length - 1 && <span className="journey-arrow">→</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default Analytics;