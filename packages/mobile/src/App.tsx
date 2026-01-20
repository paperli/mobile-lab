import { useState, useEffect, useCallback } from 'react';
import { ControllerMode } from '@mobile-lab/shared';
import { useSocket } from './hooks/useSocket';
import { PairingScreen } from './components/PairingScreen';
import { DPadController } from './components/DPadController';
import { JoystickController } from './components/JoystickController';
import { GamepadController } from './components/GamepadController';
import { TrackpadController } from './components/TrackpadController';
import { SquareController } from './components/SquareController';
import { ControllerSelector } from './components/ControllerSelector';

function App() {
  const { connectionStatus, isPaired, roomCode, joinRoom, sendNavigationInput } = useSocket();
  const [controllerMode, setControllerMode] = useState<ControllerMode>('dpad');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>();

  // Load controller mode preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('controllerMode') as ControllerMode;
    if (savedMode === 'dpad' || savedMode === 'trackpad' || savedMode === 'gamepad' || savedMode === 'hybrid' || savedMode === 'square-hybrid') {
      setControllerMode(savedMode);
    }
  }, []);

  // Save controller mode preference
  const handleModeChange = useCallback((mode: ControllerMode) => {
    setControllerMode(mode);
    localStorage.setItem('controllerMode', mode);
  }, []);

  const handlePair = useCallback(
    (code: string) => {
      setIsConnecting(true);
      setError(undefined);
      joinRoom(code);

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!isPaired) {
          setIsConnecting(false);
          setError('Failed to connect. Please check the code and try again.');
        }
      }, 5000);
    },
    [joinRoom, isPaired]
  );

  // Handle successful pairing
  useEffect(() => {
    if (isPaired) {
      setIsConnecting(false);
      setError(undefined);
    }
  }, [isPaired]);

  // Handle connection errors
  useEffect(() => {
    if (connectionStatus.error) {
      setError(connectionStatus.error);
      setIsConnecting(false);
    }
  }, [connectionStatus.error]);

  // Auto-join room if code is in URL query parameter
  useEffect(() => {
    if (connectionStatus.connected && !isPaired && !isConnecting) {
      const urlParams = new URLSearchParams(window.location.search);
      const codeFromUrl = urlParams.get('code');

      if (codeFromUrl) {
        console.log('[Mobile] Auto-joining room from URL:', codeFromUrl);
        handlePair(codeFromUrl);
      }
    }
  }, [connectionStatus.connected, isPaired, isConnecting, handlePair]);

  const handleNavigate = useCallback(
    (direction: string) => {
      sendNavigationInput({
        type: 'navigate',
        direction: direction as any,
        timestamp: Date.now(),
      });
    },
    [sendNavigationInput]
  );

  const handleAction = useCallback(
    (action: string) => {
      sendNavigationInput({
        type: 'action',
        action: action as any,
        timestamp: Date.now(),
      });
    },
    [sendNavigationInput]
  );

  // Show connection loading
  if (!connectionStatus.connected) {
    return (
      <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">📡</div>
          <h1 className="text-3xl font-bold mb-4">Connecting to Server...</h1>
          <p className="text-gray-400">Please wait</p>
        </div>
      </div>
    );
  }

  // Show pairing screen if not paired
  if (!isPaired) {
    return <PairingScreen onPair={handlePair} isConnecting={isConnecting} error={error} />;
  }

  // Show controller based on mode
  return (
    <div className="relative w-full h-full">
      <ControllerSelector mode={controllerMode} onModeChange={handleModeChange} roomCode={roomCode} />
      <div className="h-full pt-16">
        {controllerMode === 'dpad' && (
          <DPadController onNavigate={handleNavigate} onAction={handleAction} />
        )}
        {controllerMode === 'trackpad' && (
          <JoystickController onNavigate={handleNavigate} onAction={handleAction} />
        )}
        {controllerMode === 'gamepad' && (
          <GamepadController onNavigate={handleNavigate} onAction={handleAction} />
        )}
        {controllerMode === 'hybrid' && (
          <TrackpadController onNavigate={handleNavigate} onAction={handleAction} />
        )}
        {controllerMode === 'square-hybrid' && (
          <SquareController onNavigate={handleNavigate} onAction={handleAction} />
        )}
      </div>
    </div>
  );
}

export default App;
