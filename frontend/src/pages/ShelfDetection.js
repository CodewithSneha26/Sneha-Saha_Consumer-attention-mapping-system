import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './ShelfDetection.css';

function ShelfDetection() {
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

  const handleDetect = async () => {
    if (!selectedFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/detect-shelf-products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResults(response.data);
    } catch (err) {
      console.error(err);
      alert('Detection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Count how many of each class were detected
  const classCounts = results?.detections.reduce((acc, d) => {
    acc[d.class] = (acc[d.class] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="shelf-detection-page">
      <Navbar />
      <main className="shelf-detection-content">
        <h2>Shelf Product Detection</h2>
        <p className="shelf-detection-subtitle">
          Upload a shelf image to detect individual products using computer vision (YOLOv8).
        </p>

        <div className="upload-section">
          <label className="upload-box">
            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
            {previewUrl ? (
              <img src={previewUrl} alt="Selected shelf" className="preview-image" />
            ) : (
              <span>Click to select a shelf image</span>
            )}
          </label>

          <button onClick={handleDetect} disabled={!selectedFile || loading}>
            {loading ? 'Detecting...' : 'Run Detection'}
          </button>
        </div>

        {results && (
          <div className="results-section">
            <h3>Detection Results</h3>

            <img
              src={`http://127.0.0.1:8000${results.annotated_image_url}`}
              alt="Annotated detection result"
              className="annotated-result-image"
            />

            <div className="results-summary">
              <div className="summary-stat">
                <span className="summary-value">{results.total_detections}</span>
                <span className="summary-label">Total Objects Detected</span>
              </div>
            </div>

            <div className="class-breakdown">
              {Object.entries(classCounts).map(([className, count]) => (
                <div key={className} className="class-chip">
                  <span className="class-name">{className}</span>
                  <span className="class-count">{count}</span>
                </div>
              ))}
            </div>

            <p className="results-note">{results.note}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ShelfDetection;