import { PLACEHOLDER_GAMES, GameData, NavigationDirection, NavigationAction } from '@mobile-lab/shared';
import { QRCodeSVG } from 'qrcode.react';
import { GameTile } from './GameTile';
import { GamePreview } from './GamePreview';
import { FocusFrame } from './FocusFrame';
import { useKeyboardNav } from '../hooks/useKeyboardNav';

interface GameHubProps {
  roomCode: string;
  focusedIndex: number;
  bounceDirection: NavigationDirection | null;
  isPressing: boolean;
  onNavigate: (direction: NavigationDirection) => void;
  onAction: (action: NavigationAction) => void;
  onFocusChange: (index: number) => void;
}

export function GameHub({ roomCode, focusedIndex, bounceDirection, isPressing, onNavigate, onAction, onFocusChange }: GameHubProps) {
  const games = PLACEHOLDER_GAMES as unknown as GameData[];
  const mobileBaseUrl = import.meta.env.VITE_MOBILE_URL || 'http://localhost:5174';
  const mobileUrl = `${mobileBaseUrl}?code=${roomCode}`;

  // Setup keyboard navigation
  useKeyboardNav({
    onNavigate,
    onAction,
  });

  return (
    <div className="relative w-full h-full">
      {/* Background Preview */}
      <GamePreview game={games[focusedIndex]} />

      {/* Connection Status Indicator with QR Code */}
      <div className="absolute top-[2vh] right-[2vw] bg-black/60 backdrop-blur-md rounded-2xl px-[2vw] py-[1.5vh] text-white">
        <div className="flex items-start gap-[1.5vw]">
          {/* QR Code */}
          <div className="bg-white p-[0.5vw] rounded-lg">
            <QRCodeSVG
              value={mobileUrl}
              size={Math.min(window.innerWidth * 0.08, 120)}
              level="M"
              includeMargin={false}
            />
          </div>

          {/* Pairing Info */}
          <div className="flex-1">
            <div className="text-[0.8vw] font-semibold text-gray-300 mb-1">Pairing Code</div>
            <div className="text-[2.6vw] font-bold tracking-wider">{roomCode || 'LOADING'}</div>
            <div className="text-[0.7vw] text-gray-400 mt-2">
              Scan QR code or enter code on mobile
            </div>
          </div>
        </div>
      </div>

      {/* Game Tiles at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-[8vh] pb-[4vh]">
        <div className="flex justify-center items-center gap-[2vw] px-[4vw]">
          {games.map((game, index) => (
            <GameTile
              key={game.id}
              game={game}
              isActive={index === focusedIndex}
              isPressing={isPressing && index === focusedIndex}
              onClick={() => onFocusChange(index)}
            />
          ))}
        </div>
        {/* Focus Frame */}
        <FocusFrame
          focusedIndex={focusedIndex}
          totalItems={games.length}
          bounceDirection={bounceDirection}
          isPressing={isPressing}
        />
      </div>

      {/* Instructions */}
      <div className="absolute bottom-[2vh] left-[2vw] bg-black/60 backdrop-blur-md rounded-xl px-[1.5vw] py-[1vh] text-white">
        <div className="text-[0.7vw] text-gray-300">
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
