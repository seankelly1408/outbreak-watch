import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import fetch from 'node-fetch';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// In-memory data store (replace with database in production)
let casesData = [
  { country: 'Netherlands', count: 2, deaths: 1, region: 'Europe' },
  { country: 'Germany', count: 1, deaths: 1, region: 'Europe' },
  { country: 'United Kingdom', count: 2, deaths: 0, region: 'Europe' },
  { country: 'Switzerland', count: 1, deaths: 0, region: 'Europe' },
  { country: 'Spain', count: 1, deaths: 0, region: 'Europe' },
  { country: 'United States', count: 7, deaths: 0, region: 'North America' },
  { country: 'South Africa', count: 1, deaths: 1, region: 'Africa' },
];

let newsData = [
  {
    country: 'Netherlands',
    date: 'May 8, 2026',
    title: 'Ship doctor in stable condition after testing positive',
    excerpt: 'A ship doctor who developed symptoms on April 30 tested positive for Andes hantavirus on May 6 and was evacuated to Amsterdam University Medical Center, where he remains in stable condition in isolation.',
    source: 'Reuters',
    url: 'https://reuters.com'
  },
  {
    country: 'Germany',
    date: 'May 2, 2026',
    title: 'Woman dies aboard cruise ship, hantavirus confirmed',
    excerpt: 'A 72-year-old German passenger who developed fever and malaise on April 28 died on May 2 aboard the MV Hondius. Molecular testing confirmed Andes hantavirus infection.',
    source: 'DPA',
    url: 'https://dpa.com'
  },
  {
    country: 'United Kingdom',
    date: 'May 7, 2026',
    title: 'Two UK nationals confirm positive for hantavirus',
    excerpt: 'British health authorities confirmed two UK nationals have tested positive for hantavirus. An additional suspected case of a British national who disembarked at Tristan da Cunha is under investigation.',
    source: 'BBC',
    url: 'https://bbc.co.uk'
  },
  {
    country: 'Switzerland',
    date: 'May 5, 2026',
    title: 'Swiss patient tests positive after disembarking',
    excerpt: 'A man who disembarked in Saint Helena on April 22 returned to Switzerland via South Africa and Qatar. He noticed symptoms on May 1 and tested positive on May 5, now isolating at a Swiss hospital.',
    source: 'SWI',
    url: 'https://swissinfo.ch'
  },
  {
    country: 'United States',
    date: 'May 8, 2026',
    title: 'CDC monitors 7 people across five states',
    excerpt: 'US health authorities are monitoring seven people across Arizona, California, Georgia, Texas, and Virginia who disembarked from the ship. CDC has classified its response as Level 3, the lowest emergency level.',
    source: 'CDC',
    url: 'https://cdc.gov'
  },
  {
    country: 'Spain',
    date: 'May 6, 2026',
    title: 'Spain approves ship arrival in Canary Islands',
    excerpt: 'Despite objections from the Canary Islands president, Spain approved the plan for the MV Hondius to dock in Tenerife, coordinating with the WHO and 22 countries for passenger evacuation.',
    source: 'El País',
    url: 'https://elpais.es'
  },
  {
    country: 'South Africa',
    date: 'May 4, 2026',
    title: 'Woman dies in Johannesburg hospital after ship exposure',
    excerpt: 'A 69-year-old Dutch woman who went ashore at Saint Helena on April 24 with stomach problems died on April 26 at a Johannesburg hospital. Molecular tests confirmed she had hantavirus.',
    source: 'SABC News',
    url: 'https://sabc.co.za'
  },
];

// API Routes
app.get('/api/cases', (req, res) => {
  res.json(casesData);
});

app.get('/api/news', (req, res) => {
  res.json(newsData);
});

app.get('/api/stats', (req, res) => {
  const totalCases = casesData.reduce((sum, c) => sum + c.count, 0);
  const totalDeaths = casesData.reduce((sum, c) => sum + c.deaths, 0);
  const countriesAffected = casesData.length;
  
  res.json({
    totalCases,
    totalDeaths,
    countriesAffected,
    casesFatalityRate: ((totalDeaths / totalCases) * 100).toFixed(1)
  });
});

// Webhook for premium users to get alerts
app.post('/api/alerts/subscribe', (req, res) => {
  const { email, country, frequency } = req.body;
  
  if (!email || !country) {
    return res.status(400).json({ error: 'Email and country required' });
  }
  
  // In production, save to database
  console.log(`New alert subscription: ${email} for ${country}`);
  
  res.json({ 
    success: true, 
    message: 'Subscribed to alerts',
    subscription: { email, country, frequency: frequency || 'daily' }
  });
});

// Admin endpoint to update cases (protected in production)
app.post('/api/admin/cases/update', (req, res) => {
  const { country, count, deaths } = req.body;
  
  const existing = casesData.find(c => c.country === country);
  if (existing) {
    existing.count = count;
    existing.deaths = deaths;
  } else {
    casesData.push({ country, count, deaths, region: 'Unknown' });
  }
  
  res.json({ success: true, data: casesData });
});

// API for premium users - detailed analytics
app.get('/api/premium/analytics', (req, res) => {
  const token = req.headers.authorization;
  
  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // In production, verify token from database
  res.json({
    trends: {
      weeklyGrowth: 2.3,
      caseFatalityTrend: 'stable',
      geographicSpread: 'contained'
    },
    predictions: {
      estimatedNewCases7d: 3,
      confidence: 0.72
    },
    timeline: [
      { date: '2026-04-06', cases: 1, deaths: 0 },
      { date: '2026-04-11', cases: 2, deaths: 1 },
      { date: '2026-04-24', cases: 3, deaths: 2 },
      { date: '2026-05-06', cases: 5, deaths: 2 },
      { date: '2026-05-09', cases: 6, deaths: 3 }
    ]
  });
});

// Cron job to fetch latest data (runs daily at 2 AM)
cron.schedule('0 2 * * *', async () => {
  console.log('Running scheduled data sync...');
  // In production, fetch from WHO API and update database
  // Example: const whoData = await fetch('https://api.who.int/...')
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(process.cwd() + '/dist/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET /api/cases`);
  console.log(`   GET /api/news`);
  console.log(`   GET /api/stats`);
  console.log(`   POST /api/alerts/subscribe`);
  console.log(`   GET /api/premium/analytics (requires auth token)`);
});
