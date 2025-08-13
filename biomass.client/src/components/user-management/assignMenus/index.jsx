'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  TextField,
  InputAdornment,
  Toolbar,
  Chip
} from '@mui/material';
import {
  Assignment,
  Security,
  Menu,
  Search,
  GetApp,
  ViewColumn,
  Delete,
  Save
} from '@mui/icons-material';
import { userManagementApi } from '../../../redux/apis/userManagementApi';

const AssignMenus = () => {
  // State management
  const [roles, setRoles] = useState([]);
  const [mainMenus, setMainMenus] = useState([]);
  const [subMenus, setSubMenus] = useState([]);
  const [menuRoles, setMenuRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Selection states
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUnassignedMenus, setSelectedUnassignedMenus] = useState([]);
  const [selectedAssignedMenus, setSelectedAssignedMenus] = useState([]);

  // Table states
  const [unassignedPage, setUnassignedPage] = useState(0);
  const [assignedPage, setAssignedPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [unassignedSearchTerm, setUnassignedSearchTerm] = useState('');
  const [assignedSearchTerm, setAssignedSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      fetchMenuAssignments();
    }
  }, [selectedRole]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel using the API functions
      const [rolesData, mainMenusData, subMenusData, menuRolesData] = await Promise.all([
        userManagementApi.getRoles(),
        userManagementApi.getMainMenus(),
        userManagementApi.getSubMenus(),
        userManagementApi.getMenuRoles()
      ]);

      if (rolesData.success) setRoles(rolesData.result || []);
      if (mainMenusData.success) setMainMenus(mainMenusData.result || []);
      if (subMenusData.success) setSubMenus(subMenusData.result || []);
      if (menuRolesData.success) setMenuRoles(menuRolesData.result || []);

      showSnackbar('Data loaded successfully', 'success');
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to load data. Using sample data.', 'warning');
      // Use sample data
      setRoles(getSampleRoles());
      setMainMenus(getSampleMainMenus());
      setSubMenus(getSampleSubMenus());
      setMenuRoles(getSampleMenuRoles());
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuAssignments = async () => {
    if (!selectedRole) return;
    
    try {
      const data = await userManagementApi.getMenuRoles(selectedRole);
      if (data.success) {
        setMenuRoles(data.result || []);
      }
    } catch (error) {
      console.error('Error fetching menu assignments:', error);
    }
  };

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setSelectedUnassignedMenus([]);
    setSelectedAssignedMenus([]);
    setUnassignedPage(0);
    setAssignedPage(0);
  };

  const handleSaveAssignments = async () => {
    if (!selectedRole) {
      showSnackbar('Please select a role first', 'error');
      return;
    }

    try {
      // Assign selected unassigned menus
      if (selectedUnassignedMenus.length > 0) {
        const assignPromises = selectedUnassignedMenus.map(menuId => 
          userManagementApi.saveMenuRole({
            roleId: parseInt(selectedRole),
            menuId: parseInt(menuId)
          })
        );

        await Promise.all(assignPromises);
      }

      // Unassign selected assigned menus
      if (selectedAssignedMenus.length > 0) {
        const unassignPromises = selectedAssignedMenus.map(menuId => {
          const menuRole = menuRoles.find(mr => mr.menuId === menuId && mr.roleId === parseInt(selectedRole));
          if (menuRole) {
            return userManagementApi.deleteMenuRole(menuRole.menuRoleId);
          }
          return Promise.resolve();
        });

        await Promise.all(unassignPromises);
      }

      showSnackbar('Menu assignments updated successfully', 'success');
      setSelectedUnassignedMenus([]);
      setSelectedAssignedMenus([]);
      fetchMenuAssignments();
    } catch (error) {
      console.error('Error updating menu assignments:', error);
      showSnackbar('Error updating menu assignments', 'error');
    }
  };

  const handleUnassignedMenuToggle = (menuId) => {
    setSelectedUnassignedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleAssignedMenuToggle = (menuId) => {
    setSelectedAssignedMenus(prev => 
      prev.includes(menuId) 
        ? prev.filter(id => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleSelectAllUnassigned = (event) => {
    if (event.target.checked) {
      setSelectedUnassignedMenus(getUnassignedMenus().map(menu => menu.menuId));
    } else {
      setSelectedUnassignedMenus([]);
    }
  };

  const handleSelectAllAssigned = (event) => {
    if (event.target.checked) {
      setSelectedAssignedMenus(getAssignedMenus().map(menu => menu.menuId));
    } else {
      setSelectedAssignedMenus([]);
    }
  };

  const getUnassignedMenus = () => {
    if (!selectedRole) return [];
    
    const assignedMenuIds = menuRoles
      .filter(mr => mr.roleId === parseInt(selectedRole))
      .map(mr => mr.menuId);
    
    const allMenus = [...mainMenus, ...subMenus];
    return allMenus
      .filter(menu => !assignedMenuIds.includes(menu.menuId))
      .filter(menu => 
        menu.menuName?.toLowerCase().includes(unassignedSearchTerm.toLowerCase()) ||
        menu.mainMenuDesc?.toLowerCase().includes(unassignedSearchTerm.toLowerCase()) ||
        menu.subMenuDesc?.toLowerCase().includes(unassignedSearchTerm.toLowerCase())
      );
  };

  const getAssignedMenus = () => {
    if (!selectedRole) return [];
    
    const assignedMenuIds = menuRoles
      .filter(mr => mr.roleId === parseInt(selectedRole))
      .map(mr => mr.menuId);
    
    const allMenus = [...mainMenus, ...subMenus];
    return allMenus
      .filter(menu => assignedMenuIds.includes(menu.menuId))
      .filter(menu => 
        menu.menuName?.toLowerCase().includes(assignedSearchTerm.toLowerCase()) ||
        menu.mainMenuDesc?.toLowerCase().includes(assignedSearchTerm.toLowerCase()) ||
        menu.subMenuDesc?.toLowerCase().includes(assignedSearchTerm.toLowerCase())
      );
  };

  const getMenuName = (menu) => {
    return menu.menuName || menu.mainMenuDesc || menu.subMenuDesc || 'Unknown Menu';
  };

  const getMenuIcon = (menu) => {
    return menu.icon || '📋';
  };

  const getMenuOrder = (menu) => {
    return menu.orderNo || menu.mainMenuOrderNo || 0;
  };

  const getMenuEnabled = (menu) => {
    return menu.enabled || menu.isEnabled || 'N';
  };

  const getMenuCreatedBy = (menu) => {
    return menu.createdBy || 'System';
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Sample data functions
  const getSampleRoles = () => [
    { roleId: 1, roleName: 'Administrator' },
    { roleId: 2, roleName: 'Manager' },
    { roleId: 3, roleName: 'User' }
  ];

  const getSampleMainMenus = () => [
    { menuId: 1, mainMenuDesc: 'Dashboard', icon: '📊', orderNo: 1, enabled: 'Y', createdBy: 1 },
    { menuId: 2, mainMenuDesc: 'User Management', icon: '👥', orderNo: 2, enabled: 'Y', createdBy: 1 },
    { menuId: 3, mainMenuDesc: 'Company Management', icon: '🏢', orderNo: 3, enabled: 'Y', createdBy: 1 }
  ];

  const getSampleSubMenus = () => [
    { menuId: 4, subMenuDesc: 'View Users', icon: '👁️', orderNo: 1, enabled: 'Y', createdBy: 1, mainMenuId: 2 },
    { menuId: 5, subMenuDesc: 'Add User', icon: '➕', orderNo: 2, enabled: 'Y', createdBy: 1, mainMenuId: 2 },
    { menuId: 6, subMenuDesc: 'View Companies', icon: '🏢', orderNo: 1, enabled: 'Y', createdBy: 1, mainMenuId: 3 }
  ];

  const getSampleMenuRoles = () => [
    { menuRoleId: 1, roleId: 1, menuId: 1 },
    { menuRoleId: 2, roleId: 1, menuId: 2 }
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Typography variant="h6" color="text.secondary">Loading menu assignment data...</Typography>
      </Box>
    );
  }

  const unassignedMenus = getUnassignedMenus();
  const assignedMenus = getAssignedMenus();

  return (
    <Box sx={{ width: '100%' }}>
      {/* Header Section */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        mb: 3,
        borderRadius: 3,
        p: 3
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ color: 'white', mb: 1, fontWeight: 700 }}>
              Assign Menus
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
              Manage menu assignments for roles
            </Typography>
          </Box>
          <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)' }}>
            <Assignment sx={{ fontSize: 32 }} />
          </Avatar>
        </Box>
      </Box>

      {/* Role Selection */}
      <Box sx={{ mb: 3, borderRadius: 3, bgcolor: 'background.paper', p: 2, boxShadow: 1 }}>
        <FormControl fullWidth>
          <InputLabel>Select Role</InputLabel>
          <Select
            value={selectedRole}
            onChange={handleRoleChange}
            label="Select Role"
            className="professional-input"
          >
            {roles.map((role) => (
              <MenuItem key={role.roleId} value={role.roleId}>
                {role.roleName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {selectedRole && (
        <Grid container spacing={0}>
          {/* Unassigned Menus */}
          <Grid item xs={12}>
            <Box sx={{ borderRadius: 3, bgcolor: 'background.paper', p: 2, boxShadow: 1, mb: 3 }}>
              <Typography variant="h5" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, fontWeight: 600, color: 'primary.main' }}>
                <Menu />
                Unassigned Menus
              </Typography>
              
              <Box className="search-container">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Button
                    startIcon={<ViewColumn />}
                    size="small"
                    variant="outlined"
                    className="professional-button secondary"
                  >
                    Columns
                  </Button>
                  <Button
                    startIcon={<GetApp />}
                    size="small"
                    variant="outlined"
                    className="professional-button secondary"
                  >
                    Export
                  </Button>
                </Box>
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={unassignedSearchTerm}
                  onChange={(e) => setUnassignedSearchTerm(e.target.value)}
                  className="professional-input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 200 }}
                />
              </Box>

              <TableContainer className="professional-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={unassignedMenus.length > 0 && selectedUnassignedMenus.length === unassignedMenus.length}
                          indeterminate={selectedUnassignedMenus.length > 0 && selectedUnassignedMenus.length < unassignedMenus.length}
                          onChange={handleSelectAllUnassigned}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sr.</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Menu Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Menu Icon</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order No</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Enabled</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created By</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unassignedMenus.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          No rows
                        </TableCell>
                      </TableRow>
                    ) : (
                      unassignedMenus
                        .slice(unassignedPage * rowsPerPage, unassignedPage * rowsPerPage + rowsPerPage)
                        .map((menu, index) => (
                          <TableRow key={menu.menuId} hover>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedUnassignedMenus.includes(menu.menuId)}
                                onChange={() => handleUnassignedMenuToggle(menu.menuId)}
                              />
                            </TableCell>
                            <TableCell>{unassignedPage * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{getMenuName(menu)}</TableCell>
                            <TableCell>{getMenuIcon(menu)}</TableCell>
                            <TableCell>{getMenuOrder(menu)}</TableCell>
                            <TableCell>
                              <Chip
                                label={getMenuEnabled(menu) === 'Y' ? 'Yes' : 'No'}
                                size="small"
                                className="professional-chip"
                                color={getMenuEnabled(menu) === 'Y' ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell>{getMenuCreatedBy(menu)}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={unassignedMenus.length}
                page={unassignedPage}
                onPageChange={(event, newPage) => setUnassignedPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setUnassignedPage(0);
                }}
                rowsPerPageOptions={[25, 50, 100]}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSaveAssignments}
                  disabled={selectedUnassignedMenus.length === 0}
                  className="professional-button primary"
                >
                  Save
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Assigned Menus */}
          <Grid item xs={12}>
            <Box sx={{ borderRadius: 3, bgcolor: 'background.paper', p: 2, boxShadow: 1 }}>
              <Typography className="professional-heading" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security />
                Assigned Menus
              </Typography>
              
              <Box className="search-container">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Button
                    startIcon={<ViewColumn />}
                    size="small"
                    variant="outlined"
                    className="professional-button secondary"
                  >
                    Columns
                  </Button>
                  <Button
                    startIcon={<GetApp />}
                    size="small"
                    variant="outlined"
                    className="professional-button secondary"
                  >
                    Export
                  </Button>
                </Box>
                <TextField
                  size="small"
                  placeholder="Search..."
                  value={assignedSearchTerm}
                  onChange={(e) => setAssignedSearchTerm(e.target.value)}
                  className="professional-input"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ width: 200 }}
                />
              </Box>

              <TableContainer className="professional-table">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={assignedMenus.length > 0 && selectedAssignedMenus.length === assignedMenus.length}
                          indeterminate={selectedAssignedMenus.length > 0 && selectedAssignedMenus.length < assignedMenus.length}
                          onChange={handleSelectAllAssigned}
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Sr.</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Menu Name</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Menu Icon</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Order No</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Enabled</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Created By</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedMenus.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No rows
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignedMenus
                        .slice(assignedPage * rowsPerPage, assignedPage * rowsPerPage + rowsPerPage)
                        .map((menu, index) => (
                          <TableRow key={menu.menuId} hover>
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={selectedAssignedMenus.includes(menu.menuId)}
                                onChange={() => handleAssignedMenuToggle(menu.menuId)}
                              />
                            </TableCell>
                            <TableCell>{assignedPage * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{getMenuName(menu)}</TableCell>
                            <TableCell>{getMenuIcon(menu)}</TableCell>
                            <TableCell>{getMenuOrder(menu)}</TableCell>
                            <TableCell>
                              <Chip
                                label={getMenuEnabled(menu) === 'Y' ? 'Yes' : 'No'}
                                size="small"
                                className="professional-chip"
                                color={getMenuEnabled(menu) === 'Y' ? 'success' : 'error'}
                              />
                            </TableCell>
                            <TableCell>{getMenuCreatedBy(menu)}</TableCell>
                            <TableCell>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleAssignedMenuToggle(menu.menuId)}
                              >
                                <Delete />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={assignedMenus.length}
                page={assignedPage}
                onPageChange={(event, newPage) => setAssignedPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setAssignedPage(0);
                }}
                rowsPerPageOptions={[25, 50, 100]}
              />
            </Box>
          </Grid>
        </Grid>
      )}

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

export default AssignMenus;
