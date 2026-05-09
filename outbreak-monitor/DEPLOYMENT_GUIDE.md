# Hantavirus Tracker - Complete Deployment Guide

## 🚀 Quick Start (5 minutes)

### Option 1: Deploy on Railway (EASIEST - Recommended)

1. **Create Railway account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Create new project

2. **Deploy from GitHub**
   - Fork this repository
   - On Railway: "New Project" → "Deploy from GitHub repo"
   - Select your fork
   - Click Deploy

3. **Done!** 🎉
   - Railway gives you free $5 credit (enough for ~3 months)
   - Your site is live at: `projectname.up.railway.app`
   - Auto-deploys on every git push

---

## Option 2: Deploy on Vercel (Frontend) + Railway (Backend)

### Frontend on Vercel

1. Fork repository
2. Go to vercel.com → Import Project
3. Select your GitHub repo
4. Deploy

### Backend on Railway (above)

---

## Option 3: Self-hosted (AWS, DigitalOcean, etc.)

### Using DigitalOcean App Platform (Easy)

1. Create DigitalOcean account ($5-6/month)
2. Push code to GitHub
3. Create → App Platform → GitHub repo
4. Build command: `npm run build`
5. Run command: `node server.js`
6. Deploy

### Using Docker (Advanced)

```bash
# Build image
docker build -t hantavirus-tracker .

# Run locally
docker run -p 3000:3000 hantavirus-tracker

# Push to Docker Hub
docker push yourusername/hantavirus-tracker

# Deploy to AWS ECS, Google Cloud Run, etc.
```

---

## 💾 Setup Local Development

```bash
# 1. Clone repository
git clone https://github.com/yourusername/hantavirus-tracker.git
cd hantavirus-tracker

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. In another terminal, start backend
npm run server

# Visit http://localhost:5173
```

---

## 🗄️ Database Setup (Production)

Replace in-memory data store with real database:

### Option A: MongoDB (Free tier)

```bash
# Install MongoDB Atlas
# Create free cluster at mongodb.com/cloud/atlas

# Install driver
npm install mongodb

# Update server.js to use MongoDB instead of memory
```

### Option B: PostgreSQL (Free tier on Railway)

```bash
# On Railway, add PostgreSQL service
# Railway automatically adds DATABASE_URL env variable

npm install pg
```

### Option C: Firebase (Free tier)

```bash
npm install firebase-admin
# Create Firebase project at console.firebase.google.com
```

---

## 📰 Data Scraper Setup

### Run locally

```bash
# Install Python dependencies
pip install requests beautifulsoup4 feedparser

# Run scraper
python scraper.py

# Schedule with cron (Linux/Mac)
crontab -e
# Add: 0 2 * * * /usr/bin/python3 /path/to/scraper.py

# Schedule with Task Scheduler (Windows)
# Create task to run: python scraper.py
```

### Run on server

```bash
# Add to crontab on server
0 */6 * * * curl http://localhost:3000/api/scrape

# Or use APScheduler in Python
```

---

## 📊 Google AdSense Setup (Monetization)

1. Go to google.com/adsense
2. Sign up with your site URL
3. Wait for approval (1-3 days)
4. Get your Publisher ID: `ca-pub-xxxxxxxxxx`
5. Replace in App.jsx:

```jsx
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"></script>
```

6. Add ad units:
   - Top banner (728x90)
   - Sidebar (300x250)
   - Bottom banner (970x250)

**Expected revenue**: $50-200/month (depends on traffic)

---

## 🔑 Environment Variables

Create `.env` file:

```
VITE_API_URL=http://localhost:3000
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb://...
WHO_API_KEY=your_api_key
ADSENSE_ID=ca-pub-xxxxxxxx
```

---

## 📈 Premium Features Implementation

### Add Stripe for payments

```bash
npm install stripe @stripe/react-stripe-js
```

```jsx
import { loadStripe } from '@stripe/stripe-js';

const handleUpgrade = async () => {
  const stripe = await loadStripe('pk_live_YOUR_KEY');
  const response = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId: 'price_1234' })
  });
  const { sessionId } = await response.json();
  stripe.redirectToCheckout({ sessionId });
};
```

---

## 🔒 Security Checklist

- [ ] Add HTTPS (automatic on Vercel/Railway)
- [ ] Enable CORS properly (whitelist domains)
- [ ] Validate all user input
- [ ] Use environment variables for secrets
- [ ] Rate limit API endpoints
- [ ] Add authentication for admin endpoints
- [ ] Implement GDPR compliance for email alerts
- [ ] Add privacy policy
- [ ] Add terms of service

---

## 📧 Email Alerts Setup

### Using SendGrid (Free: 100 emails/day)

```bash
npm install @sendgrid/mail
```

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'user@example.com',
  from: 'alerts@hantavirustracker.com',
  subject: 'New hantavirus case in your region',
  html: '<strong>A new case has been confirmed...</strong>',
};

sgMail.send(msg);
```

### Using Mailgun (Free: 5,000 emails/month)

```bash
npm install mailgun.js
```

---

## 📊 Analytics Setup

### Google Analytics

```jsx
// Add to index.html head
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Hotjar (User behavior tracking)

```html
<script>
  (function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_ID,hjsv:6};
    // ... rest of Hotjar code
  })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

---

## 💰 Monetization Strategy Summary

| Channel | Setup Time | Monthly Revenue (Estimate) |
|---------|-----------|---------------------------|
| Google AdSense | 30 min | $50-200 |
| Premium Subscriptions | 2 hours | $200-1,000 |
| API Access (B2B) | 4 hours | $500-5,000 |
| Sponsorships | 1 hour | $1,000-10,000 |
| **Total** | | **$1,750-16,200** |

---

## 🚨 Common Issues

### Issue: Ads not showing
- Wait 24 hours after AdSense approval
- Check ad placement is visible
- Verify Publisher ID is correct
- Check browser console for errors

### Issue: Data not updating
- Check scraper is running
- Verify API endpoints work: `curl http://localhost:3000/api/cases`
- Check database connection

### Issue: Slow performance
- Enable caching on Railway/Vercel
- Optimize images
- Use CDN for static assets
- Add database indexing

---

## 📞 Support & Resources

- Railway docs: https://docs.railway.app
- Vercel docs: https://vercel.com/docs
- Node.js docs: https://nodejs.org/docs
- WHO API: https://github.com/who-data-sharing
- CDC API: https://www.cdc.gov/

---

## 🎯 Next Steps

1. Deploy on Railway (5 min)
2. Set up Google AdSense (24 hour wait)
3. Add email alerts with SendGrid
4. Set up Stripe for premium features
5. Add database (PostgreSQL or MongoDB)
6. Automate data scraper
7. Market to universities and health organizations
8. Launch B2B API sales

---

## License

MIT - Free to use and modify for any purpose.

Happy tracking! 🚀
