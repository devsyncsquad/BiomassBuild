import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Star as StarIcon
} from '@mui/icons-material';
import VendorRegistration from './VendorRegistration';
import './VendorManagement.css';
import { useVendors, useCreateVendor, useUpdateVendor, useVendorStats } from '../hooks/useVendors';
import { debounce } from 'lodash';

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [openVendorForm, setOpenVendorForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // React Query hooks
  const { data: vendorsData, isLoading: isLoadingVendors } = useVendors();
  const { data: statsData, isLoading: isLoadingStats } = useVendorStats();
  const createVendorMutation = useCreateVendor();
  const updateVendorMutation = useUpdateVendor();

  // Debug logs
  console.log('Vendors Data:', vendorsData);
  console.log('Stats Data:', statsData);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status === selectedStatus ? '' : status);
  };

  // Handle snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle vendor save
  const handleSaveVendor = async (vendorData) => {
    try {
      if (isEditMode && selectedVendor) {
        await updateVendorMutation.mutateAsync({
          id: selectedVendor.vendorId,
          ...vendorData
        });
        setSnackbar({
          open: true,
          message: 'Vendor updated successfully',
          severity: 'success'
        });
      } else {
        await createVendorMutation.mutateAsync(vendorData);
        setSnackbar({
          open: true,
          message: 'Vendor created successfully',
          severity: 'success'
        });
      }
      setOpenVendorForm(false);
      setSelectedVendor(null);
      setIsEditMode(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || 'An error occurred',
        severity: 'error'
      });
    }
  };

  // Filter vendors on the client side
  const vendors = useMemo(() => {
    const allVendors = vendorsData?.result || [];
    console.log('All Vendors:', allVendors); // Debug log
    return allVendors.filter(vendor => {
      const matchesSearch = !searchTerm || 
        vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.cnic.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = !selectedStatus || vendor.status?.toLowerCase() === selectedStatus?.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [vendorsData?.result, searchTerm, selectedStatus]);

  // Use API stats or calculate from filtered vendors as fallback
  const stats = useMemo(() => {
    if (statsData?.result) {
      return statsData.result;
    }
    // Fallback to calculated stats if API stats are not available
    return {
      total: vendors.length,
      active: vendors.filter(v => v.status?.toLowerCase() === 'active').length,
      pending: vendors.filter(v => v.status?.toLowerCase() === 'pending').length,
      inactive: vendors.filter(v => v.status?.toLowerCase() === 'inactive').length
    };
  }, [statsData?.result, vendors]);

  // Loading states
  if (isLoadingVendors || isLoadingStats) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Check if we have data
  if (!vendorsData?.result) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>No vendors data available</Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return <CheckCircleIcon />;
      case 'pending':
        return <WarningIcon />;
      case 'inactive':
        return <CancelIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  const handleAddVendor = () => {
    setSelectedVendor(null);
    setIsEditMode(false);
    setOpenVendorForm(true);
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditMode(false);
    setOpenVendorForm(true);
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditMode(true);
    setOpenVendorForm(true);
  };





  return (
    <Box sx={{ p: 0, pt: 3, width: '100%', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: '#228B22',
              mb: 1
            }}
          >
            Vendor Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#2e7d32' }}>
            Manage your vendor relationships, track performance, and streamline procurement processes.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddVendor}
          sx={{
            bgcolor: 'green',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#1565c0'
            }
          }}
        >
          Add New Vendor
        </Button>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            bgcolor: '#228B22',
            borderRadius: 2,
            p: 2.5,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            boxShadow: '0 2px 4px rgba(34, 139, 34, 0.2)'
          }}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BusinessIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                {stats.total}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Total Vendors</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            bgcolor: '#2e7d32',
            borderRadius: 2,
            p: 2,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircleIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.active}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Active Vendors</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            bgcolor: '#ff9800',
            borderRadius: 2,
            p: 2,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <WarningIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.pending}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Pending Review</Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ 
            bgcolor: '#d32f2f',
            borderRadius: 2,
            p: 2,
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}>
            <Box sx={{ 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 1,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CancelIcon />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {stats.inactive}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white' }}>Inactive</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, px: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                fullWidth
                placeholder="Search vendors..."
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#666' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: 'rgba(0,0,0,0.1)'
                    },
                    '&:hover fieldset': {
                      borderColor: '#228B22'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#228B22'
                    }
                  }
                }}
              />
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckCircleIcon />}
                onClick={() => handleStatusChange('Active')}
                sx={{
                  backgroundColor: selectedStatus === 'Active' ? '#2e7d32' : '#e0e0e0',
                  color: selectedStatus === 'Active' ? 'white' : 'black',
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Active
              </Button>
              <Button
                variant="contained"
                color="warning"
                startIcon={<WarningIcon />}
                onClick={() => handleStatusChange('Pending')}
                sx={{
                  backgroundColor: selectedStatus === 'Pending' ? '#ed6c02' : '#e0e0e0',
                  color: selectedStatus === 'Pending' ? 'white' : 'black',
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Pending
              </Button>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon />}
                onClick={() => handleStatusChange('Inactive')}
                sx={{
                  backgroundColor: selectedStatus === 'Inactive' ? '#d32f2f' : '#e0e0e0',
                  color: selectedStatus === 'Inactive' ? 'white' : 'black',
                  borderRadius: '8px',
                  textTransform: 'none'
                }}
              >
                Inactive
              </Button>
              <Box sx={{ display: 'flex', gap: 1, marginLeft: 'auto' }}>
                <IconButton
                  onClick={() => setViewMode('grid')}
                  sx={{ 
                    bgcolor: viewMode === 'grid' ? '#228B22' : 'transparent',
                    color: viewMode === 'grid' ? 'white' : 'inherit',
                    '&:hover': {
                      bgcolor: viewMode === 'grid' ? '#1b5e20' : '#e0e0e0'
                    }
                  }}
                >
                  <GridViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => setViewMode('list')}
                  sx={{ 
                    bgcolor: viewMode === 'list' ? '#228B22' : 'transparent',
                    color: viewMode === 'list' ? 'white' : 'inherit',
                    '&:hover': {
                      bgcolor: viewMode === 'list' ? '#1b5e20' : '#e0e0e0'
                    }
                  }}
                >
                  <ViewListIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Vendor Cards */}
      <Grid container spacing={3} sx={{ px: 3 }}>
        {vendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor.vendorId}>
            <Card sx={{ 
              bgcolor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              '&:hover': { 
                transform: 'translateY(-2px)',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ 
                flex: 1, // Take remaining space
                display: 'flex',
                flexDirection: 'column',
                bgcolor: 'white',
                color: '#228B22'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ 
                    bgcolor: vendor.status === 'Active' ? '#2e7d32' : 
                            vendor.status === 'Pending' ? '#ff9800' : '#d32f2f',
                    mr: 2 
                  }}>
                    {vendor.vendorName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ 
                      fontWeight: 600, 
                      color: '#333',
                      fontSize: '1rem',
                      mb: 0.5
                    }}>
                      {vendor.vendorName}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#666',
                      fontSize: '0.875rem'
                    }}>
                      {vendor.address}
                    </Typography>
                  </Box>
                  <Chip
                    label={vendor.status}
                    color={
                      vendor.status === 'Active' ? 'success' :
                      vendor.status === 'Pending' ? 'warning' : 'error'
                    }
                    size="small"
                    icon={getStatusIcon(vendor.status)}
                    sx={{ 
                      textTransform: 'capitalize',
                      '& .MuiChip-label': {
                        fontWeight: 500
                      }
                    }}
                  />
                </Box>

                <Box sx={{ 
                  mb: 2,
                  mt: 'auto',
                  borderTop: '1px solid rgba(0,0,0,0.1)',
                  pt: 2
                }}>
                  <Typography variant="body2" sx={{ 
                    mb: 0.5,
                    color: '#666',
                    fontSize: '0.875rem'
                  }}>
                    Phone: {vendor.phone1}
                  </Typography>
                  {vendor.phone2 && (
                    <Typography variant="body2" sx={{ 
                      mb: 0.5,
                      color: '#666',
                      fontSize: '0.875rem'
                    }}>
                      Alt Phone: {vendor.phone2}
                    </Typography>
                  )}
                  <Typography variant="body2" sx={{ 
                    color: '#666',
                    fontSize: '0.875rem'
                  }}>
                    CNIC: {vendor.cnic}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => handleViewDetails(vendor)}
                    sx={{
                      bgcolor: '#228B22',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      '&:hover': {
                        bgcolor: '#1b6b1b'
                      }
                    }}
                  >
                    View Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Field Requirements Footer */}
      <Box sx={{ mt: 6, p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1, mx: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Field Requirements
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Mandatory Fields
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2">Vendor Name</Typography>
              <Typography component="li" variant="body2">Vendor Address</Typography>
              <Typography component="li" variant="body2">Primary Phone Number</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
              Optional Fields
            </Typography>
            <Box component="ul" sx={{ pl: 2 }}>
              <Typography component="li" variant="body2">CNIC Front Image</Typography>
              <Typography component="li" variant="body2">CNIC Back Image</Typography>
              <Typography component="li" variant="body2">Additional Phone Numbers</Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Vendor Registration Dialog */}
      <VendorRegistration
        open={openVendorForm}
        onClose={() => {
          setOpenVendorForm(false);
          setSelectedVendor(null);
          setIsEditMode(false);
        }}
        vendor={selectedVendor}
        isEditMode={isEditMode}
        onSave={handleSaveVendor}
        onEdit={handleEditVendor}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorManagement; 