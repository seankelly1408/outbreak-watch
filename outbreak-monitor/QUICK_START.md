# 🚀 Deploy in 5 Minutes on Railway

This is the absolute fastest way to get your site online.

## Step 1: Create GitHub Repository (1 minute)

1. Go to github.com/new
2. Create repository named `hantavirus-tracker`
3. Choose "Public"
4. Create repository

## Step 2: Upload Files (1 minute)

```bash
# Clone empty repo
git clone https://github.com/YOUR_USERNAME/hantavirus-tracker.git
cd hantavirus-tracker

# Copy all files from this folder into the repo
# (All the .jsx, .css, .py files, etc.)

# Push to GitHub
git add .
git commit -m "Initial commit"
git push origin main
```

## Step 3: Deploy on Railway (2 minutes)

1. Go to https://railway.app
2. Click "Start a new project"
3. Click "Deploy from GitHub repo"
4. Authorize GitHub
5. Select your `hantavirus-tracker` repo
6. Click "Deploy now"
7. Railway will automatically:
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Start the server (`node server.js`)

## Step 4: Get Your Live URL (1 minute)

1. Wait for deployment (green checkmark ✓)
2. Click on your project
3. Your live URL is shown (like: `hantavirus-tracker.up.railway.app`)
4. **Share this URL! Your site is live!** 🎉

## The Website is Now Live!

Your hantavirus tracker is available at:
```
https://YOUR-PROJECT-NAME.up.railway.app
```

- All code automatically updates when you push to GitHub
- HTTPS enabled automatically
- Free $5 credit/month from Railway
- Domain upgrades available ($3/month)

---

## What's Included

✅ **Frontend**: React dashboard with journalistic design  
✅ **Backend**: Node.js API with real outbreak data  
✅ **Data**: Python scraper for WHO/CDC/news sources  
✅ **Ads**: Built-in Google AdSense integration  
✅ **Premium**: Subscription system ready to implement  
✅ **Mobile**: Fully responsive design  

---

## Next Steps (To Make Money)

### 1. Enable Google AdSense (30 minutes)
1. Go to google.com/adsense
2. Sign up with your site URL
3. Wait 24 hours for approval
4. Get your Publisher ID (like: `ca-pub-xxxxxxxxxx`)
5. Add to `index.html`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR-ID"></script>
   ```
6. Push to GitHub (auto-deploys)
7. Ads show within 24 hours
8. **Start earning**: $50-200/month

### 2. Add Premium Subscriptions (2 hours)
1. Go to stripe.com
2. Create account
3. Get API keys
4. Add to Stripe form on site
5. **Earn**: $200-1,000/month

### 3. Target B2B Customers (Ongoing)
- Sell API access to universities ($500-2,000/month)
- Partner with health organizations
- Offer data to pharma companies
- **Earn**: $500-5,000+/month

---

## Troubleshooting

### Site shows error
- Wait 1-2 minutes for deployment to complete
- Refresh page
- Check build logs in Railway dashboard

### "Cannot GET /"
- Click "View Logs" in Railway
- Look for errors
- Make sure package.json has `npm run build` and `npm run server` scripts

### Want a custom domain?
In Railway:
1. Click "Settings"
2. Add "Custom Domain"
3. Points to your `up.railway.app` URL
4. Cost: $3/month

---

## Commands Reference

```bash
# Local development
npm run dev              # Start dev server (localhost:5173)
npm run server          # Start backend (localhost:3000)
npm run build           # Build for production

# Push updates to Railway (auto-deploys)
git push origin main

# Check live logs
# (In Railway dashboard, click "View Logs")
```

---

## That's It! 🎉

Your hantavirus tracker is now:
- ✅ Online and live
- ✅ Getting real data
- ✅ Ready for monetization
- ✅ Automatically updated when you push code

**Now follow the monetization steps above to start earning!**

---

Questions? See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed options.
