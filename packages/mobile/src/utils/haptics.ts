/**
 * Haptic feedback utility for mobile devices
 * Works best on Android Chrome
 */

export const HapticFeedback = {
  /**
   * Light tap feedback (50ms)
   * Use for: button presses, taps, mode switching
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },

  /**
   * Medium feedback (100ms)
   * Use for: confirmations, successful actions
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }
  },

  /**
   * Success pattern (short-pause-short)
   * Use for: successful pairing, completing actions
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 50, 50]);
    }
  },

  /**
   * Error pattern (long-pause-long)
   * Use for: errors, invalid actions
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100]);
    }
  },

  /**
   * Navigation feedback (30ms)
   * Use for: swipes, directional navigation
   */
  navigation: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },

  /**
   * Cancel all ongoing vibrations
   */
  cancel: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  },
};
