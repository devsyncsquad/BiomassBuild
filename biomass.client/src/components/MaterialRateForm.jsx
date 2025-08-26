import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  Divider,
  Alert,
  Card,
  CardContent
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from 'axios';

export const MaterialRateForm = ({ open, onClose, customerId, locationId, locationName, customerName, materialRateData = null, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: customerId || '',
    locationId: locationId || '',
    effectiveDate: new Date().toISOString().split('T')[0],
    companyRate: 0,
    transporterRate: 0,
    route: '',
    materialType: 'Paper',
    status: 'Active'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      loadCustomers();
      if (customerId) {
        loadLocationsByCustomer(customerId);
      }
    }
  }, [open, customerId]);

  useEffect(() => {
    if (materialRateData) {
      setFormData({
        customerId: materialRateData.customerId || customerId || '',
        locationId: materialRateData.locationId || locationId || '',
        effectiveDate: materialRateData.effectiveDate ? new Date(materialRateData.effectiveDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        companyRate: materialRateData.companyRate || 0,
        transporterRate: materialRateData.transporterRate || 0,
        route: materialRateData.route || '',
        materialType: materialRateData.materialType || 'Paper',
        status: materialRateData.status || 'Active'
      });
      setIsEditing(true);
    } else {
      setFormData({
        customerId: customerId || '',
        locationId: locationId || '',
        effectiveDate: new Date().toISOString().split('T')[0],
        companyRate: 0,
        transporterRate: 0,
        route: '',
        materialType: 'Paper',
        status: 'Active'
      });
      setIsEditing(false);
    }
  }, [materialRateData, customerId, locationId]);

  const loadCustomers = async () => {
    try {
      const response = await axios.get('https://localhost:7084/api/customers/GetAllCustomers');
      if (response.data.success) {
        setCustomers(response.data.result);
      }
    } catch (error) {
      console.error('Error loading customers:', error);
    }
  };

  const loadLocationsByCustomer = async (customerId) => {
    if (!customerId) return;
    try {
      const response = await axios.get(`https://localhost:7084/api/customerlocations/GetLocationsByCustomerId/${customerId}`);
      if (response.data.success) {
        setLocations(response.data.result);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // If customer changes, reload locations
    if (field === 'customerId') {
      loadLocationsByCustomer(value);
      setFormData(prev => ({ ...prev, locationId: '' }));
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.customerId) {
      setError('Customer is required');
      return;
    }
    if (!formData.locationId) {
      setError('Location is required');
      return;
    }
    if (!formData.effectiveDate) {
      setError('Effective Date is required');
      return;
    }
    if (!formData.companyRate || formData.companyRate <= 0) {
      setError('Company Rate must be greater than 0');
      return;
    }
    if (!formData.transporterRate || formData.transporterRate <= 0) {
      setError('Transporter Rate must be greater than 0');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const url = isEditing 
        ? `https://localhost:7084/api/materialrates/UpdateMaterialRate/${materialRateData.rateId}`
        : 'https://localhost:7084/api/materialrates/CreateMaterialRate';
      
      const method = isEditing ? 'put' : 'post';
      
      // Convert camelCase to PascalCase for backend compatibility
      const backendData = {
        CustomerId: parseInt(formData.customerId),
        LocationId: parseInt(formData.locationId),
        EffectiveDate: new Date(formData.effectiveDate).toISOString(),
        CompanyRate: parseFloat(formData.companyRate),
        TransporterRate: parseFloat(formData.transporterRate),
        DispatchWeight: 0, // Default values as per existing model
        ReceivingWeight: 0,
        Route: formData.route,
        MaterialType: formData.materialType
      };

      const data = isEditing ? { ...backendData, Status: formData.status } : backendData;

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
            {locationName && `Location: ${locationName}`} {customerName && `| Customer: ${customerName}`}
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Customer</InputLabel>
              <Select
                value={formData.customerId}
                onChange={(e) => handleInputChange('customerId', e.target.value)}
                label="Customer"
                required
              >
                {customers.map((customer) => (
                  <MenuItem key={customer.customerId} value={customer.customerId}>
                    {customer.companyName || `${customer.firstName} ${customer.lastName}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.locationId}
                onChange={(e) => handleInputChange('locationId', e.target.value)}
                label="Location"
                required
                disabled={!formData.customerId}
              >
                {locations.map((location) => (
                  <MenuItem key={location.locationId} value={location.locationId}>
                    {location.locationName} ({location.locationCode})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
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
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Company Rate"
              type="number"
              value={formData.companyRate}
              onChange={(e) => handleInputChange('companyRate', parseFloat(e.target.value))}
              required
              InputProps={{
                startAdornment: <Typography variant="body2">Rs</Typography>
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Transporter Rate"
              type="number"
              value={formData.transporterRate}
              onChange={(e) => handleInputChange('transporterRate', parseFloat(e.target.value))}
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
          sx={{
            bgcolor: '#228B22',
            '&:hover': {
              bgcolor: '#006400',
            }
          }}
        >
          {loading ? 'Saving...' : (isEditing ? 'Update Rate' : 'Add Rate')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialRateForm;
