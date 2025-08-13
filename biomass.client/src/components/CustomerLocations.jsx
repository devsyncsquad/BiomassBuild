import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  CardActions,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Divider,
  Paper,
  Fab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Card,
  CardContent,
  CardActionArea
} from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MapComponent from './MapComponent';
import { CustomerLocationForm } from './CustomerLocationForm';
import MaterialRateForm from './MaterialRateForm';
import './CustomerLocations.css';

const CustomerLocations = ({ customer, onClose }) => {
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [openLocationDetails, setOpenLocationDetails] = useState(false);
  const [openLocationForm, setOpenLocationForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [mapZoom, setMapZoom] = useState(12);
  const [mapCenter, setMapCenter] = useState({ lat: 31.5204, lng: 74.3587 }); // Lahore, Pakistan coordinates
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [openMapDialog, setOpenMapDialog] = useState(false);
  const [mapLocation, setMapLocation] = useState(null);
  const [openMaterialRateForm, setOpenMaterialRateForm] = useState(false);
  const [selectedLocationForRate, setSelectedLocationForRate] = useState(null);
  const [materialRates, setMaterialRates] = useState([]);

  // Check if this is standalone mode (no customer prop)
  const isStandalone = !customer;

  // Update map center when locations change
  useEffect(() => {
    if (locations.length > 0) {
      // Try to find a location with valid coordinates
      const locationWithCoords = locations.find(loc => {
        const lat = loc.latitude || loc.Latitude;
        const lng = loc.longitude || loc.Longitude;
        return lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
      });
      
      if (locationWithCoords) {
        const lat = parseFloat(locationWithCoords.latitude || locationWithCoords.Latitude);
        const lng = parseFloat(locationWithCoords.longitude || locationWithCoords.Longitude);
        setMapCenter({ lat, lng });
        console.log('Updated map center to:', { lat, lng });
      }
    }
  }, [locations]);

  // Fetch customer locations from API
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        let response;
        if (customer) {
          // Fetch locations for specific customer
          response = await axios.get(`https://localhost:7084/api/customerlocations/customer/${customer.customerId}`);
        } else {
          // Fetch all locations
          response = await axios.get('https://localhost:7084/api/customerlocations');
        }
        
        console.log('API Response:', response.data);
        if (response.data.success) {
          console.log('Setting locations:', response.data.result);
          // Convert PascalCase to camelCase for frontend consistency
          const convertedLocations = response.data.result.map(location => ({
            locationId: location.locationId || location.LocationId,
            customerId: location.customerId || location.CustomerId,
            locationName: location.locationName || location.LocationName,
            locationCode: location.locationCode || location.LocationCode,
            address: location.address || location.Address,
            latitude: location.latitude || location.Latitude,
            longitude: location.longitude || location.Longitude,
            centerDispatchWeightLimit: location.centerDispatchWeightLimit || location.CenterDispatchWeightLimit,
            advancePercentageAllowed: location.advancePercentageAllowed || location.AdvancePercentageAllowed,
            toleranceLimitPercentage: location.toleranceLimitPercentage || location.ToleranceLimitPercentage,
            toleranceLimitKg: location.toleranceLimitKg || location.ToleranceLimitKg,
            materialPenaltyRatePerKg: location.materialPenaltyRatePerKg || location.MaterialPenaltyRatePerKg,
            dispatchLoadingChargesEnabled: location.dispatchLoadingChargesEnabled || location.DispatchLoadingChargesEnabled,
            dispatchChargeType: location.dispatchChargeType || location.DispatchChargeType,
            fixedLoaderCost: location.fixedLoaderCost || location.FixedLoaderCost,
            variableChargeType: location.variableChargeType || location.VariableChargeType,
            variableChargeAmount: location.variableChargeAmount || location.VariableChargeAmount,
            receivingUnloadingCostEnabled: location.receivingUnloadingCostEnabled || location.ReceivingUnloadingCostEnabled,
            receivingChargeType: location.receivingChargeType || location.ReceivingChargeType,
            fixedUnloadingCost: location.fixedUnloadingCost || location.FixedUnloadingCost,
            receivingVariableChargeType: location.receivingVariableChargeType || location.ReceivingVariableChargeType,
            receivingVariableChargeAmount: location.receivingVariableChargeAmount || location.ReceivingVariableChargeAmount,
            status: location.status || location.Status,
            createdOn: location.createdOn || location.CreatedOn,
            lastUpdatedOn: location.lastUpdatedOn || location.LastUpdatedOn,
            customerName: location.customerName || location.CustomerName
          }));
          setLocations(convertedLocations);
        } else {
          console.error('Error fetching locations:', response.data.message);
          // Fallback to mock data if API fails
          setLocations(getMockLocations());
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
        // Fallback to mock data if API fails
        setLocations(getMockLocations());
      }
    };

    fetchLocations();
  }, [customer]);

  const fetchMaterialRates = async (locationId) => {
    try {
      const response = await axios.get(`https://localhost:7084/api/materialrates/location/${locationId}`);
      if (response.data.success) {
        setMaterialRates(response.data.result);
      } else {
        console.error('Failed to fetch material rates:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching material rates:', error);
    }
  };

  const getMockLocations = () => [
    {
      locationId: 1,
      locationName: 'Bulha Shah',
      locationCode: 'BS001',
      address: '123 Main Street, Lahore, Pakistan',
      latitude: 31.5204,
      longitude: 74.3587,
      locationType: 'Warehouse',
      status: 'active',
      capacity: '5000 sq ft',
      contactPerson: 'Ahmed Khan',
      phone: '+92 300 1234567',
      email: 'ahmed.khan@bulhashah.com',
      description: 'Main distribution center for Lahore region',
      lastUpdated: '2024-01-15',
      customerName: 'John Doe'
    },
    {
      locationId: 2,
      locationName: 'Karachi Hub',
      locationCode: 'KH002',
      address: '456 Business District, Karachi, Pakistan',
      latitude: 24.8607,
      longitude: 67.0011,
      locationType: 'Distribution Center',
      status: 'active',
      capacity: '8000 sq ft',
      contactPerson: 'Fatima Ali',
      phone: '+92 300 9876543',
      email: 'fatima.ali@bulhashah.com',
      description: 'Southern distribution hub',
      lastUpdated: '2024-01-10',
      customerName: 'Sarah Johnson'
    },
    {
      locationId: 3,
      locationName: 'Islamabad Office',
      locationCode: 'IO003',
      address: '789 Business Park, Islamabad, Pakistan',
      latitude: 33.6844,
      longitude: 73.0479,
      locationType: 'Office',
      status: 'active',
      capacity: '3000 sq ft',
      contactPerson: 'Usman Malik',
      phone: '+92 300 5551234',
      email: 'usman.malik@bulhashah.com',
      description: 'Regional office for Islamabad',
      lastUpdated: '2024-01-20',
      customerName: 'Michael Brown'
    }
  ];

  const handleViewDetails = (location) => {
    setSelectedLocation(location);
    setOpenLocationDetails(true);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setOpenLocationForm(true);
  };

  const handleAddRate = (location) => {
    setSelectedLocationForRate(location);
    setOpenMaterialRateForm(true);
  };

  const handleSaveMaterialRate = (materialRate) => {
    // Refresh the material rates list
    fetchMaterialRates(selectedLocationForRate.locationId || selectedLocationForRate.LocationId);
  };

  const handleAddLocation = () => {
    setEditingLocation(null);
    setOpenLocationForm(true);
  };

  const handleSaveLocation = (savedLocation) => {
    // Convert PascalCase to camelCase for frontend consistency
    const convertedLocation = {
      locationId: savedLocation.locationId || savedLocation.LocationId,
      customerId: savedLocation.customerId || savedLocation.CustomerId,
      locationName: savedLocation.locationName || savedLocation.LocationName,
      locationCode: savedLocation.locationCode || savedLocation.LocationCode,
      address: savedLocation.address || savedLocation.Address,
      latitude: savedLocation.latitude || savedLocation.Latitude,
      longitude: savedLocation.longitude || savedLocation.Longitude,
      centerDispatchWeightLimit: savedLocation.centerDispatchWeightLimit || savedLocation.CenterDispatchWeightLimit,
      advancePercentageAllowed: savedLocation.advancePercentageAllowed || savedLocation.AdvancePercentageAllowed,
      toleranceLimitPercentage: savedLocation.toleranceLimitPercentage || savedLocation.ToleranceLimitPercentage,
      toleranceLimitKg: savedLocation.toleranceLimitKg || savedLocation.ToleranceLimitKg,
      materialPenaltyRatePerKg: savedLocation.materialPenaltyRatePerKg || savedLocation.MaterialPenaltyRatePerKg,
      dispatchLoadingChargesEnabled: savedLocation.dispatchLoadingChargesEnabled || savedLocation.DispatchLoadingChargesEnabled,
      dispatchChargeType: savedLocation.dispatchChargeType || savedLocation.DispatchChargeType,
      fixedLoaderCost: savedLocation.fixedLoaderCost || savedLocation.FixedLoaderCost,
      variableChargeType: savedLocation.variableChargeType || savedLocation.VariableChargeType,
      variableChargeAmount: savedLocation.variableChargeAmount || savedLocation.VariableChargeAmount,
      receivingUnloadingCostEnabled: savedLocation.receivingUnloadingCostEnabled || savedLocation.ReceivingUnloadingCostEnabled,
      receivingChargeType: savedLocation.receivingChargeType || savedLocation.ReceivingChargeType,
      fixedUnloadingCost: savedLocation.fixedUnloadingCost || savedLocation.FixedUnloadingCost,
      receivingVariableChargeType: savedLocation.receivingVariableChargeType || savedLocation.ReceivingVariableChargeType,
      receivingVariableChargeAmount: savedLocation.receivingVariableChargeAmount || savedLocation.ReceivingVariableChargeAmount,
      status: savedLocation.status || savedLocation.Status,
      createdOn: savedLocation.createdOn || savedLocation.CreatedOn,
      lastUpdatedOn: savedLocation.lastUpdatedOn || savedLocation.LastUpdatedOn,
      customerName: savedLocation.customerName || savedLocation.CustomerName
    };

    if (editingLocation) {
      // Update existing location
      setLocations(prev => prev.map(loc => 
        loc.locationId === convertedLocation.locationId ? convertedLocation : loc
      ));
    } else {
      // Add new location
      setLocations(prev => [...prev, convertedLocation]);
    }
    setOpenLocationForm(false);
    setEditingLocation(null);
  };

  const handleDeleteLocation = async (locationId) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await axios.delete(`https://localhost:7084/api/customerlocations/${locationId}`);
        setLocations(prev => prev.filter(loc => loc.locationId !== locationId));
      } catch (error) {
        console.error('Error deleting location:', error);
        alert('Error deleting location. Please try again.');
      }
    }
  };

  const handleViewOnMap = (location) => {
    setMapLocation(location);
    setOpenMapDialog(true);
  };

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 2, 20));
  };

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 2, 8));
  };

  const handleCenterMap = () => {
    if (locations.length > 0) {
      const locationWithCoords = locations.find(loc => {
        const lat = loc.latitude || loc.Latitude;
        const lng = loc.longitude || loc.Longitude;
        return lat && lng && !isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng));
      });
      
      if (locationWithCoords) {
        const lat = parseFloat(locationWithCoords.latitude || locationWithCoords.Latitude);
        const lng = parseFloat(locationWithCoords.longitude || locationWithCoords.Longitude);
        setMapCenter({ lat, lng });
        setMapZoom(14);
      }
    }
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Warehouse': '#2196F3',
      'Distribution Center': '#4CAF50',
      'Office': '#FF9800',
      'Service Center': '#9C27B0'
    };
    return colors[type] || '#757575';
  };

  // Filter locations based on search and filters
  const filteredLocations = locations.filter(location => {
    const matchesSearch = 
      location.locationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.locationCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || location.locationType === filterType;
    const matchesStatus = filterStatus === 'all' || location.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  if (!isStandalone && !customer) return null;

  return (
    <Box sx={{ height: isStandalone ? 'calc(100vh - 112px)' : '80vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 3, 
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
            {isStandalone ? 'All Customer Locations' : 'Customer Locations'}
          </Typography>
          <Typography variant="body1">
            {isStandalone 
              ? `Showing ${filteredLocations.length} locations` 
              : `${customer.firstName} ${customer.lastName} - ${customer.company}`
            }
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="small"
            onClick={handleAddLocation}
            sx={{
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.3)',
              }
            }}
          >
            Add Location
          </Button>
          {onClose && (
            <IconButton onClick={onClose} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Filters for standalone mode */}
      {isStandalone && (
        <Box sx={{ p: 3, bgcolor: 'background.paper', borderBottom: 1, borderColor: 'divider' }}>
          <Grid container spacing={1.5} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  label="Type"
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="Warehouse">Warehouse</MenuItem>
                  <MenuItem value="Distribution Center">Distribution Center</MenuItem>
                  <MenuItem value="Office">Office</MenuItem>
                  <MenuItem value="Service Center">Service Center</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  label="Status"
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                {filteredLocations.length} locations
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Map Section - Temporarily Hidden */}
        {/* 
        <Box sx={{ flex: 1, position: 'relative' }}>
          <MapComponent 
            locations={filteredLocations}
            center={mapCenter}
            zoom={mapZoom}
          />
          
          <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Fab size="small" onClick={handleZoomIn} sx={{ bgcolor: 'white' }}>
              <ZoomInIcon />
            </Fab>
            <Fab size="small" onClick={handleZoomOut} sx={{ bgcolor: 'white' }}>
              <ZoomOutIcon />
            </Fab>
            <Fab size="small" onClick={handleCenterMap} sx={{ bgcolor: 'white' }}>
              <MyLocationIcon />
            </Fab>
          </Box>
        </Box>
        */}

        {/* Locations List - Now Full Width */}
        <Box sx={{ width: '100%', bgcolor: 'white', overflow: 'auto' }}>
          <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '1rem' }}>
              {isStandalone ? 'All Locations' : 'Locations'} ({filteredLocations.length})
            </Typography>
          </Box>

          <Box sx={{ p: 1.5 }}>
            <Grid container spacing={2}>
              {filteredLocations.map((location) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={location.locationId || location.LocationId}>
                  <Card
                    sx={{ 
                      height: '100%',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardActionArea onClick={() => handleViewDetails(location)} sx={{ height: '100%' }}>
                      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                          <Avatar sx={{ bgcolor: getTypeColor(location.locationType || 'Warehouse'), width: 40, height: 40, fontSize: '1rem' }}>
                            {(location.locationName || location.LocationName || 'L').charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem', lineHeight: 1.2 }}>
                              {location.locationName || location.LocationName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                              {location.locationType || 'Warehouse'}
                            </Typography>
                            {isStandalone && location.customerName && (
                              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                                Customer: {location.customerName}
                              </Typography>
                            )}
                          </Box>
                          <Chip
                            label={location.status || 'Active'}
                            color={getStatusColor(location.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize', fontSize: '0.7rem', height: 24 }}
                          />
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.8rem', flex: 1 }}>
                          {location.address || location.Address}
                        </Typography>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Code: {location.locationCode || location.LocationCode || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Weight Limit: {(location.centerDispatchWeightLimit || location.CenterDispatchWeightLimit || 0).toLocaleString()} kg
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                              Advance: {(location.advancePercentageAllowed || location.AdvancePercentageAllowed || 0)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddRate(location);
                              }}
                              sx={{ color: '#4CAF50', p: 0.5 }}
                              title="Add Rate"
                            >
                              <AttachMoneyIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditLocation(location);
                              }}
                              sx={{ color: '#2196F3', p: 0.5 }}
                              title="Edit Location"
                            >
                              <EditIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteLocation(location.locationId || location.LocationId);
                              }}
                              sx={{ color: '#f44336', p: 0.5 }}
                              title="Delete Location"
                            >
                              <DeleteIcon sx={{ fontSize: '1.2rem' }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>

      {/* Location Details Dialog */}
      <Dialog
        open={openLocationDetails}
        onClose={() => setOpenLocationDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          fontWeight: 'bold'
        }}>
          Location Details - {selectedLocation?.locationName || selectedLocation?.LocationName}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {selectedLocation && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location Name"
                  value={selectedLocation.locationName || selectedLocation.LocationName}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Location Code"
                  value={selectedLocation.locationCode || selectedLocation.LocationCode}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Status"
                  value={selectedLocation.status || 'Active'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {isStandalone && selectedLocation.customerName && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Customer"
                    value={selectedLocation.customerName}
                    margin="normal"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              )}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  value={selectedLocation.address || selectedLocation.Address}
                  margin="normal"
                  multiline
                  rows={2}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Latitude"
                  value={selectedLocation.latitude || selectedLocation.Latitude}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Longitude"
                  value={selectedLocation.longitude || selectedLocation.Longitude}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              
              {/* Business Details Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 0.5 }}>
                  Business Configuration
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Center Dispatch Weight Limit"
                  value={`${(selectedLocation.centerDispatchWeightLimit || selectedLocation.CenterDispatchWeightLimit || 0).toLocaleString()} kg`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Advance Percentage Allowed"
                  value={`${selectedLocation.advancePercentageAllowed || selectedLocation.AdvancePercentageAllowed || 0}%`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tolerance Limit Percentage"
                  value={`${selectedLocation.toleranceLimitPercentage || selectedLocation.ToleranceLimitPercentage || 0}%`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tolerance Limit (kg)"
                  value={`${selectedLocation.toleranceLimitKg || selectedLocation.ToleranceLimitKg || 0} kg`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Material Penalty Rate"
                  value={`Rs. ${selectedLocation.materialPenaltyRatePerKg || selectedLocation.MaterialPenaltyRatePerKg || 0} per kg`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              
              {/* Dispatch Loading Charges Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 0.5 }}>
                  Dispatch Loading Charges
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Loading Charges Enabled"
                  value={selectedLocation.dispatchLoadingChargesEnabled || selectedLocation.DispatchLoadingChargesEnabled ? 'Yes' : 'No'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Charge Type"
                  value={selectedLocation.dispatchChargeType || selectedLocation.DispatchChargeType || 'N/A'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fixed Loader Cost"
                  value={`Rs. ${(selectedLocation.fixedLoaderCost || selectedLocation.FixedLoaderCost || 0).toLocaleString()}`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Variable Charge Type"
                  value={selectedLocation.variableChargeType || selectedLocation.VariableChargeType || 'N/A'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Variable Charge Amount"
                  value={`Rs. ${(selectedLocation.variableChargeAmount || selectedLocation.VariableChargeAmount || 0).toLocaleString()}`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              
              {/* Receiving Unloading Charges Section */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 1, color: '#1976d2', borderBottom: '2px solid #1976d2', pb: 0.5 }}>
                  Receiving Unloading Charges
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unloading Charges Enabled"
                  value={selectedLocation.receivingUnloadingCostEnabled || selectedLocation.ReceivingUnloadingCostEnabled ? 'Yes' : 'No'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Receiving Charge Type"
                  value={selectedLocation.receivingChargeType || selectedLocation.ReceivingChargeType || 'N/A'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Fixed Unloading Cost"
                  value={`Rs. ${(selectedLocation.fixedUnloadingCost || selectedLocation.FixedUnloadingCost || 0).toLocaleString()}`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Receiving Variable Charge Type"
                  value={selectedLocation.receivingVariableChargeType || selectedLocation.ReceivingVariableChargeType || 'N/A'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Receiving Variable Charge Amount"
                  value={`Rs. ${(selectedLocation.receivingVariableChargeAmount || selectedLocation.ReceivingVariableChargeAmount || 0).toLocaleString()}`}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              
              {/* Timestamps */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Created On"
                  value={selectedLocation.createdOn || selectedLocation.CreatedOn ? new Date(selectedLocation.createdOn || selectedLocation.CreatedOn).toLocaleString() : 'N/A'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Last Updated"
                  value={selectedLocation.lastUpdatedOn || selectedLocation.LastUpdatedOn ? new Date(selectedLocation.lastUpdatedOn || selectedLocation.LastUpdatedOn).toLocaleString() : 'N/A'}
                  margin="normal"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenLocationDetails(false)}>
            Close
          </Button>
          <Button 
            variant="contained"
            onClick={() => {
              setOpenLocationDetails(false);
              handleEditLocation(selectedLocation);
            }}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            Edit Location
          </Button>
        </DialogActions>
      </Dialog>

      {/* Location Form Dialog */}
      <CustomerLocationForm
        open={openLocationForm}
        onClose={() => {
          setOpenLocationForm(false);
          setEditingLocation(null);
        }}
        customerId={customer?.customerId} // Pass customerId only if in standalone mode
        locationData={editingLocation}
        onSave={handleSaveLocation}
      />

      {/* Material Rate Form Dialog */}
      <MaterialRateForm
        open={openMaterialRateForm}
        onClose={() => {
          setOpenMaterialRateForm(false);
          setSelectedLocationForRate(null);
        }}
        locationId={selectedLocationForRate?.locationId || selectedLocationForRate?.LocationId}
        locationName={selectedLocationForRate?.locationName || selectedLocationForRate?.LocationName}
        customerId={selectedLocationForRate?.customerId || selectedLocationForRate?.CustomerId}
        materialRateData={null}
        onSave={handleSaveMaterialRate}
      />

      {/* Map Dialog */}
      <Dialog
        open={openMapDialog}
        onClose={() => setOpenMapDialog(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '80vh',
            maxHeight: '80vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          fontWeight: 'bold',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography variant="h6">
              {mapLocation?.locationName || mapLocation?.LocationName} - Location on Map
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {mapLocation?.address || mapLocation?.Address}
            </Typography>
          </Box>
          <IconButton onClick={() => setOpenMapDialog(false)} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, position: 'relative', height: 'calc(80vh - 120px)' }}>
          {mapLocation && (
            <Box sx={{ height: '100%', position: 'relative' }}>
              <MapComponent 
                locations={[mapLocation]}
                center={{
                  lat: parseFloat(mapLocation.latitude || mapLocation.Latitude) || 31.5204,
                  lng: parseFloat(mapLocation.longitude || mapLocation.Longitude) || 74.3587
                }}
                zoom={15}
              />
              <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Fab 
                  size="small" 
                  onClick={() => {
                    if (mapLocation) {
                      const lat = parseFloat(mapLocation.latitude || mapLocation.Latitude);
                      const lng = parseFloat(mapLocation.longitude || mapLocation.Longitude);
                      if (lat && lng) {
                        setMapCenter({ lat, lng });
                        setMapZoom(15);
                      }
                    }
                  }} 
                  sx={{ bgcolor: 'white' }}
                  title="Center on location"
                >
                  <MyLocationIcon />
                </Fab>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CustomerLocations; 