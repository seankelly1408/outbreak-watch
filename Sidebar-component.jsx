import React, { useState } from 'react';

const Sidebar = ({ cases, selectedCountry, onSelectCountry }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCases = cases.filter(c =>
    c.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Affected Countries</h3>
        <input
          type="text"
          className="search-input"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="countries-list">
        {filteredCases.map(c => (
          <div
            key={c.id}
            className={`country-item ${selectedCountry === c.country ? 'selected' : ''}`}
            onClick={() => onSelectCountry(c.country)}
          >
            <div className="country-header">
              <h4>{c.country}</h4>
              {c.deaths > 0 && <span className="risk-indicator">⚠</span>}
            </div>
            
            <div className="country-stats">
              <div className="stat">
                <span className="stat-value">{c.count}</span>
                <span className="stat-name">cases</span>
              </div>
              <div className="stat danger">
                <span className="stat-value">{c.deaths}</span>
                <span className="stat-name">deaths</span>
              </div>
            </div>

            <div className="status-badge">
              <span className={`status ${c.deaths > 0 ? 'high-risk' : 'monitoring'}`}>
                {c.deaths > 0 ? '● High Risk' : '● Monitoring'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="alert-box">
          <h4>⚡ Get Alerts</h4>
          <p>Stay updated with real-time case notifications</p>
          <button className="btn-alert">Enable Alerts</button>
        </div>

        <div className="info-box">
          <h4>ℹ About</h4>
          <p>This tracker aggregates data from WHO, CDC, and ECDC</p>
          <a href="#" className="learn-link">Learn more →</a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
