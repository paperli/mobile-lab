#!/bin/bash

# Mobile Lab - HTTPS Certificate Setup Script
# This script automates the generation and distribution of SSL certificates for local development

set -e

echo "🔒 Mobile Lab HTTPS Setup"
echo "=========================="
echo ""

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert is not installed"
    echo ""
    echo "Please install mkcert first:"
    echo ""
    echo "  macOS:   brew install mkcert"
    echo "  Linux:   apt install mkcert"
    echo "  Windows: choco install mkcert"
    echo ""
    exit 1
fi

echo "✓ mkcert found"

# Install mkcert root certificate
echo ""
echo "📜 Installing mkcert root certificate..."
mkcert -install
echo "✓ Root certificate installed"

# Detect local IP address
echo ""
echo "🔍 Detecting local IP address..."

if [[ "$OSTYPE" == "darwin"* ]] || [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # macOS or Linux
    LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows (Git Bash)
    LOCAL_IP=$(ipconfig | grep "IPv4" | awk '{print $NF}' | head -n 1)
else
    LOCAL_IP=""
fi

if [ -z "$LOCAL_IP" ]; then
    echo "⚠️  Could not auto-detect local IP address"
    echo ""
    read -p "Please enter your local IP address (e.g., 192.168.20.40): " LOCAL_IP
fi

echo "✓ Using IP address: $LOCAL_IP"

# Create certs directory if it doesn't exist
echo ""
echo "📁 Creating certificates directory..."
mkdir -p packages/mobile/certs
echo "✓ Directory created"

# Generate certificates
echo ""
echo "🔐 Generating SSL certificates..."
cd packages/mobile/certs

mkcert -cert-file localhost+3.pem -key-file localhost+3-key.pem localhost 127.0.0.1 $LOCAL_IP ::1

if [ $? -eq 0 ]; then
    echo "✓ Certificates generated successfully"
else
    echo "❌ Failed to generate certificates"
    exit 1
fi

# Return to project root
cd ../../..

# Create certs directories for other packages
echo ""
echo "📦 Creating certificate directories for other packages..."
mkdir -p packages/tv/certs
mkdir -p packages/server/certs
echo "✓ Directories created"

# Copy certificates to other packages
echo ""
echo "📋 Copying certificates to all packages..."
cp packages/mobile/certs/*.pem packages/tv/certs/
cp packages/mobile/certs/*.pem packages/server/certs/
echo "✓ Certificates copied to tv and server packages"

# Summary
echo ""
echo "=========================================="
echo "✅ HTTPS Setup Complete!"
echo "=========================================="
echo ""
echo "Generated certificates for:"
echo "  - localhost"
echo "  - 127.0.0.1"
echo "  - $LOCAL_IP"
echo "  - ::1 (IPv6 localhost)"
echo ""
echo "Certificates installed in:"
echo "  - packages/mobile/certs/"
echo "  - packages/tv/certs/"
echo "  - packages/server/certs/"
echo ""
echo "Next steps:"
echo "  1. Start the development servers: npm run dev"
echo "  2. Look for '🔒 Using HTTPS with SSL certificates' in the logs"
echo "  3. Access services via HTTPS:"
echo "     - TV:     https://localhost:5173 or https://$LOCAL_IP:5173"
echo "     - Mobile: https://localhost:5174 or https://$LOCAL_IP:5174"
echo "     - Server: https://localhost:3000 or https://$LOCAL_IP:3000"
echo "  4. Accept certificate warnings in your browser (safe for local dev)"
echo "  5. Grant microphone permission for voice features"
echo ""
echo "Note: If your IP address changes, re-run this script to generate new certificates."
echo ""
