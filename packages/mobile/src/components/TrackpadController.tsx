import { useState, useRef } from 'react';
import { NavigationDirection, NavigationAction } from '@mobile-lab/shared';
import { useSwipeGestures } from '../hooks/useSwipeGestures';
import { HapticFeedback } from '../utils/haptics';

interface TrackpadControllerProps {
  onNavigate: (direction: NavigationDirection) => void;
  onAction: (action: NavigationAction) => void;
}

interface JoystickPosition {
  x: number;
  y: number;
}

export function TrackpadController({ onNavigate, onAction }: TrackpadControllerProps) {
  const [lastSwipe, setLastSwipe] = useState<NavigationDirection | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [joystickPosition, setJoystickPosition] = useState<JoystickPosition>({ x: 0, y: 0 });
  const [isTouching, setIsTouching] = useState(false);
  const joystickAreaRef = useRef<HTMLDivElement>(null);

  const JOYSTICK_AREA_RADIUS = 150; // Radius of the big circle
  const JOYSTICK_STICK_RADIUS = 40; // Radius of the small circle

  const constrainToCircle = (x: number, y: number, maxRadius: number): JoystickPosition => {
    const distance = Math.sqrt(x * x + y * y);
    if (distance <= maxRadius) {
      return { x, y };
    }
    const angle = Math.atan2(y, x);
    return {
      x: maxRadius * Math.cos(angle),
      y: maxRadius * Math.sin(angle),
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickAreaRef.current) return;

    const touch = e.touches[0];
    const rect = joystickAreaRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = touch.clientX - centerX;
    const offsetY = touch.clientY - centerY;

    const constrainedPos = constrainToCircle(offsetX, offsetY, JOYSTICK_AREA_RADIUS - JOYSTICK_STICK_RADIUS);
    setJoystickPosition(constrainedPos);
  };

  const handleTouchEnd = () => {
    setIsTouching(false);
    // Return joystick to center
    setJoystickPosition({ x: 0, y: 0 });
  };

  const handleSwipe = (direction: NavigationDirection) => {
    setLastSwipe(direction);
    setShowFeedback(true);
    HapticFeedback.light();
    onNavigate(direction);

    // Clear feedback after animation
    setTimeout(() => setShowFeedback(false), 300);
  };

  const handleTap = () => {
    HapticFeedback.medium();
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
      up: 'top-8 left-1/2 -translate-x-1/2',
      down: 'bottom-8 left-1/2 -translate-x-1/2',
      left: 'left-8 top-1/2 -translate-y-1/2',
      right: 'right-8 top-1/2 -translate-y-1/2',
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
      {/* Joystick Area */}
      <div className="relative flex-1 flex items-center justify-center mb-8 w-full">
        <div
          ref={(node) => {
            if (node) {
              joystickAreaRef.current = node;
              // Also apply to the swipe gesture ref
              if (typeof trackpadRef === 'function') {
                trackpadRef(node);
              } else if (trackpadRef) {
                trackpadRef.current = node;
              }
            }
          }}
          onTouchStart={() => setIsTouching(true)}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative bg-gray-800 rounded-full border-4 border-gray-600"
          style={{
            width: `${JOYSTICK_AREA_RADIUS * 2}px`,
            height: `${JOYSTICK_AREA_RADIUS * 2}px`,
            touchAction: 'none',
          }}
        >
          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-600 rounded-full"></div>

          {/* Joystick stick (smaller circle) */}
          <div
            className="absolute top-1/2 left-1/2 bg-blue-500 rounded-full shadow-lg transition-all duration-100"
            style={{
              width: `${JOYSTICK_STICK_RADIUS * 2}px`,
              height: `${JOYSTICK_STICK_RADIUS * 2}px`,
              transform: `translate(-50%, -50%) translate(${joystickPosition.x}px, ${joystickPosition.y}px)`,
              opacity: isTouching ? 1 : 0.7,
            }}
          >
            {/* Inner highlight */}
            <div className="absolute top-1/4 left-1/4 w-1/3 h-1/3 bg-blue-300 rounded-full blur-sm"></div>
          </div>

          {/* Direction arrows feedback */}
          <div
            className={`
              absolute text-6xl text-blue-400 transition-all duration-300 pointer-events-none
              ${showFeedback ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}
              ${getArrowPosition()}
            `}
          >
            {getArrowIcon()}
          </div>

          {/* Tap Feedback (center pulse) */}
          {showFeedback && !lastSwipe && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-24 h-24 rounded-full bg-blue-500/30 animate-ping"></div>
            </div>
          )}
        </div>
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
