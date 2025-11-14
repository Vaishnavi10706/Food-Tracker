/* ============================================
   CONFIGURATION - API Keys and Settings
   ============================================ */

// API Configuration
// Note: For client-side apps, these values will be visible in the browser.
// Only use public API keys or keys meant for client-side use.

const CONFIG = {
  // OpenFoodFacts API (public, no key required)
  OPENFOODFACTS_API_BASE: 'https://world.openfoodfacts.org',
  
  // Optional: Add your API key here if OpenFoodFacts requires it in the future
  // OPENFOODFACTS_API_KEY: '',
  
  // Cache duration in milliseconds (1 hour)
  CACHE_DURATION: 1000 * 60 * 60,
  
  // Other API configurations can be added here
  // EXAMPLE_API_KEY: '',
  // EXAMPLE_API_BASE: '',
};

// Export for use in other files
// In a module system, you would use: export default CONFIG;
// For vanilla JS, CONFIG is available globally

