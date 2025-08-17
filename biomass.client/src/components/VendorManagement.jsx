import React, { useState, useEffect } from 'react';
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
  Fab
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

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openVendorForm, setOpenVendorForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Mock data for vendors
  const mockVendors = [
    {
      id: 1,
      name: 'TechCorp Solutions',
      category: 'Technology',
      status: 'active',
      rating: 4.2,
      projects: 24,
      lastActive: '2 days ago',
      color: '#2196F3'
    },
    {
      id: 2,
      name: 'Global Manufacturing',
      category: 'Manufacturing',
      status: 'active',
      rating: 4.8,
      projects: 18,
      lastActive: '1 hour ago',
      color: '#4CAF50'
    },
    {
      id: 3,
      name: 'Creative Services Ltd',
      category: 'Design & Marketing',
      status: 'pending',
      rating: 4.1,
      projects: 17,
      lastActive: '3 days ago',
      color: '#9C27B0'
    },
    {
      id: 4,
      name: 'Supply Chain Pro',
      category: 'Logistics',
      status: 'active',
      rating: 4.5,
      projects: 32,
      lastActive: '5 hours ago',
      color: '#FF9800'
    },
    {
      id: 5,
      name: 'Quality Materials Co',
      category: 'Raw Materials',
      status: 'inactive',
      rating: 3.8,
      projects: 12,
      lastActive: '1 week ago',
      color: '#F44336'
    },
    {
      id: 6,
      name: 'Innovation Labs',
      category: 'Research & Development',
      status: 'active',
      rating: 4.7,
      projects: 28,
      lastActive: '6 hours ago',
      color: '#00BCD4'
    }
  ];

  useEffect(() => {
    setVendors(mockVendors);
    setFilteredVendors(mockVendors);
  }, []);

  useEffect(() => {
    const filtered = vendors.filter(vendor =>
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVendors(filtered);
  }, [searchTerm, vendors]);

  const getStatusColor = (status) => {
    switch (status) {
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
    switch (status) {
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

  const handleSaveVendor = (vendorData) => {
    if (isEditMode) {
      setVendors(prev => prev.map(v => v.id === vendorData.id ? vendorData : v));
    } else {
      const newVendor = {
        ...vendorData,
        id: Date.now(),
        rating: 0,
        projects: 0,
        lastActive: 'Just now',
        color: '#757575'
      };
      setVendors(prev => [...prev, newVendor]);
    }
    setOpenVendorForm(false);
    setSelectedVendor(null);
    setIsEditMode(false);
  };

  const stats = {
    total: vendors.length,
    active: vendors.filter(v => v.status === 'active').length,
    pending: vendors.filter(v => v.status === 'pending').length,
    inactive: vendors.filter(v => v.status === 'inactive').length
  };

  return (
    <Box sx={{ p: 0, width: '100%', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 2
          }}
        >
          Vendor Management
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your vendor relationships, track performance, and streamline procurement processes.
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4, px: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.total}
                  </Typography>
                  <Typography variant="body2">Total Vendors</Typography>
                </Box>
                <BusinessIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.active}
                  </Typography>
                  <Typography variant="body2">Active Vendors</Typography>
                </Box>
                <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.pending}
                  </Typography>
                  <Typography variant="body2">Pending Review</Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #F44336 0%, #D32F2F 100%)',
            color: 'white',
            transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-4px)' }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {stats.inactive}
                  </Typography>
                  <Typography variant="body2">Inactive</Typography>
                </Box>
                <CancelIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, px: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search vendors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
            <TextField
              fullWidth
              placeholder="Filter by category"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton
                onClick={() => setViewMode('grid')}
                sx={{ 
                  bgcolor: viewMode === 'grid' ? '#2563eb' : 'transparent',
                  color: viewMode === 'grid' ? 'white' : 'inherit'
                }}
              >
                <GridViewIcon />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                sx={{ 
                  bgcolor: viewMode === 'list' ? '#2563eb' : 'transparent',
                  color: viewMode === 'list' ? 'white' : 'inherit'
                }}
              >
                <ViewListIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Vendor Cards */}
      <Grid container spacing={3} sx={{ px: 3 }}>
        {filteredVendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor.id}>
            <Card sx={{ 
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'translateY(-8px)',
                boxShadow: 8
              }
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: vendor.color, mr: 2 }}>
                    {vendor.name.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      {vendor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {vendor.category}
                    </Typography>
                  </Box>
                  <Chip
                    label={vendor.status}
                    color={getStatusColor(vendor.status)}
                    size="small"
                    icon={getStatusIcon(vendor.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={vendor.rating} readOnly size="small" />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {vendor.rating}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Projects: {vendor.projects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Last Active: {vendor.lastActive}
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="contained"
                    size="small"
                    fullWidth
                    onClick={() => handleViewDetails(vendor)}
                    sx={{
                      background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                      }
                    }}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    onClick={() => handleEditVendor(vendor)}
                  >
                    Contact
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
      />
    </Box>
  );
};

export default VendorManagement; 