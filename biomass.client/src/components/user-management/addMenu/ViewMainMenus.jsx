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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Grid
} from '@mui/material';
import { Edit, Delete, Add, Menu as MenuIcon } from '@mui/icons-material';

// Utility Imports
import { getAuthHeaders, getCurrentUser } from '../../../utils/auth';

const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';

const ViewMenus = ({ setMenuData }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get current user
  const user = getCurrentUser();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      console.log('Fetching menus from API...');
      
      const response = await fetch(`${baseUrl}/api/UserManagement/GetMenuList`, {
        headers: getAuthHeaders()
      });

      console.log('API Response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response data:', data);
      
      if (data.success) {
        setMenus(data.result || []);
        showSnackbar('Menus loaded successfully', 'success');
      } else {
        throw new Error(data.message || 'Failed to fetch menus');
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
      showSnackbar('Failed to load menus. Please try again.', 'error');
      // For demo purposes, use sample data
      setMenus(getSampleMenus());
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMenu = async (menuId) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      try {
        setDeleteLoading(true);
        console.log('Deleting menu with ID:', menuId);
        
        const response = await fetch(`${baseUrl}/api/UserManagement/DeleteMenuById?menuId=${menuId}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        console.log('Delete response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Delete response data:', data);
        
        if (data.success) {
          showSnackbar('Menu deleted successfully', 'success');
          fetchMenus(); // Refresh the list
        } else {
          showSnackbar(data.message || 'Error deleting menu', 'error');
        }
      } catch (error) {
        console.error('Error deleting menu:', error);
        showSnackbar('Error deleting menu. Please try again.', 'error');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleEditMenu = (menu) => {
    console.log('Editing menu:', menu);
    setSelectedMenu(menu);
    setMenuData(menu); // Pass to parent for editing
    setOpenEditDialog(false); // Close the dialog since we're using the form above
  };

  const handleUpdateMenu = async (updatedMenu) => {
    try {
      console.log('Updating menu:', updatedMenu);
      
      const response = await fetch(`${baseUrl}/api/UserManagement/UpdateMenu`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedMenu)
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Update response data:', data);
      
      if (data.success) {
        showSnackbar('Menu updated successfully', 'success');
        setOpenEditDialog(false);
        fetchMenus(); // Refresh the list
      } else {
        showSnackbar(data.message || 'Error updating menu', 'error');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      showSnackbar('Error updating menu. Please try again.', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Sample data functions for demo purposes
  const getSampleMenus = () => [
    {
      menuId: 1,
      menuName: 'Dashboard',
      link: '/dashboard',
      orderNo: 1,
      isEnabled: 'Y',
      createdBy: 1,
      createdAt: '2025-08-07 05:40:31.835834',
      updatedBy: 1,
      updatedAt: '2025-08-07 05:40:31.835834'
    },
    {
      menuId: 2,
      menuName: 'Company Management',
      link: '/CompanyManagment',
      orderNo: 2,
      isEnabled: 'Y',
      createdBy: 1,
      createdAt: '2025-08-07 11:04:01.78226',
      updatedBy: 1,
      updatedAt: '2025-08-07 11:04:35.964673'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Y' ? 'success' : 'error';
  };

  const getStatusText = (status) => {
    return status === 'Y' ? 'Active' : 'Inactive';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <CardHeader
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MenuIcon sx={{ color: '#228B22' }} />
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
                Menu Management
              </Typography>
            </Box>
          }
          subheader="View and manage all system menus"
          sx={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
            borderBottom: '1px solid #e2e8f0'
          }}
        />
        
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Menu Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Link</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Order</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created By</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Created At</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Last Updated</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: '#374151' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {menus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        No menus found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  menus.map((menu) => (
                    <TableRow key={menu.menuId} hover>
                      <TableCell>{menu.menuId}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {menu.menuName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: '#6b7280' }}>
                          {menu.link}
                        </Typography>
                      </TableCell>
                      <TableCell>{menu.orderNo}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(menu.isEnabled)}
                          color={getStatusColor(menu.isEnabled)}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                      </TableCell>
                      <TableCell>{menu.createdBy}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {new Date(menu.createdAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                          {new Date(menu.updatedAt).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditMenu(menu)}
                            sx={{
                              color: '#228B22',
                              '&:hover': { backgroundColor: 'rgba(34, 139, 34, 0.1)' }
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteMenu(menu.menuId)}
                            disabled={deleteLoading}
                            sx={{
                              color: '#dc2626',
                              '&:hover': { backgroundColor: 'rgba(220, 38, 38, 0.1)' },
                              '&:disabled': { color: '#9ca3af' }
                            }}
                          >
                            {deleteLoading ? (
                              <CircularProgress size={16} />
                            ) : (
                              <Delete fontSize="small" />
                            )}
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      
    </Box>
  );
};

export default ViewMenus;
