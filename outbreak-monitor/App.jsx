import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cases, setCases] = useState([]);
  const [news, setNews] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

const fetchData = async () => {
  try {
    const [casesRes, newsRes] = await Promise.all([
      fetch('/api/cases.json'),
      fetch('/api/news.json')
    ]);
    setCases(await casesRes.json());
    setNews(await newsRes.json());
  } catch (err) {
    console.error('Error fetching data:', err);
  } finally {
    setLoading(false);
  }
};

  const totalCases = cases.reduce((sum, c) => sum + c.count, 0);
  const totalDeaths = cases.reduce((sum, c) => sum + c.deaths, 0);
  const countriesAffected = new Set(cases.map(c => c.country)).size;

  const filteredNews = selectedCountry === 'all' 
    ? news 
    : news.filter(n => n.country === selectedCountry);

  const countries = [...new Set(cases.map(c => c.country))].sort();

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-mark">◆</span>
            <h1>HANTAVIRUS TRACKER</h1>
            <span className="logo-subtitle">Global outbreak monitoring</span>
          </div>
          <div className="nav-links">
            <a href="#" className="nav-link">Data</a>
            <a href="#" className="nav-link">About</a>
            <a href="#" className="nav-link">API</a>
            <a href="#" className="nav-link premium">Go Pro</a>
          </div>
        </div>
      </nav>

      {/* Hero Stats Section */}
      <section className="hero-stats">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">{totalCases}</div>
            <div className="stat-label">Confirmed cases</div>
            <div className="stat-source">as of May 9, 2026</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item alert">
            <div className="stat-number">{totalDeaths}</div>
            <div className="stat-label">Deaths</div>
            <div className="stat-source">{((totalDeaths/totalCases)*100).toFixed(0)}% case fatality rate</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">{countriesAffected}</div>
            <div className="stat-label">Countries affected</div>
            <div className="stat-source">linked to cruise ship cluster</div>
          </div>
        </div>
      </section>

      {/* Ads Section */}
      <div className="ad-container banner-top">
        <div className="ad-placeholder">
          Advertisement — 728×90
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"></script>
        </div>
      </div>

      <main className="main-content">
        <div className="container">
          {/* Map Section */}
          <section className="section-map">
            <h2>Global distribution</h2>
            <div className="map-container">
              <div className="map-placeholder">
                <p>Interactive world map showing confirmed cases by country</p>
                <p className="map-note">Powered by real-time WHO data</p>
              </div>
            </div>
            <div className="case-summary">
              {cases.map(c => (
                <div key={c.country} className="country-badge">
                  <span className="country-name">{c.country}</span>
                  <span className="case-count">{c.count} confirmed</span>
                  {c.deaths > 0 && <span className="death-count">{c.deaths} deaths</span>}
                </div>
              ))}
            </div>
          </section>

          <div className="grid-main">
            {/* Left column: News */}
            <section className="section-news">
              <div className="news-header">
                <h2>Coverage by country</h2>
                <select 
                  value={selectedCountry} 
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="country-filter"
                >
                  <option value="all">All countries</option>
                  {countries.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="news-feed">
                {filteredNews.map((article, i) => (
                  <article key={i} className="news-item">
                    <div className="article-meta">
                      <span className="article-country">{article.country}</span>
                      <time className="article-date">{article.date}</time>
                    </div>
                    <h3 className="article-title">{article.title}</h3>
                    <p className="article-excerpt">{article.excerpt}</p>
                    <a href={article.url} className="article-link" target="_blank" rel="noopener">
                      Read on {article.source} →
                    </a>
                  </article>
                ))}
              </div>
            </section>

            {/* Right column: Sidebar */}
            <aside className="sidebar">
              {/* Premium CTA */}
              <div className="sidebar-box premium-box">
                <h3>Premium access</h3>
                <ul className="feature-list">
                  <li>Real-time alerts by region</li>
                  <li>Advanced trend analysis</li>
                  <li>API access for research</li>
                  <li>PDF report exports</li>
                </ul>
                <button className="btn-primary">Upgrade now</button>
                <p className="pricing">$9.99/month</p>
              </div>

              {/* Ad Sidebar */}
              <div className="ad-container sidebar-ad">
                <div className="ad-placeholder">
                  Advertisement — 300×250
                </div>
              </div>

              {/* Information Box */}
              <div className="sidebar-box info-box">
                <h3>About this outbreak</h3>
                <p>Andes hantavirus cluster linked to the cruise ship MV Hondius. Limited human-to-human transmission documented. WHO assesses risk to general public as low.</p>
                <a href="#" className="learn-more">Learn more about hantavirus →</a>
              </div>

              {/* Sources Box */}
              <div className="sidebar-box sources-box">
                <h3>Data sources</h3>
                <ul className="source-list">
                  <li><a href="#">WHO Disease Outbreak Notification</a></li>
                  <li><a href="#">CDC Emergency Response</a></li>
                  <li><a href="#">ECDC Alerts</a></li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Bottom Ad */}
      <div className="ad-container banner-bottom">
        <div className="ad-placeholder">
          Advertisement — 970×250
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Tracker</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Methodology</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Developers</h4>
            <ul>
              <li><a href="#">API Docs</a></li>
              <li><a href="#">GitHub</a></li>
              <li><a href="#">Status</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Legal</h4>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Disclaimer</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Advertise</h4>
            <ul>
              <li><a href="#">Media Kit</a></li>
              <li><a href="#">Sponsorships</a></li>
              <li><a href="#">Contact Sales</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Hantavirus Tracker. Data is for informational purposes. Always consult official health authorities.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
