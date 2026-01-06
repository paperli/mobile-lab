import { ControllerMode } from '@mobile-lab/shared';
import { HapticFeedback } from '../utils/haptics';

interface ControllerSelectorProps {
  mode: ControllerMode;
  onModeChange: (mode: ControllerMode) => void;
  roomCode?: string; // Optional since we're not displaying it
}

export function ControllerSelector({ mode, onModeChange }: ControllerSelectorProps) {
  const handleModeChange = (newMode: ControllerMode) => {
    // Haptic feedback when switching modes
    HapticFeedback.light();
    onModeChange(newMode);
  };

  return (
    <div className="absolute top-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md px-4 py-3 border-b-2 border-gray-700 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
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
            Joystick
          </button>
          <button
            onClick={() => handleModeChange('gamepad')}
            className={`
              px-4 py-2 rounded-md text-sm font-semibold transition-all
              ${
                mode === 'gamepad'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }
            `}
          >
            Gamepad
          </button>
          <button
            onClick={() => handleModeChange('hybrid')}
            className={`
              px-4 py-2 rounded-md text-sm font-semibold transition-all
              ${
                mode === 'hybrid'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }
            `}
          >
            Hybrid
          </button>
        </div>
      </div>
    </div>
  );
}
