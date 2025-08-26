import React, { useState, useEffect, useMemo } from 'react';
import { useVendors } from '../../hooks/useVendors';
import { useLookupsByDomain } from '../../hooks/useLookups';
import { useCostCenters } from '../../hooks/useCostCenters';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Divider,
  FormControlLabel,
  Checkbox,
  IconButton,
  FormHelperText,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
} from '@mui/icons-material';

const VehicleForm = ({ open, onClose, vehicle }) => {
  const { data: vendorsData, isLoading: isLoadingVendors } = useVendors();
  const { data: vehicleTypesData, isLoading: isLoadingVehicleTypes } = useLookupsByDomain('VehicleType');
  const { data: costCentersData, isLoading: isLoadingCostCenters } = useCostCenters();
  const [vehicleData, setVehicleData] = useState({
    vehicleType: '',
    vehicleNumber: '',
    vehicleRegNumber: '',
    vendorId: '',
    fuelType: '',
    capacity: '',
    status: 'Active',
    addToCostCenter: false,
    costCenter: '',
    expenseName: ''
  });

  // Find default cost center
  const defaultCostCenter = useMemo(() => {
    if (!costCentersData?.result) return null;
    return costCentersData.result.find(cc => 
      cc.code.toLowerCase() === 'vendor-vehicles' && cc.isActive
    );
  }, [costCentersData?.result]);

  // Auto-generate expense name
  const generateExpenseName = useMemo(() => {
    if (!vehicleData.addToCostCenter) return '';
    
    const vehicleNumber = vehicleData.vehicleNumber?.trim() || '';
    const vendor = vendorsData?.result?.find(v => v.vendorId === vehicleData.vendorId);
    const vendorName = vendor?.vendorName?.trim() || '';
    
    if (!vehicleNumber && !vendorName) return '';
    return `${vehicleNumber}${vendorName ? ` - ${vendorName}` : ''}`.trim();
  }, [vehicleData.vehicleNumber, vehicleData.vendorId, vendorsData?.result, vehicleData.addToCostCenter]);

  const [driverData, setDriverData] = useState({
    fullName: '',
    licenseNumber: '',
    cnic: '',
    phoneNumber: '',
    address: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  // Update expense name when relevant fields change
  useEffect(() => {
    if (vehicleData.addToCostCenter) {
      setVehicleData(prev => ({
        ...prev,
        expenseName: generateExpenseName
      }));
    }
  }, [generateExpenseName, vehicleData.addToCostCenter]);

  // Set default cost center when checkbox is checked
  useEffect(() => {
    if (vehicleData.addToCostCenter && defaultCostCenter && !vehicleData.costCenter) {
      setVehicleData(prev => ({
        ...prev,
        costCenter: defaultCostCenter.code
      }));
    }
  }, [vehicleData.addToCostCenter, defaultCostCenter]);

  useEffect(() => {
    if (vehicle) {
      setVehicleData({
        vehicleType: vehicle.vehicleType || '',
        vehicleNumber: vehicle.vehicleNumber || '',
        vehicleRegNumber: vehicle.vehicleRegNumber || '',
        vendorId: vehicle.vendorId || '',
        fuelType: vehicle.fuelType || '',
        capacity: vehicle.capacity || '',
        status: vehicle.status || 'Active',
        addToCostCenter: false,
        costCenter: '',
        expenseName: ''
      });
      if (vehicle.driver) {
        setDriverData({
          fullName: vehicle.driver.fullName || '',
          cnic: vehicle.driver.cnic || '',
          licenseNumber: vehicle.driver.licenseNumber || '',
          phoneNumber: vehicle.driver.phoneNumber || '',
          address: vehicle.driver.address || '',
          status: vehicle.driver.status || 'Active'
        });
      }
    }
  }, [vehicle]);

  const handleVehicleChange = (field) => (event) => {
    setVehicleData({
      ...vehicleData,
      [field]: event.target.value
    });
    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: ''
      });
    }
  };

  const handleDriverChange = (field) => (event) => {
    setDriverData({
      ...driverData,
      [field]: event.target.value
    });
    // Clear error when user types
    if (errors[`driver_${field}`]) {
      setErrors({
        ...errors,
        [`driver_${field}`]: ''
      });
    }
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setVehicleData({
        ...vehicleData,
        vehiclePhoto: file
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Vehicle Validation
    if (!vehicleData.vehicleType) newErrors.vehicleType = 'Vehicle type is required';
    if (!vehicleData.vehicleNumber) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!vehicleData.fuelType) newErrors.fuelType = 'Fuel type is required';
    if (!vehicleData.status) newErrors.status = 'Status is required';

    // Driver Validation
    if (!driverData.fullName) newErrors.driver_fullName = 'Driver name is required';
    if (!driverData.licenseNumber) newErrors.driver_licenseNumber = 'License number is required';
    if (driverData.cnic && !/^\d{13}$|^\d{5}-\d{7}-\d$/.test(driverData.cnic)) {
      newErrors.driver_cnic = 'Invalid CNIC format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        const payload = {
          ...vehicleData,
          driver: driverData.fullName ? {
            fullName: driverData.fullName,
            cnic: driverData.cnic,
            licenseNumber: driverData.licenseNumber,
            phoneNumber: driverData.phoneNumber,
            address: driverData.address,
            status: driverData.status
          } : null
        };

        if (vehicle) {
          await updateVehicle(vehicle.vehicleId, payload);
        } else {
          await createVehicle(payload);
        }

        onClose();
      } catch (error) {
        console.error('Error saving vehicle:', error);
        // TODO: Show error message
      }
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#228B22', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h6">
          {vehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Vehicle Information */}
        <Typography variant="h6" sx={{ mb: 2, color: '#228B22', fontWeight: 600 }}>
          Vehicle Information
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
                          <FormControl fullWidth error={!!errors.vehicleType}>
              <InputLabel>Vehicle Type *</InputLabel>
              <Select
                value={vehicleData.vehicleType}
                onChange={handleVehicleChange('vehicleType')}
                label="Vehicle Type *"
                disabled={isLoadingVehicleTypes}
              >
                <MenuItem value="">Select Vehicle Type</MenuItem>
                {vehicleTypesData?.result?.map((type) => (
                  <MenuItem key={type.lookupId} value={type.lookupName}>
                    {type.lookupName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vehicle Number *"
              value={vehicleData.vehicleNumber}
              onChange={handleVehicleChange('vehicleNumber')}
              error={!!errors.vehicleNumber}
              helperText={errors.vehicleNumber}
            />
          </Grid>
          <Grid item xs={12} md={6}>
                          <FormControl fullWidth>
              <InputLabel>Vendor</InputLabel>
              <Select
                value={vehicleData.vendorId}
                onChange={handleVehicleChange('vendorId')}
                label="Vendor"
                disabled={isLoadingVendors}
              >
                <MenuItem value="">None</MenuItem>
                {vendorsData?.result?.map((vendor) => (
                  <MenuItem key={vendor.vendorId} value={vendor.vendorId}>
                    {vendor.vendorName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Fuel Type *"
              value={vehicleData.fuelType}
              onChange={handleVehicleChange('fuelType')}
              error={!!errors.fuelType}
              helperText={errors.fuelType}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Capacity"
              type="number"
              value={vehicleData.capacity}
              onChange={handleVehicleChange('capacity')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth error={!!errors.status}>
              <InputLabel>Status *</InputLabel>
              <Select
                value={vehicleData.status}
                onChange={handleVehicleChange('status')}
                label="Status *"
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { borderColor: '#228B22' }
              }}
              onClick={() => document.getElementById('vehiclePhoto').click()}
            >
              <input
                id="vehiclePhoto"
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoUpload}
              />
              <UploadIcon sx={{ fontSize: 40, color: '#666', mb: 1 }} />
              <Typography>
                {vehicleData.vehiclePhoto ? vehicleData.vehiclePhoto.name : 'Click to upload vehicle photo'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Driver Information */}
        <Typography variant="h6" sx={{ mb: 2, color: '#228B22', fontWeight: 600 }}>
          Driver Information
        </Typography>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Full Name *"
              value={driverData.fullName}
              onChange={handleDriverChange('fullName')}
              error={!!errors.driver_fullName}
              helperText={errors.driver_fullName}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="License Number *"
              value={driverData.licenseNumber}
              onChange={handleDriverChange('licenseNumber')}
              error={!!errors.driver_licenseNumber}
              helperText={errors.driver_licenseNumber}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="CNIC"
              value={driverData.cnic}
              onChange={handleDriverChange('cnic')}
              error={!!errors.driver_cnic}
              helperText={errors.driver_cnic || 'Format: 12345-1234567-1'}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone Number"
              value={driverData.phoneNumber}
              onChange={handleDriverChange('phoneNumber')}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={driverData.address}
              onChange={handleDriverChange('address')}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Cost Center Section */}
        <FormControlLabel
          control={
            <Checkbox
              checked={vehicleData.addToCostCenter}
              onChange={(e) => setVehicleData(prev => ({ 
                ...prev, 
                addToCostCenter: e.target.checked,
                costCenter: e.target.checked && defaultCostCenter ? defaultCostCenter.code : '',
                expenseName: e.target.checked ? generateExpenseName : ''
              }))}
            />
          }
          label="Do you want to add this vehicle in cost center for expense?"
        />

        {vehicleData.addToCostCenter && (
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!vehicleData.costCenter}>
                <InputLabel>Cost Center</InputLabel>
                <Select
                  value={vehicleData.costCenter}
                  onChange={handleVehicleChange('costCenter')}
                  label="Cost Center"
                  disabled={isLoadingCostCenters}
                >
                  {costCentersData?.result?.map(cc => (
                    <MenuItem 
                      key={cc.costCenterId} 
                      value={cc.code}
                      disabled={!cc.isActive}
                    >
                      {cc.name}
                    </MenuItem>
                  ))}
                </Select>
                {!defaultCostCenter && (
                  <FormHelperText error>
                    Default cost center 'Vendor-Vehicles' not found; please select manually.
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Expense Name"
                value={vehicleData.expenseName}
                onChange={handleVehicleChange('expenseName')}
                helperText="Auto-generated from Vehicle Number and Vendor Name"
              />
            </Grid>
          </Grid>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          sx={{ bgcolor: '#228B22', '&:hover': { bgcolor: '#1b6b1b' } }}
        >
          {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default VehicleForm;
