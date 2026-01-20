import { useState } from 'react';
import { Undo2 } from 'lucide-react';
import { NavigationDirection, NavigationAction } from '@mobile-lab/shared';
import { useSwipeGestures } from '../hooks/useSwipeGestures';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { HapticFeedback } from '../utils/haptics';
import { VoiceGlow } from './VoiceGlow';
import padBackground from '../assets/pad_background_circular_3x.png';

interface SquareControllerProps {
  onNavigate: (direction: NavigationDirection) => void;
  onAction: (action: NavigationAction) => void;
}

export function SquareController({ onNavigate, onAction }: SquareControllerProps) {
  const [lastSwipe, setLastSwipe] = useState<NavigationDirection | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [edgePress, setEdgePress] = useState<NavigationDirection | null>(null);
  const [ripplePosition, setRipplePosition] = useState<{ x: number; y: number } | null>(null);
  const [showDebugPanel, setShowDebugPanel] = useState(true);

  // Voice input for visual feedback
  const { volume, isListening, error } = useVoiceInput({
    enabled: true,
    smoothingFactor: 0.85,
    testMode: false  // Now using HTTPS, real microphone enabled
  });

  // Log voice input status for debugging
  console.log('[SquareController] Voice status:', { volume, isListening, error });

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

  const handleEdgeClick = (direction: NavigationDirection, e: React.TouchEvent) => {
    HapticFeedback.light();

    // Calculate ripple position relative to the container
    const touch = e.touches[0];
    const container = e.currentTarget.closest('.aspect-square');
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setRipplePosition({ x, y });
    }

    setEdgePress(direction);
    onNavigate(direction);

    // Clear ripple after animation
    setTimeout(() => {
      setEdgePress(null);
      setRipplePosition(null);
    }, 300);
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
    <>
      {/* Voice-activated glowing edge effect */}
      <VoiceGlow volume={volume} isActive={isListening} />

      {/* Debug panel - hidden for production */}
      {/* Uncomment to show debug panel for development */}
      {/*
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          setShowDebugPanel(!showDebugPanel);
        }}
        className="fixed top-4 right-4 w-12 h-12 bg-black/80 backdrop-blur-md text-white rounded-full z-50 flex items-center justify-center text-xl shadow-lg active:scale-95 transition-transform"
      >
        {showDebugPanel ? '✕' : '📊'}
      </button>

      {showDebugPanel && (
        <div className="fixed top-4 left-4 right-20 bg-black/80 backdrop-blur-md text-white p-4 rounded-lg z-50 text-sm">
          <div className="font-bold mb-2">Voice Debug</div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: isListening ? '#10b981' : '#ef4444' }}></div>
            <span>{isListening ? 'Microphone Active' : 'Microphone Inactive'}</span>
          </div>
          {error && (
            <div className="text-red-300 text-xs mb-2">
              Error: {error}
            </div>
          )}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Volume:</span>
              <span>{(volume * 100).toFixed(0)}%</span>
            </div>
            <div className="w-full h-8 bg-gray-700 rounded-lg overflow-hidden">
              <div
                className="h-full transition-all duration-75"
                style={{
                  width: `${volume * 100}%`,
                  background: `linear-gradient(90deg,
                    hsl(${120 - volume * 120}, 80%, 50%),
                    hsl(${180 + volume * 180}, 80%, 50%))`,
                }}
              />
            </div>
          </div>
        </div>
      )}
      */}

      <div className="flex flex-col items-center justify-center h-full py-8 px-2" style={{ backgroundColor: '#00001f' }}>
        {/* Square Trackpad Area with Invisible Edge Zones */}
        <div className="relative w-full max-w-md aspect-square mb-16">
          <div
            className="relative w-full h-full overflow-hidden"
            style={{
              touchAction: 'none',
              backgroundImage: `url(${padBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              borderRadius: '64px'
            }}
          >
            {/* Invisible Top Edge Zone */}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdgeClick('up', e);
              }}
              className="absolute top-0 left-0 right-0 h-24 z-10 bg-transparent"
            />

            {/* Invisible Bottom Edge Zone */}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdgeClick('down', e);
              }}
              className="absolute bottom-0 left-0 right-0 h-24 z-10 bg-transparent"
            />

            {/* Invisible Left Edge Zone */}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdgeClick('left', e);
              }}
              className="absolute top-24 bottom-24 left-0 w-24 z-10 bg-transparent"
            />

            {/* Invisible Right Edge Zone */}
            <button
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleEdgeClick('right', e);
              }}
              className="absolute top-24 bottom-24 right-0 w-24 z-10 bg-transparent"
            />

            {/* Central Trackpad Area with swipe and tap */}
            <div
              ref={trackpadRef}
              className="absolute inset-24 z-0"
            >
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
          </div>

          {/* Ripple Overlay - Outside clipping context */}
          {edgePress && ripplePosition && (
            <div
              className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${ripplePosition.x}px`,
                top: `${ripplePosition.y}px`,
              }}
            >
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
            w-64 h-20
            text-white text-2xl font-bold
            transition-all duration-100 active:scale-95
            select-none touch-none
            flex items-center justify-center gap-3
          "
          style={{
            borderRadius: '24px',
            border: '2px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.06)',
          }}
        >
          <Undo2 size={28} strokeWidth={2.5} />
          BACK
        </button>
      </div>
    </>
  );
}
