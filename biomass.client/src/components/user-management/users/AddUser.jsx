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
  Divider
} from '@mui/material';
import {
  Person,
  Phone,
  Badge,
  Security,
  Lock,
  Comment
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

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!userData && !formData.passwordHash.trim()) {
      newErrors.passwordHash = 'Password is required';
    } else if (formData.passwordHash && formData.passwordHash.length < 6) {
      newErrors.passwordHash = 'Password must be at least 6 characters';
    }

    if (!formData.empNo) {
      newErrors.empNo = 'Employee number is required';
    }

    if (!formData.roleId) {
      newErrors.roleId = 'Role is required';
    }

    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    
    try {
      const userDataToSend = {
        ...formData,
        empNo: parseInt(formData.empNo),
        reportingTo: parseInt(formData.reportingTo),
        roleId: parseInt(formData.roleId),
        createdBy: 1, // TODO: Get from current user context
        updatedBy: 1  // TODO: Get from current user context
      };

      let response;
      if (userData) {
        // Update existing user
        response = await axios.put('https://localhost:7084/api/UserManagement/UpdateUser', userDataToSend, {
          headers: getAuthHeaders()
        });
      } else {
        // Create new user
        response = await axios.post('https://localhost:7084/api/UserManagement/SaveUser', userDataToSend, {
          headers: getAuthHeaders()
        });
      }

      if (response.data && response.data.success) {
        setSuccessMessage(userData ? 'User updated successfully!' : 'User created successfully!');
        resetForm();
        // Trigger refresh of user list
        if (setUserData) {
          setUserData(null);
        }
      } else {
        setErrors({ submit: response.data?.message || 'Operation failed' });
      }
    } catch (error) {
      console.error('Error saving user:', error);
      setErrors({ 
        submit: error.response?.data?.message || 'An error occurred while saving the user' 
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
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

  const handleCancel = () => {
    resetForm();
    if (setUserData) {
      setUserData(null);
    }
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Person sx={{ mr: 2, color: 'primary.main' }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Add New User
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {successMessage}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
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
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              error={!!errors.lastName}
              helperText={errors.lastName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Password"
              name="passwordHash"
              type="password"
              value={formData.passwordHash}
              onChange={handleChange}
              error={!!errors.passwordHash}
              helperText={errors.passwordHash}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Employee Number"
              name="empNo"
              value={formData.empNo}
              onChange={handleChange}
              error={!!errors.empNo}
              helperText={errors.empNo}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Badge />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

                      <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth error={!!errors.roleId}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  label="Role"
                >
                  {roles.map((role) => (
                    <MenuItem key={role.roleId} value={role.roleId}>
                      {role.roleName}
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

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Team Lead</InputLabel>
                <Select
                  name="isTeamLead"
                  value={formData.isTeamLead}
                  onChange={handleChange}
                  label="Team Lead"
                >
                  <MenuItem value="Y">Yes</MenuItem>
                  <MenuItem value="N">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="enabled"
                  value={formData.enabled}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Y">Active</MenuItem>
                  <MenuItem value="N">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Reporting To (User ID)"
                name="reportingTo"
                type="number"
                value={formData.reportingTo}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Comments"
                name="comments"
                value={formData.comments}
                onChange={handleChange}
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Comment />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  sx={{
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                    },
                  }}
                >
                  {loading ? (userData ? 'Updating...' : 'Adding...') : (userData ? 'Update User' : 'Add User')}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Box>
    );
  };

export default AddUser;
