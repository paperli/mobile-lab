# SSL Certificates for Local Development

This directory contains SSL certificates for running the mobile app over HTTPS, which is required for accessing device features like the microphone.

## Setup Instructions

1. **Install mkcert** (if not already installed):
   ```bash
   # macOS
   brew install mkcert

   # Linux
   apt install mkcert  # or use your package manager

   # Windows
   choco install mkcert
   ```

2. **Generate certificates**:
   ```bash
   cd packages/mobile/certs
   mkcert localhost 127.0.0.1 192.168.50.72 ::1
   ```
   Replace `192.168.50.72` with your local IP address.

3. **Copy certificates to other packages**:
   ```bash
   # From project root
   cp packages/mobile/certs/*.pem packages/tv/certs/
   cp packages/mobile/certs/*.pem packages/server/certs/
   ```

4. **Trust the certificates** (optional, but recommended):
   ```bash
   mkcert -install
   ```

## Why HTTPS?

Modern browsers require HTTPS for accessing sensitive device features like:
- Microphone
- Camera
- Geolocation
- Clipboard

The voice command feature requires microphone access, which is why we need HTTPS for local development.

## Note

These certificates are self-signed and only valid for local development. You'll see certificate warnings in your browser - this is normal and safe to bypass for local testing.
