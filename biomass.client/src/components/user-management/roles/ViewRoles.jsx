'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Search,
  Security,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';
import { getAuthHeaders } from '../../../utils/auth';

const ViewRoles = ({ setInitialData }) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://localhost:7084/api/UserManagement/GetRoleList', {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        setRoles(response.data.result || []);
      } else {
        setError(response.data?.message || 'Failed to fetch roles');
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      setError('Failed to fetch roles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditRole = (role) => {
    setInitialData(role);
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        const response = await axios.delete(`https://localhost:7084/api/UserManagement/DeleteRoleById?roleId=${roleId}`, {
          headers: getAuthHeaders()
        });
        
        if (response.data && response.data.success) {
          // Remove role from local state
          setRoles(roles.filter(role => role.roleId !== roleId));
        } else {
          alert(response.data?.message || 'Failed to delete role');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        alert('Failed to delete role. Please try again.');
      }
    }
  };

  const handleViewRole = (role) => {
    console.log('View role:', role);
  };

  const filteredRoles = roles.filter(role =>
    role.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (enabled) => {
    return enabled === 'Y' ? 'success' : 'error';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Roles List
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchRoles}
          disabled={loading}
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search roles by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Roles Table */}
      {!loading && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.roleId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        <Security />
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {role.roleName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {role.roleId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {role.description || 'No description'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={role.enabled === 'Y' ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={getStatusColor(role.enabled)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {role.createdAt ? new Date(role.createdAt).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit Role">
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Role">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDeleteRole(role.roleId)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && filteredRoles.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {roles.length === 0 ? 'No roles found.' : 'No roles match your search criteria.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViewRoles;
