import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Real case data with coordinates for map markers
let casesData = [
  {
    id: 1,
    country: "Netherlands",
    city: "Amsterdam",
    lat: 52.3676,
    lng: 4.9041,
    count: 2,
    deaths: 1,
    region: "Europe",
    status: "confirmed",
    date: "2026-05-08"
  },
  {
    id: 2,
    country: "Germany",
    city: "Berlin",
    lat: 52.5200,
    lng: 13.4050,
    count: 1,
    deaths: 1,
    region: "Europe",
    status: "confirmed",
    date: "2026-05-02"
  },
  {
    id: 3,
    country: "United Kingdom",
    city: "London",
    lat: 51.5074,
    lng: -0.1278,
    count: 2,
    deaths: 0,
    region: "Europe",
    status: "confirmed",
    date: "2026-05-07"
  },
  {
    id: 4,
    country: "Switzerland",
    city: "Zurich",
    lat: 47.3769,
    lng: 8.5472,
    count: 1,
    deaths: 0,
    region: "Europe",
    status: "confirmed",
    date: "2026-05-05"
  },
  {
    id: 5,
    country: "Spain",
    city: "Madrid",
    lat: 40.4168,
    lng: -3.7038,
    count: 1,
    deaths: 0,
    region: "Europe",
    status: "confirmed",
    date: "2026-05-06"
  },
  {
    id: 6,
    country: "United States",
    city: "Atlanta",
    lat: 33.7490,
    lng: -84.3880,
    count: 7,
    deaths: 0,
    region: "North America",
    status: "monitoring",
    date: "2026-05-08"
  },
  {
    id: 7,
    country: "South Africa",
    city: "Johannesburg",
    lat: -26.2023,
    lng: 28.0436,
    count: 1,
    deaths: 1,
    region: "Africa",
    status: "confirmed",
    date: "2026-05-04"
  }
];

let newsData = [
  {
    id: 1,
    country: "Netherlands",
    date: "2026-05-08",
    title: "Ship doctor in stable condition after testing positive",
    excerpt: "A ship doctor who developed symptoms on April 30 tested positive for Andes hantavirus on May 6 and was evacuated to Amsterdam University Medical Center.",
    source: "Reuters",
    url: "https://reuters.com",
    image: "https://via.placeholder.com/300x200?text=Netherlands"
  },
  {
    id: 2,
    country: "Germany",
    date: "2026-05-02",
    title: "Woman dies aboard cruise ship, hantavirus confirmed",
    excerpt: "A 72-year-old German woman who developed fever and malaise on April 28 died on May 2 aboard the MV Hondius. Molecular testing confirmed Andes hantavirus.",
    source: "DPA",
    url: "https://dpa.com",
    image: "https://via.placeholder.com/300x200?text=Germany"
  },
  {
    id: 3,
    country: "United Kingdom",
    date: "2026-05-07",
    title: "Two UK nationals confirm positive for hantavirus",
    excerpt: "British health authorities confirmed two UK nationals have tested positive for hantavirus. Additional suspected cases are under investigation.",
    source: "BBC",
    url: "https://bbc.co.uk",
    image: "https://via.placeholder.com/300x200?text=UK"
  },
  {
    id: 4,
    country: "Switzerland",
    date: "2026-05-05",
    title: "Swiss patient tests positive after disembarking",
    excerpt: "A man who disembarked in Saint Helena returned to Switzerland and tested positive on May 5, now isolating at a Swiss hospital.",
    source: "SWI",
    url: "https://swissinfo.ch",
    image: "https://via.placeholder.com/300x200?text=Switzerland"
  },
  {
    id: 5,
    country: "United States",
    date: "2026-05-08",
    title: "CDC monitors 7 people across five states",
    excerpt: "US health authorities are monitoring seven people across Arizona, California, Georgia, Texas, and Virginia who disembarked from the ship.",
    source: "CDC",
    url: "https://cdc.gov",
    image: "https://via.placeholder.com/300x200?text=USA"
  },
  {
    id: 6,
    country: "Spain",
    date: "2026-05-06",
    title: "Spain approves ship arrival in Canary Islands",
    excerpt: "Spain approved the plan for the MV Hondius to dock in Tenerife, coordinating with WHO and 22 countries for passenger evacuation.",
    source: "El País",
    url: "https://elpais.es",
    image: "https://via.placeholder.com/300x200?text=Spain"
  }
];

// API Routes - Cases with map data
app.get('/api/cases', (req, res) => {
  res.json(casesData);
});

// API Routes - Map markers
app.get('/api/markers', (req, res) => {
  const markers = casesData.map(c => ({
    id: c.id,
    lat: c.lat,
    lng: c.lng,
    country: c.country,
    city: c.city,
    count: c.count,
    deaths: c.deaths,
    status: c.status
  }));
  res.json(markers);
});

// API Routes - News
app.get('/api/news', (req, res) => {
  const country = req.query.country;
  if (country && country !== 'all') {
    return res.json(newsData.filter(n => n.country === country));
  }
  res.json(newsData);
});

// API Routes - Statistics
app.get('/api/stats', (req, res) => {
  const totalCases = casesData.reduce((sum, c) => sum + c.count, 0);
  const totalDeaths = casesData.reduce((sum, c) => sum + c.deaths, 0);
  const countriesAffected = casesData.length;
  const cfr = ((totalDeaths / totalCases) * 100).toFixed(1);
  
  res.json({
    totalCases,
    totalDeaths,
    countriesAffected,
    casesFatalityRate: cfr,
    lastUpdated: new Date().toISOString(),
    regions: {
      Europe: casesData.filter(c => c.region === 'Europe').length,
      'North America': casesData.filter(c => c.region === 'North America').length,
      Africa: casesData.filter(c => c.region === 'Africa').length
    }
  });
});

// API Routes - Country detail
app.get('/api/country/:name', (req, res) => {
  const country = casesData.find(c => c.country.toLowerCase() === req.params.name.toLowerCase());
  const countryNews = newsData.filter(n => n.country === req.params.name);
  
  if (!country) {
    return res.status(404).json({ error: 'Country not found' });
  }
  
  res.json({
    ...country,
    news: countryNews,
    riskLevel: country.deaths > 0 ? 'High' : 'Medium'
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    casesTracked: casesData.length,
    newsArticles: newsData.length
  });
});

// Update case data (for admin)
app.post('/api/admin/update', (req, res) => {
  const { country, count, deaths } = req.body;
  
  const existing = casesData.find(c => c.country === country);
  if (existing) {
    existing.count = count;
    existing.deaths = deaths;
  }
  
  res.json({ success: true, data: casesData });
});

// Cron job to update data (every 6 hours)
cron.schedule('0 */6 * * *', () => {
  console.log('Running scheduled data sync...');
  // In production: fetch from WHO API
  // For now, data updates when manually posted
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 OUTBREAK WATCH - PRODUCTION SERVER\n`);
  console.log(`Server running on port ${PORT}`);
  console.log(`📊 Live at: http://localhost:${PORT}`);
  console.log(`\n📡 API Endpoints:`);
  console.log(`   GET  /api/cases          - All case data with coordinates`);
  console.log(`   GET  /api/markers        - Map markers for Leaflet`);
  console.log(`   GET  /api/news           - Latest news articles`);
  console.log(`   GET  /api/stats          - Global statistics`);
  console.log(`   GET  /api/country/:name  - Country details`);
  console.log(`   GET  /health             - Health check`);
  console.log(`\n✅ Ready for requests!\n`);
});
