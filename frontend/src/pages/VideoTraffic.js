import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './VideoTraffic.css';

function VideoTraffic() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/detect-video-traffic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      alert('Video analysis failed. Please try a shorter video or check the file format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="video-traffic-page">
      <Navbar />
      <main className="video-traffic-content">
        <h2>Video Traffic Analysis</h2>
        <p className="video-traffic-subtitle">
          Upload store/mall footage to analyze real multi-person traffic patterns using YOLOv8 tracking.
        </p>

        <div className="upload-section">
          <label className="upload-box">
            <input type="file" accept="video/*" onChange={handleFileChange} hidden />
            {previewUrl ? (
              <video src={previewUrl} controls className="preview-video" />
            ) : (
              <span>Click to select a video file (MP4)</span>
            )}
          </label>

          <button onClick={handleAnalyze} disabled={!selectedFile || loading}>
            {loading ? 'Analyzing video... this may take a minute' : 'Analyze Traffic'}
          </button>
        </div>

        {results && (
          <div className="results-section">
            <h3>Traffic Analysis Results</h3>

            <div className="results-summary">
              <div className="summary-stat">
                <span className="summary-value">{results.frames_processed}</span>
                <span className="summary-label">Frames Processed</span>
              </div>
              <div className="summary-stat">
                <span className="summary-value">{results.total_unique_people}</span>
                <span className="summary-label">Unique People Tracked</span>
              </div>
              <div className="summary-stat">
                <span className="summary-value">{results.max_simultaneous_people}</span>
                <span className="summary-label">Max Simultaneous</span>
              </div>
            </div>
            <p className="results-note">{results.note}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default VideoTraffic;