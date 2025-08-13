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
  CircularProgress
} from '@mui/material';

// Component Imports
import { useGetMainMenuListQuery } from '../../../redux/apis/userManagementApi';

const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';

const AddMainMenu = ({ mainMenuData }) => {
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
    mainMenuId: 0,
    mainMenuDesc: '',
    orderNo: '',
    icon: '',
    enabled: 'Y',
    createdBy: 0,
    createdOn: new Date().toISOString(),
    lastUpdatedBy: 0,
    lastUpdatedOn: new Date().toISOString()
  });
  const [isMainMenuSaveLoading, setIsMainMenuSaveLoading] = useState(false);

  const {
    data: mainMenusData,
    error,
    isLoading: isMainMenusDataLoading,
    refetch: refetchMainMenus
  } = useGetMainMenuListQuery();

  const getAuthTokenFromLocalStorage = () => {
    return localStorage.getItem('authToken');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsMainMenuSaveLoading(true);
      const mainMenuData = {
        ...formData,
        createdBy: user.empId,
        lastUpdatedBy: user.empId,
        createdOn: new Date().toISOString(),
        lastUpdatedOn: new Date().toISOString()
      };

      const authToken = getAuthTokenFromLocalStorage();
      if (!authToken) {
        console.error('Authorization token not found');
        return;
      }

      const { data } = await axios.post(
        `${baseUrl}UserManagement/SaveMainMenu`,
        mainMenuData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      if (data.success) {
        setFormData({
          mainMenuId: 0,
          mainMenuDesc: '',
          orderNo: '',
          icon: '',
          enabled: 'Y',
          createdBy: 0,
          createdOn: new Date().toISOString(),
          lastUpdatedBy: 0,
          lastUpdatedOn: new Date().toISOString()
        });
        refetchMainMenus();
        enqueueSnackbar('Main menu saved successfully', {
          variant: 'success',
          autoHideDuration: 5000
        });
      }
    } catch (error) {
      console.error('Error saving main menu:', error);
      enqueueSnackbar('Error saving main menu. Please try again.', {
        variant: 'error',
        autoHideDuration: 5000
      });
    } finally {
      setIsMainMenuSaveLoading(false);
    }
  };

  useEffect(() => {
    if (mainMenuData) {
      setFormData({
        ...formData,
        mainMenuId: mainMenuData.mainMenuId || 0,
        mainMenuDesc: mainMenuData.mainMenuDesc || '',
        orderNo: mainMenuData.orderNo || '',
        icon: mainMenuData.icon || '',
        enabled: mainMenuData.enabled === 'Yes' ? 'Y' : 'N',
        createdBy: mainMenuData.createdBy || 0,
        createdOn: mainMenuData.createdOn || new Date().toISOString(),
        lastUpdatedBy: mainMenuData.lastUpdatedBy || 0,
        lastUpdatedOn: mainMenuData.lastUpdatedOn || new Date().toISOString()
      });
    }
  }, [mainMenuData]);

  return (
    <Card sx={{ p: 0 }}>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        spacing={1}
      >
        <Grid item>
          <Typography variant="h5" align="left" sx={{ color: '#8E48BB' }}>
            Add Main Menus
          </Typography>
        </Grid>
      </Grid>
      <Divider color="#8E48BB" sx={{ mb: 1, height: 1 }} />
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Grid
            container
            spacing={5}
            width="Inherit"
            sx={{ paddingY: 2, paddingX: 2 }}
          >
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Main Menu Description"
                value={formData.mainMenuDesc}
                name="mainMenuDesc"
                placeholder="Main Menu Description"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Order No"
                type="number"
                value={formData.orderNo}
                name="orderNo"
                placeholder="Order No"
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Icon"
                value={formData.icon}
                name="icon"
                placeholder="Icon"
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Enabled</InputLabel>
                <Select
                  label="Enabled"
                  name="enabled"
                  value={formData.enabled}
                  onChange={handleChange}
                >
                  <MenuItem value="Y">Yes</MenuItem>
                  <MenuItem value="N">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} textAlign="right" sx={{ mt: 2 }}>
              <Button variant="contained" type="submit" sx={{ minWidth: 90 }}>
                {isMainMenuSaveLoading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  'Save'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  );
};
export default AddMainMenu;
