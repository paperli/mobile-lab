# Mobile Lab - Mobile-to-TV Game Connection Testbed

A real-time WebSocket-based system for connecting mobile controllers to TV screens, supporting up to 4 simultaneous players with multiple controller layouts.

## Features

- 🎮 **4 Controller Modes**: D-Pad, Trackpad, Gamepad, and Hybrid
- 📱 **Up to 4 Players**: Multiple mobile devices can control the same TV
- 🔐 **Room-based Pairing**: Secure 6-digit code system
- 🌐 **Network Support**: Works on local network and remote deployment
- ⚡ **Real-time**: WebSocket communication via Socket.io
- 📳 **Haptic Feedback**: Context-aware vibration on mobile

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   TV Screen │◄─────┤   Server    ├─────►│  Mobile 1-4 │
│  (React)    │      │ (Socket.io) │      │   (React)   │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Testing Locally

### Prerequisites

- Node.js 18+ installed
- All dependencies installed (`npm install`)

### Step 1: Start Development Servers

From the project root:

```bash
npm run dev
```

This starts 3 services concurrently:
- **Server**: http://localhost:3000 (WebSocket server)
- **TV**: http://localhost:5176 (may vary if port is taken)
- **Mobile**: http://localhost:5175 (may vary if port is taken)

### Step 2: Connect TV Screen

1. Open **TV URL** in a browser (desktop/laptop)
   - Example: http://localhost:5176
2. A **6-digit room code** will appear on screen
   - Example: `842783`
3. Leave this window open

### Step 3: Connect Mobile Controller(s)

#### Testing on Same Computer:

1. Open **Mobile URL** in another browser window/tab
   - Example: http://localhost:5175
2. Enter the 6-digit code from TV screen
3. Select a controller mode and test navigation

#### Testing on Your Phone (Local Network):

1. Find your computer's local IP address:
   ```bash
   # macOS/Linux
   ifconfig | grep "inet " | grep -v 127.0.0.1

   # Windows
   ipconfig
   ```
   - Example IP: `192.168.20.40`

2. Open on your phone:
   - Mobile: `http://192.168.20.40:5175`
   - (Optional) TV on tablet: `http://192.168.20.40:5176`

3. Enter the 6-digit code displayed on TV
4. Test all 4 controller modes

### Step 4: Test Multiple Controllers

1. Connect up to 4 mobile devices using the **same room code**
2. All controllers can navigate simultaneously
3. Each controller operates independently

### Step 5: Test Controller Modes

Switch between modes using the top navigation:

#### 1. D-Pad Mode
- **Up/Down/Left/Right**: Directional buttons
- **OK**: Center blue button
- **BACK**: Red button at bottom
- Test: Navigate through game tiles

#### 2. Trackpad Mode
- **Swipe**: Swipe in any direction to navigate
- **Tap center**: OK action
- **BACK**: Red button at bottom
- Test: Swipe gestures and tap responsiveness

#### 3. Gamepad Mode
- **D-Pad**: Cross-shaped directional buttons (slate gray)
- **A Button**: Large green button (OK action)
- **B Button**: Smaller red button (BACK action)
- Test: Button press feedback

#### 4. Hybrid Mode
- **Invisible edges**: Tap edges for directional navigation
- **Center swipe**: Swipe gestures still work
- **Center tap**: OK action
- **BACK**: Red button at bottom
- Test: Edge taps + swipe combination

### Expected Behavior

- ✅ TV highlights focused game tile
- ✅ Mobile shows haptic feedback on input
- ✅ Navigation responds immediately (< 100ms)
- ✅ Multiple controllers work without interference
- ✅ Reconnection works after disconnection

### Troubleshooting Local Testing

**Connection Issues:**
- Check that all 3 servers are running
- Verify firewall isn't blocking connections
- Ensure mobile and computer are on same WiFi network

**Phone Can't Connect:**
- Disable VPN on phone or computer
- Check router's AP Isolation setting (should be off)
- Try using computer's hostname: `http://[computer-name].local:5175`

**Controllers Not Responding:**
- Check browser console for errors (F12)
- Verify WebSocket connection in Network tab
- Refresh both TV and Mobile windows

---

## Testing Remotely (Render Deployment)

### Prerequisites

- Application deployed to Render.com
- You have the deployed URLs

### Step 1: Get Your Deployment URLs

After successful Render deployment, you'll have 3 URLs:

```
Server:  https://mobile-lab-server.onrender.com
TV:      https://mobile-lab-tv.onrender.com
Mobile:  https://mobile-lab-mobile.onrender.com
```

### Step 2: Connect TV Screen

1. Open **TV URL** on any device with a large screen
   - Desktop browser
   - TV browser (if available)
   - Tablet in landscape mode

2. A **6-digit room code** will appear
   - Note: First load may take 30-60 seconds (cold start)

3. Keep this window open

### Step 3: Connect Mobile Controller(s)

1. Open **Mobile URL** on your phone(s)
   - Works on iPhone, Android, any mobile browser
   - Can test with up to 4 devices

2. Enter the 6-digit code from TV

3. Wait for "Connected" indicator (green dot)

### Step 4: Test from Different Locations

**Scenario 1: Same Room**
- TV on computer/TV screen
- Phone controllers for 1-4 people
- Test all controller modes

**Scenario 2: Different Rooms**
- TV in living room
- Phones from bedroom/kitchen
- Tests WiFi range and latency

**Scenario 3: Different Networks**
- TV on office WiFi
- Phone on home WiFi (or cellular data)
- Tests true remote functionality

### Step 5: Test Features

Same as local testing (see Step 4 & 5 above):
- ✅ All 4 controller modes
- ✅ Up to 4 simultaneous players
- ✅ Haptic feedback
- ✅ Real-time navigation

### Remote Testing Notes

**Cold Start Delay:**
- Free tier services "sleep" after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Subsequent requests are fast

**Connection Quality:**
- Depends on internet speed
- Typical latency: 50-200ms
- Acceptable for navigation UI (not fast-paced games)

**Session Persistence:**
- Rooms expire after 1 hour of inactivity
- Disconnected controllers can rejoin with same code
- If TV disconnects, room is destroyed

### Troubleshooting Remote Testing

**TV Shows "Connecting to Server":**
- Service is waking up from sleep (wait 60 seconds)
- Check if server is running in Render dashboard
- Clear browser cache and reload

**Mobile Can't Connect:**
- Verify room code is correct
- Check that TV is still connected (refresh if needed)
- Ensure server environment variables are set correctly

**High Latency:**
- Check internet connection on both devices
- Remote testing will always have some latency
- Expected: 50-200ms delay

**Room Full Error:**
- Maximum 4 mobile controllers per room
- Someone else needs to disconnect first
- Or create a new room (refresh TV)

---

## Quick Reference

### Start Local Development

```bash
npm run dev
```

### Test with 2 Devices (Computer + Phone)

1. Start dev servers
2. Computer: Open http://localhost:5176 (TV)
3. Phone: Open http://192.168.20.40:5175 (use your IP)
4. Enter room code on phone
5. Test navigation

### Test with 4 Players Remotely

1. Open TV URL on big screen
2. Share mobile URL + room code with 3 friends
3. All 4 connect using same code
4. Everyone can navigate independently

### Controller Mode Shortcuts

- **D-Pad**: Traditional button layout with OK/BACK
- **Trackpad**: Swipe and tap gestures
- **Gamepad**: Console-style with A/B buttons
- **Hybrid**: Invisible edges + swipe (power user mode)

---

## Development

### Project Structure

```
mobile-lab/
├── packages/
│   ├── server/          # WebSocket server (Node.js + Socket.io)
│   ├── tv/              # TV interface (React + Vite)
│   ├── mobile/          # Mobile controller (React + Vite)
│   └── shared/          # Shared types and constants
├── render.yaml          # Render deployment config
├── DEPLOYMENT.md        # Deployment guide
└── README.md            # This file
```

### Available Scripts

```bash
# Development (all services)
npm run dev

# Development (individual)
npm run dev:server
npm run dev:tv
npm run dev:mobile

# Build (all)
npm run build

# Build (individual)
npm run build:server
npm run build:tv
npm run build:mobile
```

### Environment Variables

**Local Development:**
- No environment variables needed
- Uses localhost and auto-detection

**Remote Deployment:**
- `VITE_SERVER_URL`: Backend URL for frontends
- `ALLOWED_ORIGINS`: CORS origins for backend
- See `DEPLOYMENT.md` for details

---

## Common Issues

### "This site can't be reached" on Phone

**Solution:**
1. Ensure phone and computer on same WiFi
2. Check computer's firewall settings
3. Disable VPN if active
4. Try using hostname: `http://[computer-name].local:5175`

### TV Shows "LOADING" Instead of Code

**Solution:**
1. Check server is running (port 3000)
2. Refresh TV browser window
3. Check browser console for errors
4. Verify WebSocket connection

### Navigation Not Working

**Solution:**
1. Check green dot indicator (shows connection)
2. Verify haptic feedback on button press
3. Try switching controller modes
4. Refresh both TV and Mobile

### Multiple Controllers Interfering

**Solution:**
This is normal behavior - all controllers share focus control. This is intended for testing multiplayer navigation patterns.

---

## Testing Checklist

### Basic Functionality
- [ ] TV displays room code
- [ ] Mobile connects with code
- [ ] Green connection indicator shows
- [ ] Navigation updates TV in real-time
- [ ] Haptic feedback works on mobile

### All Controller Modes
- [ ] D-Pad mode buttons work
- [ ] Trackpad swipes work
- [ ] Gamepad A/B buttons work
- [ ] Hybrid edge taps work

### Multi-Player (2-4 devices)
- [ ] All devices can connect with same code
- [ ] All controllers navigate independently
- [ ] No lag or interference
- [ ] Disconnection doesn't affect others

### Network Scenarios
- [ ] Same computer (localhost)
- [ ] Local network (different devices)
- [ ] Remote deployment (internet)

---

## Support

For issues or questions:
- Check `DEPLOYMENT.md` for deployment issues
- Review error logs in browser console (F12)
- Check Render logs for server issues

## License

This is a development testbed project.
