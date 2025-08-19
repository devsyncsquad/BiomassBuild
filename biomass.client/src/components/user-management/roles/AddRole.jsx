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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  Box
} from '@mui/material';
import { Security } from '@mui/icons-material';

// Component Imports
import {
  useGetRoleListQuery
} from '../../../redux/apis/userManagementApi';

const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';

const AddRole = ({ initialData }) => {
  // Temporary workaround - get user from localStorage
  const getUserFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : { empId: 1 }; // Default empId if no user
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { empId: 1 }; // Default empId
    }
  };
  const user = getUserFromStorage();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    roleId: 0,
    roleName: '',
    description: '',
    enabled: 'Y',
    createdBy: 0,
    createdAt: new Date().toISOString(),
    updatedBy: 0,
    updatedAt: new Date().toISOString()
  });
  const [isRoleSaveLoading, setIsRoleSaveLoading] = useState(false);
  const {
    data: rolesData,
    isLoading: isRolesLoading,
    error: rolesError,
    refetch: refetchRoleList
  } = useGetRoleListQuery();
  const [errors, setErrors] = useState({});

  const getAuthTokenFromLocalStorage = () => {
    return localStorage.getItem('authToken');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error when the user starts typing
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.roleName) {
      newErrors.roleName = 'Role name is required';
      isValid = false;
    }
    if (!formData.enabled) {
      newErrors.enabled = 'This field is required';
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if (!validateFields()) {
      return;
    }

    const roleData = {
      ...formData,
      createdBy: user.empId,
      updatedBy: user.empId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setIsRoleSaveLoading(true);
    try {
      const authToken = getAuthTokenFromLocalStorage();
      if (!authToken) {
        console.error('Authorization token not found');
        return;
      }

      const { data } = await axios.post(
        `${baseUrl}UserManagement/SaveRole`,
        roleData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      if (data.success) {
        setFormData({
          roleId: 0,
          roleName: '',
          description: '',
          enabled: 'Y',
          createdBy: 0,
          createdAt: new Date().toISOString(),
          updatedBy: 0,
          updatedAt: new Date().toISOString()
        });
        refetchRoleList();
        enqueueSnackbar('Role saved successfully', {
          variant: 'success',
          autoHideDuration: 5000
        });
      }
    } catch (error) {
      console.error('Error adding role:', error);
      enqueueSnackbar('Error adding Role. Please try again.', {
        variant: 'error',
        autoHideDuration: 5000
      });
    } finally {
      setIsRoleSaveLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        roleId: initialData?.roleId,
        roleName: initialData?.roleName,
        description: initialData?.description,
        enabled: initialData?.enabled,
        createdBy: initialData?.createdBy,
        createdAt: initialData?.createdAt,
        updatedBy: initialData?.updatedBy,
        updatedAt: initialData?.updatedAt
      });
    }
  }, [initialData]);

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      {/* Header */}
      <Box sx={{
        background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
        p: 3,
        color: 'white'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Security sx={{ fontSize: '2rem' }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              {initialData ? 'Edit Role' : 'Add New Role'}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {initialData ? 'Update role information and permissions' : 'Create a new role with specific permissions'}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Grid
        container
        spacing={5}
        width="Inherit"
        sx={{ paddingY: 2, paddingX: 2 }}
      >
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Role Name"
            value={formData.roleName}
            name="roleName"
            placeholder="Role Name"
            onChange={handleChange}
            required
            error={!!errors.roleName}
            helperText={errors.roleName}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            name="description"
            placeholder="Description"
            onChange={handleChange}
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Enabled"
            select
            variant="outlined"
            fullWidth
            value={formData.enabled}
            name="enabled"
            onChange={handleChange}
            error={!!errors.enabled}
            helperText={errors.enabled}
          >
            <MenuItem value="Y">Yes</MenuItem>
            <MenuItem value="N">No</MenuItem>
          </TextField>
        </Grid>
        <Grid item xs={12} textAlign="right" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ minWidth: 90 }}
          >
            {isRoleSaveLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              'Save'
            )}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddRole;
