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
  Chip
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
  Add
} from '@mui/icons-material';
import axios from 'axios';
import { getAuthHeaders } from '../../../utils/auth';

const AddUser = ({ userData, setUserData }) => {
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
    roleId: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [roles, setRoles] = useState([]);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
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
        roleId: userData.roleId || ''
      });
    }
  }, [userData]);

  const fetchRoles = async () => {
    try {
      const response = await axios.get('https://localhost:7084/api/UserManagement/GetRoleList', {
        headers: getAuthHeaders()
      });
      if (response.data && response.data.success) {
        setRoles(response.data.result || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
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
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.username.trim()) newErrors.username = 'Username is required';
    if (!userData && !formData.passwordHash.trim()) newErrors.passwordHash = 'Password is required';
    if (!formData.empNo.trim()) newErrors.empNo = 'Employee number is required';
    if (!formData.roleId) newErrors.roleId = 'Role is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setSuccessMessage('');
    
    try {
      let response;
      
      if (userData) {
        // Update existing user
        response = await axios.put(`https://localhost:7084/api/UserManagement/UpdateUserById?userId=${userData.userId}`, formData, {
          headers: getAuthHeaders()
        });
      } else {
        // Create new user
        response = await axios.post('https://localhost:7084/api/UserManagement/CreateUser', formData, {
          headers: getAuthHeaders()
        });
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
            roleId: ''
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
      roleId: ''
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
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
          p: 3,
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Person sx={{ fontSize: '2rem' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {userData ? 'Edit User' : 'Add New User'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
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

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Personal Information Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Person sx={{ color: '#6366F1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      Personal Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Person sx={{ color: '#6366F1', fontSize: '1.2rem' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Account Information Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Security sx={{ color: '#6366F1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      Account Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        error={!!errors.username}
                        helperText={errors.username}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="passwordHash"
                        type="password"
                        value={formData.passwordHash}
                        onChange={handleChange}
                        error={!!errors.passwordHash}
                        helperText={errors.passwordHash}
                        disabled={!!userData}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Lock sx={{ color: '#6366F1', fontSize: '1.2rem' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Employee Information Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Badge sx={{ color: '#6366F1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      Employee Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Employee Number"
                        name="empNo"
                        value={formData.empNo}
                        onChange={handleChange}
                        error={!!errors.empNo}
                        helperText={errors.empNo}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone sx={{ color: '#6366F1', fontSize: '1.2rem' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Role and Permissions Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Security sx={{ color: '#6366F1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      Role & Permissions
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth error={!!errors.roleId}>
                        <InputLabel>Role</InputLabel>
                        <Select
                          name="roleId"
                          value={formData.roleId}
                          onChange={handleChange}
                          label="Role"
                          sx={{
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          }}
                        >
                          {roles.map((role) => (
                            <MenuItem key={role.roleId} value={role.roleId}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Chip 
                                  label={role.roleName} 
                                  size="small" 
                                  sx={{ 
                                    bgcolor: 'rgba(99, 102, 241, 0.1)',
                                    color: '#6366F1',
                                    fontWeight: 600
                                  }}
                                />
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                        {errors.roleId && (
                          <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                            {errors.roleId}
                          </Typography>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>Team Lead</InputLabel>
                        <Select
                          name="isTeamLead"
                          value={formData.isTeamLead}
                          onChange={handleChange}
                          label="Team Lead"
                          sx={{
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          }}
                        >
                          <MenuItem value="Y">Yes</MenuItem>
                          <MenuItem value="N">No</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>

              {/* Additional Information Section */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: '#f8fafc' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Comment sx={{ color: '#6366F1' }} />
                    <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                      Additional Information
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Comments"
                        name="comments"
                        value={formData.comments}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#818CF8',
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#6366F1',
                              borderWidth: '2px',
                            },
                          },
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end', 
              mt: 4,
              pt: 3,
              borderTop: '1px solid #e2e8f0'
            }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                startIcon={<Clear />}
                sx={{
                  borderColor: '#64748b',
                  color: '#64748b',
                  '&:hover': {
                    borderColor: '#475569',
                    bgcolor: 'rgba(71, 85, 105, 0.04)',
                  },
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? null : <Save />}
                sx={{
                  background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #4F46E5 0%, #3730A3 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 8px 25px rgba(99, 102, 241, 0.3)'
                  },
                  borderRadius: '12px',
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Saving...' : (userData ? 'Update User' : 'Create User')}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddUser;
