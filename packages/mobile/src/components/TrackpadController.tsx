import { useState } from 'react';
import { NavigationDirection, NavigationAction } from '@mobile-lab/shared';
import { useSwipeGestures } from '../hooks/useSwipeGestures';
import { HapticFeedback } from '../utils/haptics';

interface TrackpadControllerProps {
  onNavigate: (direction: NavigationDirection) => void;
  onAction: (action: NavigationAction) => void;
}

export function TrackpadController({ onNavigate, onAction }: TrackpadControllerProps) {
  const [lastSwipe, setLastSwipe] = useState<NavigationDirection | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleSwipe = (direction: NavigationDirection) => {
    setLastSwipe(direction);
    setShowFeedback(true);
    onNavigate(direction);

    // Clear feedback after animation
    setTimeout(() => setShowFeedback(false), 300);
  };

  const handleTap = () => {
    onAction('ok');
    setShowFeedback(true);
    setTimeout(() => setShowFeedback(false), 300);
  };

  const trackpadRef = useSwipeGestures({
    onSwipe: handleSwipe,
    onTap: handleTap,
    minSwipeDistance: 40,
    minVelocity: 0.2,
  });

  const getArrowPosition = () => {
    if (!lastSwipe || !showFeedback) return 'opacity-0';

    const positions = {
      up: 'top-1/4 left-1/2 -translate-x-1/2',
      down: 'bottom-1/4 left-1/2 -translate-x-1/2',
      left: 'left-1/4 top-1/2 -translate-y-1/2',
      right: 'right-1/4 top-1/2 -translate-y-1/2',
    };

    return positions[lastSwipe];
  };

  const getArrowIcon = () => {
    if (!lastSwipe) return '';

    const icons = {
      up: '▲',
      down: '▼',
      left: '◀',
      right: '▶',
    };

    return icons[lastSwipe];
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white text-center mb-2">Trackpad Controller</h2>
        <p className="text-gray-400 text-center">Swipe to navigate, tap for OK</p>
      </div>

      {/* Trackpad Area */}
      <div
        ref={trackpadRef}
        className="relative flex-1 w-full max-w-2xl bg-gray-800 rounded-3xl border-4 border-gray-700 mb-8 overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-600 text-6xl select-none pointer-events-none">⊕</div>
        </div>

        {/* Swipe Feedback */}
        <div
          className={`
            absolute text-8xl text-blue-400 transition-all duration-300
            ${showFeedback ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}
            ${getArrowPosition()}
          `}
        >
          {getArrowIcon()}
        </div>

        {/* Tap Feedback (center pulse) */}
        {showFeedback && !lastSwipe && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-blue-500/30 animate-ping"></div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          HapticFeedback.light();
          onAction('back');
        }}
        className="
          w-64 h-20 bg-red-600 active:bg-red-500
          border-4 border-red-500 active:border-red-400
          rounded-2xl text-white text-2xl font-bold
          transition-all duration-100 active:scale-95
          shadow-lg active:shadow-xl
          select-none touch-none
        "
      >
        BACK
      </button>
    </div>
  );
}
