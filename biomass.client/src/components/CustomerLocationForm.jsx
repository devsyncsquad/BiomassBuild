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
  CardContent,
  Select,
  MenuItem
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
    // Labour Charges
    laborChargesEnabled: false,
    laborChargeType: 'Fixed',
    laborChargesCost: 3500,
    receivingUnloadingCostEnabled: false,
    receivingChargeType: 'Fixed',
    fixedUnloadingCost: 4000,
    receivingVariableChargeType: 'UnloadingPerMaan',
    receivingVariableChargeAmount: 250
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Check if we have a complete location object with locationId (editing existing)
    const isEditingExisting = locationData && locationData.locationId;
    
    console.log('CustomerLocationForm useEffect:', {
      locationData,
      customerId,
      isEditingExisting,
      hasLocationId: locationData?.locationId
    });
    
    if (isEditingExisting) {
      setFormData({
        ...locationData,
        customerId: customerId,
        customerName: locationData.customerName || '',
        toleranceLimitPercentage: locationData.toleranceLimitPercentage || 0,
        toleranceLimitKg: locationData.toleranceLimitKg || 0
      });
      setIsEditing(true);
      console.log('Setting form to EDIT mode for existing location');
    } else {
      // This is a new location or just has customerName from handleAddLocation
      setFormData({
        customerId: customerId,
        customerName: locationData?.customerName || '', // Use customerName if provided
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
        // Labour Charges
        laborChargesEnabled: false,
        laborChargeType: 'Fixed',
        laborChargesCost: 3500,
        receivingUnloadingCostEnabled: false,
        receivingChargeType: 'Fixed',
        fixedUnloadingCost: 4000,
        receivingVariableChargeType: 'UnloadingPerMaan',
        receivingVariableChargeAmount: 250
      });
      setIsEditing(false);
      console.log('Setting form to NEW location mode');
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
      // Determine if this is a new location or an edit
      const isNewLocation = !locationData || !locationData.locationId;
      
      const url = isNewLocation 
        ? 'http://100.42.177.77:88/api/customerlocations/CreateLocation'
        : `http://100.42.177.77:88/api/customerlocations/UpdateLocation/${locationData.locationId}`;
      
      const method = isNewLocation ? 'post' : 'put';
      
      // Convert camelCase to PascalCase for backend compatibility
      const backendData = {
        CustomerId: parseInt(formData.customerId) || 0,
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
        LaborChargesEnabled: Boolean(formData.laborChargesEnabled),
        LaborChargeType: formData.laborChargeType,
        LaborChargesCost: formData.laborChargesCost ? parseFloat(formData.laborChargesCost) : null,
        ReceivingUnloadingCostEnabled: Boolean(formData.receivingUnloadingCostEnabled),
        ReceivingChargeType: formData.receivingChargeType,
        FixedUnloadingCost: formData.fixedUnloadingCost ? parseFloat(formData.fixedUnloadingCost) : null,
        ReceivingVariableChargeType: formData.receivingVariableChargeType,
        ReceivingVariableChargeAmount: formData.receivingVariableChargeAmount ? parseFloat(formData.receivingVariableChargeAmount) : null
      };

      // Only add Status for edit operations
      const data = isNewLocation ? backendData : { ...backendData, Status: 'active' };

      console.log('Sending data to backend:', data);
      console.log('Request method:', method.toUpperCase());
      console.log('Request URL:', url);
      console.log('Is new location:', isNewLocation);

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
      } else if (error.response?.status === 404) {
        alert('Not Found: The requested resource was not found. Please check the URL and try again.');
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
          margin: '16px'
        }
      }}
    >
      <DialogTitle sx={{ 
        backgroundColor: '#228B22', 
        color: 'white',
        borderBottom: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 1
      }}>
        <Typography variant="h6" fontWeight="bold" sx={{ color: 'white' }}>
          Customer Locations Form
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          
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
                value={formData.customerName}
                InputProps={{
                  readOnly: true,
                }}
                sx={{ 
                  '& .MuiInputBase-root': {
                    backgroundColor: '#f5f5f5',
                    '&.Mui-focused': {
                      backgroundColor: '#f5f5f5'
                    }
                  }
                }}
                helperText="Customer name is read-only and will be saved with the location"
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
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Location/City Name"
                placeholder="Name"
                value={formData.locationName}
                onChange={(e) => handleInputChange('locationName', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Location Code"
                placeholder="HJ01"
                value={formData.locationCode}
                onChange={(e) => handleInputChange('locationCode', e.target.value)}
                required
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Center Dispatch Weight Limit (kg)"
                type="number"
                value={formData.centerDispatchWeightLimit}
                onChange={(e) => handleInputChange('centerDispatchWeightLimit', parseFloat(e.target.value))}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
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
            
            <Grid item xs={12} sm={6} md={4}>
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
            
            <Grid item xs={12} sm={6} md={4}>
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
            
            <Grid item xs={12} sm={6} md={4}>
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

            {/* Cost Management Section - All in One Row */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Cost Management
              </Typography>
            </Grid>
            
            {/* Dispatch Loading Charges */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                p: 2, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    Dispatch: Loading Charges
                  </Typography>
                  <Switch
                    size="small"
                    checked={formData.dispatchLoadingChargesEnabled}
                    onChange={(e) => handleInputChange('dispatchLoadingChargesEnabled', e.target.checked)}
                  />
                </Box>
                
                {formData.dispatchLoadingChargesEnabled && (
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Loader cost:
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={formData.dispatchChargeType}
                          onChange={(e) => handleInputChange('dispatchChargeType', e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="Fixed">Fixed</MenuItem>
                          <MenuItem value="Variable">Variable</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    
                    {formData.dispatchChargeType === 'Fixed' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Fixed Amount"
                        type="number"
                        value={formData.fixedLoaderCost}
                        onChange={(e) => handleInputChange('fixedLoaderCost', parseFloat(e.target.value))}
                        sx={{ mt: 1 }}
                      />
                    )}
                    
                    {formData.dispatchChargeType === 'Variable' && (
                      <Box sx={{ mt: 1 }}>
                        <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                          <Select
                            value={formData.variableChargeType}
                            onChange={(e) => handleInputChange('variableChargeType', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="LoaderPerMaan">Loader Per Maan</MenuItem>
                            <MenuItem value="LaborPerMonth">Labor Per Month</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          size="small"
                          label="Variable Amount"
                          type="number"
                          value={formData.variableChargeAmount}
                          onChange={(e) => handleInputChange('variableChargeAmount', parseFloat(e.target.value))}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Labour Charges */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                p: 2, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    Labor Cost
                  </Typography>
                  <Switch
                    size="small"
                    checked={formData.laborChargesEnabled}
                    onChange={(e) => handleInputChange('laborChargesEnabled', e.target.checked)}
                  />
                </Box>
                
                {formData.laborChargesEnabled && (
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={formData.laborChargeType}
                          onChange={(e) => handleInputChange('laborChargeType', e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="Fixed">Fixed</MenuItem>
                          <MenuItem value="Variable">Variable</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    
                    {formData.laborChargeType === 'Fixed' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Fixed Amount"
                        type="number"
                        value={formData.laborChargesCost}
                        onChange={(e) => handleInputChange('laborChargesCost', parseFloat(e.target.value))}
                        sx={{ mt: 1 }}
                      />
                    )}
                    
                    {formData.laborChargeType === 'Variable' && (
                      <Box sx={{ mt: 1 }}>
                        <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                          <Select
                            value={formData.variableChargeType}
                            onChange={(e) => handleInputChange('variableChargeType', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="LoaderPerMaan">Loader Per Maan</MenuItem>
                            <MenuItem value="LaborPerMonth">Labor Per Month</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          size="small"
                          label="Variable Amount"
                          type="number"
                          value={formData.variableChargeAmount}
                          onChange={(e) => handleInputChange('variableChargeAmount', parseFloat(e.target.value))}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>

            {/* Receiving Unloading Cost */}
            <Grid item xs={12} sm={6} md={4}>
              <Box sx={{ 
                border: '1px solid #e0e0e0', 
                borderRadius: 2, 
                p: 2, 
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold" color="primary">
                    Receiving: Unloading Cost
                  </Typography>
                  <Switch
                    size="small"
                    checked={formData.receivingUnloadingCostEnabled}
                    onChange={(e) => handleInputChange('receivingUnloadingCostEnabled', e.target.checked)}
                  />
                </Box>
                
                {formData.receivingUnloadingCostEnabled && (
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="body2" fontWeight="medium">
                        Unloading Cost:
                      </Typography>
                      <FormControl size="small" sx={{ minWidth: 100 }}>
                        <Select
                          value={formData.receivingChargeType}
                          onChange={(e) => handleInputChange('receivingChargeType', e.target.value)}
                          displayEmpty
                        >
                          <MenuItem value="Fixed">Fixed</MenuItem>
                          <MenuItem value="Variable">Variable</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    
                    {formData.receivingChargeType === 'Fixed' && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Fixed Amount"
                        type="number"
                        value={formData.fixedUnloadingCost}
                        onChange={(e) => handleInputChange('fixedUnloadingCost', parseFloat(e.target.value))}
                        sx={{ mt: 1 }}
                      />
                    )}
                    
                    {formData.receivingChargeType === 'Variable' && (
                      <Box sx={{ mt: 1 }}>
                        <FormControl size="small" fullWidth sx={{ mb: 1 }}>
                          <Select
                            value={formData.receivingVariableChargeType}
                            onChange={(e) => handleInputChange('receivingVariableChargeType', e.target.value)}
                            displayEmpty
                          >
                            <MenuItem value="UnloadingPerMaan">Unloading Per Maan</MenuItem>
                            <MenuItem value="LaborPerMonth">Labor Per Month</MenuItem>
                          </Select>
                        </FormControl>
                        <TextField
                          fullWidth
                          size="small"
                          label="Variable Amount"
                          type="number"
                          value={formData.receivingVariableChargeAmount}
                          onChange={(e) => handleInputChange('receivingVariableChargeAmount', parseFloat(e.target.value))}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </Grid>
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
          sx={{
            bgcolor: '#228B22',
            '&:hover': {
              bgcolor: '#006400',
            }
          }}
        >
          Add This Location
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomerLocationForm; 