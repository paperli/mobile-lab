/**
 * Haptic feedback utility for mobile devices
 * Works best on Android Chrome
 */

export const HapticFeedback = {
  /**
   * Light tap feedback (20ms)
   * Use for: button presses, taps, mode switching
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Medium feedback (40ms)
   * Use for: confirmations, successful actions
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(40);
    }
  },

  /**
   * Success pattern (short-pause-short)
   * Use for: successful pairing, completing actions
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 30, 30]);
    }
  },

  /**
   * Error pattern (long-pause-long)
   * Use for: errors, invalid actions
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }
  },

  /**
   * Navigation feedback (15ms)
   * Use for: swipes, directional navigation
   */
  navigation: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(15);
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
