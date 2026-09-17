import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import { useResults } from '../context/ResultsContext';
import './ShelfDetection.css';

function ShelfDetection() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedShelf, setSelectedShelf] = useState('');
  const [shelves, setShelves] = useState([]);
  const [shelfScores, setShelfScores] = useState({});
  const { shelfDetectionResults: results, setShelfDetectionResults: setResults } = useResults();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/shelves').then((res) => setShelves(res.data)).catch((err) => console.error('Failed to load shelves:', err));
    api.get('/shelf-scores').then((res) => setShelfScores(res.data)).catch((err) => console.error('Failed to load scores:', err));
  }, []);

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
          <select
            className="shelf-select-dropdown"
            value={selectedShelf}
            onChange={(e) => setSelectedShelf(e.target.value)}
          >
            <option value="">Which shelf is this photo of? (optional)</option>
            {shelves.map((s) => (
              <option key={s.id} value={s.shelf_name}>{s.shelf_name}</option>
            ))}
          </select>

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

            {selectedShelf && shelfScores[selectedShelf] && (
              <div className="shelf-insight-banner">
                <div className="insight-stat">
                  <span className="insight-value">{results.total_detections}</span>
                  <span className="insight-label">Products Detected (from photo)</span>
                </div>
                <div className="insight-vs">vs</div>
                <div className="insight-stat">
                  <span className="insight-value">{shelfScores[selectedShelf].attractiveness_score}</span>
                  <span className="insight-label">Consumer Attention Score</span>
                </div>
                <p className="insight-text">
                  {shelfScores[selectedShelf].attractiveness_score < 30 && results.total_detections > 20
                    ? `⚠️ "${selectedShelf}" is heavily stocked but getting low attention — consider repositioning or improving visibility.`
                    : shelfScores[selectedShelf].attractiveness_score >= 50
                    ? `✅ "${selectedShelf}" is performing well — this stocking level is working.`
                    : `This shelf has moderate attention relative to its stock level — monitor for optimization opportunities.`}
                </p>
              </div>
            )}

            <div className="results-summary">
              <div className="summary-stat">
                <span className="summary-value">{results.total_detections}</span>
                <span className="summary-label">Total Objects Detected</span>
              </div>
            </div>

            <div className="class-breakdown">
              {Object.entries(classCounts || {}).map(([className, count]) => (
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