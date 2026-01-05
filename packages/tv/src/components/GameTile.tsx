import { GameData } from '@mobile-lab/shared';

interface GameTileProps {
  game: GameData;
  isActive: boolean;
  onClick?: () => void;
}

export function GameTile({ game, isActive, onClick }: GameTileProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative w-96 h-56 rounded-2xl overflow-hidden
        transition-all duration-300 ease-out
        ${
          isActive
            ? 'ring-8 ring-blue-500 scale-105 shadow-2xl shadow-blue-500/50'
            : 'ring-4 ring-gray-700 opacity-70 scale-95'
        }
      `}
      style={{ backgroundColor: game.backgroundColor }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-3xl font-bold text-white text-center drop-shadow-lg">
          {game.title}
        </h3>
      </div>
    </button>
  );
}
