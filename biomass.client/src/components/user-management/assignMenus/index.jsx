"use client";

import React, { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Security, Menu, Search, Save } from "@mui/icons-material";

// Utility Imports
import { getAuthHeaders, getCurrentUser } from "../../../utils/auth";
import SectionHeader from "../shared/SectionHeader";
import CardContainer from "../shared/CardContainer";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "https://localhost:7084";

const AssignMenus = () => {
  // State management
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [menuRoles, setMenuRoles] = useState([]);
  const [userMenuRoles, setUserMenuRoles] = useState([]); // Menus assigned to current user
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Selection states
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedUnassignedMenus, setSelectedUnassignedMenus] = useState([]);
  const [selectedAssignedMenus, setSelectedAssignedMenus] = useState([]);

  // Table states
  const [unassignedPage, setUnassignedPage] = useState(0);
  const [assignedPage, setAssignedPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(100);
  const [unassignedSearchTerm, setUnassignedSearchTerm] = useState("");
  const [assignedSearchTerm, setAssignedSearchTerm] = useState("");

  // Get current user
  const user = getCurrentUser();

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

      // Fetch all data in parallel
      const [rolesResponse, menusResponse, menuRolesResponse] =
        await Promise.all([
          fetch(`${baseUrl}/api/UserManagement/GetRoleList`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${baseUrl}/api/UserManagement/GetMenuList`, {
            headers: getAuthHeaders(),
          }),
          fetch(`${baseUrl}/api/UserManagement/GetMenuRoleList`, {
            headers: getAuthHeaders(),
          }),
        ]);

      // Parse responses
      const rolesData = await rolesResponse.json();
      const menusData = await menusResponse.json();
      const menuRolesData = await menuRolesResponse.json();

      if (rolesData.success) setRoles(rolesData.result || []);
      if (menusData.success) setMenus(menusData.result || []);
      if (menuRolesData.success) setMenuRoles(menuRolesData.result || []);

      // Fetch current user's menu assignments
      if (user?.empId) {
        await fetchUserMenuAssignments();
      }

      showSnackbar("Data loaded successfully", "success");
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Failed to load data. Using sample data.", "warning");
      // Use sample data
      setRoles(getSampleRoles());
      setMenus(getSampleMenus());
      setMenuRoles(getSampleMenuRoles());
      setUserMenuRoles(getSampleUserMenuRoles());
    } finally {
      setLoading(false);
    }
  };

  const fetchUserMenuAssignments = async () => {
    try {
      // Get user's role first
      const userRoleResponse = await fetch(
        `${baseUrl}/api/UserManagement/GetUserRolesByUserId?userId=${user.empId}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (userRoleResponse.ok) {
        const userRoleData = await userRoleResponse.json();
        if (
          userRoleData.success &&
          userRoleData.result &&
          userRoleData.result.length > 0
        ) {
          const userRole = userRoleData.result[0]; // Get first role

          // Fetch menus for this role
          const userMenusResponse = await fetch(
            `${baseUrl}/api/UserManagement/GetMenuRolesByRoleId?roleId=${userRole.roleId}`,
            {
              headers: getAuthHeaders(),
            }
          );

          if (userMenusResponse.ok) {
            const userMenusData = await userMenusResponse.json();
            if (userMenusData.success) {
              setUserMenuRoles(userMenusData.result || []);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching user menu assignments:", error);
    }
  };

  const fetchMenuAssignments = async () => {
    if (!selectedRole) return;

    try {
      const response = await fetch(
        `${baseUrl}/api/UserManagement/GetMenuRoleList?roleId=${selectedRole}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMenuRoles(data.result || []);
        }
      }
    } catch (error) {
      console.error("Error fetching menu assignments:", error);
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
      showSnackbar("Please select a role first", "error");
      return;
    }

    try {
      // Assign selected unassigned menus
      if (selectedUnassignedMenus.length > 0) {
        const assignPromises = selectedUnassignedMenus.map((menuId) =>
          fetch(`${baseUrl}/api/UserManagement/SaveMenuRole`, {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              roleId: parseInt(selectedRole),
              menuId: parseInt(menuId),
            }),
          })
        );

        await Promise.all(assignPromises);
      }

      // Unassign selected assigned menus
      if (selectedAssignedMenus.length > 0) {
        const unassignPromises = selectedAssignedMenus.map((menuId) => {
          const menuRole = menuRoles.find(
            (mr) => mr.menuId === menuId && mr.roleId === parseInt(selectedRole)
          );
          if (menuRole) {
            return fetch(
              `${baseUrl}/api/UserManagement/DeleteMenuRoleById?roleId=${selectedRole}&menuId=${menuId}`,
              {
                method: "DELETE",
                headers: getAuthHeaders(),
              }
            );
          }
          return Promise.resolve();
        });

        await Promise.all(unassignPromises);
      }

      showSnackbar("Menu assignments updated successfully", "success");
      setSelectedUnassignedMenus([]);
      setSelectedAssignedMenus([]);
      fetchMenuAssignments();

      // Refresh user's menu assignments if they're editing their own role
      if (user?.empId) {
        await fetchUserMenuAssignments();
      }
    } catch (error) {
      console.error("Error updating menu assignments:", error);
      showSnackbar("Error updating menu assignments", "error");
    }
  };

  const handleUnassignedMenuToggle = (menuId) => {
    setSelectedUnassignedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleAssignedMenuToggle = (menuId) => {
    setSelectedAssignedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleSelectAllUnassigned = (event) => {
    if (event.target.checked) {
      setSelectedUnassignedMenus(
        getUnassignedMenus().map((menu) => menu.menuId)
      );
    } else {
      setSelectedUnassignedMenus([]);
    }
  };

  const handleSelectAllAssigned = (event) => {
    if (event.target.checked) {
      setSelectedAssignedMenus(getAssignedMenus().map((menu) => menu.menuId));
    } else {
      setSelectedAssignedMenus([]);
    }
  };

  // Get filtered menus based on user role
  const getFilteredMenus = () => {
    if (!user?.role) return menus;

    // Admin sees all menus
    if (
      user.role.toLowerCase() === "administrator" ||
      user.role.toLowerCase() === "admin"
    ) {
      return menus;
    }

    // Manager and Employee only see their assigned menus
    const assignedMenuIds = userMenuRoles.map((mr) => mr.menuId);
    return menus.filter((menu) => assignedMenuIds.includes(menu.menuId));
  };

  const getUnassignedMenus = () => {
    if (!selectedRole) return [];

    const assignedMenuIds = menuRoles
      .filter((mr) => mr.roleId === parseInt(selectedRole))
      .map((mr) => mr.menuId);

    const filteredMenus = getFilteredMenus();

    return filteredMenus
      .filter((menu) => !assignedMenuIds.includes(menu.menuId))
      .filter((menu) =>
        menu.menuName
          ?.toLowerCase()
          .includes(unassignedSearchTerm.toLowerCase())
      );
  };

  const getAssignedMenus = () => {
    if (!selectedRole) return [];

    const assignedMenuIds = menuRoles
      .filter((mr) => mr.roleId === parseInt(selectedRole))
      .map((mr) => mr.menuId);

    const filteredMenus = getFilteredMenus();

    return filteredMenus
      .filter((menu) => assignedMenuIds.includes(menu.menuId))
      .filter((menu) =>
        menu.menuName?.toLowerCase().includes(assignedSearchTerm.toLowerCase())
      );
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  // Sample data functions for demo purposes
  const getSampleRoles = () => [
    { roleId: 1, roleName: "Administrator" },
    { roleId: 2, roleName: "Manager" },
    { roleId: 3, roleName: "User" },
  ];

  const getSampleMenus = () => [
    {
      menuId: 1,
      menuName: "Dashboard",
      iconUrl: "📊",
      orderNo: 1,
      isEnabled: "Y",
      createdBy: 1,
    },
    {
      menuId: 2,
      menuName: "User Management",
      iconUrl: "👥",
      orderNo: 2,
      isEnabled: "Y",
      createdBy: 1,
    },
    {
      menuId: 3,
      menuName: "Company Management",
      iconUrl: "🏢",
      orderNo: 3,
      isEnabled: "Y",
      createdBy: 1,
    },
  ];

  const getSampleMenuRoles = () => [
    { menuRoleId: 1, roleId: 1, menuId: 1 },
    { menuRoleId: 2, roleId: 1, menuId: 2 },
  ];

  const getSampleUserMenuRoles = () => [
    { menuRoleId: 1, roleId: 1, menuId: 1 },
    { menuRoleId: 2, roleId: 1, menuId: 2 },
  ];

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 400,
        }}
      >
        <CircularProgress size={40} sx={{ color: "#228B22" }} />
        <Typography variant='h6' color='text.secondary' sx={{ ml: 2 }}>
          Loading menu assignment data...
        </Typography>
      </Box>
    );
  }

  const unassignedMenus = getUnassignedMenus();
  const assignedMenus = getAssignedMenus();
  const filteredMenus = getFilteredMenus();

  return (
    <Box sx={{ width: "100%", bgcolor: "background.default" }}>
      <SectionHeader title='Assign Menus to Roles' />

      {/* Role Selection */}
      {/* <Box
        sx={{
          mb: 3,
          borderRadius: 3,
          bgcolor: "background.paper",
          p: 2,
          boxShadow: 2,
          mx: 3,
        }}
      > */}
      <Grid container spacing={2} sx={{ mb: 3, px: 3 }}>
        <Grid item xs={12} md={6} lg={4}>
          <FormControl fullWidth>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={handleRoleChange}
              label='Select Role'
            >
              {roles.map((role) => (
                <MenuItem key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* </Box> */}

      {/* Access Control Notice */}
      {/* {user?.role?.toLowerCase() !== "administrator" &&
        user?.role?.toLowerCase() !== "admin" && (
          <Box sx={{ mb: 3, mx: 3 }}>
            <Alert
              severity='info'
              sx={{
                bgcolor: "#e3f2fd",
                border: "1px solid #2196f3",
                "& .MuiAlert-icon": { color: "#2196f3" },
              }}
            >
              <Typography variant='body2'>
                <strong>Access Control Active:</strong> You can only view and
                manage menus that are assigned to your role. Contact an
                administrator for full access.
              </Typography>
            </Alert>
          </Box>
        )} */}

      {selectedRole && (
        <Grid container spacing={3} sx={{ px: 3 }}>
          {/* Unassigned Menus */}
          <Grid item xs={12} md={6}>
            <CardContainer>
              <Typography
                variant='h6'
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                  color: "#228B22",
                  borderBottom: "2px solid #228B22",
                  pb: 1,
                }}
              >
                <Menu sx={{ color: "#228B22" }} />
                Available Menus ({unassignedMenus.length})
              </Typography>

              <TextField
                size='small'
                placeholder='Search menus...'
                value={unassignedSearchTerm}
                onChange={(e) => setUnassignedSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search sx={{ color: "#228B22" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#228B22",
                      borderWidth: "2px",
                    },
                  },
                }}
              />

              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f8f0" }}>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={
                            unassignedMenus.length > 0 &&
                            selectedUnassignedMenus.length ===
                              unassignedMenus.length
                          }
                          indeterminate={
                            selectedUnassignedMenus.length > 0 &&
                            selectedUnassignedMenus.length <
                              unassignedMenus.length
                          }
                          onChange={handleSelectAllUnassigned}
                          sx={{
                            color: "#228B22",
                            "&.Mui-checked": { color: "#228B22" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Menu Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Order
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unassignedMenus.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align='center'>
                          <Typography variant='body2' color='text.secondary'>
                            No available menus
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      unassignedMenus
                        .slice(
                          unassignedPage * rowsPerPage,
                          unassignedPage * rowsPerPage + rowsPerPage
                        )
                        .map((menu) => (
                          <TableRow
                            key={menu.menuId}
                            hover
                            sx={{ "&:hover": { backgroundColor: "#f8fffa" } }}
                          >
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={selectedUnassignedMenus.includes(
                                  menu.menuId
                                )}
                                onChange={() =>
                                  handleUnassignedMenuToggle(menu.menuId)
                                }
                                sx={{
                                  color: "#228B22",
                                  "&.Mui-checked": { color: "#228B22" },
                                }}
                              />
                            </TableCell>
                            <TableCell>{menu.menuName}</TableCell>
                            <TableCell>{menu.orderNo}</TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  menu.isEnabled === "Y" ? "Active" : "Inactive"
                                }
                                size='small'
                                color={
                                  menu.isEnabled === "Y" ? "success" : "error"
                                }
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component='div'
                count={unassignedMenus.length}
                page={unassignedPage}
                onPageChange={(event, newPage) => setUnassignedPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setUnassignedPage(0);
                }}
                rowsPerPageOptions={[25, 50, 100]}
                sx={{
                  "& .MuiTablePagination-selectIcon": { color: "#228B22" },
                  "& .MuiTablePagination-select": { color: "#228B22" },
                  "& .MuiTablePagination-actions button": { color: "#228B22" },
                }}
              />
            </CardContainer>
          </Grid>

          {/* Assigned Menus */}
          <Grid item xs={12} md={6}>
            <CardContainer>
              <Typography
                variant='h6'
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontWeight: 600,
                  color: "#228B22",
                  borderBottom: "2px solid #228B22",
                  pb: 1,
                }}
              >
                <Security sx={{ color: "#228B22" }} />
                Assigned Menus ({assignedMenus.length})
              </Typography>

              <TextField
                size='small'
                placeholder='Search menus...'
                value={assignedSearchTerm}
                onChange={(e) => setAssignedSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search sx={{ color: "#228B22" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  width: "100%",
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#228B22",
                      borderWidth: "2px",
                    },
                  },
                }}
              />

              <TableContainer>
                <Table size='small'>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f0f8f0" }}>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          checked={
                            assignedMenus.length > 0 &&
                            selectedAssignedMenus.length ===
                              assignedMenus.length
                          }
                          indeterminate={
                            selectedAssignedMenus.length > 0 &&
                            selectedAssignedMenus.length < assignedMenus.length
                          }
                          onChange={handleSelectAllAssigned}
                          sx={{
                            color: "#228B22",
                            "&.Mui-checked": { color: "#228B22" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Menu Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Order
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Status
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedMenus.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align='center'>
                          <Typography variant='body2' color='text.secondary'>
                            No assigned menus
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignedMenus
                        .slice(
                          assignedPage * rowsPerPage,
                          assignedPage * rowsPerPage + rowsPerPage
                        )
                        .map((menu) => (
                          <TableRow
                            key={menu.menuId}
                            hover
                            sx={{ "&:hover": { backgroundColor: "#f8fffa" } }}
                          >
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={selectedAssignedMenus.includes(
                                  menu.menuId
                                )}
                                onChange={() =>
                                  handleAssignedMenuToggle(menu.menuId)
                                }
                                sx={{
                                  color: "#228B22",
                                  "&.Mui-checked": { color: "#228B22" },
                                }}
                              />
                            </TableCell>
                            <TableCell>{menu.menuName}</TableCell>
                            <TableCell>{menu.orderNo}</TableCell>
                            <TableCell>
                              <Chip
                                label={
                                  menu.isEnabled === "Y" ? "Active" : "Inactive"
                                }
                                size='small'
                                color={
                                  menu.isEnabled === "Y" ? "success" : "error"
                                }
                                sx={{ fontWeight: 500 }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component='div'
                count={assignedMenus.length}
                page={assignedPage}
                onPageChange={(event, newPage) => setAssignedPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(event) => {
                  setRowsPerPage(parseInt(event.target.value, 10));
                  setAssignedPage(0);
                }}
                rowsPerPageOptions={[25, 50, 100]}
                sx={{
                  "& .MuiTablePagination-selectIcon": { color: "#228B22" },
                  "& .MuiTablePagination-select": { color: "#228B22" },
                  "& .MuiTablePagination-actions button": { color: "#228B22" },
                }}
              />
            </CardContainer>
          </Grid>
        </Grid>
      )}

      {/* Action Buttons */}
      {selectedRole && (
        <Box
          sx={{
            mt: 3,
            display: "flex",
            justifyContent: "center",
            gap: 2,
            px: 3,
          }}
        >
          <Button
            variant='contained'
            startIcon={<Save />}
            onClick={handleSaveAssignments}
            disabled={
              selectedUnassignedMenus.length === 0 &&
              selectedAssignedMenus.length === 0
            }
          >
            Update Menu Assignments
          </Button>
        </Box>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AssignMenus;
