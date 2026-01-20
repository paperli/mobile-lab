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
      className="relative w-[20vw] aspect-[16/9] rounded-2xl overflow-hidden transition-opacity duration-300 ease-out opacity-80"
      style={{ backgroundColor: game.backgroundColor }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-[1.5vw]">
        <div className="text-[4vw] mb-[1vw]">🎮</div>
        <h3 className="text-[1.5vw] font-bold text-white text-center drop-shadow-lg">
          {game.title}
        </h3>
      </div>
    </button>
  );
}
