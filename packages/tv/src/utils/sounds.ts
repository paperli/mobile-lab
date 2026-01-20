// Sound effect utilities using audio files

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  private volume: number = 0.3; // Master volume (0.0 to 1.0)

  // Audio file paths (relative to public folder)
  private readonly soundPaths = {
    navigation: '/audio/navigation.mp3',
    selection: '/audio/selection.mp3',
    bounce: '/audio/bounce.mp3',
  };

  /**
   * Preload an audio file
   * Call this during app initialization to avoid delays on first play
   */
  preloadSound(key: keyof typeof this.soundPaths) {
    const path = this.soundPaths[key];
    if (!this.audioCache.has(key)) {
      const audio = new Audio(path);
      audio.volume = this.volume;
      audio.preload = 'auto';
      this.audioCache.set(key, audio);
    }
  }

  /**
   * Preload all sounds
   */
  preloadAll() {
    Object.keys(this.soundPaths).forEach((key) => {
      this.preloadSound(key as keyof typeof this.soundPaths);
    });
  }

  /**
   * Play a sound by key
   * Creates a new audio instance each time to allow overlapping sounds
   */
  private playSound(key: keyof typeof this.soundPaths) {
    try {
      const path = this.soundPaths[key];
      const audio = new Audio(path);
      audio.volume = this.volume;

      // Play and remove when done
      audio.play().catch((error) => {
        console.warn(`Failed to play ${key} sound:`, error);
      });

      // Clean up after playback
      audio.addEventListener('ended', () => {
        audio.remove();
      });
    } catch (error) {
      console.warn(`Failed to play ${key} sound:`, error);
    }
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Play a navigation sound (when moving between games)
  playNavigationSound() {
    this.playSound('navigation');
  }

  // Play a selection/launch sound (when pressing OK/Enter)
  playSelectionSound() {
    this.playSound('selection');
  }

  // Play a bounce sound (when hitting boundaries)
  playBounceSound() {
    this.playSound('bounce');
  }
}

// Export singleton instance
export const soundManager = new SoundManager();

// Optionally preload sounds when module loads
// Uncomment to enable preloading (recommended for production)
// soundManager.preloadAll();
