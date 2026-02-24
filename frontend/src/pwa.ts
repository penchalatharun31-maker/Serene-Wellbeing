/**
 * Progressive Web App (PWA) Service Worker Registration
 *
 * This file handles PWA service worker registration and update notifications.
 * The VitePWA plugin automatically generates the service worker, but this file
 * provides additional control and user notifications for updates.
 */

// Import the service worker registration from vite-plugin-pwa/client
import { registerSW } from 'virtual:pwa-register';

// Register the service worker with auto-update
const updateSW = registerSW({
  onNeedRefresh() {
    // When a new version is available, notify the user
    if (confirm('New version available! Click OK to update.')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    // Notify user that the app is ready for offline use
    console.log('App is ready for offline use!');
  },
  onRegistered(registration) {
    // Log successful registration
    console.log('Service Worker registered successfully');

    // Check for updates every hour
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000); // 1 hour
    }
  },
  onRegisterError(error) {
    console.error('Service Worker registration failed:', error);
  },
});

// Listen for online/offline events
window.addEventListener('online', () => {
  console.log('App is back online');
});

window.addEventListener('offline', () => {
  console.log('App is offline - using cached content');
});

// Export for potential manual updates
export { updateSW };
