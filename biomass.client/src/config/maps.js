// Google Maps API Configuration
export const MAPS_CONFIG = {
  // Replace this with your actual Google Maps API key
  API_KEY: 'AIzaSyD-9tSesB2zS2Fp0jxK8cttPOMXo6yNCKQ',
  
  // Default map center (Lahore, Pakistan)
  DEFAULT_CENTER: { lat: 31.5204, lng: 74.3587 },
  
  // Default zoom level
  DEFAULT_ZOOM: 12,
  
  // Map styles for a cleaner look
  MAP_STYLES: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }
  ],
  
  // Marker colors
  MARKER_COLORS: {
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#f093fb'
  }
};

// Global Google Maps loader to prevent multiple API loads
let googleMapsLoadingPromise = null;

export const loadGoogleMapsAPI = () => {
  console.log('loadGoogleMapsAPI called'); // Debug log
  console.log('API Key:', MAPS_CONFIG.API_KEY); // Debug log
  
  // If already loaded, return existing promise
  if (window.google && window.google.maps) {
    console.log('Google Maps already loaded'); // Debug log
    return Promise.resolve(window.google.maps);
  }
  
  // If already loading, return existing promise
  if (googleMapsLoadingPromise) {
    console.log('Google Maps already loading'); // Debug log
    return googleMapsLoadingPromise;
  }
  
  console.log('Creating new Google Maps loading promise'); // Debug log
  
  // Create new loading promise
  googleMapsLoadingPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists but API might not be ready yet
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          resolve(window.google.maps);
        } else {
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
      return;
    }
    
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places,geometry&loading=async`;
    script.async = true;
    script.defer = true;
    
    console.log('Adding Google Maps script to DOM'); // Debug log
    
    script.onload = () => {
      console.log('Google Maps script loaded successfully'); // Debug log
      // Wait for Google Maps to be fully initialized
      const checkGoogleMaps = () => {
        if (window.google && window.google.maps) {
          console.log('Google Maps API fully initialized'); // Debug log
          resolve(window.google.maps);
        } else {
          console.log('Waiting for Google Maps to initialize...'); // Debug log
          setTimeout(checkGoogleMaps, 100);
        }
      };
      checkGoogleMaps();
    };
    
    script.onerror = () => {
      console.error('Failed to load Google Maps script'); // Debug log
      googleMapsLoadingPromise = null;
      reject(new Error('Failed to load Google Maps API. Please check your API key in config/maps.js'));
    };
    
    document.head.appendChild(script);
  });
  
  return googleMapsLoadingPromise;
};

// Helper function to get the Google Maps API URL (deprecated, use loadGoogleMapsAPI instead)
export const getGoogleMapsApiUrl = () => {
  console.warn('getGoogleMapsApiUrl is deprecated. Use loadGoogleMapsAPI() instead.');
  return `https://maps.googleapis.com/maps/api/js?key=${MAPS_CONFIG.API_KEY}&libraries=places,geometry&loading=async`;
};

// Helper function to validate coordinates
export const isValidCoordinates = (lat, lng) => {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
};

// Helper function to parse coordinates from string
export const parseCoordinates = (latStr, lngStr) => {
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  
  if (isNaN(lat) || isNaN(lng) || !isValidCoordinates(lat, lng)) {
    return null;
  }
  
  return { lat, lng };
}; 