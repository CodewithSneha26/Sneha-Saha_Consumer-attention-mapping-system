import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api/axiosConfig';
import './Reports.css';

function Reports() {
  const [downloading, setDownloading] = useState('');

  const downloadFile = async (endpoint, filename) => {
    setDownloading(endpoint);
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
      console.error(err);
      alert('Failed to download report.');
    } finally {
      setDownloading('');
    }
  };

  return (
    <div className="reports-page">
      <Navbar />
      <main className="reports-content">
        <h2>Reports & Export</h2>
        <p className="reports-subtitle">Download consolidated reports covering shelf performance, product engagement, attention, conversion, and marketing effectiveness.</p>

        <div className="reports-grid">
          <div className="report-card">
            <div className="report-icon">📄</div>
            <h3>PDF Report</h3>
            <p>A formatted document with all key metrics and tables, ready to share or print.</p>
            <button
              onClick={() => downloadFile('/reports/pdf', 'consumer_attention_report.pdf')}
              disabled={downloading === '/reports/pdf'}
            >
              {downloading === '/reports/pdf' ? 'Downloading...' : 'Download PDF'}
            </button>
          </div>

          <div className="report-card">
            <div className="report-icon">📊</div>
            <h3>Excel Report</h3>
            <p>A multi-sheet spreadsheet with raw data for shelf performance, interactions, and conversions.</p>
            <button
              onClick={() => downloadFile('/reports/excel', 'consumer_attention_report.xlsx')}
              disabled={downloading === '/reports/excel'}
            >
              {downloading === '/reports/excel' ? 'Downloading...' : 'Download Excel'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Reports;