'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Grid,
  InputAdornment,
  Typography,
  Divider,
  Card,
  CardContent,
  Paper,
  Chip,
  OutlinedInput,
  Checkbox,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Phone,
  Badge,
  Security,
  Lock,
  Comment,
  Save,
  Clear,
  Add,
  Business
} from '@mui/icons-material';
import axios from 'axios';
import { getAuthHeaders } from '../../../utils/auth';
import { getBaseUrl } from '../../../utils/api';

const AddUser = ({ userData, setUserData }) => {
  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { empId: 1 }; // Default empId if no user
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { empId: 1 }; // Default empId
    }
  };
  const currentUser = getCurrentUser();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    passwordHash: '',
    empNo: '',
    phoneNumber: '',
    isTeamLead: 'N',
    enabled: 'Y',
    comments: 'User created via user management',
    reportingTo: 0,
    roleId: '',
    customerIds: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [roles, setRoles] = useState([]);
  const [customers, setCustomers] = useState([]);

  // Fetch roles and customers on component mount
  useEffect(() => {
    fetchRoles();
    fetchCustomers();
  }, []);

  // Load user data for editing
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        username: userData.username || '',
        passwordHash: '', // Don't show password when editing
        empNo: userData.empNo || '',
        phoneNumber: userData.phoneNumber || '',
        isTeamLead: userData.isTeamLead || 'N',
        enabled: userData.enabled || 'Y',
        comments: userData.comments || '',
        reportingTo: userData.reportingTo || 0,
        roleId: userData.roleId || '',
        customerIds: userData.customerIds || []
      });
    }
  }, [userData]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/UserManagement/GetRoleList`, {
        headers: getAuthHeaders()
      });
      if (response.data && response.data.success) {
        setRoles(response.data.result || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(`${getBaseUrl()}/Customers/GetAllCustomers`, {
        headers: getAuthHeaders()
      });
      if (response.data && response.data.success) {
        setCustomers(response.data.result || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle numeric fields
    let processedValue = value;
    if (name === 'empNo' || name === 'reportingTo') {
      processedValue = value === '' ? '' : parseInt(value) || 0;
    } else if (name === 'roleId') {
      processedValue = value === '' ? '' : parseInt(value) || '';
    }
    
    setFormData({
      ...formData,
      [name]: processedValue
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    console.log('Validating form with userData:', userData);
    console.log('Form data for validation:', formData);
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!userData && !formData.passwordHash.trim()) newErrors.passwordHash = 'Password is required';
    if (!formData.empNo) newErrors.empNo = 'Employee number is required';
    if (!formData.roleId) newErrors.roleId = 'Role is required';
    
    console.log('Validation errors found:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submitted! userData:', userData);
    console.log('Form data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed, returning');
      return;
    }
    
    console.log('Form validation passed, proceeding with submission');
    setLoading(true);
    setSuccessMessage('');
    
    try {
      let response;
      
      if (userData) {
        console.log('Updating existing user with ID:', userData.userId);
        // Update existing user - add UpdatedBy field
        const updateData = {
          ...formData,
          userId: userData.userId, // Make sure userId is included
          updatedBy: currentUser.empId || 1 // Use current user's empId or default to 1
        };
        
        console.log('Update data being sent:', updateData);
        console.log('API endpoint:', `${getBaseUrl()}/UserManagement/UpdateUser`);
        console.log('Headers:', getAuthHeaders());
        
        response = await axios.put(`${getBaseUrl()}/UserManagement/UpdateUser`, updateData, {
          headers: getAuthHeaders()
        });
        
        console.log('Update response:', response.data);
      } else {
        console.log('Creating new user');
        // Create new user - add CreatedBy field
        const createData = {
          ...formData,
          createdBy: currentUser.empId || 1 // Use current user's empId or default to 1
        };
        
        console.log('Create data being sent:', createData);
        
        response = await axios.post(`${getBaseUrl()}/UserManagement/SaveUser`, createData, {
          headers: getAuthHeaders()
        });
        
        console.log('Create response:', response.data);
      }
      
      if (response.data && response.data.success) {
        setSuccessMessage(userData ? 'User updated successfully!' : 'User created successfully!');
        if (!userData) {
          // Reset form for new user creation
          setFormData({
            firstName: '',
            lastName: '',
            username: '',
            passwordHash: '',
            empNo: '',
            phoneNumber: '',
            isTeamLead: 'N',
            enabled: 'Y',
            comments: 'User created via user management',
            reportingTo: 0,
            roleId: '',
            customerIds: []
          });
        }
        setUserData(null); // Clear editing state
      } else {
        setErrors({ submit: response.data?.message || 'Failed to save user' });
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ submit: 'Failed to save user. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setUserData(null);
    setFormData({
      firstName: '',
      lastName: '',
      username: '',
      passwordHash: '',
      empNo: '',
      phoneNumber: '',
      isTeamLead: 'N',
      enabled: 'Y',
      comments: 'User created via user management',
      reportingTo: 0,
      roleId: '',
      customerIds: []
    });
    setErrors({});
    setSuccessMessage('');
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      <Card sx={{ 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        {/* Header */}
        <Box sx={{
          background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
          p: 3,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ fontSize: '2rem' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, color: 'white' }}>
                {userData ? 'Edit User' : 'Add New User'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9, color: 'white' }}>
                {userData ? 'Update user information and permissions' : 'Create a new user account with role assignments'}
              </Typography>
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Success Message */}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: '12px' }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {errors.submit && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
              {errors.submit}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            
            {/* Form Fields - No Section Headings */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Basic Information Fields */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="firstName"
                  label="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="lastName"
                  label="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  error={!!errors.username}
                  helperText={errors.username}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Contact & Security Fields */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="passwordHash"
                  label="Password"
                  type="password"
                  value={formData.passwordHash}
                  onChange={handleChange}
                  error={!!errors.passwordHash}
                  helperText={errors.passwordHash}
                  required={!userData}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="empNo"
                  label="Employee Number"
                  value={formData.empNo}
                  onChange={handleChange}
                  error={!!errors.empNo}
                  helperText={errors.empNo}
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>

              {/* Role & Permissions Fields */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="roleId"
                    value={formData.roleId}
                    onChange={handleChange}
                    error={!!errors.roleId}
                    required
                    sx={{
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Team Lead</InputLabel>
                  <Select
                    name="isTeamLead"
                    value={formData.isTeamLead}
                    onChange={handleChange}
                    sx={{
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    <MenuItem value="Y">Yes</MenuItem>
                    <MenuItem value="N">No</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="enabled"
                    value={formData.enabled}
                    onChange={handleChange}
                    sx={{
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    <MenuItem value="Y">Active</MenuItem>
                    <MenuItem value="N">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Customer Assignment & Additional Information Fields */}
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Customers</InputLabel>
                  <Select
                    name="customerIds"
                    multiple
                    value={formData.customerIds}
                    onChange={handleChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip
                            key={value}
                            label={customers.find(c => c.customerId === value)?.companyName || `${customers.find(c => c.customerId === value)?.firstName} ${customers.find(c => c.customerId === value)?.lastName}` || ''}
                            size="small"
                            sx={{
                              bgcolor: 'rgba(34, 139, 34, 0.1)',
                              color: '#228B22',
                              fontWeight: 600
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          maxHeight: 200,
                          width: 250,
                        },
                      },
                    }}
                    sx={{
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    }}
                  >
                    {customers.map((customer) => (
                      <MenuItem key={customer.customerId} value={customer.customerId}>
                        <Checkbox checked={formData.customerIds.indexOf(customer.customerId) > -1} />
                        <ListItemText primary={customer.companyName || `${customer.firstName} ${customer.lastName}`} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="reportingTo"
                  label="Reporting To (Employee ID)"
                  type="number"
                  value={formData.reportingTo}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  name="comments"
                  label="Comments"
                  value={formData.comments}
                  onChange={handleChange}
                  multiline
                  rows={1}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '12px',
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#228B22',
                        borderWidth: '2px',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 4 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleCancel}
                startIcon={<Clear />}
                sx={{
                  borderColor: '#228B22',
                  color: '#228B22',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#1B5E20',
                    bgcolor: 'rgba(34, 139, 34, 0.04)',
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
                sx={{
                  bgcolor: '#228B22',
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#1B5E20',
                  },
                  '&:disabled': {
                    bgcolor: '#9CA3AF',
                  },
                }}
              >
                {loading ? 'Saving...' : (userData ? 'Update User' : 'Save User')}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddUser;
