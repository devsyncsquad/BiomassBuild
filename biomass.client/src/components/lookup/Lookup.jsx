import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import axios from 'axios';

const Lookup = () => {
  // State management
  const [lookups, setLookups] = useState([]);
  const [allLookups, setAllLookups] = useState([]); // Store all lookups for client-side filtering
  const [domains, setDomains] = useState([]);
  const [domainsLoading, setDomainsLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total: 0,
    enabled: 0,
    disabled: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasError, setHasError] = useState(false);

  // Filter and pagination state
  const [filters, setFilters] = useState({
    search: '',
    domain: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 0,
    pageSize: 10
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLookup, setEditingLookup] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    lookupName: '',
    lookupDomain: '',
    enabled: true,
    sortOrder: 0
  });

  // Ensure formData is always properly initialized
  const safeFormData = {
    lookupName: formData?.lookupName || '',
    lookupDomain: formData?.lookupDomain || '',
    enabled: formData?.enabled === true || formData?.enabled === 'true',
    sortOrder: formData?.sortOrder || 0
  };

  // API base URL
  const API_BASE = 'https://localhost:7084/api/lookups';

  // Error boundary function
  const handleError = (error, errorInfo) => {
    console.error('Lookup component error:', error, errorInfo);
    setHasError(true);
    setError('An unexpected error occurred. Please refresh the page.');
  };

  // Global error handler
  useEffect(() => {
    const handleGlobalError = (event) => {
      handleError(event.error, { componentStack: event.error?.stack });
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason, { type: 'unhandledrejection' });
    });

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleGlobalError);
    };
  }, []);

  // If there's a critical error, show error message
  if (hasError) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
        >
          Refresh Page
        </Button>
      </Box>
    );
  }

  // Fetch data functions
  const fetchLookups = async () => {
    setLoading(true);
    setError('');
    try {
      // Use the unpaginated API to get all lookups
      const response = await axios.get(`${API_BASE}/GetAllLookupsUnpaginated`);
      if (response.data?.success) {
        const allItems = response.data.result || [];
        setAllLookups(allItems);
      } else {
        setError(response.data?.message || 'Failed to fetch lookups');
        setAllLookups([]);
        setLookups([]);
        setPagination(prev => ({ ...prev, total: 0 }));
      }
    } catch (err) {
      console.error('Error fetching lookups:', err);
      setError(err.response?.data?.message || 'Failed to fetch lookups');
      setAllLookups([]);
      setLookups([]);
      setPagination(prev => ({ ...prev, total: 0 }));
    } finally {
      setLoading(false);
    }
  };

  // Update statistics based on filtered data
  const updateStatistics = (items = allLookups) => {
    const total = items.length;
    const enabled = items.filter(item => item.enabled === true).length;
    const disabled = items.filter(item => item.enabled === false).length;
    const pending = items.filter(item => item.sortOrder > 0 && item.enabled === false).length;

    setStatistics({
      total,
      enabled,
      disabled,
      pending
    });
  };

  const fetchDomains = async () => {
    setDomainsLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/GetDomains`);
      if (response.data.success) {
        setDomains(response.data.result || []);
      } else {
        console.error('Failed to fetch domains:', response.data.message);
        setDomains([]); // Ensure domains is always an array
      }
    } catch (err) {
      console.error('Failed to fetch domains:', err);
      setDomains([]); // Ensure domains is always an array on error
      setError('Failed to load domains. Please refresh the page.');
    } finally {
      setDomainsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`${API_BASE}/GetStatistics`);
      if (response.data.success) {
        setStatistics(response.data.result || {
          total: 0,
          enabled: 0,
          disabled: 0,
          pending: 0
        });
      } else {
        console.error('Failed to fetch statistics:', response.data.message);
        setStatistics({
          total: 0,
          enabled: 0,
          disabled: 0,
          pending: 0
        });
      }
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
      setStatistics({
        total: 0,
        enabled: 0,
        disabled: 0,
        pending: 0
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchLookups();
    fetchDomains();
    fetchStatistics();
  }, []); // Only run once on mount

  // Memoized filtered results for better performance
  const filteredLookups = useMemo(() => {
    let filteredItems = [...allLookups];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredItems = filteredItems.filter(item => 
        item.lookupName?.toLowerCase().includes(searchTerm) ||
        item.lookupId?.toString().includes(searchTerm) ||
        item.lookupDomain?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply domain filter
    if (filters.domain) {
      filteredItems = filteredItems.filter(item => 
        item.lookupDomain === filters.domain
      );
    }

    // Apply status filter
    if (filters.status) {
      switch (filters.status.toLowerCase()) {
        case 'enabled':
          filteredItems = filteredItems.filter(item => item.enabled === true);
          break;
        case 'disabled':
          filteredItems = filteredItems.filter(item => item.enabled === false);
          break;
        case 'pending':
          filteredItems = filteredItems.filter(item => 
            item.sortOrder > 0 && item.enabled === false
          );
          break;
      }
    }

    return filteredItems;
  }, [allLookups, filters.search, filters.domain, filters.status]);

  // Memoized paginated results
  const paginatedLookups = useMemo(() => {
    const startIndex = pagination.page * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredLookups.slice(startIndex, endIndex);
  }, [filteredLookups, pagination.page, pagination.pageSize]);

  // Update lookups and pagination when filtered results change
  useEffect(() => {
    setLookups(paginatedLookups);
    setPagination(prev => ({ ...prev, total: filteredLookups.length }));
  }, [paginatedLookups, filteredLookups.length]);

  // Update statistics when filtered results change
  useEffect(() => {
    updateStatistics(filteredLookups);
  }, [filteredLookups]);

  // Handle search input change
  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  const handleFilterReset = () => {
    setFilters({ search: '', domain: '', status: '' });
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page
  };

  // Handle pagination changes
  const handlePageChange = (event, newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (event) => {
    setPagination(prev => ({ 
      ...prev, 
      pageSize: parseInt(event.target.value, 10),
      page: 0 // Reset to first page when changing page size
    }));
  };

  // Handle form operations
  const handleAddNew = () => {
    setEditingLookup(null);
    setFormData({
      lookupName: '',
      lookupDomain: '',
      enabled: true,
      sortOrder: 0
    });
    setModalOpen(true);
  };

  const handleEdit = (lookup) => {
    try {
      if (!lookup || typeof lookup !== 'object') {
        console.error('Invalid lookup data for editing:', lookup);
        setError('Invalid lookup data for editing');
        return;
      }

      setEditingLookup(lookup);
      setFormData({
        lookupName: lookup.lookupName || '',
        lookupDomain: lookup.lookupDomain || '',
        enabled: lookup.enabled === true || lookup.enabled === 'true',
        sortOrder: lookup.sortOrder || 0
      });
      setModalOpen(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      setError('Failed to open edit form');
    }
  };

  const handleDelete = (lookup) => {
    try {
      if (!lookup || typeof lookup !== 'object') {
        console.error('Invalid lookup data for deletion:', lookup);
        setError('Invalid lookup data for deletion');
        return;
      }

      setDeleteConfirm(lookup);
    } catch (error) {
      console.error('Error in handleDelete:', error);
      setError('Failed to prepare deletion');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm || typeof deleteConfirm !== 'object') {
      console.error('Invalid delete confirmation data:', deleteConfirm);
      setError('Invalid deletion data');
      return;
    }
    
    try {
      const response = await axios.delete(`${API_BASE}/DeleteLookup/${deleteConfirm.lookupId}`);
      if (response.data?.success) {
        setDeleteConfirm(null);
        // Refresh all data and reapply filters
        fetchLookups();
      } else {
        setError(response.data?.message || 'Failed to delete lookup');
      }
    } catch (err) {
      console.error('Error deleting lookup:', err);
      setError(err.response?.data?.message || 'Failed to delete lookup');
    }
  };

  const handleSave = async () => {
    try {
      // Validate form data
      if (!formData.lookupName || !formData.lookupDomain) {
        setError('Please fill in all required fields');
        return;
      }

      let response;
      if (editingLookup && editingLookup.lookupId) {
        response = await axios.put(`${API_BASE}/UpdateLookup/${editingLookup.lookupId}`, formData);
      } else {
        response = await axios.post(`${API_BASE}/CreateLookup`, formData);
      }

      if (response.data?.success) {
        setModalOpen(false);
        setEditingLookup(null);
        // Refresh all data and reapply filters
        fetchLookups();
      } else {
        setError(response.data?.message || 'Failed to save lookup');
      }
    } catch (err) {
      console.error('Error saving lookup:', err);
      setError(err.response?.data?.message || 'Failed to save lookup');
    }
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get status chip color
  const getStatusChip = (enabled, sortOrder) => {
    try {
      if (enabled === true || enabled === 'true') {
        return <Chip label="Enabled" color="success" size="small" icon={<CheckCircleIcon />} />;
      } else if (sortOrder && sortOrder > 0) {
        return <Chip label="Pending" color="warning" size="small" icon={<ScheduleIcon />} />;
      } else {
        return <Chip label="Disabled" color="error" size="small" icon={<CancelIcon />} />;
      }
    } catch (error) {
      console.error('Error in getStatusChip:', error);
      return <Chip label="Unknown" color="default" size="small" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold" color="primary">
          Lookup Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddNew}
          sx={{ bgcolor: '#228B22', '&:hover': { bgcolor: '#006400' } }}
        >
          Add Lookup
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e9ecef' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                {statistics.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Lookups
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#d4edda', border: '1px solid #c3e6cb' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {statistics.enabled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enabled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#f8d7da', border: '1px solid #f5c6cb' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {statistics.disabled}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Disabled
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#fff3cd', border: '1px solid #ffeaa7' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {statistics.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FilterIcon color="primary" />
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
        </Box>
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search by Name, ID, or Domain"
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Type to search..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                endAdornment: filters.search && (
                  <IconButton
                    size="small"
                    onClick={() => handleSearchChange('')}
                    sx={{ mr: -0.5 }}
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                )
              }}
              helperText={`${lookups.length} of ${allLookups.length} results`}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Domain</InputLabel>
              <Select
                value={filters.domain}
                label="Domain"
                onChange={(e) => handleFilterChange('domain', e.target.value)}
              >
                <MenuItem value="">All Domains</MenuItem>
                {domainsLoading ? (
                  <MenuItem value="" disabled>
                    Loading domains...
                  </MenuItem>
                ) : domains && domains.length > 0 ? (
                  domains.map((domain) => (
                    <MenuItem key={domain} value={domain}>
                      {domain}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value="" disabled>
                    No domains available
                  </MenuItem>
                )}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="enabled">Enabled</MenuItem>
                <MenuItem value="disabled">Disabled</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant="outlined"
                onClick={handleFilterReset}
                sx={{ flex: 1 }}
              >
                Reset
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  fetchLookups();
                  fetchStatistics();
                }}
                startIcon={<RefreshIcon />}
                sx={{ flex: 1 }}
              >
                Refresh
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Filter Summary */}
      {(filters.search || filters.domain || filters.status) && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Active Filters:
            </Typography>
            {filters.search && (
              <Chip 
                label={`Search: "${filters.search}"`} 
                size="small" 
                onDelete={() => handleFilterChange('search', '')}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.domain && (
              <Chip 
                label={`Domain: ${filters.domain}`} 
                size="small" 
                onDelete={() => handleFilterChange('domain', '')}
                color="secondary"
                variant="outlined"
              />
            )}
            {filters.status && (
              <Chip 
                label={`Status: ${filters.status}`} 
                size="small" 
                onDelete={() => handleFilterChange('status', '')}
                color="info"
                variant="outlined"
              />
            )}
            <Button 
              size="small" 
              variant="outlined" 
              onClick={handleFilterReset}
              sx={{ ml: 'auto' }}
            >
              Clear All
            </Button>
          </Box>
        </Paper>
      )}

      {/* Data Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#228B22' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Domain</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sort Order</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Loading lookups...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : allLookups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No lookups found in the system
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : lookups.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No lookups match your current filters
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleFilterReset}
                      sx={{ mt: 1 }}
                    >
                      Clear Filters
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                lookups.map((lookup) => {
                  // Safety check for malformed lookup data
                  if (!lookup || typeof lookup !== 'object') {
                    return null;
                  }
                  
                  return (
                    <TableRow key={lookup.lookupId || Math.random()} hover>
                      <TableCell>{lookup.lookupId || 'N/A'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {lookup.lookupName || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={lookup.lookupDomain || 'N/A'} variant="outlined" size="small" />
                      </TableCell>
                      <TableCell>
                        {getStatusChip(lookup.enabled, lookup.sortOrder)}
                      </TableCell>
                      <TableCell>{lookup.sortOrder || 0}</TableCell>
                      <TableCell>{lookup.createdOn ? formatDate(lookup.createdOn) : 'N/A'}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="Edit">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleEdit(lookup)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(lookup)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                }).filter(Boolean) // Remove any null rows
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={pagination.total || 0}
          rowsPerPage={pagination.pageSize}
          page={pagination.page}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handlePageSizeChange}
          labelDisplayedRows={({ from, to, count }) => 
            `Showing ${from}-${to} of ${count}`
          }
        />
      </Paper>

      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingLookup ? 'Edit Lookup' : 'Add New Lookup'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={safeFormData.lookupName}
                onChange={(e) => handleFormChange('lookupName', e.target.value)}
                required
                helperText="2-100 characters"
                error={safeFormData.lookupName && safeFormData.lookupName.length > 0 && (safeFormData.lookupName.length < 2 || safeFormData.lookupName.length > 100)}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Domain</InputLabel>
                <Select
                  value={safeFormData.lookupDomain}
                  label="Domain"
                  onChange={(e) => handleFormChange('lookupDomain', e.target.value)}
                >
                  {domainsLoading ? (
                    <MenuItem value="" disabled>
                      Loading domains...
                    </MenuItem>
                  ) : domains && domains.length > 0 ? (
                    domains.map((domain) => (
                      <MenuItem key={domain} value={domain}>
                        {domain}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem value="" disabled>
                      No domains available
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={safeFormData.enabled}
                  label="Status"
                  onChange={(e) => handleFormChange('enabled', e.target.value)}
                >
                  <MenuItem value={true}>Enabled</MenuItem>
                  <MenuItem value={false}>Disabled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Sort Order"
                type="number"
                value={safeFormData.sortOrder}
                onChange={(e) => handleFormChange('sortOrder', parseInt(e.target.value) || 0)}
                inputProps={{ min: 0 }}
                helperText="Optional, ≥ 0"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={
              !safeFormData.lookupName || 
              !safeFormData.lookupDomain || 
              safeFormData.lookupName.length < 2 || 
              safeFormData.lookupName.length > 100 ||
              domainsLoading ||
              domains.length === 0
            }
          >
            {editingLookup ? 'Update' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteConfirm && deleteConfirm?.lookupId} onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the lookup "{deleteConfirm?.lookupName || 'Unknown'}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button 
            color="error" 
            variant="contained" 
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lookup;


