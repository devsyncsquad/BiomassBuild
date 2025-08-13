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
  Button,
  Typography,
  Chip,
  Avatar,
  Tooltip,
  Grid,
  Divider,
  InputAdornment,
  TextField,
  Alert,
  CircularProgress
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility, 
  Search,
  Person,
  Refresh
} from '@mui/icons-material';
import axios from 'axios';
import { getAuthHeaders } from '../../../utils/auth';

const ViewUsers = ({ setUserData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('https://localhost:7084/api/UserManagement/GetUsersList', {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        setUsers(response.data.result || []);
      } else {
        setError(response.data?.message || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setUserData(user);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`https://localhost:7084/api/UserManagement/DeleteUserById?userId=${userId}`, {
          headers: getAuthHeaders()
        });
        
        if (response.data && response.data.success) {
          // Remove user from local state
          setUsers(users.filter(user => user.userId !== userId));
        } else {
          alert(response.data?.message || 'Failed to delete user');
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  const handleDeactivateUser = async (userId) => {
    try {
      const response = await axios.get(`https://localhost:7084/api/UserManagement/DeactivateUserById?userId=${userId}`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        // Update user status in local state
        setUsers(users.map(user => 
          user.userId === userId 
            ? { ...user, enabled: 'N' }
            : user
        ));
      } else {
        alert(response.data?.message || 'Failed to deactivate user');
      }
    } catch (error) {
      console.error('Error deactivating user:', error);
      alert('Failed to deactivate user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.empNo?.toString().includes(searchTerm)
  );

  const getStatusColor = (enabled) => {
    return enabled === 'Y' ? 'success' : 'error';
  };

  const getTeamLeadColor = (isTeamLead) => {
    return isTeamLead === 'Y' ? 'primary' : 'default';
  };

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Users List
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={fetchUsers}
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
          placeholder="Search users by name, username, or employee number..."
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

      {/* Users Table */}
      {!loading && (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'grey.50' }}>
                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Employee #</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Role ID</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Team Lead</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.userId} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          @{user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.empNo}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={`Role ${user.roleId}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isTeamLead === 'Y' ? 'Yes' : 'No'} 
                      size="small" 
                      color={getTeamLeadColor(user.isTeamLead)}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.enabled === 'Y' ? 'Active' : 'Inactive'} 
                      size="small" 
                      color={getStatusColor(user.enabled)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.phoneNumber || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Edit User">
                        <IconButton
                          size="small"
                          onClick={() => handleEditUser(user)}
                          sx={{ color: 'warning.main' }}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete User">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteUser(user.userId)}
                          sx={{ color: 'error.main' }}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      {user.enabled === 'Y' && (
                        <Tooltip title="Deactivate User">
                          <IconButton
                            size="small"
                            onClick={() => handleDeactivateUser(user.userId)}
                            sx={{ color: 'info.main' }}
                          >
                            <Visibility />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && filteredUsers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography color="text.secondary">
            {users.length === 0 ? 'No users found.' : 'No users match your search criteria.'}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViewUsers;
