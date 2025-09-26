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
import { getBaseUrl } from "../../utils/api";

const forestGreen = "#228B22";
const forestGreenHover = "#1b6b1b";

const VehicleForm = ({ open, onClose, vehicle, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch vendors and lookups
  const { data: vendorsResponse } = useVendors();
  const { data: vehicleTypesResponse } = useLookupsByDomain("VEHICLE_TYPE");

  // State for cost centers
  const [costCenters, setCostCenters] = useState([]);

  // Fetch cost centers
  useEffect(() => {
    const fetchCostCenters = async () => {
      try {
        const response = await axios.get(`${getBaseUrl()}/cost-centers/GetAllCostCentersView`);
        if (response.data && response.data.result) {
          setCostCenters(response.data.result);
        }
      } catch (error) {
        console.error('Error fetching cost centers:', error);
      }
    };
    fetchCostCenters();
  }, []);

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

    // Validate required fields and field lengths according to database schema
    const validations = {
      vehicleNumber: {
        required: true,
        maxLength: 50,
        label: "Vehicle Number",
        unique: true
      },
      vehicleType: {
        required: true,
        maxLength: 50,
        label: "Vehicle Type"
      },
      fuelType: {
        required: true,
        maxLength: 50,
        label: "Fuel Type"
      },
      status: {
        maxLength: 20,
        label: "Status"
      },
      capacity: {
        type: "decimal",
        label: "Capacity",
        validate: (value) => {
          if (value && (isNaN(value) || value < 0)) {
            return "Capacity must be a positive number";
          }
          // Check decimal places (10,2)
          if (value && value.toString().split('.')[1]?.length > 2) {
            return "Capacity can have maximum 2 decimal places";
          }
          return null;
        }
      },
      weightAllowed: {
        type: "integer",
        label: "Weight Allowed",
        validate: (value) => {
          if (value && (!Number.isInteger(Number(value)) || Number(value) < 0)) {
            return "Weight Allowed must be a positive integer";
          }
          return null;
        }
      }
    };

    // Collect validation errors
    const validationErrors = [];

    // Check required fields and their constraints
    Object.entries(validations).forEach(([field, rules]) => {
      const value = formData[field]?.toString().trim();

      // Required field check
      if (rules.required && !value) {
        validationErrors.push(`${rules.label} is required`);
        return;
      }

      // Max length check
      if (rules.maxLength && value && value.length > rules.maxLength) {
        validationErrors.push(`${rules.label} cannot exceed ${rules.maxLength} characters`);
      }

      // Custom validation
      if (rules.validate && value) {
        const error = rules.validate(value);
        if (error) {
          validationErrors.push(error);
        }
      }
    });

    // Validate CNIC
    if (formData.driver.cnic) {
      if (formData.driver.cnic.length !== 13) {
        validationErrors.push("CNIC must be exactly 13 digits");
      } else if (!/^\d+$/.test(formData.driver.cnic)) {
        validationErrors.push("CNIC must contain only numbers");
      }
    }

    // Check for validation errors
    if (validationErrors.length > 0) {
      setError(validationErrors.join("\n"));
      setLoading(false);
      return;
    }

    // Log the form data before submission
    console.log("Form Data:", formData);

    try {
      // Convert data types and prepare submission data
      // Prepare the request data with PascalCase property names for backend
      // Prepare data to match the working Swagger example
      const submitData = {
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        capacity: parseFloat(formData.capacity) || 0,
        fuelType: formData.fuelType,
        status: formData.status,
        vehicleRegNumber: formData.vehicleRegNumber,
        vendorId: parseInt(formData.vendorId) || 0,
        costCenterId: parseInt(formData.costCenterId) || 0,
        isWeightAllocated: formData.isWeightAllocated ? "true" : "false",
        weightAllowed: formData.isWeightAllocated ? (parseFloat(formData.weightAllowed) || 0) : 0,
        driver: formData.driver.fullName ? {
          fullName: formData.driver.fullName,
          cnic: formData.driver.cnic,
          licenseNumber: formData.driver.licenseNumber,
          phoneNumber: formData.driver.phoneNumber,
          address: formData.driver.address,
          status: formData.driver.status || "Active"
        } : null
      };

      // If vehicle exists, it's an update operation
      const isUpdate = !!vehicle?.vehicleId;

      // Log the request data
      console.log("Request Data:", submitData);

      const response = await axios({
        method: isUpdate ? "put" : "post",
        url: `${getBaseUrl()}/vehicles${isUpdate ? `/${vehicle.vehicleId}` : ""}`,
        data: isUpdate ? {
          ...submitData,
          vehicleId: vehicle.vehicleId
        } : submitData,
      });

      // Log the response
      console.log("API Response:", response.data);

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
      console.error('API Error:', err);
      console.error('Error Response:', err.response?.data);
      
      let errorMessage = "An error occurred while saving the vehicle";
      
      if (err.response?.data) {
        const errorData = err.response.data;
        
        // Handle specific database errors
        if (err.response.status === 500 && errorData.message?.includes("duplicate key value violates unique constraint")) {
          errorMessage = "A vehicle with this vehicle number already exists. Please use a different vehicle number.";
        }
        // Handle validation errors
        else if (errorData.errors) {
          const errorMessages = [];
          
          Object.entries(errorData.errors).forEach(([field, fieldErrors]) => {
            if (Array.isArray(fieldErrors)) {
              fieldErrors.forEach(error => {
                const fieldLabel = getFieldLabel(field);
                errorMessages.push(`${fieldLabel}: ${error}`);
              });
            } else if (typeof fieldErrors === 'string') {
              const fieldLabel = getFieldLabel(field);
              errorMessages.push(`${fieldLabel}: ${fieldErrors}`);
            }
          });
          
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join("\n");
          } else {
            errorMessage = errorData.title || errorData.message || errorMessage;
          }
        } else if (errorData.message) {
          // Try to make database errors more user-friendly
          if (errorData.message.includes("numeric field overflow")) {
            errorMessage = "One or more numeric values are too large. Please check capacity and weight values.";
          } else if (errorData.message.includes("invalid input syntax for type numeric")) {
            errorMessage = "Please enter valid numbers for numeric fields (Capacity, Weight).";
          } else {
            errorMessage = errorData.message;
          }
        } else if (errorData.title) {
          errorMessage = errorData.title;
        }
        
        // Log the actual error for debugging
        console.log('Original Error:', err.response.data);
        console.log('Processed Error Message:', errorMessage);
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
              <FormControl fullWidth>
                <InputLabel>Cost Center</InputLabel>
                <Select
                  name='costCenterId'
                  value={formData.costCenterId}
                  onChange={handleChange}
                  label='Cost Center'
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {costCenters.map((center) => (
                    <MenuItem key={center.costCenterId} value={center.costCenterId}>
                      {center.name} ({center.code})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
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
