/**
 * Haptic feedback utility for mobile devices
 * Works best on Android Chrome
 */

export const HapticFeedback = {
  /**
   * Light tap feedback (10ms)
   * Use for: button presses, taps, mode switching
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },

  /**
   * Medium feedback (25ms)
   * Use for: confirmations, successful actions
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Success pattern (short-pause-short)
   * Use for: successful pairing, completing actions
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([15, 15, 15]);
    }
  },

  /**
   * Error pattern (long-pause-long)
   * Use for: errors, invalid actions
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([25, 15, 25]);
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
