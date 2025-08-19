import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

const MaterialRateForm = ({ open, onClose, locationId, locationName, customerId, materialRateData = null, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: customerId,
    locationId: locationId,
    effectiveDate: new Date().toISOString().split('T')[0],
    buyingRate: 0,
    sellingRate: 0,
    route: '',
    materialType: 'Paper',
    dispatchWeight: 0,
    receivingWeight: 0
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (materialRateData) {
      setFormData({
        customerId: customerId,
        locationId: locationId,
        effectiveDate: materialRateData.effectiveDate ? new Date(materialRateData.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        buyingRate: materialRateData.buyingRate || 0,
        sellingRate: materialRateData.sellingRate || 0,
        route: materialRateData.route || '',
        materialType: materialRateData.materialType || 'Paper',
        dispatchWeight: materialRateData.dispatchWeight || 0,
        receivingWeight: materialRateData.receivingWeight || 0
      });
      setIsEditing(true);
    } else {
      setFormData({
        customerId: customerId,
        locationId: locationId,
        effectiveDate: new Date().toISOString().split('T')[0],
        buyingRate: 0,
        sellingRate: 0,
        route: '',
        materialType: 'Paper',
        dispatchWeight: 0,
        receivingWeight: 0
      });
      setIsEditing(false);
    }
  }, [materialRateData, locationId, customerId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.customerId) {
      setError('Customer ID is required');
      return;
    }
    if (!formData.locationId) {
      setError('Location ID is required');
      return;
    }
    if (!formData.effectiveDate) {
      setError('Effective Date is required');
      return;
    }
    if (!formData.buyingRate || formData.buyingRate <= 0) {
      setError('Buying Rate must be greater than 0');
      return;
    }
    if (!formData.sellingRate || formData.sellingRate <= 0) {
      setError('Selling Rate must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = isEditing 
        ? `https://localhost:7084/api/materialrates/${materialRateData.rateId}`
        : 'https://localhost:7084/api/materialrates';
      
      const method = isEditing ? 'put' : 'post';
      
      // Convert camelCase to PascalCase for backend compatibility
      const backendData = {
        CustomerId: parseInt(formData.customerId),
        LocationId: parseInt(formData.locationId),
        EffectiveDate: new Date(formData.effectiveDate).toISOString(),
        BuyingRate: parseFloat(formData.buyingRate),
        SellingRate: parseFloat(formData.sellingRate),
        Route: formData.route,
        MaterialType: formData.materialType,
        DispatchWeight: formData.dispatchWeight ? parseFloat(formData.dispatchWeight) : null,
        ReceivingWeight: formData.receivingWeight ? parseFloat(formData.receivingWeight) : null
      };

      const data = isEditing ? { ...backendData, Status: 'active' } : backendData;

      console.log('Sending material rate data to backend:', data);

      const response = await axios[method](url, data);
      
      if (response.data.success) {
        onSave(response.data.result);
        onClose();
      } else {
        setError('Error saving material rate: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error saving material rate:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        setError('Validation errors: ' + errorMessages);
      } else if (error.response?.data?.message) {
        setError('Error saving material rate: ' + error.response.data.message);
      } else if (error.response?.status === 400) {
        setError('Bad Request: Please check your input data. Error: ' + (error.response.data?.message || 'Unknown error'));
      } else {
        setError('Error saving material rate. Please try again. Status: ' + (error.response?.status || 'Unknown'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#228B22', 
        color: 'white',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          {isEditing ? 'Edit Material Rate' : 'Add Material Rate'}
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={loading}
            sx={{ mr: 1, bgcolor: 'white', color: '#228B22', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            {loading ? 'Saving...' : 'Save Rate'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onClose}
            disabled={loading}
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Cancel
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Material Rate Information
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {locationName && `Location: ${locationName}`}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Effective Date"
              type="date"
              value={formData.effectiveDate}
              onChange={(e) => handleInputChange('effectiveDate', e.target.value)}
              required
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Buying Rate"
              type="number"
              value={formData.buyingRate}
              onChange={(e) => handleInputChange('buyingRate', parseFloat(e.target.value))}
              required
              InputProps={{
                startAdornment: <Typography variant="body2">Rs</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Selling Rate"
              type="number"
              value={formData.sellingRate}
              onChange={(e) => handleInputChange('sellingRate', parseFloat(e.target.value))}
              required
              InputProps={{
                startAdornment: <Typography variant="body2">Rs</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Route"
              value={formData.route}
              onChange={(e) => handleInputChange('route', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Material Type</InputLabel>
              <Select
                value={formData.materialType}
                onChange={(e) => handleInputChange('materialType', e.target.value)}
                label="Material Type"
              >
                <MenuItem value="Paper">Paper</MenuItem>
                <MenuItem value="Plastic">Plastic</MenuItem>
                <MenuItem value="Glass">Glass</MenuItem>
                <MenuItem value="Metal">Metal</MenuItem>
                <MenuItem value="Textile">Textile</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Dispatch Weight"
              type="number"
              value={formData.dispatchWeight}
              onChange={(e) => handleInputChange('dispatchWeight', parseFloat(e.target.value))}
              InputProps={{
                endAdornment: <Typography variant="body2">kg</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Receiving Weight"
              type="number"
              value={formData.receivingWeight}
              onChange={(e) => handleInputChange('receivingWeight', parseFloat(e.target.value))}
              InputProps={{
                endAdornment: <Typography variant="body2">kg</Typography>
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={loading}
          size="large"
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Rate' : 'Add Rate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialRateForm;
