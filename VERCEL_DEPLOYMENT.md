# Vercel Frontend Deployment Guide

## Prerequisites
- GitHub repository for frontend pushed to GitHub
- Vercel account (vercel.com)

## Steps to Deploy Frontend on Vercel

### 1. Import Project to Vercel
- Go to [vercel.com](https://vercel.com)
- Click "Add New..." → "Project"
- Connect your GitHub account
- Import the frontend repository (client folder)

### 2. Configure Project Settings
- **Project Name**: `gold-png-client` (or your preferred name)
- **Framework Preset**: Vite (should auto-detect)
- **Root Directory**: `./` (since you're importing client folder)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### 3. Add Environment Variables
In the "Environment Variables" section, add:
```
VITE_API_BASE_URL=https://gold-png-server.onrender.com
```

Then reference it in your frontend code:
```javascript
// In client/src/api.js or main.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

### 4. Deploy
- Click "Deploy"
- Vercel will automatically build and deploy your frontend
- You'll get a URL like `https://gold-png-client.vercel.app`

### 5. Custom Domain (Optional)
- In Vercel Dashboard → Your Project → Settings → Domains
- Add your custom domain

## Important Notes
- Vercel provides free hosting with unlimited deployments
- Every push to `main` branch triggers automatic deployment
- Check deployment logs in Vercel Dashboard for debugging
- Ensure CORS is properly configured in backend

## Update Backend CORS Settings
In `server/index.js`, make sure CORS allows Vercel domain:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://gold-png-client.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```
