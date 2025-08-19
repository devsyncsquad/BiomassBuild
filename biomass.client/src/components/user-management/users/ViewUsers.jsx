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
  CircularProgress,
  Card,
  CardContent
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Visibility, 
  Search,
  Person,
  Refresh,
  FilterList
} from '@mui/icons-material';
import axios from 'axios';
import { getAuthHeaders } from '../../../utils/auth';
import { getBaseUrl } from '../../../utils/api';

const ViewUsers = ({ setUserData }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchCustomers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`${getBaseUrl()}/UserManagement/GetUsersList`, {
        headers: getAuthHeaders()
      });
      
      if (response.data && response.data.success) {
        console.log('API Response:', response.data.result);
        // The API now returns UserWithCustomers objects directly
        const transformedUsers = (response.data.result || []).map(item => ({
          ...item.user,
          customerIds: item.customerIds || []
        }));
        console.log('Transformed Users:', transformedUsers);
        setUsers(transformedUsers);
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



  // Helper function to get customer assignment display text
  const getCustomerAssignmentText = (user) => {
    console.log('Processing user:', user.username, 'customerIds:', user.customerIds);
    if (!user.customerIds || user.customerIds.length === 0) {
      return "No Customer Assigned";
    }
    const count = user.customerIds.length;
    return `${count} Customer${count > 1 ? 's' : ''}`;
  };

  // Helper function to get customer assignment color
  const getCustomerAssignmentColor = (user) => {
    if (!user.customerIds || user.customerIds.length === 0) {
      return '#6B7280'; // Gray for no assignment
    }
    return '#10B981'; // Green for assigned
  };

  const handleEditUser = (user) => {
    setUserData(user);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await axios.delete(`${getBaseUrl()}/UserManagement/DeleteUserById?userId=${userId}`, {
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
      const response = await axios.get(`${getBaseUrl()}/UserManagement/DeactivateUserById?userId=${userId}`, {
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

  const handleRefresh = async () => {
    await fetchUsers();
  };

  const filteredUsers = users.filter(user => {
    const matches = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.empNo?.toString().includes(searchTerm);
    
    return matches;
  });

  const getStatusColor = (enabled) => {
    return enabled === 'Y' ? 'success' : 'error';
  };

  const getTeamLeadColor = (isTeamLead) => {
    return isTeamLead === 'Y' ? 'primary' : 'default';
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        mb: 4,
        p: 3,
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '16px',
        border: '1px solid #e2e8f0'
      }}>
        <Box>
          <Typography variant="h5" sx={{ 
            fontWeight: 700, 
            color: '#228B22',
            mb: 1
          }}>
            User Management
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Manage and monitor all system users, their roles, and permissions
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={handleRefresh}
          disabled={loading}
          sx={{
            borderColor: '#228B22',
            color: '#228B22',
            '&:hover': {
              borderColor: '#1B5E20',
              bgcolor: 'rgba(34, 139, 34, 0.04)',
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(34, 139, 34, 0.15)'
            },
            transition: 'all 0.2s ease',
            borderRadius: '12px',
            px: 3,
            py: 1
          }}
        >
          Refresh
        </Button>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Card sx={{ mb: 4, borderRadius: '16px', boxShadow: '0 4px 20px rgba(34, 139, 34, 0.08)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FilterList sx={{ color: '#228B22', fontSize: '1.5rem' }} />
            <TextField
              fullWidth
              placeholder="Search users by name, username, or employee number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#228B22' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                maxWidth: 500,
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
          </Box>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#228B22' }} size={48} />
        </Box>
      )}





      {/* Users Table */}
      {!loading && filteredUsers.length > 0 && (
        <Card sx={{ borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(34, 139, 34, 0.08)' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ 
                  background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
                  '& th': {
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    borderBottom: 'none',
                    py: 2
                  }
                }}>
                  <TableCell>User</TableCell>
                  <TableCell>Employee #</TableCell>
                  <TableCell>Role ID</TableCell>
                  <TableCell>Team Lead</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Customer Assignment</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow 
                    key={user.userId}
                    hover 
                    sx={{ 
                      '&:nth-of-type(even)': { bgcolor: '#f8fafc' },
                      '&:hover': { 
                        bgcolor: 'rgba(34, 139, 34, 0.02)',
                        transform: 'scale(1.01)',
                        transition: 'all 0.2s ease'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ 
                          mr: 2, 
                          bgcolor: '#228B22',
                          boxShadow: '0 4px 12px rgba(34, 139, 34, 0.3)',
                          width: 40,
                          height: 40
                        }}>
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {user.firstName} {user.lastName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#228B22', fontWeight: 500 }}>
                            @{user.username}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#475569', fontWeight: 500 }}>
                        {user.empNo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={`Role ${user.roleId}`} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(34, 139, 34, 0.1)',
                          color: '#228B22',
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.isTeamLead === 'Y' ? 'Yes' : 'No'} 
                        size="small" 
                        sx={{ 
                          bgcolor: user.isTeamLead === 'Y' 
                            ? 'rgba(20, 184, 166, 0.1)' 
                            : 'rgba(148, 163, 184, 0.1)',
                          color: user.isTeamLead === 'Y' ? '#14B8A6' : '#64748b',
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.enabled === 'Y' ? 'Active' : 'Inactive'} 
                        size="small" 
                        sx={{ 
                          bgcolor: user.enabled === 'Y' 
                            ? 'rgba(34, 197, 94, 0.1)' 
                            : 'rgba(239, 68, 68, 0.1)',
                          color: user.enabled === 'Y' ? '#22c55e' : '#ef4444',
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#475569' }}>
                        {user.phoneNumber || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={getCustomerAssignmentText(user)} 
                        size="small" 
                        sx={{ 
                          bgcolor: 'rgba(16, 185, 129, 0.1)',
                          color: getCustomerAssignmentColor(user),
                          fontWeight: 600,
                          borderRadius: '8px'
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                        <Tooltip title="Edit User">
                          <IconButton
                            size="small"
                            onClick={() => handleEditUser(user)}
                            sx={{ 
                              color: '#228B22',
                              p: 1,
                              bgcolor: 'rgba(34, 139, 34, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(34, 139, 34, 0.2)',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Edit sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete User">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteUser(user.userId)}
                            sx={{ 
                              color: '#ef4444',
                              p: 1,
                              bgcolor: 'rgba(239, 68, 68, 0.1)',
                              '&:hover': {
                                bgcolor: 'rgba(239, 68, 68, 0.2)',
                                transform: 'scale(1.1)'
                              },
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <Delete sx={{ fontSize: '1.1rem' }} />
                          </IconButton>
                        </Tooltip>
                        
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* No Results Message */}
      {!loading && filteredUsers.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
            {users.length === 0 ? 'No users found.' : 'No users match your search criteria.'}
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            Try adjusting your search terms or add new users to get started.
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViewUsers;
