import React, { useState } from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import RatePopup from './RatePopup';

const RatePopupDemo = () => {
  const [open, setOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState({
    locationId: 1,
    locationName: 'Hujra Shah',
    customerId: 1,
    customerName: 'Demo Customer'
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (rateData) => {
    console.log('Rate saved:', rateData);
    // Handle the saved rate data here
    // You can update your local state, make API calls, etc.
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Rate Popup Demo
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Click the button below to open the Rate Popup with two tabs: Add Rate and Previous Rates
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          size="large"
          sx={{
            bgcolor: '#228B22',
            '&:hover': { bgcolor: '#006400' }
          }}
        >
          Open Rate Popup
        </Button>
      </Paper>

      <RatePopup
        open={open}
        onClose={handleClose}
        locationId={selectedLocation.locationId}
        locationName={selectedLocation.locationName}
        customerId={selectedLocation.customerId}
        customerName={selectedLocation.customerName}
        onSave={handleSave}
      />
    </Box>
  );
};

export default RatePopupDemo;
