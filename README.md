# UK Dairy Environmental Dashboard

A React-based dashboard for monitoring environmental metrics and TNFD compliance across dairy farm suppliers.

## Features

- Portfolio view of multiple farms with key environmental metrics
- Individual farm detailed analysis
- TNFD-aligned reporting
- Environmental scheme compliance tracking (SFI, CS, NVZ)
- Water management assessments
- Biodiversity monitoring
- Risk assessment and alerts
- AI-powered compliance assistant (demo mode)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Deployment

### Deploy to Vercel

1. Fork or clone this repository
2. Connect your GitHub account to Vercel
3. Import the repository
4. Vercel will auto-detect the Vite configuration
5. Click "Deploy"

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify

1. Fork or clone this repository
2. Connect your GitHub account to Netlify
3. Choose the repository
4. Build settings are pre-configured in `netlify.toml`
5. Click "Deploy site"

Or drag and drop the `dist` folder after building:
```bash
npm run build
# Then drag the dist folder to Netlify
```

### Deploy to Render

1. Fork or clone this repository
2. Connect your GitHub account to Render
3. Create a new Static Site
4. Select the repository
5. Use these settings:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
6. Click "Create Static Site"

## Environment Variables

The app uses demo data by default. To enable the AI assistant with real API calls:

1. Copy `.env.example` to `.env`
2. Add your API key
3. Rebuild and redeploy

## Quick Deploy Links

- **Deploy to Vercel**: [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git)
- **Deploy to Netlify**: [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## Notes

- The dashboard uses randomly generated demo data
- The AI assistant runs in demo mode without API configuration
- All environmental metrics are simulated for demonstration purposes
- Mobile responsive design included

## License

MIT