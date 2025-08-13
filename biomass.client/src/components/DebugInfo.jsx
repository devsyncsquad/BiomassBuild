import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const DebugInfo = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Debug Information
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Token:</strong> {token ? 'Present' : 'Not found'}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>User Data:</strong> {userData ? 'Present' : 'Not found'}
        </Typography>
        
        {userData && (
          <Typography variant="body2" sx={{ mb: 2, fontFamily: 'monospace', fontSize: '0.8rem' }}>
            <strong>User Data Content:</strong><br />
            {userData}
          </Typography>
        )}
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          <strong>Current URL:</strong> {window.location.href}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => window.location.href = '/dashboard'}
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          
          <Button 
            variant="contained" 
            color="secondary" 
            onClick={() => window.location.href = '/login'}
            sx={{ mr: 2 }}
          >
            Go to Login
          </Button>
          
          <Button 
            variant="outlined" 
            color="error" 
            onClick={clearStorage}
          >
            Clear Storage
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default DebugInfo; 