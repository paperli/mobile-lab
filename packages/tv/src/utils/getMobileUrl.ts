/**
 * Dynamically determines the mobile app URL based on the current environment
 *
 * Logic:
 * - If on Render production (*.onrender.com), returns Render mobile URL (ignores VITE_MOBILE_URL)
 * - If on local network (192.168.x.x or similar), returns the same IP with mobile port
 * - If on localhost, returns localhost with mobile port or VITE_MOBILE_URL if configured
 */
export function getMobileUrl(): string {
  const currentHost = window.location.hostname;
  const currentProtocol = window.location.protocol;

  // PRIORITY 1: Check if we're on Render production
  // This should always take precedence over VITE_MOBILE_URL
  if (currentHost.includes('onrender.com')) {
    // Extract the app name and construct mobile URL
    // e.g., mobile-lab-tv.onrender.com -> mobile-lab-mobile.onrender.com
    const renderMobileUrl = currentHost.replace('mobile-lab-tv', 'mobile-lab-mobile');
    return `${currentProtocol}//${renderMobileUrl}`;
  }

  // PRIORITY 2: Check if we're on localhost
  if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
    // Use environment variable if set, otherwise default to localhost:5174
    const envMobileUrl = import.meta.env.VITE_MOBILE_URL;
    if (envMobileUrl) {
      return envMobileUrl;
    }
    return `${currentProtocol}//localhost:5174`;
  }

  // PRIORITY 3: For local network access (192.168.x.x, 10.x.x.x, etc.)
  // Use the same IP address but with mobile port (5174)
  // Handle both cases: with and without port in hostname
  const hostWithoutPort = currentHost.split(':')[0];
  return `${currentProtocol}//${hostWithoutPort}:5174`;
}
