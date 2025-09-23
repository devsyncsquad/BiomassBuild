import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import axios from "axios";
import { useVendors } from "../../hooks/useVendors";
import { useLookupsByDomain } from "../../hooks/useLookups";

const forestGreen = "#228B22";
const forestGreenHover = "#1b6b1b";

const VehicleForm = ({ open, onClose, vehicle, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vendors and lookups
  const { data: vendorsResponse } = useVendors();
  const { data: vehicleTypesResponse } = useLookupsByDomain("VEHICLE_TYPE");

  // Extract vendors and vehicle types from response
  const vendors = vendorsResponse?.result || [];
  const vehicleTypes = vehicleTypesResponse?.result || [];

  const [formData, setFormData] = useState({
    vehicleId: "",
    vehicleNumber: "",
    vehicleType: "",
    capacity: "",
    fuelType: "",
    status: "Active",
    vehicleRegNumber: "",
    vendorId: "",
    isWeightAllocated: false,
    weightAllowed: "",
    costCenterId: "",
    driver: {
      fullName: "",
      cnic: "",
      licenseNumber: "",
      phoneNumber: "",
      address: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleId: vehicle.vehicleId || "",
        vehicleNumber: vehicle.vehicleNumber || "",
        vehicleType: vehicle.vehicleType || "",
        capacity: vehicle.capacity || "",
        fuelType: vehicle.fuelType || "",
        status: vehicle.status || "Active",
        vehicleRegNumber: vehicle.vehicleRegNumber || "",
        vendorId: vehicle.vendorId || "",
        isWeightAllocated: vehicle.isWeightAllocated || false,
        weightAllowed: vehicle.weightAllowed || "",
        costCenterId: vehicle.costCenterId || "",
        driver: vehicle.driver
          ? {
              fullName: vehicle.driver.fullName || "",
              cnic: vehicle.driver.cnic || "",
              licenseNumber: vehicle.driver.licenseNumber || "",
              phoneNumber: vehicle.driver.phoneNumber || "",
              address: vehicle.driver.address || "",
              status: vehicle.driver.status || "Active",
            }
          : {
              fullName: "",
              cnic: "",
              licenseNumber: "",
              phoneNumber: "",
              address: "",
              status: "Active",
            },
      });
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("driver.")) {
      const driverField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        driver: {
          ...prev.driver,
          [driverField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate CNIC
    if (formData.driver.cnic && formData.driver.cnic.length !== 13) {
      setError("CNIC must be exactly 13 digits");
      setLoading(false);
      return;
    }

    try {
      // Convert data types and prepare submission data
      const submitData = {
        ...formData,
        capacity: parseFloat(formData.capacity) || 0,
        vendorId: parseInt(formData.vendorId) || 0,
        isWeightAllocated: formData.isWeightAllocated ? "true" : "false",
        weightAllowed: formData.isWeightAllocated ? (parseFloat(formData.weightAllowed) || 0) : 0,
        costCenterId: parseInt(formData.costCenterId) || 0,
      };

      // If vehicle exists, it's an update operation
      const isUpdate = !!vehicle?.vehicleId;

      const response = await axios({
        method: isUpdate ? "put" : "post",
        url: `https://localhost:7084/api/vehicles${
          isUpdate ? `/${vehicle.vehicleId}` : ""
        }`,
        data: {
          ...submitData,
          vehicleId: isUpdate ? vehicle.vehicleId : undefined,
        },
      });

      if (response.data.success) {
        onSuccess?.();
        onClose();
      } else {
        setError(
          response.data.message ||
            `Failed to ${isUpdate ? "update" : "create"} vehicle`
        );
      }
    } catch (err) {
      // Enhanced error handling for better user experience
      let errorMessage = "An error occurred while saving the vehicle";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle validation errors
        if (errorData.errors) {
          const errorMessages = [];
          
          Object.keys(errorData.errors).forEach(field => {
            const fieldErrors = errorData.errors[field];
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach(error => {
                // Convert field names to user-friendly labels
                const fieldLabel = getFieldLabel(field);
                errorMessages.push(`${fieldLabel}: ${error}`);
              });
            }
          });
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join("\n");
          } else {
            errorMessage = errorData.title || errorData.message || errorMessage;
          }
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert field names to user-friendly labels
  const getFieldLabel = (fieldName) => {
    const fieldLabels = {
      'request': 'Request',
      'isWeightAllocated': 'Weight Allocation',
      'vehicleNumber': 'Vehicle Number',
      'vehicleType': 'Vehicle Type',
      'capacity': 'Capacity',
      'fuelType': 'Fuel Type',
      'status': 'Status',
      'vehicleRegNumber': 'Registration Number',
      'vendorId': 'Vendor',
      'weightAllowed': 'Weight Allowed',
      'costCenterId': 'Cost Center ID',
      'driver.fullName': 'Driver Name',
      'driver.cnic': 'Driver CNIC',
      'driver.licenseNumber': 'License Number',
      'driver.phoneNumber': 'Phone Number',
      'driver.address': 'Driver Address',
      'driver.status': 'Driver Status',
    };
    
    return fieldLabels[fieldName] || fieldName;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: forestGreen,
          color: "white",
          py: 2,
        }}
      >
        {vehicle ? "Edit Vehicle" : "Add New Vehicle"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
          {error && (
            <Alert severity='error' sx={{ mb: 2, whiteSpace: 'pre-line' }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Vehicle Information */}
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Vehicle Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Vehicle Number'
                name='vehicleNumber'
                value={formData.vehicleNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  name='vehicleType'
                  value={formData.vehicleType}
                  onChange={handleChange}
                  label='Vehicle Type'
                >
                  {Array.isArray(vehicleTypes) &&
                    vehicleTypes.map((type) => (
                      <MenuItem key={type.lookupId} value={type.lookupName}>
                        {type.lookupName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                type='number'
                label='Capacity'
                name='capacity'
                value={formData.capacity}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Fuel Type'
                name='fuelType'
                value={formData.fuelType}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  name='status'
                  value={formData.status}
                  onChange={handleChange}
                  label='Status'
                >
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                  <MenuItem value='Maintenance'>Maintenance</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Registration Number'
                name='vehicleRegNumber'
                value={formData.vehicleRegNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Vendor</InputLabel>
                <Select
                  name='vendorId'
                  value={formData.vendorId}
                  onChange={handleChange}
                  label='Vendor'
                >
                  {Array.isArray(vendors) &&
                    vendors.map((vendor) => (
                      <MenuItem key={vendor.vendorId} value={vendor.vendorId}>
                        {vendor.vendorName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Weight Allocation */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isWeightAllocated}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isWeightAllocated: e.target.checked,
                        weightAllowed: e.target.checked ? prev.weightAllowed : 0,
                      }))
                    }
                    name='isWeightAllocated'
                  />
                }
                label='Weight Allocated'
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Weight Allowed'
                name='weightAllowed'
                value={formData.isWeightAllocated ? formData.weightAllowed : 0}
                onChange={handleChange}
                disabled={!formData.isWeightAllocated}
                inputProps={{
                  min: 0,
                  step: 0.01,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type='number'
                label='Cost Center ID'
                name='costCenterId'
                value={formData.costCenterId}
                onChange={handleChange}
              />
            </Grid>

            {/* Driver Information */}
            <Grid item xs={12}>
              <Typography variant='h6' sx={{ mb: 2, mt: 2 }}>
                Driver Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Driver Name'
                name='driver.fullName'
                value={formData.driver.fullName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='CNIC'
                name='driver.cnic'
                value={formData.driver.cnic}
                onChange={handleChange}
                inputProps={{
                  minLength: 13,
                  maxLength: 13,
                  pattern: "[0-9]{13}",
                }}
                helperText="CNIC must be exactly 13 digits"
                error={formData.driver.cnic && formData.driver.cnic.length !== 13}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='License Number'
                name='driver.licenseNumber'
                value={formData.driver.licenseNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label='Phone Number'
                name='driver.phoneNumber'
                value={formData.driver.phoneNumber}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Address'
                name='driver.address'
                value={formData.driver.address}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Driver Status</InputLabel>
                <Select
                  name='driver.status'
                  value={formData.driver.status}
                  onChange={handleChange}
                  label='Driver Status'
                >
                  <MenuItem value='Active'>Active</MenuItem>
                  <MenuItem value='Inactive'>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={onClose}
            sx={{
              color: forestGreen,
              "&:hover": {
                bgcolor: "rgba(34, 139, 34, 0.08)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type='submit'
            variant='contained'
            disabled={loading}
            sx={{
              bgcolor: forestGreen,
              "&:hover": { bgcolor: forestGreenHover },
              "&:disabled": { bgcolor: "rgba(34, 139, 34, 0.5)" },
            }}
          >
            {loading ? (
              <CircularProgress size={24} color='inherit' />
            ) : vehicle ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default VehicleForm;
