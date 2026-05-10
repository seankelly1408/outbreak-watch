import React from 'react';

const NewsPanel = ({ news, selectedCountry }) => {
  const filteredNews = selectedCountry
    ? news.filter(n => n.country === selectedCountry)
    : news;

  return (
    <div className="news-panel">
      <div className="news-container">
        <h2>Latest News {selectedCountry && `from ${selectedCountry}`}</h2>
        
        <div className="news-grid">
          {filteredNews.map(article => (
            <article key={article.id} className="news-card">
              <div className="news-image" style={{
                backgroundImage: `url(${article.image})`,
                backgroundColor: '#2a2a2a'
              }}></div>
              
              <div className="news-content">
                <div className="news-meta">
                  <span className="news-country">{article.country}</span>
                  <span className="news-date">{new Date(article.date).toLocaleDateString()}</span>
                </div>
                
                <h3 className="news-title">{article.title}</h3>
                <p className="news-excerpt">{article.excerpt}</p>
                
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="news-link">
                  Read on {article.source} →
                </a>
              </div>
            </article>
          ))}
        </div>

        {filteredNews.length === 0 && (
          <div className="no-news">
            <p>No news articles found for {selectedCountry}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsPanel;
