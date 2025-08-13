// React Imports
import React, { useState, useEffect } from 'react';

// Other Imports
import axios from 'axios';
import { useSnackbar } from 'notistack';

import {
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Select,
  InputLabel,
  CardHeader,
  FormControl,
  MenuItem,
  Typography,
  Divider,
  CircularProgress
} from '@mui/material';

// Component Imports
import {
  useGetMainMenuListQuery,
  useGetSubMenuListByMainMenuQuery,
  useGetSubMenuByMainMenuIdListQuery
} from '../../../redux/apis/userManagementApi';

const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';

const AddSubMenu = ({ subMenuData, selectedMainMenu }) => {
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
    subMenuId: 0,
    subMenuDesc: '',
    link: '',
    icon: '',
    mainMenuId: 0,
    orderNo: 0,
    enabled: 'Y',
    createdBy: 0,
    createdOn: new Date().toISOString(),
    lastUpdatedBy: 0,
    lastUpdatedOn: new Date().toISOString(),
    appId: 1
  });
  const [mainMenus, setMainMenus] = useState([]);
  const [isSubMenuSaveLoading, setIsSubMenuSaveLoading] = useState(false);
  const { refetch: refetchSubMenu } = useGetSubMenuByMainMenuIdListQuery(
    selectedMainMenu,
    {
      skip: !selectedMainMenu
    }
  );
  const {
    data: mainMenusData,
    error,
    isLoading: isMainMenusDataLoading,
    refetch: refetchMainMenus
  } = useGetMainMenuListQuery();

  const {
    data: subMenusData,
    isLoading: isSubMenusDataLoading,
    refetch: refetchSubMenus
  } = useGetSubMenuListByMainMenuQuery(formData.mainMenuId, {
    skip: !formData.mainMenuId
  });

  useEffect(() => {
    if (mainMenusData) {
      setMainMenus(mainMenusData?.result);
    }
  }, [mainMenusData]);
  const [errors, setErrors] = useState({});

  const getAuthTokenFromLocalStorage = () => {
    return localStorage.getItem('authToken');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'orderNo' ? parseInt(value, 10) : value
    });
    setErrors((prev) => ({ ...prev, [name]: '' })); // Clear error when the user starts typing
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.subMenuDesc) {
      newErrors.subMenuDesc = 'Sub menu description is required';
      isValid = false;
    }
    if (!formData.mainMenuId) {
      newErrors.mainMenuId = 'Main menu is required';
      isValid = false;
    }
    if (!formData.enabled) {
      newErrors.enabled = 'This field is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      setIsSubMenuSaveLoading(true);
      const subMenuData = {
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
        `${baseUrl}UserManagement/SaveSubMenu`,
        subMenuData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`
          }
        }
      );
      if (data.success) {
        setFormData({
          subMenuId: 0,
          subMenuDesc: '',
          link: '',
          icon: '',
          mainMenuId: 0,
          orderNo: 0,
          enabled: 'Y',
          createdBy: 0,
          createdOn: new Date().toISOString(),
          lastUpdatedBy: 0,
          lastUpdatedOn: new Date().toISOString(),
          appId: 1
        });
        refetchSubMenus();
        refetchSubMenu();
        enqueueSnackbar('Sub menu saved successfully', {
          variant: 'success',
          autoHideDuration: 5000
        });
      }
    } catch (error) {
      console.error('Error saving sub menu:', error);
      enqueueSnackbar('Error saving sub menu. Please try again.', {
        variant: 'error',
        autoHideDuration: 5000
      });
    } finally {
      setIsSubMenuSaveLoading(false);
    }
  };

  useEffect(() => {
    if (subMenuData) {
      setFormData({
        ...formData,
        subMenuId: subMenuData?.subMenuId || 0,
        subMenuDesc: subMenuData?.subMenuDesc || '',
        link: subMenuData?.link || '',
        icon: subMenuData?.icon || '',
        mainMenuId: subMenuData?.mainMenuId || 0,
        orderNo: subMenuData?.orderNo || 0,
        enabled: subMenuData?.enabled || 'Y',
        createdBy: subMenuData?.createdBy || 0,
        createdOn: subMenuData?.createdOn || new Date().toISOString(),
        lastUpdatedBy: subMenuData?.lastUpdatedBy || 0,
        lastUpdatedOn: subMenuData?.lastUpdatedOn || new Date().toISOString(),
        appId: subMenuData?.appId || 1
      });
    }
  }, [subMenuData]);

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
            Add Sub Menus
          </Typography>
        </Grid>
      </Grid>
      <Divider color="#8E48BB" sx={{ mb: 1, height: 1 }} />
      <CardContent>
        <Grid
          container
          spacing={5}
          width="Inherit"
          sx={{ paddingY: 2, paddingX: 2 }}
        >
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Sub Menu Description"
              value={formData.subMenuDesc}
              name="subMenuDesc"
              placeholder="Sub Menu Description"
              onChange={handleChange}
              required
              error={!!errors.subMenuDesc}
              helperText={errors.subMenuDesc}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Link"
              value={formData.link}
              name="link"
              placeholder="Link"
              onChange={handleChange}
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
            <TextField
              fullWidth
              label="Order No"
              type="number"
              value={formData.orderNo}
              name="orderNo"
              placeholder="Order No"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Main Menu</InputLabel>
              <Select
                label="Main Menu"
                name="mainMenuId"
                value={formData.mainMenuId}
                onChange={handleChange}
                error={!!errors.mainMenuId}
              >
                {mainMenus.map((menu) => (
                  <MenuItem key={menu.mainMenuId} value={menu.mainMenuId}>
                    {menu.mainMenuDesc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="App ID"
              type="number"
              value={formData.appId}
              name="appId"
              placeholder="App ID"
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} textAlign="right" sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ minWidth: 90 }}
            >
              {isSubMenuSaveLoading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Save'
              )}
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default AddSubMenu;
