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
  Snackbar
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const ViewMainMenus = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
      const response = await fetch(`${baseUrl}/api/UserManagement/GetMenuList`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menus');
      }

      const data = await response.json();
      
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
        const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
        const response = await fetch(`${baseUrl}/api/UserManagement/DeleteMenuById?menuId=${menuId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to delete menu');
        }

        const data = await response.json();
        if (data.success) {
          showSnackbar('Menu deleted successfully', 'success');
          fetchMenus();
        } else {
          showSnackbar(data.message || 'Error deleting menu', 'error');
        }
      } catch (error) {
        console.error('Error deleting menu:', error);
        showSnackbar('Error deleting menu', 'error');
      }
    }
  };

  const handleEditMenu = (menu) => {
    setSelectedMenu(menu);
    setOpenEditDialog(true);
  };

  const handleUpdateMenu = async (updatedMenu) => {
    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
      const response = await fetch(`${baseUrl}/api/UserManagement/UpdateMenu`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedMenu)
      });

      if (!response.ok) {
        throw new Error('Failed to update menu');
      }

      const data = await response.json();
      if (data.success) {
        showSnackbar('Menu updated successfully', 'success');
        setOpenEditDialog(false);
        fetchMenus();
      } else {
        showSnackbar(data.message || 'Error updating menu', 'error');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      showSnackbar('Error updating menu', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
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
      menuName: 'User Management',
      link: '/user-management',
      orderNo: 2,
      isEnabled: 'Y',
      createdBy: 1,
      createdAt: '2025-08-07 05:40:31.835834',
      updatedBy: 1,
      updatedAt: '2025-08-07 05:40:31.835834'
    },
    {
      menuId: 3,
      menuName: 'Company Management',
      link: '/company-management',
      orderNo: 3,
      isEnabled: 'Y',
      createdBy: 1,
      createdAt: '2025-08-07 05:40:31.835834',
      updatedBy: 1,
      updatedAt: '2025-08-07 05:40:31.835834'
    },
    {
      menuId: 4,
      menuName: 'Reports',
      link: '/reports',
      orderNo: 4,
      isEnabled: 'N',
      createdBy: 1,
      createdAt: '2025-08-07 05:40:31.835834',
      updatedBy: 1,
      updatedAt: '2025-08-07 05:40:31.835834'
    }
  ];

  if (loading) {
    return <Typography>Loading menus...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Menus Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenAddDialog(true)}
        >
          Add Menu
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Menu Name</TableCell>
              <TableCell>Link</TableCell>
              <TableCell>Order</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.map((menu) => (
              <TableRow key={menu.menuId}>
                <TableCell>{menu.menuName}</TableCell>
                <TableCell>{menu.link}</TableCell>
                <TableCell>{menu.orderNo}</TableCell>
                <TableCell>
                  <Chip
                    label={menu.isEnabled === 'Y' ? 'Active' : 'Inactive'}
                    color={menu.isEnabled === 'Y' ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {menu.createdAt ? new Date(menu.createdAt).toLocaleDateString() : 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditMenu(menu)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteMenu(menu.menuId)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Menu Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Menu</DialogTitle>
        <DialogContent>
          <AddMenuForm
            onSuccess={() => {
              setOpenAddDialog(false);
              fetchMenus();
              showSnackbar('Menu added successfully', 'success');
            }}
            onCancel={() => setOpenAddDialog(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Menu Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Menu</DialogTitle>
        <DialogContent>
          {selectedMenu && (
            <EditMenuForm
              menu={selectedMenu}
              onUpdate={handleUpdateMenu}
              onCancel={() => setOpenEditDialog(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

// Add Menu Form Component
const AddMenuForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    menuName: '',
    link: '',
    orderNo: '',
    isEnabled: 'Y'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.menuName.trim()) {
      newErrors.menuName = 'Menu name is required';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
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
    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
      const response = await fetch(`${baseUrl}/api/UserManagement/SaveMenu`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save menu');
      }

      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        setErrors({ submit: data.message || 'Error adding menu' });
      }
    } catch (error) {
      console.error('Error adding menu:', error);
      setErrors({ submit: 'Error adding menu. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <TextField
        name="menuName"
        label="Menu Name"
        value={formData.menuName}
        onChange={handleChange}
        error={!!errors.menuName}
        helperText={errors.menuName}
        required
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        name="link"
        label="Link"
        value={formData.link}
        onChange={handleChange}
        error={!!errors.link}
        helperText={errors.link}
        required
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        name="orderNo"
        label="Order Number"
        type="number"
        value={formData.orderNo}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          name="isEnabled"
          value={formData.isEnabled}
          onChange={handleChange}
          label="Status"
        >
          <MenuItem value="Y">Enabled</MenuItem>
          <MenuItem value="N">Disabled</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Menu'}
        </Button>
      </Box>
    </Box>
  );
};

// Edit Menu Form Component
const EditMenuForm = ({ menu, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    menuId: menu.menuId,
    menuName: menu.menuName || '',
    link: menu.link || '',
    orderNo: menu.orderNo || '',
    isEnabled: menu.isEnabled || 'Y'
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

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

    if (!formData.menuName.trim()) {
      newErrors.menuName = 'Menu name is required';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Link is required';
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
    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
      const response = await fetch(`${baseUrl}/api/UserManagement/UpdateMenu`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update menu');
      }

      const data = await response.json();
      
      if (data.success) {
        onUpdate(formData);
      } else {
        setErrors({ submit: data.message || 'Error updating menu' });
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      setErrors({ submit: 'Error updating menu. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {errors.submit && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.submit}
        </Alert>
      )}

      <TextField
        name="menuName"
        label="Menu Name"
        value={formData.menuName}
        onChange={handleChange}
        error={!!errors.menuName}
        helperText={errors.menuName}
        required
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        name="link"
        label="Link"
        value={formData.link}
        onChange={handleChange}
        error={!!errors.link}
        helperText={errors.link}
        required
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        name="orderNo"
        label="Order Number"
        type="number"
        value={formData.orderNo}
        onChange={handleChange}
        fullWidth
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Status</InputLabel>
        <Select
          name="isEnabled"
          value={formData.isEnabled}
          onChange={handleChange}
          label="Status"
        >
          <MenuItem value="Y">Enabled</MenuItem>
          <MenuItem value="N">Disabled</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Menu'}
        </Button>
      </Box>
    </Box>
  );
};

export default ViewMainMenus;
