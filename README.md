# Mobile Lab - TV & Mobile Game Connection Testbed

A real-time testbed for experimenting with mobile-to-TV game connection patterns using WebSocket communication. Control your TV screen from your mobile device with responsive haptic feedback and real-time synchronization.

## 🎮 Features

- **TV Screen (1920x1080)**: Game hub interface with keyboard navigation
  - Fixed viewport with no scrolling
  - Dynamic background previews that change with selection
  - 4 selectable game tiles with visual focus indicators
  - Real-time updates from mobile controller

- **Mobile Controllers**:
  - **Traditional D-Pad**: Button-based crucifix layout with center OK button
  - **Swipeable Joystick**: Gesture-based navigation with visual feedback
  - **Haptic Feedback**: Context-aware vibration patterns (optimized for Android Chrome)
  - **Mode Switching**: Toggle between D-Pad and Joystick on the fly

- **Real-time Communication**: WebSocket-based connection via Socket.io
  - Stable connections that don't reset on navigation
  - Automatic hostname detection for local network access
  - Room-based pairing with 6-digit codes

- **Network Access**: Exposed to local network for testing on real devices
- **Responsive Design**: Optimized for mobile browsers (iOS Chrome, Android Chrome)

## 📁 Project Structure

```
mobile-lab/
├── packages/
│   ├── shared/         # Shared TypeScript types and constants
│   ├── server/         # WebSocket signaling server (Express + Socket.io)
│   ├── tv/            # TV screen app (React + Vite)
│   └── mobile/        # Mobile controller app (React + Vite)
├── package.json       # Root workspace configuration
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome recommended)
- Mobile device for testing controllers (optional, can test in browser)

### Installation

```bash
# Install all dependencies
npm install
```

### Running the Application

#### Start all services at once:

```bash
npm run dev
```

This will start:
- **Server** at `http://localhost:3000`
- **TV Screen** at `http://localhost:5173` (also exposed on your network IP)
- **Mobile Controller** at `http://localhost:5174` (also exposed on your network IP)

All services are **automatically exposed to your local network**, so you can access them from any device on the same WiFi.

#### Or run services individually:

```bash
# Terminal 1 - Server
npm run dev:server

# Terminal 2 - TV Screen
npm run dev:tv

# Terminal 3 - Mobile Controller
npm run dev:mobile
```

## 🎯 How to Use

### 1. Open TV Screen
**On Desktop:**
- Navigate to `http://localhost:5173` in your browser
- Set browser window to 1920x1080 resolution for best experience
- A 6-digit pairing code will be displayed in the top-right

**On Network (from any device on same WiFi):**
- The console will show your network URL (e.g., `http://192.168.20.40:5173`)
- Use this URL to access from other devices on your network

### 2. Connect Mobile Controller
**On the same computer (testing):**
- Open `http://localhost:5174` in a browser

**On your mobile device (real testing):**
- Make sure your phone is on the **same WiFi network**
- Open Chrome or Safari
- Navigate to your network URL (e.g., `http://192.168.20.40:5174`)
- Enter the 6-digit pairing code from the TV screen
- Choose between **D-Pad** or **Joystick** controller mode

### 3. Navigate the Game Hub
**Using Keyboard (on TV screen):**
- `←` `→` Arrow keys to navigate between games
- `Enter` to select a game
- `Esc` for back action

**Using Mobile Controller:**
- **D-Pad Mode**:
  - Tap directional buttons (↑ ↓ ← →) to navigate
  - Tap OK button in center to confirm
  - Tap BACK button at bottom
  - Feel haptic feedback on each press (Android Chrome)

- **Joystick Mode**:
  - Swipe in any direction to navigate
  - Tap center area for OK action
  - Tap BACK button at bottom
  - Feel subtle haptic feedback on swipes and stronger on taps (Android Chrome)

- **Switch modes anytime** using the toggle buttons at the top

## 🎨 Game Hub Layout

The TV screen displays:
- **Background**: Dynamic preview that changes based on selected game
- **Game Tiles**: 4 games displayed at the bottom with focus indicators
- **Pairing Code**: Displayed in the top-right corner
- **Instructions**: Keyboard shortcuts shown in bottom-left

## 🏗️ Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io (WebSockets)
- **Backend**: Node.js + Express

## 🔧 Development

### Building for Production

```bash
# Build all packages
npm run build

# Build individually
npm run build:tv
npm run build:mobile
npm run build:server
```

### Project Architecture

**Communication Flow:**
```
Mobile Device → Socket.io → Server → Socket.io → TV Screen
```

**Socket.io Events:**
- `room:create` - TV creates a new room
- `room:created` - Server sends room code to TV
- `room:join` - Mobile joins room with code
- `room:joined` - Server confirms successful join
- `navigation:input` - Mobile sends navigation events
- `navigation:update` - Server forwards events to TV

### Shared Types

All types are defined in `packages/shared/src/types.ts`:
- `NavigationEvent` - Navigation input structure
- `GameData` - Game information
- `RoomInfo` - Room/pairing information
- `ConnectionStatus` - Connection state

## 📱 Haptic Feedback

The mobile controller features **context-aware haptic feedback** that works best on **Android Chrome**:

### Vibration Patterns:
- **Navigation** (swipes, arrow buttons) - Quick, subtle feedback (30-50ms)
- **Confirmations** (OK, Connect) - Stronger feedback (100ms)
- **Mode switching** - Light feedback (50ms)

### Implementation:
The haptic system (`packages/mobile/src/utils/haptics.ts`) provides:
- `light()` - For buttons and navigation
- `medium()` - For confirmations
- `navigation()` - For swipe gestures (shorter, more responsive)
- `success()` - Pattern for successful actions
- `error()` - Pattern for errors

This helps users distinguish between different types of actions through touch alone!

## 📱 Mobile Browser Compatibility

The mobile controller is optimized for:
- **Android Chrome** (best haptic feedback support)
- iOS Safari & Chrome (limited haptic feedback)
- Desktop browsers (for testing, no haptics)

Key features:
- Prevents browser pull-to-refresh and overscroll
- Disables text selection and scrolling
- Context-aware haptic feedback patterns
- Touch gesture detection with velocity tracking
- Automatic network URL detection

## 🎮 Future Extensibility

The testbed is designed to support:
- Multiple game screens (not just the hub)
- Different controller layouts per game
- Multi-player scenarios (multiple mobile devices)
- Game state synchronization beyond navigation
- Custom game implementations

## 🐛 Troubleshooting

**Mobile can't access the network URL:**
- Ensure your mobile device is on the **same WiFi network** as your computer
- Check firewall settings - ports 3000, 5173, and 5174 should be accessible
- Try accessing `http://[YOUR_IP]:5174` (replace with your actual IP from console output)
- On iOS, try adding the URL to home screen for better app-like experience

**Mobile can't connect:**
- Verify the pairing code is correct (6 digits)
- Check that the server is running: `http://localhost:3000/health`
- Try refreshing both TV and mobile screens
- Make sure TV screen shows "Connected" status before trying to pair

**Navigation not working:**
- Check browser console for WebSocket connection errors
- Ensure TV screen is focused (click on it) when using keyboard
- Verify both devices are using the same server URL
- If pairing code keeps changing, hard refresh both screens (Cmd+Shift+R or Ctrl+Shift+R)

**Joystick gestures not responding:**
- Swipe with enough distance (40px minimum by default)
- Try swiping faster for better detection
- Check that browser isn't capturing gestures (should be disabled automatically)
- On iOS Safari, try swiping from the center of the joystick area

**Haptic feedback not working:**
- Works best on **Android Chrome** (full support)
- iOS has limited haptic API support
- Check that device is not in silent mode (some devices disable haptics in silent mode)
- Try adjusting system vibration settings

## 📄 License

This is a prototype/testbed project.

## 🤝 Contributing

This is an experimental testbed. Feel free to extend and modify for your use cases!

---

Built with React + TypeScript + Socket.io
