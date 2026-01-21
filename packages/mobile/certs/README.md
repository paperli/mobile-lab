# SSL Certificates for Local Development

This directory contains SSL certificates for running the mobile app over HTTPS, which is required for accessing device features like the microphone.

## Quick Setup (Recommended)

From the project root, run the automated setup script:

```bash
./setup-https.sh
```

This will handle all the steps below automatically, including IP detection and certificate distribution.

## Manual Setup Instructions

1. **Install mkcert** (if not already installed):
   ```bash
   # macOS
   brew install mkcert

   # Linux
   apt install mkcert  # or use your package manager

   # Windows
   choco install mkcert
   ```

2. **Install the root certificate** (trust local certificates):
   ```bash
   mkcert -install
   ```

3. **Generate certificates**:
   ```bash
   # From project root
   cd packages/mobile/certs

   # Replace 192.168.20.40 with your actual local IP address
   # Find your IP: ifconfig (macOS/Linux) or ipconfig (Windows)
   mkcert -cert-file localhost+3.pem -key-file localhost+3-key.pem localhost 127.0.0.1 192.168.20.40 ::1
   ```

4. **Copy certificates to other packages**:
   ```bash
   # From project root
   mkdir -p packages/tv/certs packages/server/certs
   cp packages/mobile/certs/*.pem packages/tv/certs/
   cp packages/mobile/certs/*.pem packages/server/certs/
   ```

5. **Restart development servers** to use HTTPS:
   ```bash
   # From project root
   npm run dev
   ```
   You should see "🔒 Using HTTPS with SSL certificates" in the server logs.

## Why HTTPS?

Modern browsers require HTTPS for accessing sensitive device features like:
- Microphone
- Camera
- Geolocation
- Clipboard

The voice command feature requires microphone access, which is why we need HTTPS for local development.

## Note

These certificates are self-signed and only valid for local development. You'll see certificate warnings in your browser - this is normal and safe to bypass for local testing.
