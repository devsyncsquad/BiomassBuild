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
  Paper
} from '@mui/material';
import {
  Search as SearchIcon,
  Business as BusinessIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
  FilterList as FilterIcon
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
  
  // Filter states
  const [filters, setFilters] = useState({
    industry: '',
    companySize: '',
    location: '',
    search: ''
  });

  // Sample company colors for avatars
  const companyColors = [
    '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', 
    '#F44336', '#00BCD4', '#795548', '#607D8B'
  ];

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [companies, filters]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
      const response = await fetch(`${baseUrl}/api/companies`, {
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
      companyDescription: 'Leading energy solutions provider',
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
      companyDescription: 'Healthcare technology platform improving patient care through innovation',
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
      companyDescription: 'Digital banking solutions for modern businesses and consumers',
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
      companyDescription: 'E-commerce platform connecting vendors with global customers',
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
    handleFormClose();
    fetchCompanies();
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, p: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', fontSize: '1.25rem', mb: 0.5 }}>
            Companies Directory
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
            Discover and explore companies in your industry
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddCompany}
          size="small"
          sx={{ borderRadius: 1.5 }}
        >
          Add Company
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ mb: 1.5, p: 3, bgcolor: 'background.paper', borderRadius: 0, boxShadow: 1, mx: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <FilterIcon sx={{ mr: 1, fontSize: '1rem' }} />
          <Typography variant="h6" sx={{ fontSize: '1rem' }}>Filters</Typography>
        </Box>
        
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Industry"
              value={filters.industry}
              onChange={(e) => handleFilterChange('industry', e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Company Size"
              value={filters.companySize}
              onChange={(e) => handleFilterChange('companySize', e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search companies..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
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
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 1.5, mt: 1.5 }}>
          <Button variant="contained" onClick={applyFilters} size="small">
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={clearFilters} size="small">
            Clear All
          </Button>
        </Box>
      </Box>

      {/* Results Count */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5, px: 3 }}>
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          Showing {filteredCompanies.length} of {companies.length} companies
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 3, mb: 1.5 }}>
          <Alert severity="error" sx={{ fontSize: '0.8rem' }}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Companies Grid */}
      <Box sx={{ px: 3 }}>
        <Grid container spacing={1.5}>
          {filteredCompanies.map((company) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={company.companyId}>
              <Paper 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  p: 1.5,
                  borderRadius: 1.5,
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                  <Avatar
                    sx={{
                      bgcolor: getCompanyColor(company.companyId),
                      width: 40,
                      height: 40,
                      mr: 1.5,
                      fontSize: '0.9rem'
                    }}
                    src={company.logoPath ? `${import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084'}/api/companies/${company.companyId}/logo` : null}
                  >
                    {getCompanyInitials(company.companyName)}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.25, fontSize: '0.9rem' }}>
                      {company.companyName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontSize: '0.75rem' }}>
                      {company.companyDescription}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 1.5 }}>
                  <Typography variant="body2" sx={{ mb: 0.25, fontSize: '0.75rem' }}>
                    <strong>NTN:</strong> {company.ntn || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.25, fontSize: '0.75rem' }}>
                    <strong>Primary Contact Person:</strong> {company.contactPersonName || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.25, fontSize: '0.75rem' }}>
                    <strong>Contact Number:</strong> {company.contactPersonPhone || 'N/A'}
                  </Typography>
                </Box>

                <Box sx={{ mt: 'auto' }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(company)}
                    size="small"
                    sx={{ borderRadius: 1.5, fontSize: '0.75rem', py: 0.5 }}
                  >
                    View Details
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Information Banner */}
      <Box sx={{ mt: 2, px: 3 }}>
        <Alert severity="info" icon={<BusinessIcon />} sx={{ fontSize: '0.8rem' }}>
          <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
            <strong>Information:</strong> Ensure all mandatory fields are completed. Optional compliance numbers should be provided if your company is registered for these services. This information will be used for regulatory compliance and business documentation.
          </Typography>
        </Alert>
      </Box>

      {/* Company Form Dialog */}
      <Dialog
        open={isFormOpen}
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <CompanyForm
          company={selectedCompany}
          isViewMode={isViewMode}
          onClose={handleFormClose}
          onSaved={handleCompanySaved}
        />
      </Dialog>
    </Box>
  );
};

export default CompanyManagement; 