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

    try {
      // Convert capacity to number
      const submitData = {
        ...formData,
        capacity: parseFloat(formData.capacity),
        vendorId: parseInt(formData.vendorId),
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
      setError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while saving the vehicle"
      );
    } finally {
      setLoading(false);
    }
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
            <Alert severity='error' sx={{ mb: 2 }}>
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
                      }))
                    }
                    name='isWeightAllocated'
                  />
                }
                label='Weight Allocated'
              />
            </Grid>

            {formData.isWeightAllocated && (
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type='number'
                  label='Weight Allowed'
                  name='weightAllowed'
                  value={formData.weightAllowed}
                  onChange={handleChange}
                />
              </Grid>
            )}

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
