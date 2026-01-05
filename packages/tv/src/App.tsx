import { useState, useCallback } from 'react';
import {
  NavigationInputPayload,
  NavigationDirection,
  NavigationAction,
  PLACEHOLDER_GAMES,
} from '@mobile-lab/shared';
import { GameHub } from './components/GameHub';
import { useSocket } from './hooks/useSocket';

function App() {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const games = PLACEHOLDER_GAMES;

  const handleNavigate = useCallback((direction: NavigationDirection) => {
    setFocusedIndex((current) => {
      switch (direction) {
        case 'left':
          return Math.max(0, current - 1);
        case 'right':
          return Math.min(games.length - 1, current + 1);
        case 'up':
        case 'down':
          return current;
        default:
          return current;
      }
    });
  }, [games.length]);

  const handleAction = useCallback((action: NavigationAction) => {
    if (action === 'ok') {
      console.log(`[TV] Selected game: ${games[focusedIndex].title}`);
      // In the future, this could launch the game
    } else if (action === 'back') {
      console.log('[TV] Back action');
      // In the future, this could go back to main menu
    }
  }, [focusedIndex, games]);

  // Handle navigation input from mobile
  const handleNavigationInput = useCallback(
    (payload: NavigationInputPayload) => {
      if (payload.type === 'navigate' && payload.direction) {
        handleNavigate(payload.direction);
      } else if (payload.type === 'action' && payload.action) {
        handleAction(payload.action);
      }
    },
    [handleNavigate, handleAction]
  );

  const { roomCode, connectionStatus } = useSocket(handleNavigationInput);

  if (!connectionStatus.connected || !roomCode) {
    return (
      <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-6 animate-pulse">📡</div>
          <h1 className="text-5xl font-bold mb-4">Connecting to Server...</h1>
          <p className="text-2xl text-gray-400">Please wait</p>
        </div>
      </div>
    );
  }

  return (
    <GameHub
      roomCode={roomCode}
      focusedIndex={focusedIndex}
      onNavigate={handleNavigate}
      onAction={handleAction}
      onFocusChange={setFocusedIndex}
    />
  );
}

export default App;
