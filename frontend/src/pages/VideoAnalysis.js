import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { useResults } from '../context/ResultsContext';
import './VideoAnalysis.css';

function VideoAnalysis() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { videoAnalysisResults: results, setVideoAnalysisResults: setResults } = useResults();
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/analyze-video-full?clear_previous_data=true', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      alert('Video analysis failed. This may take a minute for longer videos - please wait and try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (endpoint, filename) => {
    try {
      const response = await api.get(endpoint, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Download failed.');
    }
  };

  return (
    <div className="video-analysis-page">
      <Navbar />
      <main className="video-analysis-content">
        <h2>Full Video Analysis</h2>
        <p className="video-analysis-subtitle">
          Upload any store/mall video to run the complete detection, tracking, attention, and reporting pipeline.
        </p>

        <div className="upload-section">
          <label className="upload-box">
            <input type="file" accept="video/*" onChange={handleFileChange} hidden />
            {selectedFile ? <span>{selectedFile.name}</span> : <span>Click to select a video file</span>}
          </label>
          <button onClick={handleAnalyze} disabled={!selectedFile || loading}>
            {loading ? 'Analyzing... this may take a minute' : 'Run Full Analysis'}
          </button>
        </div>

        {results && (
          <div className="results-wrapper">

            <div className="overview-stats">
              <div className="overview-stat">
                <span className="overview-value">{results.unique_people_tracked}</span>
                <span className="overview-label">Unique People Tracked</span>
              </div>
              <div className="overview-stat">
                <span className="overview-value">{results.frames_processed}</span>
                <span className="overview-label">Frames Processed</span>
              </div>
              <div className="overview-stat">
                <span className="overview-value">{results.total_attention_time_seconds}s</span>
                <span className="overview-label">Total Attention Time</span>
              </div>
              <div className="overview-stat">
                <span className="overview-value">{results.total_attentive_events}</span>
                <span className="overview-label">Attentive Events</span>
              </div>
            </div>

            <div className="download-row">
              <button onClick={() => downloadFile(results.pdf_report_url, 'video_analysis_report.pdf')}>
                Download PDF Report
              </button>
              <button onClick={() => downloadFile(results.excel_report_url, 'video_analysis_report.xlsx')}>
                Download Excel Report
              </button>
            </div>

            <h3>1. Shelf Performance & Attractiveness Scores</h3>
            <table className="report-table-full">
              <thead>
                <tr>
                  <th>Shelf</th><th>Score</th><th>Visibility</th><th>Engagement</th><th>Conversion</th><th>Marketing</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(results.shelf_scores).map(([shelf, d]) => (
                  <tr key={shelf}>
                    <td>{shelf}</td>
                    <td>{d.attractiveness_score}</td>
                    <td>{d.shelf_visibility_score}</td>
                    <td>{d.engagement_score}</td>
                    <td>{d.conversion_potential_score}%</td>
                    <td>{d.marketing_effectiveness_score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>2. Product Engagement Summary</h3>
            <table className="report-table-full">
              <thead><tr><th>Interaction Type</th><th>Count</th></tr></thead>
              <tbody>
                {Object.entries(results.interaction_summary).map(([type, count]) => (
                  <tr key={type}><td>{type}</td><td>{count}</td></tr>
                ))}
              </tbody>
            </table>

            <h3>3. Consumer Attention Summary</h3>
            <div className="summary-box">
              <p>Total recorded attention time: <strong>{results.total_attention_time_seconds} seconds</strong></p>
              <p>Total attentive events: <strong>{results.total_attentive_events}</strong></p>
            </div>

            <h3>4. Conversion Report</h3>
            <table className="report-table-full">
              <thead><tr><th>Shelf</th><th>Total Interactions</th><th>Purchased</th><th>Conversion Rate</th></tr></thead>
              <tbody>
                {Object.entries(results.shelf_scores).map(([shelf, d]) => (
                  <tr key={shelf}>
                    <td>{shelf}</td><td>{d.total_interactions}</td><td>{d.purchased_count}</td><td>{d.conversion_potential_score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>5. Marketing Effectiveness Report</h3>
            <table className="report-table-full">
              <thead><tr><th>Shelf</th><th>Compared</th><th>Purchased</th><th>Marketing Effectiveness</th></tr></thead>
              <tbody>
                {Object.entries(results.shelf_scores).map(([shelf, d]) => (
                  <tr key={shelf}>
                    <td>{shelf}</td><td>{d.compared_count}</td><td>{d.purchased_count}</td><td>{d.marketing_effectiveness_score}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h3>Recommendations</h3>
            {results.recommendations.map((rec, i) => (
              <div key={i} className="rec-card-full">
                <h4>{rec.shelf} <span>Score: {rec.attractiveness_score}</span></h4>
                {rec.recommendations.map((r, j) => (
                  <p key={j}><strong>{r.type}:</strong> {r.text}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default VideoAnalysis;