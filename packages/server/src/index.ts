import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { RoomManager } from './room-manager.js';
import { setupSocketHandlers } from './socket-handler.js';
import { CONFIG } from '@mobile-lab/shared';

const app = express();
const httpServer = createServer(app);

// Configure CORS for Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Express middleware
app.use(cors());
app.use(express.json());

// Initialize room manager
const roomManager = new RoomManager();

// Setup socket handlers
setupSocketHandlers(io, roomManager);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// Get all rooms (for debugging)
app.get('/rooms', (req, res) => {
  res.json({ rooms: roomManager.getAllRooms() });
});

// Cleanup expired rooms every 5 minutes
setInterval(() => {
  roomManager.cleanupExpiredRooms(CONFIG.ROOM_EXPIRY_MS);
}, 300000);

// Start server
const PORT = CONFIG.SERVER_PORT;
httpServer.listen(PORT, () => {
  console.log(`\n🚀 Mobile Lab Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready for connections\n`);
});
