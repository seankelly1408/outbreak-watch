#!/usr/bin/env python3
"""
Hantavirus Tracker - Data Scraper
Fetches real-time data from WHO, CDC, and news sources
"""

import requests
from bs4 import BeautifulSoup
from datetime import datetime, timedelta
import json
import os
from typing import List, Dict
import feedparser
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class HantavirusScraper:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
        self.cases = []
        self.news = []
        
    def fetch_who_data(self) -> List[Dict]:
        """Fetch data from WHO Disease Outbreak Notifications"""
        try:
            # WHO DON RSS feed
            url = 'https://www.who.int/feeds/entity/csr/don/en/feed.xml'
            feed = feedparser.parse(url)
            
            outbreak_entries = []
            for entry in feed.entries[:10]:
                if 'hantavirus' in entry.title.lower():
                    outbreak_entries.append({
                        'source': 'WHO',
                        'title': entry.title,
                        'date': entry.get('published', datetime.now().isoformat()),
                        'url': entry.link,
                        'summary': entry.get('summary', '')[:200]
                    })
            
            logger.info(f"Fetched {len(outbreak_entries)} WHO entries")
            return outbreak_entries
            
        except Exception as e:
            logger.error(f"Error fetching WHO data: {e}")
            return []
    
    def fetch_cdc_data(self) -> List[Dict]:
        """Fetch data from CDC Emergency Preparedness & Response"""
        try:
            url = 'https://www.cdc.gov/hantavirus/'
            response = self.session.get(url, timeout=10)
            
            if response.status_code == 200:
                # In production: parse HTML and extract case data
                logger.info("Fetched CDC page")
                return []
            
        except Exception as e:
            logger.error(f"Error fetching CDC data: {e}")
            return []
    
    def fetch_news_by_country(self) -> List[Dict]:
        """Fetch news articles about hantavirus from major news sources"""
        sources = {
            'Reuters': 'https://www.reuters.com/search/news?blob=hantavirus',
            'BBC': 'https://www.bbc.com/news/search?q=hantavirus',
            'AP': 'https://apnews.com/search?q=hantavirus&sort=latest',
            'Guardian': 'https://www.theguardian.com/search?q=hantavirus&type=article'
        }
        
        articles = []
        
        for source, url in sources.items():
            try:
                response = self.session.get(url, timeout=10)
                if response.status_code == 200:
                    soup = BeautifulSoup(response.content, 'html.parser')
                    # Parse based on source structure
                    # This is simplified - each source needs custom parsing
                    logger.info(f"Fetched {source}")
                    
            except Exception as e:
                logger.error(f"Error fetching {source}: {e}")
        
        return articles
    
    def fetch_google_news(self, query: str = 'hantavirus outbreak') -> List[Dict]:
        """Fetch from Google News RSS"""
        try:
            url = f'https://news.google.com/rss/search?q={query}'
            feed = feedparser.parse(url)
            
            articles = []
            for entry in feed.entries[:15]:
                articles.append({
                    'title': entry.title,
                    'date': entry.get('published', datetime.now().isoformat()),
                    'url': entry.link,
                    'source': 'Google News',
                    'excerpt': entry.get('summary', '')[:300]
                })
            
            logger.info(f"Fetched {len(articles)} Google News articles")
            return articles
            
        except Exception as e:
            logger.error(f"Error fetching Google News: {e}")
            return []
    
    def parse_country_from_title(self, title: str) -> str:
        """Extract country from news title"""
        countries = {
            'Netherlands': ['Netherlands', 'Dutch', 'Amsterdam', 'Holland'],
            'Germany': ['Germany', 'German', 'Berlin'],
            'UK': ['United Kingdom', 'UK', 'Britain', 'British'],
            'Switzerland': ['Switzerland', 'Swiss', 'Zurich'],
            'Spain': ['Spain', 'Spanish', 'Tenerife', 'Canary'],
            'United States': ['United States', 'US', 'America', 'American'],
            'South Africa': ['South Africa', 'Johannesburg'],
            'Argentina': ['Argentina', 'Argentine'],
            'Chile': ['Chile', 'Chilean'],
        }
        
        title_lower = title.lower()
        for country, keywords in countries.items():
            if any(kw.lower() in title_lower for kw in keywords):
                return country
        
        return 'Unknown'
    
    def scrape_all(self) -> Dict:
        """Run all scrapers and return consolidated data"""
        logger.info("Starting data scrape...")
        
        all_articles = []
        all_articles.extend(self.fetch_who_data())
        all_articles.extend(self.fetch_google_news())
        all_articles.extend(self.fetch_cdc_data())
        
        # Add country information
        for article in all_articles:
            if 'country' not in article:
                article['country'] = self.parse_country_from_title(article['title'])
        
        return {
            'timestamp': datetime.now().isoformat(),
            'total_articles': len(all_articles),
            'articles': all_articles[:20]  # Top 20
        }
    
    def save_to_json(self, data: Dict, filename: str = 'outbreak_data.json'):
        """Save scraped data to JSON file"""
        try:
            with open(filename, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Data saved to {filename}")
        except Exception as e:
            logger.error(f"Error saving data: {e}")

# WHO Case Data Parser - for structured data
class WHOCaseParser:
    """Parse WHO DON reports for structured case data"""
    
    @staticmethod
    def extract_case_counts(text: str) -> Dict:
        """Extract confirmed/probable cases from text"""
        cases = {
            'confirmed': 0,
            'probable': 0,
            'deaths': 0,
            'countries': []
        }
        
        # Simple regex patterns - in production use NLP
        import re
        
        confirmed = re.search(r'(\d+)\s+confirmed', text, re.IGNORECASE)
        if confirmed:
            cases['confirmed'] = int(confirmed.group(1))
        
        probable = re.search(r'(\d+)\s+probable', text, re.IGNORECASE)
        if probable:
            cases['probable'] = int(probable.group(1))
        
        deaths = re.search(r'(\d+)\s+deaths?', text, re.IGNORECASE)
        if deaths:
            cases['deaths'] = int(deaths.group(1))
        
        return cases

# Scheduled task runner
def run_scheduled_scrape():
    """Run scraper on a schedule (call from cron job)"""
    scraper = HantavirusScraper()
    data = scraper.scrape_all()
    scraper.save_to_json(data)
    
    # POST to backend API
    try:
        response = requests.post(
            'http://localhost:3000/api/admin/news/update',
            json=data,
            timeout=10
        )
        logger.info(f"Updated backend: {response.status_code}")
    except Exception as e:
        logger.error(f"Could not update backend: {e}")

if __name__ == '__main__':
    scraper = HantavirusScraper()
    
    print("🚀 Hantavirus Data Scraper")
    print("-" * 50)
    
    # Fetch all data
    results = scraper.scrape_all()
    
    print(f"\n📰 Found {results['total_articles']} articles")
    print(f"⏰ Last updated: {results['timestamp']}")
    
    # Save to file
    scraper.save_to_json(results)
    
    # Display sample
    print("\n📋 Sample articles:")
    for article in results['articles'][:3]:
        print(f"\n  {article['title'][:60]}...")
        print(f"  Country: {article.get('country', 'Unknown')}")
        print(f"  Source: {article.get('source', 'Unknown')}")
