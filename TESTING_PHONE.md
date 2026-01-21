# Testing on Android Phone - Quick Guide

## The Problem We Fixed

When accessing the mobile controller from your phone, it was trying to connect to `wss://localhost:3000`, but "localhost" on your phone refers to the phone itself, not your computer.

## The Solution

All services now use your network IP address (`192.168.20.40`) instead of localhost when accessed from the network.

## Testing Steps

### 1. On Your Computer

Open the TV interface:
```
https://localhost:5173
```

You'll see:
- A 6-digit room code (e.g., `434838`)
- Certificate warning (click "Advanced" → "Proceed" - safe for local dev)

### 2. On Your Android Phone

**Option A: Type URL directly**
```
https://192.168.20.40:5174
```

**Option B: Scan QR code** (if TV is on network URL)
- QR code will point to `https://192.168.20.40:5174`

### 3. Accept Certificate Warning on Phone

You'll see "Your connection is not private":
1. Tap "Advanced"
2. Tap "Proceed to 192.168.20.40 (unsafe)"
3. This is normal for self-signed certificates in local development

### 4. Grant Microphone Permission

When prompted, allow microphone access for voice features.

### 5. Enter Room Code

Enter the 6-digit code shown on the TV screen.

### 6. Test the Circular Back Button

You should see the circular back button on the Square controller layout!

## Troubleshooting

### Issue: Still seeing "ERR_CONNECTION_REFUSED"

**Solution**: Make sure you're using the network IP, not localhost:
- ❌ Wrong: `https://localhost:5174`
- ✅ Right: `https://192.168.20.40:5174`

### Issue: "Room not found" error

**Solution**: The TV restarted and created a new room. Refresh the TV to get the new room code.

### Issue: Can't load the page at all

**Solution**: Check these:
1. Phone and computer on same WiFi network
2. No VPN active on either device
3. Firewall not blocking port 5174
4. Try pinging the IP: On phone, open browser and visit `https://192.168.20.40:5174`

### Issue: Certificate warning won't go away

**Solution**: This is normal. You must click "Advanced" → "Proceed" on each device that connects.

## What Changed

### Environment Variables

**packages/mobile/.env**:
```env
# OLD (doesn't work from phone)
VITE_SERVER_URL=https://localhost:3000

# NEW (works from phone)
VITE_SERVER_URL=https://192.168.20.40:3000
```

### Socket Connection Logic

Both mobile and TV now auto-detect the protocol (HTTPS vs HTTP) based on how the page was loaded.

### Server Configuration

Server now allows connections from network IP in ALLOWED_ORIGINS:
```env
ALLOWED_ORIGINS=https://localhost:5173,https://localhost:5174,https://192.168.20.40:5173,https://192.168.20.40:5174
```

## Quick Reference

### Your Network Setup
- **Computer IP**: 192.168.20.40
- **Server** (Backend): Port 3000 (HTTPS)
- **TV** (Frontend): Port 5173 (HTTPS)
- **Mobile** (Frontend): Port 5174 (HTTPS)

### URLs to Use

**From your computer**:
- TV: https://localhost:5173
- Mobile: https://localhost:5174

**From your phone**:
- TV: https://192.168.20.40:5173 (if showing TV on tablet)
- Mobile: https://192.168.20.40:5174 ← **Use this!**

## Success Indicators

✅ Server logs show: `🔒 Using HTTPS with SSL certificates`
✅ Mobile connects without "ERR_CONNECTION_REFUSED"
✅ Green connection dot appears on mobile
✅ Room code is accepted
✅ Navigation inputs from phone work on TV
✅ Circular back button appears on Square controller

## Next Steps After Successful Connection

1. Test all controller modes (D-Pad, Trackpad, Gamepad, Hybrid, Square)
2. Test the circular back button functionality
3. Test voice features with microphone
4. Test with multiple phones (up to 4 simultaneous connections)
