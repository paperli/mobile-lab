import { useEffect, useState } from 'react';

interface VoiceGlowProps {
  volume: number; // 0-1 range
  isActive: boolean;
}

export function VoiceGlow({ volume, isActive }: VoiceGlowProps) {
  const [hueOffset, setHueOffset] = useState(0);

  // Animate hue rotation for color shifting effect
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setHueOffset((prev) => (prev + 1) % 360);
    }, 50); // Update every 50ms for smooth color transitions

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  // Calculate glow intensity based on volume
  // Min opacity: 0.3, Max opacity: 0.9
  const opacity = 0.3 + (volume * 0.6);

  // Calculate blur amount based on volume
  // Min blur: 20px, Max blur: 60px
  const blur = 20 + (volume * 40);

  // Calculate scale based on volume for pulsing effect
  // Min scale: 1.0, Max scale: 1.15
  const scale = 1.0 + (volume * 0.15);

  // Generate gradient with shifting colors (like Siri)
  const gradient = `
    linear-gradient(
      90deg,
      hsl(${(hueOffset + 0) % 360}, 80%, 60%),
      hsl(${(hueOffset + 60) % 360}, 80%, 60%),
      hsl(${(hueOffset + 120) % 360}, 80%, 60%),
      hsl(${(hueOffset + 180) % 360}, 80%, 60%),
      hsl(${(hueOffset + 240) % 360}, 80%, 60%),
      hsl(${(hueOffset + 300) % 360}, 80%, 60%),
      hsl(${(hueOffset + 0) % 360}, 80%, 60%)
    )
  `;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Top edge glow */}
      <div
        className="absolute top-0 left-0 right-0 h-2 transition-all duration-100"
        style={{
          background: gradient,
          opacity,
          filter: `blur(${blur}px)`,
          transform: `scaleY(${scale})`,
          transformOrigin: 'top',
        }}
      />

      {/* Bottom edge glow */}
      <div
        className="absolute bottom-0 left-0 right-0 h-2 transition-all duration-100"
        style={{
          background: gradient,
          opacity,
          filter: `blur(${blur}px)`,
          transform: `scaleY(${scale})`,
          transformOrigin: 'bottom',
        }}
      />

      {/* Left edge glow */}
      <div
        className="absolute top-0 bottom-0 left-0 w-2 transition-all duration-100"
        style={{
          background: gradient,
          opacity,
          filter: `blur(${blur}px)`,
          transform: `scaleX(${scale})`,
          transformOrigin: 'left',
        }}
      />

      {/* Right edge glow */}
      <div
        className="absolute top-0 bottom-0 right-0 w-2 transition-all duration-100"
        style={{
          background: gradient,
          opacity,
          filter: `blur(${blur}px)`,
          transform: `scaleX(${scale})`,
          transformOrigin: 'right',
        }}
      />

      {/* Corner accents for more uniform glow */}
      {/* Top-left corner */}
      <div
        className="absolute top-0 left-0 w-20 h-20 transition-all duration-100"
        style={{
          background: `radial-gradient(circle at top left,
            hsl(${(hueOffset + 0) % 360}, 80%, 60%) 0%,
            transparent 70%)`,
          opacity: opacity * 0.8,
          filter: `blur(${blur * 0.8}px)`,
        }}
      />

      {/* Top-right corner */}
      <div
        className="absolute top-0 right-0 w-20 h-20 transition-all duration-100"
        style={{
          background: `radial-gradient(circle at top right,
            hsl(${(hueOffset + 90) % 360}, 80%, 60%) 0%,
            transparent 70%)`,
          opacity: opacity * 0.8,
          filter: `blur(${blur * 0.8}px)`,
        }}
      />

      {/* Bottom-left corner */}
      <div
        className="absolute bottom-0 left-0 w-20 h-20 transition-all duration-100"
        style={{
          background: `radial-gradient(circle at bottom left,
            hsl(${(hueOffset + 180) % 360}, 80%, 60%) 0%,
            transparent 70%)`,
          opacity: opacity * 0.8,
          filter: `blur(${blur * 0.8}px)`,
        }}
      />

      {/* Bottom-right corner */}
      <div
        className="absolute bottom-0 right-0 w-20 h-20 transition-all duration-100"
        style={{
          background: `radial-gradient(circle at bottom right,
            hsl(${(hueOffset + 270) % 360}, 80%, 60%) 0%,
            transparent 70%)`,
          opacity: opacity * 0.8,
          filter: `blur(${blur * 0.8}px)`,
        }}
      />
    </div>
  );
}
