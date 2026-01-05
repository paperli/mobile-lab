import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  SOCKET_EVENTS,
  CONFIG,
  ConnectionStatus,
  NavigationInputPayload,
} from '@mobile-lab/shared';

export function useSocket(onNavigationInput: (payload: NavigationInputPayload) => void) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    connected: false,
    deviceType: 'tv',
  });
  const [roomCode, setRoomCode] = useState<string>('');

  // Use a ref to store the callback so it doesn't cause socket reconnections
  const onNavigationInputRef = useRef(onNavigationInput);

  // Update the ref when the callback changes
  useEffect(() => {
    onNavigationInputRef.current = onNavigationInput;
  }, [onNavigationInput]);

  useEffect(() => {
    // Use current hostname to support both localhost and network access
    const hostname = window.location.hostname;
    const socketInstance = io(`http://${hostname}:${CONFIG.SERVER_PORT}`, {
      transports: ['websocket'],
    });

    socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
      console.log('[TV] Connected to server');
      setConnectionStatus({ connected: true, deviceType: 'tv' });

      // Request room creation
      socketInstance.emit(SOCKET_EVENTS.ROOM_CREATE, { deviceType: 'tv' });
    });

    socketInstance.on(SOCKET_EVENTS.ROOM_CREATED, (payload: { roomCode: string }) => {
      console.log('[TV] Room created:', payload.roomCode);
      setRoomCode(payload.roomCode);
      setConnectionStatus((prev) => ({ ...prev, roomCode: payload.roomCode }));
    });

    socketInstance.on(SOCKET_EVENTS.ROOM_JOINED, (payload: { success: boolean }) => {
      if (payload.success) {
        console.log('[TV] Mobile device connected');
      }
    });

    socketInstance.on(SOCKET_EVENTS.NAVIGATION_INPUT, (payload: NavigationInputPayload) => {
      console.log('[TV] Navigation input received:', payload);
      // Use the ref to call the latest callback without causing reconnections
      onNavigationInputRef.current(payload);
    });

    socketInstance.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log('[TV] Disconnected from server');
      setConnectionStatus({ connected: false, deviceType: 'tv' });
      setRoomCode('');
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []); // Empty dependency array - socket connects once and stays connected

  return { socket, connectionStatus, roomCode };
}
