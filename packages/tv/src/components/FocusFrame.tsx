import { useEffect, useState } from 'react';

interface FocusFrameProps {
  focusedIndex: number;
  totalItems: number;
  bounceDirection?: 'left' | 'right' | 'up' | 'down' | null;
  isPressing: boolean;
}

export function FocusFrame({ focusedIndex, totalItems, bounceDirection, isPressing }: FocusFrameProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate position to match the flexbox-centered tiles
  // Each tile is 20vw wide + 2vw gap
  const tileWidth = 20; // vw
  const gap = 2; // vw
  const containerPadding = 4; // vw (px-[4vw] on parent)

  // Focus frame is larger than tile to create margin
  const frameMargin = 1; // vw margin on each side
  const frameWidth = tileWidth + (frameMargin * 2); // 22vw total

  // Calculate tile and frame heights
  const tileHeight = tileWidth * (9 / 16); // 20vw * 9/16 = 11.25vw
  const frameHeight = tileHeight + (frameMargin * 2); // 13.25vw total

  // Total width of all tiles plus gaps
  const totalContentWidth = (tileWidth + gap) * totalItems - gap; // 20*4 + 2*3 = 86vw

  // Available width after padding
  const availableWidth = 100 - (containerPadding * 2); // 100 - 8 = 92vw

  // Flexbox centering offset
  const centeringOffset = (availableWidth - totalContentWidth) / 2; // (92 - 86) / 2 = 3vw

  // Position of first tile from left edge
  const firstTileOffset = containerPadding + centeringOffset; // 4 + 3 = 7vw

  // Calculate the translateX for current focused index
  // Subtract frameMargin to center the larger frame over the tile
  const translateX = firstTileOffset + (tileWidth + gap) * focusedIndex - frameMargin;

  // Bounce offset based on direction
  const getBounceOffset = () => {
    if (!bounceDirection) return { x: 0, y: 0 };

    switch (bounceDirection) {
      case 'left':
        return { x: -1.5, y: 0 }; // vw
      case 'right':
        return { x: 1.5, y: 0 }; // vw
      case 'up':
        return { x: 0, y: -1.5 }; // vw
      case 'down':
        return { x: 0, y: 1.5 }; // vw
      default:
        return { x: 0, y: 0 };
    }
  };

  const bounceOffset = getBounceOffset();

  // Trigger animation when bounce direction changes
  useEffect(() => {
    if (bounceDirection) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 150); // Animation duration
      return () => clearTimeout(timer);
    }
  }, [bounceDirection]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className={`
          absolute
          rounded-2xl
          ring-8 ring-blue-500
          shadow-2xl shadow-blue-500/50
          ${isAnimating || isPressing ? 'transition-transform duration-150 ease-out' : 'transition-all duration-300 ease-out'}
        `}
        style={{
          width: `${frameWidth}vw`,
          height: `${frameHeight}vw`,
          bottom: `calc(4vh - ${frameMargin}vw)`, // Equal margin on all sides
          left: '0',
          transform: isAnimating
            ? `translateX(${translateX + bounceOffset.x}vw) translateY(${bounceOffset.y}vw)${isPressing ? ' scale(0.95)' : ''}`
            : `translateX(${translateX}vw)${isPressing ? ' scale(0.95)' : ''}`,
        }}
      />
    </div>
  );
}
