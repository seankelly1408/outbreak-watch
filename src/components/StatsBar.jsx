import React from 'react';

const StatsBar = ({ stats }) => {
  return (
    <div className="stats-bar">
      <div className="stats-container">
        <div className="stat-item">
          <div className="stat-number">{stats.totalCases}</div>
          <div className="stat-label">Confirmed Cases</div>
          <div className="stat-sub">As of today</div>
        </div>
        
        <div className="stat-divider"></div>
        
        <div className="stat-item danger">
          <div className="stat-number">{stats.totalDeaths}</div>
          <div className="stat-label">Deaths</div>
          <div className="stat-sub">{stats.casesFatalityRate}% fatality rate</div>
        </div>
        
        <div className="stat-divider"></div>
        
        <div className="stat-item">
          <div className="stat-number">{stats.countriesAffected}</div>
          <div className="stat-label">Countries</div>
          <div className="stat-sub">Europe, Africa, N. America</div>
        </div>

        <div className="stat-divider"></div>
        
        <div className="stat-item">
          <div className="stat-number">{Object.values(stats.regions).reduce((a, b) => a + b, 0)}</div>
          <div className="stat-label">Regions</div>
          <div className="stat-sub">Under surveillance</div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
