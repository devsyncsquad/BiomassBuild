// Application Configuration
// Update this file to change API endpoints for different environments

export const config = {
  // API Configuration
  api: {
    // Base URL for API calls
    // For development: 'http://100.42.177.77:88/api'
    // For production: 'https://your-production-domain.com/api'
    //baseUrl: "http://100.42.177.77:88/api",
    baseUrl: "http://100.42.177.77:88/api",

    // Timeout for API requests (in milliseconds)
    timeout: 30000,

    // Retry configuration
    retry: {
      attempts: 3,
      delay: 1000,
    },
  },

  // Application Configuration
  app: {
    name: "Biomass Portal",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
  },
};

// Helper function to get API base URL
export const getApiBaseUrl = () => {
  // Check for environment variable first (Vite format)
  if (import.meta.env.VITE_LIVE_APP_BASEURL) {
    return import.meta.env.VITE_LIVE_APP_BASEURL;
  }

  // In development, use relative URLs to leverage Vite proxy
  if (import.meta.env.DEV) {
    return '/api';
  }

  // Fallback to config file for production
  return config.api.baseUrl;
};

// Export default config
export default config;
