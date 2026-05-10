import React, { useState, useEffect } from 'react';
import './App.css';
import MapComponent from './components/Map';
import NewsPanel from './components/NewsPanel';
import StatsBar from './components/StatsBar';
import Sidebar from './components/Sidebar';

function App() {
  const [cases, setCases] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [news, setNews] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [casesRes, markersRes, newsRes, statsRes] = await Promise.all([
        fetch('/api/cases'),
        fetch('/api/markers'),
        fetch('/api/news'),
        fetch('/api/stats')
      ]);

      setCases(await casesRes.json());
      setMarkers(await markersRes.json());
      setNews(await newsRes.json());
      setStats(await statsRes.json());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading outbreak data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <span className="logo-icon">◆</span>
            <div>
              <h1>OUTBREAK WATCH</h1>
              <p>Real-time Hantavirus Tracking</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn-secondary">Share</button>
            <button className="btn-primary">Get Alerts</button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      {stats && <StatsBar stats={stats} />}

      {/* Main Layout */}
      <div className="main-layout">
        {/* Left: Map */}
        <div className="map-section">
          <h2>Global Distribution</h2>
          <MapComponent markers={markers} onMarkerClick={setSelectedCountry} />
        </div>

        {/* Right: Sidebar */}
        <div className="sidebar-section">
          <Sidebar
            cases={cases}
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
          />
        </div>
      </div>

      {/* News Panel */}
      <NewsPanel news={news} selectedCountry={selectedCountry} />

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-col">
            <h4>Data</h4>
            <a href="#">WHO</a>
            <a href="#">CDC</a>
            <a href="#">ECDC</a>
          </div>
          <div className="footer-col">
            <h4>About</h4>
            <a href="#">About Us</a>
            <a href="#">Methodology</a>
            <a href="#">Contact</a>
          </div>
          <div className="footer-col">
            <h4>Develop</h4>
            <a href="#">API Docs</a>
            <a href="#">GitHub</a>
            <a href="#">Status</a>
          </div>
          <div className="footer-col">
            <h4>Legal</h4>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Disclaimer</a>
          </div>
        </div>
        <div className="footer-bottom">
          © 2026 Outbreak Watch | Real-time health data for public awareness
        </div>
      </footer>
    </div>
  );
}

export default App;
