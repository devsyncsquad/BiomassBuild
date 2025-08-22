// React Imports
import React, { useState, useEffect } from 'react';

// Other Imports
import axios from 'axios';
import { useSnackbar } from 'notistack';

// MUI Imports
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Select,
  InputLabel,
  CardHeader,
  FormControl,
  Typography,
  Divider,
  CircularProgress,
  Box,
  Alert
} from '@mui/material';
import { Menu, Save, Clear } from '@mui/icons-material';

// Utility Imports
import { getAuthHeaders, getCurrentUser } from '../../../utils/auth';

const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';

const AddMenu = ({ menuData, onMenuSaved, onRefresh }) => {
  // Get current user from auth utility
  const user = getCurrentUser();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    menuId: 0,
    menuName: '',
    iconUrl: '',
    orderNo: '',
    isEnabled: 'Y',
    createdBy: 0,
    createdAt: new Date().toISOString(),
    updatedBy: 0,
    updatedAt: new Date().toISOString(),
    link: ''
  });
  
  const [isMenuSaveLoading, setIsMenuSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error when the user starts typing
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.menuName || !formData.menuName.trim()) {
      newErrors.menuName = 'Menu name is required';
      isValid = false;
    }
    
    if (!formData.orderNo || !formData.orderNo.toString().trim()) {
      newErrors.orderNo = 'Order number is required';
      isValid = false;
    }
    
    if (!formData.link || !formData.link.trim()) {
      newErrors.link = 'Link is required';
      isValid = false;
    }
    
    if (!formData.isEnabled) {
      newErrors.isEnabled = 'Status is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFields()) {
      return;
    }

    setIsMenuSaveLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      // Check if user is authenticated
      if (!user || !user.empId) {
        enqueueSnackbar('User not authenticated. Please login again.', {
          variant: 'error',
          autoHideDuration: 5000
        });
        return;
      }

      console.log('Current user for menu operation:', {
        empId: user.empId,
        username: user.username || 'N/A',
        role: user.role || 'N/A'
      });

      let response;
      let isUpdate = !!menuData;

      if (isUpdate) {
        // Update existing menu - preserve original creator, update the updater
        const updateData = {
          menuId: formData.menuId,
          menuName: formData.menuName.trim(),
          iconUrl: formData.iconUrl || '',
          orderNo: parseInt(formData.orderNo),
          isEnabled: formData.isEnabled,
          createdBy: formData.createdBy, // Keep original creator ID
          createdAt: formData.createdAt, // Keep original creation date
          updatedBy: user.empId, // Set current user as updater
          updatedAt: new Date().toISOString(),
          link: formData.link.trim()
        };

        console.log('Updating menu:', updateData);
        console.log('API URL:', `${baseUrl}/api/UserManagement/UpdateMenu`);
        console.log('Headers:', getAuthHeaders());
        console.log('Original creator ID:', formData.createdBy);
        console.log('Current updater ID:', user.empId);
        
        response = await axios.put(
          `${baseUrl}/api/UserManagement/UpdateMenu`,
          updateData,
          {
            headers: getAuthHeaders()
          }
        );
      } else {
        // Create new menu - set current user as both creator and updater
        const createData = {
          menuId: 0, // API expects 0 for new menus
          menuName: formData.menuName.trim(),
          iconUrl: formData.iconUrl || '',
          orderNo: parseInt(formData.orderNo),
          isEnabled: formData.isEnabled,
          createdBy: user.empId, // Set current user as creator
          createdAt: new Date().toISOString(),
          updatedBy: user.empId, // Set current user as updater
          updatedAt: new Date().toISOString(),
          link: formData.link.trim()
        };

        console.log('Creating menu:', createData);
        console.log('API URL:', `${baseUrl}/api/UserManagement/SaveMenu`);
        console.log('Headers:', getAuthHeaders());
        console.log('Creator ID:', user.empId);
        console.log('Updater ID:', user.empId);
        
        response = await axios.post(
          `${baseUrl}/api/UserManagement/SaveMenu`,
          createData,
          {
            headers: getAuthHeaders()
          }
        );
      }

      console.log('API Response:', response.data);

      if (response.data && response.data.success) {
        setSuccessMessage(isUpdate ? 'Menu updated successfully!' : 'Menu created successfully!');
        
        // Reset form for new menu creation
        if (!isUpdate) {
          setFormData({
            menuId: 0,
            menuName: '',
            iconUrl: '',
            orderNo: '',
            isEnabled: 'Y',
            createdBy: 0,
            createdAt: new Date().toISOString(),
            updatedBy: 0,
            updatedAt: new Date().toISOString(),
            link: ''
          });
        }
        
        // Notify parent component
        if (onMenuSaved) {
          onMenuSaved(response.data.result);
        }
        
        // Trigger refresh of menu list
        if (onRefresh) {
          onRefresh();
        }
        
        enqueueSnackbar(response.data.message || 'Menu saved successfully', {
          variant: 'success',
          autoHideDuration: 5000
        });
      } else {
        const errorMsg = response.data?.message || 'Failed to save menu';
        setErrors({ submit: errorMsg });
        enqueueSnackbar(errorMsg, {
          variant: 'error',
          autoHideDuration: 5000
        });
      }
    } catch (error) {
      console.error('Error saving menu:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Error saving menu. Please try again.';
      
      if (error.response?.status === 400) {
        errorMessage = error.response.data?.message || 'Validation error. Please check your input.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized. Please check your authentication.';
      } else if (error.response?.status === 409) {
        errorMessage = 'Menu name already exists.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setErrors({ submit: errorMessage });
      enqueueSnackbar(errorMessage, {
        variant: 'error',
        autoHideDuration: 5000
      });
    } finally {
      setIsMenuSaveLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      menuId: 0,
      menuName: '',
      iconUrl: '',
      orderNo: '',
      isEnabled: 'Y',
      createdBy: 0,
      createdAt: new Date().toISOString(),
      updatedBy: 0,
      updatedAt: new Date().toISOString(),
      link: ''
    });
    setErrors({});
    setSuccessMessage('');
  };

  useEffect(() => {
    if (menuData) {
      console.log('Populating form with menu data:', menuData);
      
      const populatedFormData = {
        menuId: menuData.menuId || 0,
        menuName: menuData.menuName || '',
        iconUrl: menuData.iconUrl || '',
        orderNo: menuData.orderNo || '',
        isEnabled: menuData.isEnabled || 'Y',
        createdBy: menuData.createdBy || 0, // Preserve original creator
        createdAt: menuData.createdAt || new Date().toISOString(),
        updatedBy: menuData.updatedBy || 0,
        updatedAt: menuData.updatedAt || new Date().toISOString(),
        link: menuData.link || ''
      };
      
      console.log('Setting form data for edit:', populatedFormData);
      console.log('Original creator ID preserved:', populatedFormData.createdBy);
      
      setFormData(populatedFormData);
    } else {
      console.log('Initializing form for new menu creation');
      // Reset form for new menu
      const newFormData = {
        menuId: 0,
        menuName: '',
        iconUrl: '',
        orderNo: '',
        isEnabled: 'Y',
        createdBy: 0, // Will be set to current user on save
        createdAt: new Date().toISOString(),
        updatedBy: 0, // Will be set to current user on save
        updatedAt: new Date().toISOString(),
        link: ''
      };
      
      console.log('Setting form data for new menu:', newFormData);
      setFormData(newFormData);
    }
  }, [menuData]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
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
            <Menu sx={{ fontSize: '2rem' }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {menuData ? 'Edit Menu' : 'Add New Menu'}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {menuData ? 'Update menu information and settings' : 'Create a new menu with specific properties'}
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
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Menu Name *"
                  value={formData.menuName}
                  name="menuName"
                  placeholder="Enter menu name"
                  onChange={handleChange}
                  required
                  error={!!errors.menuName}
                  helperText={errors.menuName}
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
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Link *"
                  value={formData.link}
                  name="link"
                  placeholder="Enter menu link (e.g., /dashboard)"
                  onChange={handleChange}
                  required
                  error={!!errors.link}
                  helperText={errors.link}
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
                  label="Order Number *"
                  type="number"
                  value={formData.orderNo}
                  name="orderNo"
                  placeholder="Enter order number"
                  onChange={handleChange}
                  required
                  error={!!errors.orderNo}
                  helperText={errors.orderNo}
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
                  label="Icon URL"
                  value={formData.iconUrl}
                  name="iconUrl"
                  placeholder="Enter icon URL (optional)"
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
                <FormControl fullWidth error={!!errors.isEnabled}>
                  <InputLabel>Status *</InputLabel>
                  <Select
                    value={formData.isEnabled}
                    name="isEnabled"
                    onChange={handleChange}
                    label="Status *"
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
                  {errors.isEnabled && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                      {errors.isEnabled}
                    </Typography>
                  )}
                </FormControl>
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
                disabled={isMenuSaveLoading}
                startIcon={isMenuSaveLoading ? <CircularProgress size={20} /> : <Save />}
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
                {isMenuSaveLoading ? 'Saving...' : (menuData ? 'Update Menu' : 'Save Menu')}
              </Button>
            </Box>
          </Box>

        </CardContent>
      </Card>
    </Box>
  );
};

export default AddMenu;
