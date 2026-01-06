import { PLACEHOLDER_GAMES, GameData, NavigationDirection, NavigationAction } from '@mobile-lab/shared';
import { GameTile } from './GameTile';
import { GamePreview } from './GamePreview';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

interface GameHubProps {
  roomCode: string;
  focusedIndex: number;
  onNavigate: (direction: NavigationDirection) => void;
  onAction: (action: NavigationAction) => void;
  onFocusChange: (index: number) => void;
}

export function GameHub({ roomCode, focusedIndex, onNavigate, onAction, onFocusChange }: GameHubProps) {
  const games = PLACEHOLDER_GAMES as unknown as GameData[];

  // Setup keyboard navigation
  useKeyboardNav({
    onNavigate,
    onAction,
  });

  return (
    <div className="relative w-full h-full">
      {/* Background Preview */}
      <GamePreview game={games[focusedIndex]} />

      {/* Connection Status Indicator */}
      <div className="absolute top-8 right-8 bg-black/60 backdrop-blur-md rounded-2xl px-8 py-4 text-white">
        <div className="text-sm font-semibold text-gray-300 mb-1">Pairing Code</div>
        <div className="text-5xl font-bold tracking-wider">{roomCode || 'LOADING'}</div>
        <div className="text-sm text-gray-400 mt-2">Enter this code on your mobile device</div>
      </div>

      {/* Game Tiles at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-32 pb-16">
        <div className="flex justify-center items-center gap-8 px-16">
          {games.map((game, index) => (
            <GameTile
              key={game.id}
              game={game}
              isActive={index === focusedIndex}
              onClick={() => onFocusChange(index)}
            />
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-8 left-8 bg-black/60 backdrop-blur-md rounded-xl px-6 py-3 text-white">
        <div className="text-sm text-gray-300">
          <span className="font-semibold">←→</span> Navigate{' '}
          <span className="mx-2">|</span>
          <span className="font-semibold">Enter</span> Select{' '}
          <span className="mx-2">|</span>
          <span className="font-semibold">Esc</span> Back
        </div>
      </div>
    </div>
  );
}
