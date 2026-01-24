# Environment Variables Setup Guide

This guide explains the environment variables used in Mobile Lab and how to configure them.

## Quick Start

Environment variables are **automatically configured** by the setup script. For most users:

```bash
./setup-https.sh
```

This will detect your IP address and update all `.env` files automatically.

## When IP Address Changes

If you switch networks, change machines, or your IP address changes for any reason:

```bash
./setup-https.sh
```

The script will regenerate certificates AND update all `.env` files with your new IP.

## Manual Configuration (Usually Not Needed)

Environment variables are pre-configured with sensible defaults. The `.env` files are already created with HTTPS URLs and your local IP address.

## Environment Variables by Package

### Server (`packages/server/.env`)

```env
# Server port (default: 3000)
PORT=3000

# Allowed CORS origins (optional, has defaults)
ALLOWED_ORIGINS=https://localhost:5173,https://localhost:5174,http://localhost:5173,http://localhost:5174,https://192.168.20.40:5173,https://192.168.20.40:5174
```

**When to customize**:
- Change `PORT` if 3000 is already in use
- Add your network IP to `ALLOWED_ORIGINS` if different from 192.168.20.40

### TV Frontend (`packages/tv/.env`)

```env
# Backend server URL (optional, auto-detects if not set)
VITE_SERVER_URL=https://localhost:3000

# Mobile controller URL for QR code
VITE_MOBILE_URL=https://192.168.20.40:5174
```

**When to customize**:
- Update `VITE_MOBILE_URL` with your actual local IP address for network testing
- The QR code on the TV screen uses this URL

### Mobile Frontend (`packages/mobile/.env`)

```env
# Backend server URL (optional, auto-detects if not set)
VITE_SERVER_URL=https://localhost:3000
```

**When to customize**:
- Usually no changes needed
- Server URL is auto-detected in most cases

## Local Development vs Production

### Local Development (Default)

Uses HTTPS with self-signed certificates:
```env
VITE_SERVER_URL=https://localhost:3000
VITE_MOBILE_URL=https://192.168.20.40:5174
```

### Production (Render)

Uses production URLs:
```env
VITE_SERVER_URL=https://mobile-lab-server.onrender.com
VITE_MOBILE_URL=https://mobile-lab-mobile.onrender.com
ALLOWED_ORIGINS=https://mobile-lab-tv.onrender.com,https://mobile-lab-mobile.onrender.com
```

## Finding Your Local IP Address

The `setup-https.sh` script automatically detects your IP. To find it manually:

**macOS/Linux**:
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows**:
```bash
ipconfig
```

**Example output**: `192.168.20.40`

## Updating Environment Variables

1. **Edit the .env files** in each package directory
2. **Restart the development servers** for changes to take effect:
   ```bash
   # Stop current servers (Ctrl+C)
   npm run dev
   ```

## Example Configurations

### Testing on Same Computer

Use localhost URLs:
```env
VITE_SERVER_URL=https://localhost:3000
VITE_MOBILE_URL=https://localhost:5174
```

### Testing on Phone (Same Network)

Use your network IP:
```env
VITE_SERVER_URL=https://localhost:3000
VITE_MOBILE_URL=https://192.168.20.40:5174
```

### Remote Deployment (Render)

Use production URLs:
```env
VITE_SERVER_URL=https://mobile-lab-server.onrender.com
VITE_MOBILE_URL=https://mobile-lab-mobile.onrender.com
ALLOWED_ORIGINS=https://mobile-lab-tv.onrender.com,https://mobile-lab-mobile.onrender.com
```

## Troubleshooting

**Issue**: Changes to `.env` files not taking effect
- **Solution**: Restart development servers with `npm run dev`

**Issue**: CORS errors in browser console
- **Solution**: Add your frontend URL to `ALLOWED_ORIGINS` in `packages/server/.env`

**Issue**: QR code points to wrong URL
- **Solution**: Update `VITE_MOBILE_URL` in `packages/tv/.env`

**Issue**: Can't connect from phone
- **Solution**: Update IP address in `.env` files to match your network

## .env.example Files

Each package has a `.env.example` file showing all available options. These are templates for creating `.env` files with different configurations.

**Location**:
- Root: `.env.example` (all variables documented)
- Server: `packages/server/.env.example`
- TV: `packages/tv/.env.example`
- Mobile: `packages/mobile/.env.example`

## Security Notes

- `.env` files are gitignored and never committed
- `.env.example` files are committed as templates
- SSL certificates are also gitignored (except README.md)
- Use environment-specific configurations for production deployments

## Summary

**For most users**: No configuration needed - just run `npm run dev`

**For network testing**: Update `VITE_MOBILE_URL` in `packages/tv/.env` with your IP

**For production**: See `DEPLOYMENT.md` for Render deployment configuration
