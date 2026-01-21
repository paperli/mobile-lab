# Deployment Guide for Mobile Lab

This guide explains how to deploy the Mobile Lab application to Render.com for free remote testing.

## Local Development vs Production

**Local Development (HTTPS Setup Required)**:
- Requires self-signed SSL certificates for accessing device features (microphone, etc.)
- See `packages/mobile/certs/README.md` for certificate setup instructions
- Server will fall back to HTTP if certificates are not found

**Production Deployment (Render)**:
- HTTPS is provided automatically by Render at no cost
- No certificate setup needed
- All services get `.onrender.com` domains with valid SSL certificates

## Prerequisites

1. A GitHub account
2. A Render.com account (free tier)
3. Push your code to a GitHub repository

## Architecture

The application consists of 3 services:
- **Backend Server** (Node.js + Socket.io) - Handles WebSocket connections and room management
- **TV Frontend** (React + Vite) - Static site for the TV interface
- **Mobile Frontend** (React + Vite) - Static site for the mobile controller

## Deployment Steps

### 1. Push Code to GitHub

```bash
# Push your deployment-setup branch to GitHub
git push origin deployment-setup
```

### 2. Connect GitHub to Render

1. Go to https://render.com and sign up/login
2. Click "New +" and select "Blueprint"
3. Connect your GitHub repository
4. Select the repository containing mobile-lab
5. Select the `deployment-setup` branch

### 3. Configure Environment Variables

Render will read the `render.yaml` file and create 3 services automatically. You'll need to configure environment variables for each:

#### Backend Server (`mobile-lab-server`)
- `ALLOWED_ORIGINS`: Set to your deployed frontend URLs (comma-separated)
  ```
  https://mobile-lab-tv.onrender.com,https://mobile-lab-mobile.onrender.com
  ```

#### TV Frontend (`mobile-lab-tv`)
- `VITE_SERVER_URL`: Set to your deployed backend URL
  ```
  https://mobile-lab-server.onrender.com
  ```

#### Mobile Frontend (`mobile-lab-mobile`)
- `VITE_SERVER_URL`: Set to your deployed backend URL
  ```
  https://mobile-lab-server.onrender.com
  ```

### 4. Deploy

1. Once environment variables are set, click "Apply" to deploy
2. Wait for all 3 services to build and deploy (5-10 minutes)
3. Render will provide URLs for each service:
   - Backend: `https://mobile-lab-server.onrender.com`
   - TV: `https://mobile-lab-tv.onrender.com`
   - Mobile: `https://mobile-lab-mobile.onrender.com`

### 5. Update Environment Variables (Second Pass)

After initial deployment, you'll have the actual URLs. Update the environment variables:

1. Go to each service settings
2. Update `ALLOWED_ORIGINS` for backend with the actual frontend URLs
3. Update `VITE_SERVER_URL` for both frontends with the actual backend URL
4. Save and trigger a manual deploy for each service

## Testing the Deployment

1. Open TV URL on your computer: `https://mobile-lab-tv.onrender.com`
2. Note the 6-digit room code displayed
3. Open Mobile URL on your phone: `https://mobile-lab-mobile.onrender.com`
4. Enter the room code
5. Test all 4 controller layouts!

## Important Notes

### Free Tier Limitations
- Services may spin down after 15 minutes of inactivity
- First request after spin-down will take 30-60 seconds to wake up
- 750 hours/month of free runtime (enough for testing)

### WebSocket Connection
- Render's free tier supports WebSockets
- Connection will be via WSS (secure WebSocket) automatically

### HTTPS
- All Render services get free HTTPS automatically with valid SSL certificates
- No certificate setup or configuration needed (unlike local development)
- Socket connections will automatically use WSS (secure WebSocket over HTTPS)
- Required for accessing device features like microphone in production

### Cold Start
- First connection may be slow due to service spin-up
- Subsequent connections will be fast

## Troubleshooting

### Services Not Connecting
1. Check environment variables are set correctly
2. Check backend logs for CORS errors
3. Verify all services are "Live" (green status)

### WebSocket Connection Failed
1. Verify `VITE_SERVER_URL` uses `https://` not `http://`
2. Check backend logs for connection attempts
3. Ensure `ALLOWED_ORIGINS` includes both frontend URLs

### Build Failed
1. Check build logs for errors
2. Verify `package.json` scripts are correct
3. Ensure all dependencies are listed

## Manual Deployment (Alternative)

If you prefer to deploy services individually:

### Backend
```bash
cd packages/server
npm install
npm run build
npm start
```

### TV Frontend
```bash
cd packages/tv
npm install
VITE_SERVER_URL=https://your-backend-url npm run build
# Upload dist/ folder to Render static site
```

### Mobile Frontend
```bash
cd packages/mobile
npm install
VITE_SERVER_URL=https://your-backend-url npm run build
# Upload dist/ folder to Render static site
```

## Cost Estimate

- **Free Tier**: $0/month for testing
- All 3 services fit within Render's free tier
- Suitable for demos and testing
- For production, consider upgrading to paid tier

## Next Steps

After successful deployment:
1. Test all controller modes (D-Pad, Trackpad, Gamepad, Hybrid)
2. Test with multiple mobile devices (up to 4)
3. Share the URLs with your team for remote testing
4. Monitor usage in Render dashboard

## Support

For issues with:
- Render deployment: https://render.com/docs
- Application bugs: Check application logs
- WebSocket issues: Verify CORS and origins configuration
