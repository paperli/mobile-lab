import { ControllerMode } from '@mobile-lab/shared';
import { HapticFeedback } from '../utils/haptics';

interface ControllerSelectorProps {
  mode: ControllerMode;
  onModeChange: (mode: ControllerMode) => void;
  roomCode: string;
}

export function ControllerSelector({ mode, onModeChange, roomCode }: ControllerSelectorProps) {
  const handleModeChange = (newMode: ControllerMode) => {
    // Haptic feedback when switching modes
    HapticFeedback.light();
    onModeChange(newMode);
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md px-6 py-4 border-b-2 border-gray-700 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-white text-sm">
            <span className="text-gray-400">Connected:</span>{' '}
            <span className="font-mono font-bold">{roomCode}</span>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-900 rounded-lg p-1">
          <button
            onClick={() => handleModeChange('dpad')}
            className={`
              px-4 py-2 rounded-md text-sm font-semibold transition-all
              ${
                mode === 'dpad'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }
            `}
          >
            D-Pad
          </button>
          <button
            onClick={() => handleModeChange('trackpad')}
            className={`
              px-4 py-2 rounded-md text-sm font-semibold transition-all
              ${
                mode === 'trackpad'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }
            `}
          >
            Trackpad
          </button>
        </div>
      </div>
    </div>
  );
}
