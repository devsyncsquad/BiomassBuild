import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  Snackbar,
  Card,
  CardContent,
  Divider,
  Fade,
  Zoom
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  Work as WorkIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import CompanyForm from './CompanyForm';
import './CompanyManagement.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewMode, setIsViewMode] = useState(false);
  
  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    industry: '',
    companySize: '',
    location: '',
    search: ''
  });

  // Enhanced company colors with better contrast
  const companyColors = [
    '#228B22', '#388e3c', '#f57c00', '#7b1fa2', 
    '#d32f2f', '#0097a7', '#5d4037', '#455a64',
    '#1565c0', '#2e7d32', '#ef6c00', '#6a1b9a'
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [companies, filters]);

  const showSnackbar = (message, severity = 'success') => {
    console.log('showSnackbar called with:', message, severity);
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const hideSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const iconUrl = import.meta.env.VITE_LIVE_APP_BASEURL || 'https://localhost:7084/api';
      const response = await fetch(`${iconUrl}/Companies/GetAllCompanies`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch companies');
      }

      const data = await response.json();
      
      if (data.success) {
        setCompanies(data.result || []);
      } else {
        throw new Error(data.message || 'Failed to fetch companies');
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
      setError('Failed to load companies. Please try again.');
      // For demo purposes, use sample data
      setCompanies(getSampleCompanies());
    } finally {
      setLoading(false);
    }
  };

  const getSampleCompanies = () => [
    {
      companyId: 1,
      companyName: 'BSP (Bullah Shah)',
      companyDescription: 'Leading energy solutions provider specializing in renewable energy and sustainable power generation',
      ntn: '123456789',
      contactPersonName: 'Ahmed Khan',
      contactPersonPhone: '+92-300-1234567',
      industry: 'Energy',
      companySize: 'Large',
      location: 'Karachi'
    },
    {
      companyId: 2,
      companyName: 'Sapphaler',
      companyDescription: 'Healthcare technology platform improving patient care through innovative digital solutions',
      ntn: '987654321',
      contactPersonName: 'Fatima Ali',
      contactPersonPhone: '+92-300-9876543',
      industry: 'Healthcare',
      companySize: 'Medium',
      location: 'Lahore'
    },
    {
      companyId: 3,
      companyName: 'Nishat',
      companyDescription: 'Digital banking solutions for modern businesses and consumers with cutting-edge fintech',
      ntn: '456789123',
      contactPersonName: 'Usman Malik',
      contactPersonPhone: '+92-300-4567891',
      industry: 'Banking',
      companySize: 'Large',
      location: 'Islamabad'
    },
    {
      companyId: 4,
      companyName: 'Ithad Chemicals',
      companyDescription: 'E-commerce platform connecting vendors with global customers worldwide',
      ntn: '789123456',
      contactPersonName: 'Ayesha Hassan',
      contactPersonPhone: '+92-300-7891234',
      industry: 'Manufacturing',
      companySize: 'Medium',
      location: 'Faisalabad'
    }
  ];

  const applyFilters = () => {
    let filtered = [...companies];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(company =>
        company.companyName.toLowerCase().includes(searchTerm) ||
        company.companyDescription.toLowerCase().includes(searchTerm) ||
        company.contactPersonName.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.industry) {
      filtered = filtered.filter(company => company.industry === filters.industry);
    }

    if (filters.companySize) {
      filtered = filtered.filter(company => company.companySize === filters.companySize);
    }

    if (filters.location) {
      filtered = filtered.filter(company => company.location === filters.location);
    }

    setFilteredCompanies(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      industry: '',
      companySize: '',
      location: '',
      search: ''
    });
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setIsViewMode(true);
    setIsFormOpen(true);
  };

  const handleAddCompany = () => {
    setSelectedCompany(null);
    setIsViewMode(false);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedCompany(null);
    setIsViewMode(false);
  };

  const handleCompanySaved = () => {
    console.log('Company saved, showing snackbar...');
    handleFormClose();
    fetchCompanies();
    showSnackbar('Company saved successfully!');
  };

  const getCompanyInitials = (companyName) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getCompanyColor = (companyId) => {
    return companyColors[companyId % companyColors.length];
  };

  const getIndustryIcon = (industry) => {
    switch (industry) {
      case 'Technology': return <WorkIcon />;
      case 'Healthcare': return <BusinessIcon />;
      case 'Finance': return <BusinessIcon />;
      case 'Manufacturing': return <WorkIcon />;
      case 'Energy': return <WorkIcon />;
      case 'Retail': return <BusinessIcon />;
      case 'Education': return <BusinessIcon />;
      default: return <BusinessIcon />;
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        gap={3}
      >
        <CircularProgress size={60} thickness={4} />
        <Typography variant="h6" color="text.secondary">
          Loading companies...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, backgroundColor: '#f8fffa', minHeight: '100vh' }}>
      {/* Enhanced Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
        color: 'white',
        p: 4,
        mb: 3,
        borderRadius: '0 0 24px 24px',
        boxShadow: '0 8px 32px rgba(34,139,34,0.2)'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{color: 'white', fontWeight: 700, mb: 1 }}>
              Companies Directory
            </Typography>
            <Typography variant="h6" sx={{color: 'white', opacity: 0.9, fontWeight: 300 }}>
              Discover and explore companies in your industry
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCompany}
            size="large"
            sx={{ 
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 600,
              bgcolor: '#228B22',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              '&:hover': {
                bgcolor: '#006400',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Add Company
          </Button>
        </Box>
      </Box>

      {/* Enhanced Filters Section */}
      <Box sx={{ mb: 4, px: 3 }}>
        <Card sx={{ 
          borderRadius: 4, 
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          overflow: 'visible'
        }}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                          <FilterIcon sx={{ mr: 2, fontSize: '1.5rem', color: '#228B22' }} />
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#228B22' }}>
              Search & Filters
            </Typography>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Industry"
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  size="medium"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#228B22',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Company Size"
                  value={filters.companySize}
                  onChange={(e) => handleFilterChange('companySize', e.target.value)}
                  size="medium"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#228B22',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Location"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  size="medium"
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#228B22',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Search Companies"
                  placeholder="Search by name, description..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  size="medium"
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#228B22' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#228B22',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 3, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={applyFilters} 
                size="large"
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  bgcolor: '#228B22',
                  '&:hover': {
                    bgcolor: '#006400'
                  }
                }}
              >
                Apply Filters
              </Button>
              <Button 
                variant="outlined" 
                onClick={clearFilters} 
                size="large"
                sx={{ 
                  borderRadius: 2,
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: '#228B22',
                  color: '#228B22',
                  '&:hover': {
                    borderColor: '#006400',
                    color: '#006400',
                    bgcolor: 'rgba(34, 139, 34, 0.04)'
                  }
                }}
              >
                Clear All
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Enhanced Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, px: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#228B22' }}>
            Results
          </Typography>
          <Chip 
            label={`${filteredCompanies.length} of ${companies.length} companies`}
            sx={{ 
              fontWeight: 500,
              color: '#228B22',
              borderColor: '#228B22'
            }}
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 3, mb: 3 }}>
          <Alert severity="error" sx={{ borderRadius: 2, fontSize: '0.9rem' }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Enhanced Companies Grid */}
      <Box sx={{ px: 3, pb: 4 }}>
        <Grid container spacing={3}>
          {filteredCompanies.map((company, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={company.companyId}>
              <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => handleViewDetails(company)}
                >
                  {/* Company Header */}
                  <Box sx={{ 
                    p: 3, 
                    background: `linear-gradient(135deg, ${getCompanyColor(company.companyId)} 0%, ${getCompanyColor(company.companyId)}dd 100%)`,
                    color: 'white',
                    borderRadius: '12px 12px 0 0'
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: 'rgba(255,255,255,0.2)',
                          width: 50,
                          height: 50,
                          mr: 2,
                          fontSize: '1.2rem',
                          fontWeight: 600,
                          border: '2px solid rgba(255,255,255,0.3)'
                        }}
                        src={company.logoPath ? `${import.meta.env.VITE_LIVE_APP_BASEURL || 'https://localhost:7084/api'}/Companies/${company.companyId}/logo` : null}
                      >
                        {getCompanyInitials(company.companyName)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1.1rem', color: 'white' }}>
                          {company.companyName}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem', color: 'white', fontWeight: 500 }}>
                          {company.industry || 'Industry not specified'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Company Content */}
                  <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {company.companyDescription}
                    </Typography>

                    <Box sx={{ mb: 3, flexGrow: 1 }}>
                      {/* Company Details */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <LocationIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                          {company.location || 'Location not specified'}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <PeopleIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                          {company.companySize || 'Size not specified'}
                        </Typography>
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                        <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                          {company.contactPersonPhone || 'Phone not specified'}
                        </Typography>
                      </Box>

                      {company.ntn && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <BusinessIcon sx={{ mr: 1, fontSize: '1rem', color: 'text.secondary' }} />
                          <Typography variant="body2" sx={{ fontSize: '0.85rem', color: 'text.secondary' }}>
                            NTN: {company.ntn}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Action Button */}
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<VisibilityIcon />}
                      size="medium"
                      sx={{ 
                        borderRadius: 2,
                        py: 1.5,
                        fontWeight: 600,
                        borderWidth: 2,
                        borderColor: '#228B22',
                        color: '#228B22',
                        '&:hover': {
                          borderWidth: 2,
                          borderColor: '#006400',
                          color: '#006400',
                          bgcolor: 'rgba(34, 139, 34, 0.04)',
                          transform: 'scale(1.02)'
                        },
                        transition: 'all 0.2s ease'
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {filteredCompanies.length === 0 && !loading && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            px: 3
          }}>
            <BusinessIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" color="text.secondary" sx={{ mb: 1 }}>
              No companies found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your filters or add a new company to get started.
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddCompany}
              size="large"
              sx={{ 
                borderRadius: 2, 
                px: 4, 
                py: 1.5,
                bgcolor: '#228B22',
                '&:hover': {
                  bgcolor: '#006400'
                }
              }}
            >
              Add First Company
            </Button>
          </Box>
        )}
      </Box>

      {/* Company Form Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 4, overflow: 'hidden' }
        }}
      >
        <CompanyForm
          company={selectedCompany}
          isViewMode={isViewMode}
          onClose={handleFormClose}
          onSaved={handleCompanySaved}
        />
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={hideSnackbar} 
          severity={snackbar.severity} 
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {/* Debug info */}
      <div style={{ display: 'none' }}>
        Snackbar state: {JSON.stringify(snackbar)}
      </div>
    </Box>
  );
};

export default CompanyManagement; 