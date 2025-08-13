import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MapComponent = ({ locations = [], center = { lat: 31.5204, lng: 74.3587 }, zoom = 12 }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Create a custom map display
  const createCustomMap = (lat, lng, locationName, address) => {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          border: '2px solid #2196f3',
          overflow: 'hidden'
        }}
      >
        {/* Map-like background pattern */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(90deg, rgba(33,150,243,0.1) 1px, transparent 1px),
              linear-gradient(rgba(33,150,243,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
            opacity: 0.3
          }}
        />
        
        {/* Grid lines for map effect */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              linear-gradient(90deg, rgba(33,150,243,0.05) 1px, transparent 1px),
              linear-gradient(rgba(33,150,243,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            opacity: 0.5
          }}
        />
        
        {/* Location marker */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            textAlign: 'center',
            backgroundColor: 'rgba(255,255,255,0.9)',
            borderRadius: 3,
            px: 3,
            py: 2,
            boxShadow: 3,
            border: '2px solid #2196f3'
          }}
        >
          <LocationOnIcon 
            sx={{ 
              fontSize: 60, 
              color: '#f44336',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              mb: 1
            }} 
          />
          
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 'bold',
              color: '#1976d2',
              textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
              mb: 1
            }}
          >
            {locationName || 'Location'}
          </Typography>
          
          {address && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#424242',
                mb: 1,
                maxWidth: '300px',
                textAlign: 'center'
              }}
            >
              {address}
            </Typography>
          )}
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#424242',
              backgroundColor: 'rgba(255,255,255,0.8)',
              px: 2,
              py: 0.5,
              borderRadius: 1,
              fontWeight: 'bold',
              border: '1px solid #2196f3'
            }}
          >
            Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
          </Typography>
        </Box>

        {/* Compass indicator */}
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.95)',
            borderRadius: '50%',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #2196f3',
            boxShadow: 2
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
            N
          </Typography>
        </Box>

        {/* Scale indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            backgroundColor: 'rgba(255,255,255,0.95)',
            px: 2,
            py: 1,
            borderRadius: 2,
            border: '2px solid #2196f3',
            boxShadow: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
            Scale: 1:{(1000000 / Math.pow(2, zoom)).toFixed(0)}
          </Typography>
        </Box>

        {/* Zoom level indicator */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            backgroundColor: 'rgba(255,255,255,0.95)',
            px: 2,
            py: 1,
            borderRadius: 2,
            border: '2px solid #2196f3',
            boxShadow: 2
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
            Zoom: {zoom}
          </Typography>
        </Box>
      </Box>
    );
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          height: '100%',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress sx={{ color: 'white', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Loading Map...
          </Typography>
          <Typography variant="body2">
            Please wait while the map loads
          </Typography>
        </Box>
      </Box>
    );
  }

  // Get the first location or use center coordinates
  const location = locations.length > 0 ? locations[0] : null;
  const lat = location ? parseFloat(location.latitude || location.Latitude) : center.lat;
  const lng = location ? parseFloat(location.longitude || location.Longitude) : center.lng;
  const locationName = location ? (location.locationName || location.LocationName) : 'Location';
  const address = location ? (location.address || location.Address) : '';

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: '400px' }}>
      {createCustomMap(lat, lng, locationName, address)}
    </Box>
  );
};

export default MapComponent; 