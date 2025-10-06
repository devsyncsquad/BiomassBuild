import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
} from "@mui/icons-material";
import { materialRatesApi, customerLocationsApi, customerApi, lookupApi } from "../utils/api";
import "./RatePopup.css";

const RatePopup = ({
  open,
  onClose,
  locationId,
  locationName,
  customerId,
  customerName,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    customerId: customerId || "",
    locationId: locationId || "",
    effectiveDate: "1-15",
    companyRate: 0,
    transporterRate: 0,
    dieselRate: 0,
    materialType: "",
    materialId: null,
    status: "Active",
  });

  const [rates, setRates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingRate, setEditingRate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingRatesWarning, setExistingRatesWarning] = useState(null);
  const [showWarningAlert, setShowWarningAlert] = useState(false);

  // Filter states for Previous Rates tab
  const [filters, setFilters] = useState({
    customerId: "",
    locationId: "",
    startDate: "",
    endDate: "",
    status: "all",
  });

  useEffect(() => {
    if (open) {
      loadCustomers();
      loadMaterialTypes();
      if (locationId) {
        loadLocationsByCustomer(customerId);
        loadRatesByLocation(locationId);
      }
    }
  }, [open, locationId, customerId]);

  // Check for existing active rates when form data changes
  useEffect(() => {
    if (open && !isEditing) {
      checkExistingActiveRates();
    }
  }, [
    formData.customerId,
    formData.locationId,
    formData.materialType,
    formData.effectiveDate,
  ]);

  const loadCustomers = async () => {
    try {
      const response = await customerApi.getCustomers();
      if (response.success) {
        setCustomers(response.result);
      }
    } catch (error) {
      console.error("Error loading customers:", error);
    }
  };

  const loadLocationsByCustomer = async (customerId) => {
    if (!customerId) return;
    try {
      const response = await customerLocationsApi.getLocationsByCustomerId(customerId);
      if (response.success) {
        setLocations(response.result);
      }
    } catch (error) {
      console.error("Error loading locations:", error);
    }
  };

  const loadMaterialTypes = async () => {
    try {
      const response = await lookupApi.getLookupsByDomain("MaterialType");
      if (response.success) {
        setMaterialTypes(response.result);
        // Set default material type to first available if not editing
        if (!isEditing && response.result.length > 0) {
          setFormData(prev => ({
            ...prev,
            materialType: response.result[0].lookupName,
            materialId: response.result[0].lookupId
          }));
        }
      }
    } catch (error) {
      console.error("Error loading material types:", error);
    }
  };

  const loadRatesByLocation = async (locationId) => {
    if (!locationId) return;
    try {
      const response = await materialRatesApi.getMaterialRatesByLocationId(locationId);
      if (response.success) {
        setRates(response.result);
      }
    } catch (error) {
      console.error("Error loading rates:", error);
    }
  };

  const loadAllRates = async () => {
    try {
      const response = await materialRatesApi.getAllMaterialRates();
      if (response.success) {
        setRates(response.result);
      }
    } catch (error) {
      console.error("Error loading all rates:", error);
    }
  };

  const checkExistingActiveRates = async () => {
    if (
      !formData.customerId ||
      !formData.locationId ||
      !formData.materialType ||
      !formData.effectiveDate
    ) {
      setExistingRatesWarning(null);
      setShowWarningAlert(false);
      return;
    }

    try {
      const response = await materialRatesApi.checkExistingActiveRates(
        formData.customerId,
        formData.locationId,
        formData.materialType,
        formData.effectiveDate // Send the actual dropdown value (1-15 or 16-31)
      );

      if (response.success && response.result.length > 0) {
        setExistingRatesWarning({
          count: response.result.length,
          rates: response.result,
        });
        setShowWarningAlert(true);
      } else {
        setExistingRatesWarning(null);
        setShowWarningAlert(false);
      }
    } catch (error) {
      console.error("Error checking existing rates:", error);
      setExistingRatesWarning(null);
      setShowWarningAlert(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // If customer changes, reload locations
    if (field === "customerId") {
      loadLocationsByCustomer(value);
      setFormData((prev) => ({ ...prev, locationId: "" }));
      setExistingRatesWarning(null);
      setShowWarningAlert(false);
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!formData.customerId) {
      setError("Customer is required");
      return;
    }
    if (!formData.locationId) {
      setError("Location is required");
      return;
    }
    if (!formData.effectiveDate) {
      setError("Effective Date is required");
      return;
    }
    if (!formData.companyRate || formData.companyRate <= 0) {
      setError("Company Rate must be greater than 0");
      return;
    }
    if (!formData.transporterRate || formData.transporterRate <= 0) {
      setError("Transporter Rate must be greater than 0");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Convert camelCase to PascalCase for backend compatibility
      const backendData = {
        CustomerId: parseInt(formData.customerId),
        LocationId: parseInt(formData.locationId),
        EffectiveDate: formData.effectiveDate, // Send the actual dropdown value (1-15 or 16-31)
        CompanyRate: parseFloat(formData.companyRate),
        TransporterRate: parseFloat(formData.transporterRate),
        DieselRate: formData.dieselRate ? parseFloat(formData.dieselRate) : null,
        MaterialType: formData.materialType,
        MaterialId: formData.materialId,
      };

      const data = isEditing
        ? { ...backendData, Status: formData.status }
        : backendData;

      console.log("Sending rate data to backend:", data);

      const response = isEditing
        ? await materialRatesApi.updateMaterialRate(editingRate.rateId, data)
        : await materialRatesApi.createMaterialRate(data);

      if (response.success) {
        setSuccess(
          isEditing
            ? "Rate updated successfully!"
            : "Rate created successfully!"
        );
        onSave(response.result);

        // Refresh rates
        if (formData.locationId) {
          loadRatesByLocation(formData.locationId);
        }

        // Reset form if not editing
        if (!isEditing) {
          resetForm();
        }

        setEditingRate(null);
        setIsEditing(false);
        setExistingRatesWarning(null);
        setShowWarningAlert(false);
      } else {
        setError("Error saving rate: " + response.message);
      }
    } catch (error) {
      console.error("Error saving rate:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        setError("Validation errors: " + errorMessages);
      } else if (error.response?.data?.message) {
        setError("Error saving rate: " + error.response.data.message);
      } else {
        setError("Error saving rate. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (rate) => {
    setEditingRate(rate);
    setIsEditing(true);
    setFormData({
      customerId: rate.customerId,
      locationId: rate.locationId,
      effectiveDate: getDateRangeFromDate(rate.effectiveDate) || "1-15",
      companyRate: rate.companyRate,
      transporterRate: rate.transporterRate,
      dieselRate: rate.dieselRate || 0,
      materialType: rate.materialType || "",
      materialId: rate.materialId || null,
      status: rate.status,
    });
    setExistingRatesWarning(null);
    setShowWarningAlert(false);
  };

  const resetForm = () => {
    setFormData({
      customerId: customerId || "",
      locationId: locationId || "",
      effectiveDate: "1-15",
      companyRate: 0,
      transporterRate: 0,
      dieselRate: 0,
      materialType: "",
      materialId: null,
      status: "Active",
    });
    setEditingRate(null);
    setIsEditing(false);
    setExistingRatesWarning(null);
    setShowWarningAlert(false);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    if (newValue === 1) {
      // Load all rates for Previous Rates tab
      loadAllRates();
    } else if (newValue === 0 && locationId) {
      // Load rates for specific location in Add Rate tab
      loadRatesByLocation(locationId);
    }
  };

  const applyFilters = () => {
    // This would typically call a filtered API endpoint
    // For now, we'll filter the existing rates
    loadAllRates();
  };

  const clearFilters = () => {
    setFilters({
      customerId: "",
      locationId: "",
      startDate: "",
      endDate: "",
      status: "all",
    });
    loadAllRates();
  };

  const getFilteredRates = () => {
    let filtered = [...rates];

    if (filters.customerId) {
      filtered = filtered.filter(
        (rate) => rate.customerId === parseInt(filters.customerId)
      );
    }
    if (filters.locationId) {
      filtered = filtered.filter(
        (rate) => rate.locationId === parseInt(filters.locationId)
      );
    }
    if (filters.startDate) {
      filtered = filtered.filter(
        (rate) => new Date(rate.effectiveDate) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (rate) => new Date(rate.effectiveDate) <= new Date(filters.endDate)
      );
    }
    if (filters.status !== "all") {
      filtered = filtered.filter((rate) => rate.status === filters.status);
    }

    return filtered;
  };

  // Helper function to convert date to range display
  const getDateRangeDisplay = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    return day <= 15 ? "1-15" : "16-31";
  };

  // Helper function to convert date to range for form
  const getDateRangeFromDate = (dateString) => {
    if (!dateString) return "1-15";
    const date = new Date(dateString);
    const day = date.getDate();
    return day <= 15 ? "1-15" : "16-31";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='xl'
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          maxHeight: "90vh",
          width: "95vw",
          maxWidth: "1400px",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#228B22",
          color: "white",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant='h6' fontWeight='bold' sx={{ color: "white" }}>
          Material Rates Management
        </Typography>
        <Box>
          <Button
            variant='contained'
            startIcon={<RefreshIcon />}
            onClick={() => {
              if (activeTab === 0 && locationId) {
                loadRatesByLocation(locationId);
              } else {
                loadAllRates();
              }
            }}
            sx={{
              mr: 1,
              bgcolor: "white",
              color: "#228B22",
              "&:hover": { bgcolor: "#f5f5f5" },
            }}
          >
            Refresh
          </Button>
          <Button
            variant='outlined'
            startIcon={<CancelIcon />}
            onClick={onClose}
            sx={{
              color: "white",
              borderColor: "white",
              "&:hover": {
                borderColor: "white",
                bgcolor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3 }}>
            <Tab label='Add Rate' />
            <Tab label='Previous Rates' />
          </Tabs>
        </Box>

        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Add Rate Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant='h6' gutterBottom>
                Add New Rate
              </Typography>
              <Typography variant='body2' color='text.secondary' gutterBottom>
                {locationName && `Location: ${locationName}`}{" "}
                {customerName && `| Customer: ${customerName}`}
              </Typography>

              {error && (
                <Alert severity='error' sx={{ mt: 2, mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity='success' sx={{ mt: 2, mb: 2 }}>
                  {success}
                </Alert>
              )}

              {showWarningAlert && existingRatesWarning && (
                <Alert
                  severity='warning'
                  sx={{
                    mt: 2,
                    mb: 2,
                    bgcolor: "#fff3cd",
                    borderColor: "#ffeaa7",
                  }}
                  action={
                    <Button
                      color='inherit'
                      size='small'
                      onClick={() => setShowWarningAlert(false)}
                    >
                      Dismiss
                    </Button>
                  }
                >
                  <Typography
                    variant='body2'
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    ⚠️ Existing Active Rate(s) Detected
                  </Typography>
                  <Typography variant='body2'>
                    The system has detected {existingRatesWarning.count} active
                    rate(s) already defined for this client, location, and
                    material combination. If you proceed, the existing active
                    rate(s) will be closed automatically, and the new rate will
                    be saved in the system.
                  </Typography>
                  {existingRatesWarning.rates.length > 0 && (
                    <Box
                      sx={{ mt: 1, p: 1, bgcolor: "#fff8e1", borderRadius: 1 }}
                    >
                      <Typography variant='caption' sx={{ fontWeight: "bold" }}>
                        Existing rates that will be deactivated:
                      </Typography>
                      {existingRatesWarning.rates.map((rate, index) => (
                        <Typography
                          key={rate.rateId}
                          variant='caption'
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          • Rate ID: {rate.rateId} | Transporter: Rs{" "}
                          {rate.transporterRate} | Effective:{" "}
                          {getDateRangeDisplay(rate.effectiveDate)}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Alert>
              )}

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Customer</InputLabel>
                    <Select
                      value={formData.customerId}
                      onChange={(e) =>
                        handleInputChange("customerId", e.target.value)
                      }
                      label='Customer'
                      required
                    >
                      {customers.map((customer) => (
                        <MenuItem
                          key={customer.customerId}
                          value={customer.customerId}
                        >
                          {customer.customerName ||
                            `${customer.firstName} ${customer.lastName}`}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={formData.locationId}
                      onChange={(e) =>
                        handleInputChange("locationId", e.target.value)
                      }
                      label='Location'
                      required
                      disabled={!formData.customerId}
                    >
                      {locations.map((location) => (
                        <MenuItem
                          key={location.locationId}
                          value={location.locationId}
                        >
                          {location.locationName} ({location.locationCode})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Effective Date Range</InputLabel>
                    <Select
                      value={formData.effectiveDate}
                      onChange={(e) =>
                        handleInputChange("effectiveDate", e.target.value)
                      }
                      label='Effective Date Range'
                      required
                    >
                      <MenuItem value='1-15'>1-15</MenuItem>
                      <MenuItem value='16-31'>16-31</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        handleInputChange("status", e.target.value)
                      }
                      label='Status'
                    >
                      <MenuItem value='Active'>Active</MenuItem>
                      <MenuItem value='Inactive'>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label='Company Rate'
                    type='number'
                    value={formData.companyRate}
                    onChange={(e) =>
                      handleInputChange(
                        "companyRate",
                        parseFloat(e.target.value)
                      )
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <Typography variant='body2'>Rs</Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label='Is this Rate per mund'
                    type='number'
                    value={formData.transporterRate}
                    onChange={(e) =>
                      handleInputChange(
                        "transporterRate",
                        parseFloat(e.target.value)
                      )
                    }
                    required
                    InputProps={{
                      startAdornment: (
                        <Typography variant='body2'>Rs</Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    label='Diesel Rate'
                    type='number'
                    value={formData.dieselRate}
                    onChange={(e) =>
                      handleInputChange(
                        "dieselRate",
                        parseFloat(e.target.value)
                      )
                    }
                    InputProps={{
                      startAdornment: (
                        <Typography variant='body2'>Rs</Typography>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Material Type</InputLabel>
                    <Select
                      value={formData.materialType}
                      onChange={(e) => {
                        const selectedMaterial = materialTypes.find(mt => mt.lookupName === e.target.value);
                        handleInputChange("materialType", e.target.value);
                        if (selectedMaterial) {
                          handleInputChange("materialId", selectedMaterial.lookupId);
                        }
                      }}
                      label='Material Type'
                    >
                      {materialTypes.map((materialType) => (
                        <MenuItem key={materialType.lookupId} value={materialType.lookupName}>
                          {materialType.lookupName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  variant='contained'
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    bgcolor: "#228B22",
                    "&:hover": { bgcolor: "#006400" },
                  }}
                >
                  {loading
                    ? "Saving..."
                    : isEditing
                    ? "Update Rate"
                    : "Save Rate"}
                </Button>

                {isEditing && (
                  <Button
                    variant='outlined'
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancel Edit
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Rates Grid */}
            <Box>
              <Typography variant='h6' gutterBottom>
                Current Rates for Selected Location
              </Typography>

              <TableContainer component={Paper} sx={{ maxHeight: 400, overflowX: 'auto' }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#228B22" }}>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Rate ID
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Customer
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Location
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Effective Date Range
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Company Rate
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Transporter Rate
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Diesel Rate
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Material Type
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Status
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Created By
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Created On
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "white",
                          backgroundColor: "#228B22",
                          fontWeight: "bold",
                        }}
                      >
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rates.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} align='center'>
                          No rates found for this location
                        </TableCell>
                      </TableRow>
                    ) : (
                      rates.map((rate) => (
                        <TableRow key={rate.rateId} hover>
                          <TableCell>{rate.rateId}</TableCell>
                          <TableCell>{rate.customerName}</TableCell>
                          <TableCell>{rate.locationName}</TableCell>
                          <TableCell>{rate.effectiveDate}</TableCell>
                          <TableCell>Rs {rate.companyRate}</TableCell>
                          <TableCell>Rs {rate.transporterRate}</TableCell>
                          <TableCell>Rs {rate.dieselRate || "-"}</TableCell>
                          <TableCell>{rate.materialType || "-"}</TableCell>
                          <TableCell>
                            <Chip
                              label={rate.status}
                              color={
                                rate.status === "Active" ? "success" : "default"
                              }
                              size='small'
                            />
                          </TableCell>
                          <TableCell>{rate.createdBy}</TableCell>
                          <TableCell>
                            {new Date(rate.createdOn).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size='small'
                              onClick={() => handleEdit(rate)}
                              color='primary'
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}

        {activeTab === 1 && (
          <Box sx={{ p: 3, }}>
            {/* Previous Rates Tab */}
            <Box sx={{ mb: 3, backgroundColor: "green" }}>
              <Typography variant='h6' gutterBottom color="white">
                Previous Rates History
              </Typography>
              <Typography variant='body2' gutterBottom color="white">
                View and filter historical material rates
              </Typography>
            </Box>

            {/* Filters */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant='subtitle1' gutterBottom>
                  <FilterIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Filters
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Customer</InputLabel>
                      <Select
                        value={filters.customerId}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            customerId: e.target.value,
                          }))
                        }
                        label='Customer'
                      >
                        <MenuItem value=''>All Customers</MenuItem>
                        {customers.map((customer) => (
                          <MenuItem
                            key={customer.customerId}
                            value={customer.customerId}
                          >
                            {customer.customerName ||
                              `${customer.firstName} ${customer.lastName}`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <FormControl fullWidth>
                      <InputLabel>Location</InputLabel>
                      <Select
                        value={filters.locationId}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            locationId: e.target.value,
                          }))
                        }
                        label='Location'
                      >
                        <MenuItem value=''>All Locations</MenuItem>
                        {locations.map((location) => (
                          <MenuItem
                            key={location.locationId}
                            value={location.locationId}
                          >
                            {location.locationName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label='Start Date'
                      type='date'
                      value={filters.startDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <TextField
                      fullWidth
                      label='End Date'
                      type='date'
                      value={filters.endDate}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={2}>
                    <FormControl fullWidth>
                      <InputLabel>Status</InputLabel>
                      <Select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        label='Status'
                      >
                        <MenuItem value='all'>All Status</MenuItem>
                        <MenuItem value='Active'>Active</MenuItem>
                        <MenuItem value='Inactive'>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 2, display: "flex", gap: 2}}>
                  <Button
                    variant='contained'
                    onClick={applyFilters}
                    startIcon={<FilterIcon sx={{ color: "white" }} />}
                    sx={{
                      bgcolor: "#228B22",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#1B5E20",
                      },
                    }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant='contained'
                    onClick={clearFilters}
                    sx={{
                      bgcolor: "#228B22",
                      color: "white",
                      "&:hover": {
                        bgcolor: "#1B5E20",
                      },
                    }}
                  >
                    Clear Filters
                  </Button>
                </Box>
              </CardContent>
            </Card>

            {/* Previous Rates Table */}
            <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#228B22" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Rate ID
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Customer
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Location
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Effective Date Range
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Company Rate
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Transporter Rate
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Diesel Rate
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Material Type
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Created By
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Created On
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getFilteredRates().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={11} align='center'>
                        No rates found matching the filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    getFilteredRates().map((rate) => (
                      <TableRow key={rate.rateId} hover>
                        <TableCell>{rate.rateId}</TableCell>
                        <TableCell>{rate.customerName}</TableCell>
                        <TableCell>{rate.locationName}</TableCell>
                        <TableCell>
                          {getDateRangeDisplay(rate.effectiveDate)}
                        </TableCell>
                        <TableCell>Rs {rate.companyRate}</TableCell>
                        <TableCell>Rs {rate.transporterRate}</TableCell>
                        <TableCell>Rs {rate.dieselRate || "-"}</TableCell>
                        <TableCell>{rate.materialType || "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={rate.status}
                            color={
                              rate.status === "Active" ? "success" : "default"
                            }
                            size='small'
                          />
                        </TableCell>
                        <TableCell>{rate.createdBy}</TableCell>
                        <TableCell>
                          {new Date(rate.createdOn).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RatePopup;
