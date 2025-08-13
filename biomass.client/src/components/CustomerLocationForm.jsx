import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
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

export const CustomerLocationForm = ({ open, onClose, customerId, locationData = null, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: customerId,
    customerName: '',
    locationName: '',
    locationCode: '',
    address: '',
    latitude: '',
    longitude: '',
    centerDispatchWeightLimit: 22000,
    advancePercentageAllowed: 95,
    toleranceLimitPercentage: 1,
    toleranceLimitKg: 0,
    materialPenaltyRatePerKg: 9,
    dispatchLoadingChargesEnabled: false,
    dispatchChargeType: 'Fixed',
    fixedLoaderCost: 5000,
    variableChargeType: 'LoaderPerMaan',
    variableChargeAmount: 300,
    receivingUnloadingCostEnabled: false,
    receivingChargeType: 'Fixed',
    fixedUnloadingCost: 4000,
    receivingVariableChargeType: 'UnloadingPerMaan',
    receivingVariableChargeAmount: 250
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (locationData) {
      setFormData({
        ...locationData,
        customerId: customerId,
        customerName: locationData.customerName || '',
        toleranceLimitPercentage: locationData.toleranceLimitPercentage || 0,
        toleranceLimitKg: locationData.toleranceLimitKg || 0
      });
      setIsEditing(true);
    } else {
      setFormData({
        customerId: customerId,
        customerName: '',
        locationName: '',
        locationCode: '',
        address: '',
        latitude: '',
        longitude: '',
        centerDispatchWeightLimit: 22000,
        advancePercentageAllowed: 95,
        toleranceLimitPercentage: 1,
        toleranceLimitKg: 0,
        materialPenaltyRatePerKg: 9,
        dispatchLoadingChargesEnabled: false,
        dispatchChargeType: 'Fixed',
        fixedLoaderCost: 5000,
        variableChargeType: 'LoaderPerMaan',
        variableChargeAmount: 300,
        receivingUnloadingCostEnabled: false,
        receivingChargeType: 'Fixed',
        fixedUnloadingCost: 4000,
        receivingVariableChargeType: 'UnloadingPerMaan',
        receivingVariableChargeAmount: 250
      });
      setIsEditing(false);
    }
  }, [locationData, customerId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.customerName?.trim()) {
      alert('Customer Name is required');
      return;
    }
    if (!formData.locationName?.trim()) {
      alert('Location Name is required');
      return;
    }
    if (!formData.locationCode?.trim()) {
      alert('Location Code is required');
      return;
    }
    if (!formData.address?.trim()) {
      alert('Address is required');
      return;
    }
    if (!formData.customerId) {
      alert('Customer ID is required');
      return;
    }
    
    // Validate coordinates if provided
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        alert('Please enter valid numeric coordinates');
        return;
      }
      
      if (lat < -90 || lat > 90) {
        alert('Latitude must be between -90 and 90 degrees');
        return;
      }
      
      if (lng < -180 || lng > 180) {
        alert('Longitude must be between -180 and 180 degrees');
        return;
      }
    }

    try {
      const url = isEditing 
        ? `https://localhost:7084/api/customerlocations/${locationData.locationId}`
        : 'https://localhost:7084/api/customerlocations';
      
      const method = isEditing ? 'put' : 'post';
      
      // Convert camelCase to PascalCase for backend compatibility
      const backendData = {
        CustomerId: parseInt(formData.customerId) || 0,
        CustomerName: formData.customerName,
        LocationName: formData.locationName,
        LocationCode: formData.locationCode,
        Address: formData.address,
        Latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        Longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        CenterDispatchWeightLimit: formData.centerDispatchWeightLimit ? parseFloat(formData.centerDispatchWeightLimit) : null,
        AdvancePercentageAllowed: formData.advancePercentageAllowed ? parseFloat(formData.advancePercentageAllowed) : null,
        ToleranceLimitPercentage: formData.toleranceLimitPercentage ? parseFloat(formData.toleranceLimitPercentage) : null,
        ToleranceLimitKg: formData.toleranceLimitKg ? parseFloat(formData.toleranceLimitKg) : null,
        MaterialPenaltyRatePerKg: formData.materialPenaltyRatePerKg ? parseFloat(formData.materialPenaltyRatePerKg) : null,
        DispatchLoadingChargesEnabled: Boolean(formData.dispatchLoadingChargesEnabled),
        DispatchChargeType: formData.dispatchChargeType,
        FixedLoaderCost: formData.fixedLoaderCost ? parseFloat(formData.fixedLoaderCost) : null,
        VariableChargeType: formData.variableChargeType,
        VariableChargeAmount: formData.variableChargeAmount ? parseFloat(formData.variableChargeAmount) : null,
        ReceivingUnloadingCostEnabled: Boolean(formData.receivingUnloadingCostEnabled),
        ReceivingChargeType: formData.receivingChargeType,
        FixedUnloadingCost: formData.fixedUnloadingCost ? parseFloat(formData.fixedUnloadingCost) : null,
        ReceivingVariableChargeType: formData.receivingVariableChargeType,
        ReceivingVariableChargeAmount: formData.receivingVariableChargeAmount ? parseFloat(formData.receivingVariableChargeAmount) : null
      };

      const data = isEditing ? { ...backendData, Status: 'active' } : backendData;

      console.log('Sending data to backend:', data);

      const response = await axios[method](url, data);
      
      if (response.data.success) {
        onSave(response.data.result);
        onClose();
      } else {
        alert('Error saving location: ' + response.data.message);
      }
    } catch (error) {
      console.error('Error saving location:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        alert('Validation errors: ' + errorMessages);
      } else if (error.response?.data?.message) {
        alert('Error saving location: ' + error.response.data.message);
      } else if (error.response?.status === 400) {
        alert('Bad Request: Please check your input data. Error: ' + (error.response.data?.message || 'Unknown error'));
      } else {
        alert('Error saving location. Please try again. Status: ' + (error.response?.status || 'Unknown'));
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          maxHeight: '90vh',
          minWidth: '1400px'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#1976d2', 
        color: 'white',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6" fontWeight="bold">
          Customer Locations Form
        </Typography>
        <Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ mr: 1, bgcolor: 'white', color: '#1976d2', '&:hover': { bgcolor: '#f5f5f5' } }}
          >
            Save Customer location
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={onClose}
            sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' } }}
          >
            Cancel
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Customer Location Information Section */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Customer Location Information
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Manage customer details and delivery/collection locations
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Customer Name"
                placeholder="Enter customer name"
                value={formData.customerName}
                onChange={(e) => handleInputChange('customerName', e.target.value)}
                required
                sx={{ '& .MuiInputLabel-root': { '&.Mui-focused': { color: 'red' } } }}
              />
            </Grid>
            
          </Grid>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Delivery & Collection Locations Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Delivery & Collection Locations
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Configure location specific settings, freight rates, and penalty rates
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Location Details */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Location Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location/City Name"
                placeholder="Name"
                value={formData.locationName}
                onChange={(e) => handleInputChange('locationName', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Location Code"
                placeholder="HJ01"
                value={formData.locationCode}
                onChange={(e) => handleInputChange('locationCode', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Center Dispatch Weight Limit (kg)"
                type="number"
                value={formData.centerDispatchWeightLimit}
                onChange={(e) => handleInputChange('centerDispatchWeightLimit', parseFloat(e.target.value))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Advance Percentage allowed"
                type="number"
                value={formData.advancePercentageAllowed}
                onChange={(e) => handleInputChange('advancePercentageAllowed', parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: <Typography variant="body2">%</Typography>
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location Address"
                placeholder="Hujra Shah"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </Grid>

            {/* Tolerance and Penalty */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Tolerance and Penalty
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TextField
                  fullWidth
                  label="Tolerance Limit (%)"
                  type="number"
                  value={formData.toleranceLimitPercentage}
                  onChange={(e) => handleInputChange('toleranceLimitPercentage', parseFloat(e.target.value))}
                  disabled={!formData.toleranceLimitPercentage || formData.toleranceLimitPercentage === 0}
                  sx={{
                    '& .MuiInputBase-root': {
                      backgroundColor: formData.toleranceLimitPercentage > 0 ? '#f0f8ff' : '#f5f5f5'
                    }
                  }}
                  InputProps={{
                    endAdornment: <Typography variant="body2">%</Typography>
                  }}
                />
                <Switch
                  checked={formData.toleranceLimitPercentage > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleInputChange('toleranceLimitPercentage', 1);
                      handleInputChange('toleranceLimitKg', 0);
                    } else {
                      handleInputChange('toleranceLimitPercentage', 0);
                      handleInputChange('toleranceLimitKg', 1);
                    }
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {formData.toleranceLimitPercentage > 0 ? 'Percentage mode active' : 'Percentage mode disabled'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Tolerance Limit (kg)"
                type="number"
                value={formData.toleranceLimitKg}
                onChange={(e) => handleInputChange('toleranceLimitKg', parseFloat(e.target.value))}
                disabled={formData.toleranceLimitPercentage > 0}
                sx={{
                  '& .MuiInputBase-root': {
                    backgroundColor: formData.toleranceLimitPercentage === 0 ? '#f0f8ff' : '#f5f5f5'
                  }
                }}
                InputProps={{
                  endAdornment: <Typography variant="body2">kg</Typography>
                }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                {formData.toleranceLimitPercentage === 0 ? 'Kilogram mode active' : 'Kilogram mode disabled'}
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Material Penalty Rate/kg"
                type="number"
                value={formData.materialPenaltyRatePerKg}
                onChange={(e) => handleInputChange('materialPenaltyRatePerKg', parseFloat(e.target.value))}
                InputProps={{
                  endAdornment: <Typography variant="body2">Rs</Typography>
                }}
              />
            </Grid>

            {/* Dispatch Loading Charges */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Dispatch: Loading Charges
                </Typography>
                <Switch
                  checked={formData.dispatchLoadingChargesEnabled}
                  onChange={(e) => handleInputChange('dispatchLoadingChargesEnabled', e.target.checked)}
                />
              </Box>
            </Grid>
            
            {formData.dispatchLoadingChargesEnabled && (
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={formData.dispatchChargeType}
                  onChange={(e) => handleInputChange('dispatchChargeType', e.target.value)}
                >
                  <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                  <FormControlLabel value="Variable" control={<Radio />} label="Variable" />
                </RadioGroup>
                
                {/* Informational Note */}
                <Alert severity="info" sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Fixed or Variable cost will be fetched here.</strong> This will be fetched on the dispatch screen based on the customer location. 
                    <strong>CALCULATION WILL BE DONE ON THE BASIS OF FIXED OR VARIABLE.</strong>
                  </Typography>
                </Alert>
                
                {formData.dispatchChargeType === 'Fixed' && (
                  <TextField
                    fullWidth
                    label="Fixed Loader Cost"
                    type="number"
                    value={formData.fixedLoaderCost}
                    onChange={(e) => handleInputChange('fixedLoaderCost', parseFloat(e.target.value))}
                    sx={{ mt: 1 }}
                  />
                )}
                
                {formData.dispatchChargeType === 'Variable' && (
                  <Box sx={{ mt: 1 }}>
                    <RadioGroup
                      row
                      value={formData.variableChargeType}
                      onChange={(e) => handleInputChange('variableChargeType', e.target.value)}
                    >
                      <FormControlLabel value="LoaderPerMaan" control={<Radio />} label="Loader Per Maan" />
                      <FormControlLabel value="LaborPerMonth" control={<Radio />} label="Labor Per Month" />
                    </RadioGroup>
                    <TextField
                      fullWidth
                      label="Variable Charge Amount"
                      type="number"
                      value={formData.variableChargeAmount}
                      onChange={(e) => handleInputChange('variableChargeAmount', parseFloat(e.target.value))}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}

                {/* Calculation Examples */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  {formData.dispatchChargeType === 'Variable' && (
                    <Card sx={{ bgcolor: '#fff3cd', border: '1px solid #ffeaa7', maxWidth: 300 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Case1: Variable Per Maan Cost (Everything in Maan)
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          • Company Rate = 310 per ton<br/>
                          • Convert company rate to maan<br/>
                          • 310 × 25 = 7750 (Saffi Rate exclusive of all taxes)<br/>
                          • Per Maan<br/>
                          • Rate to Trolly owner = 300<br/>
                          • Loading/Bucket Charges = 10<br/>
                          • Labour charges = Rs 5<br/>
                          • Freight Charges = 285
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                  
                  {formData.dispatchChargeType === 'Fixed' && (
                    <Card sx={{ bgcolor: '#fff3cd', border: '1px solid #ffeaa7', maxWidth: 300 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                          Case3: Fixed Rate
                        </Typography>
                        <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                          • Company Rate = 310 per maan<br/>
                          • Convert company rate to maan<br/>
                          • 310 × 25 = 7750 (Saffi Rate exclusive of all taxes)<br/>
                          • Fixed Cost<br/>
                          • Rate to Trolly owner = 30500<br/>
                          • Loading/Bucket Charges = 5000<br/>
                          • Labour charges = Rs 3500<br/>
                          • Freight Charges = 285
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Box>
              </Grid>
            )}

            {/* Receiving Unloading Cost */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Receiving: Unloading Cost
                </Typography>
                <Switch
                  checked={formData.receivingUnloadingCostEnabled}
                  onChange={(e) => handleInputChange('receivingUnloadingCostEnabled', e.target.checked)}
                />
              </Box>
            </Grid>
            
            {formData.receivingUnloadingCostEnabled && (
              <Grid item xs={12}>
                <RadioGroup
                  row
                  value={formData.receivingChargeType}
                  onChange={(e) => handleInputChange('receivingChargeType', e.target.value)}
                >
                  <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                  <FormControlLabel value="Variable" control={<Radio />} label="Variable" />
                </RadioGroup>
                
                {formData.receivingChargeType === 'Fixed' && (
                  <TextField
                    fullWidth
                    label="Fixed Unloading Cost"
                    type="number"
                    value={formData.fixedUnloadingCost}
                    onChange={(e) => handleInputChange('fixedUnloadingCost', parseFloat(e.target.value))}
                    sx={{ mt: 1 }}
                  />
                )}
                
                {formData.receivingChargeType === 'Variable' && (
                  <Box sx={{ mt: 1 }}>
                    <RadioGroup
                      row
                      value={formData.receivingVariableChargeType}
                      onChange={(e) => handleInputChange('receivingVariableChargeType', e.target.value)}
                    >
                      <FormControlLabel value="UnloadingPerMaan" control={<Radio />} label="Unloading Per Maan" />
                      <FormControlLabel value="LaborPerMonth" control={<Radio />} label="Labor Per Month" />
                    </RadioGroup>
                    <TextField
                      fullWidth
                      label="Variable Charge Amount"
                      type="number"
                      value={formData.receivingVariableChargeAmount}
                      onChange={(e) => handleInputChange('receivingVariableChargeAmount', parseFloat(e.target.value))}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                )}
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, borderTop: '1px solid #e0e0e0' }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          size="large"
        >
          Add This Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerLocationForm; 