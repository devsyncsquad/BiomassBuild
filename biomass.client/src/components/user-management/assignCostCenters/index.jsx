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
import { Assignment, Business, Search, Save } from "@mui/icons-material";

// Utility Imports
import { getAuthHeaders, getCurrentUser } from "../../../utils/auth";
import SectionHeader from "../shared/SectionHeader";
import CardContainer from "../shared/CardContainer";

import { getBaseUrl } from "../../../utils/api";

const AssignCostCenters = () => {
  // State management
  const [users, setUsers] = useState([]);
  const [costCenters, setCostCenters] = useState([]);
  const [userCostCenters, setUserCostCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Selection states
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUnassignedCostCenters, setSelectedUnassignedCostCenters] = useState([]);
  const [selectedAssignedCostCenters, setSelectedAssignedCostCenters] = useState([]);

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
    if (selectedUser) {
      fetchUserCostCenterAssignments();
    }
  }, [selectedUser]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [usersResponse, costCentersResponse] = await Promise.all([
        fetch(`${getBaseUrl()}/UserManagement/GetUsersList`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${getBaseUrl()}/cost-centers/GetAllCostCentersView`, {
          headers: getAuthHeaders(),
        }),
      ]);

      // Parse responses
      const usersData = await usersResponse.json();
      const costCentersData = await costCentersResponse.json();

      if (usersData.success) {
        // Extract users from UserWithCustomers structure
        const users = usersData.result?.map(item => item.user) || [];
        console.log("Extracted users:", users);
        setUsers(users);
      }
      if (costCentersData.success) setCostCenters(costCentersData.result || []);

      showSnackbar("Data loaded successfully", "success");
    } catch (error) {
      console.error("Error fetching data:", error);
      showSnackbar("Failed to load data", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserCostCenterAssignments = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `${getBaseUrl()}/UserManagement/GetUserCostCenterAssignment/${selectedUser}`,
        {
          headers: getAuthHeaders(),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUserCostCenters(data.result || []);
        }
      }
    } catch (error) {
      console.error("Error fetching user cost center assignments:", error);
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
    setSelectedUnassignedCostCenters([]);
    setSelectedAssignedCostCenters([]);
    setUnassignedPage(0);
    setAssignedPage(0);
  };

  const handleSaveAssignments = async () => {
    if (!selectedUser) {
      showSnackbar("Please select a user first", "error");
      return;
    }

    try {
      // Assign selected unassigned cost centers
      if (selectedUnassignedCostCenters.length > 0) {
        const assignPromises = selectedUnassignedCostCenters.map((costCenterId) =>
          fetch(`${getBaseUrl()}/UserManagement/AssignCostCenterToUser`, {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: parseInt(selectedUser),
              costCenterId: parseInt(costCenterId),
              assignedBy: user?.empId || 1,
            }),
          })
        );

        await Promise.all(assignPromises);
      }

      // Unassign selected assigned cost centers
      if (selectedAssignedCostCenters.length > 0) {
        const unassignPromises = selectedAssignedCostCenters.map((costCenterId) =>
          fetch(
            `${getBaseUrl()}/UserManagement/UnassignCostCenterFromUser/${selectedUser}/${costCenterId}`,
            {
              method: "DELETE",
              headers: getAuthHeaders(),
            }
          )
        );

        await Promise.all(unassignPromises);
      }

      showSnackbar("Cost center assignments updated successfully", "success");
      setSelectedUnassignedCostCenters([]);
      setSelectedAssignedCostCenters([]);
      fetchUserCostCenterAssignments();
    } catch (error) {
      console.error("Error updating cost center assignments:", error);
      showSnackbar("Error updating cost center assignments", "error");
    }
  };

  const handleUnassignedCostCenterToggle = (costCenterId) => {
    setSelectedUnassignedCostCenters((prev) =>
      prev.includes(costCenterId)
        ? prev.filter((id) => id !== costCenterId)
        : [...prev, costCenterId]
    );
  };

  const handleAssignedCostCenterToggle = (costCenterId) => {
    setSelectedAssignedCostCenters((prev) =>
      prev.includes(costCenterId)
        ? prev.filter((id) => id !== costCenterId)
        : [...prev, costCenterId]
    );
  };

  const handleSelectAllUnassigned = (event) => {
    if (event.target.checked) {
      setSelectedUnassignedCostCenters(
        getUnassignedCostCenters().map((costCenter) => costCenter.costCenterId)
      );
    } else {
      setSelectedUnassignedCostCenters([]);
    }
  };

  const handleSelectAllAssigned = (event) => {
    if (event.target.checked) {
      setSelectedAssignedCostCenters(getAssignedCostCenters().map((costCenter) => costCenter.costCenterId));
    } else {
      setSelectedAssignedCostCenters([]);
    }
  };

  const getUnassignedCostCenters = () => {
    if (!selectedUser || !userCostCenters) return [];

    const assignedCostCenterIds = userCostCenters.assignedCostCenters?.map((cc) => cc.costCenterId) || [];

    return costCenters
      .filter((cc) => !assignedCostCenterIds.includes(cc.costCenterId))
      .filter((cc) =>
        cc.name?.toLowerCase().includes(unassignedSearchTerm.toLowerCase()) ||
        cc.code?.toLowerCase().includes(unassignedSearchTerm.toLowerCase())
      );
  };

  const getAssignedCostCenters = () => {
    if (!selectedUser || !userCostCenters) return [];

    return (userCostCenters.assignedCostCenters || [])
      .filter((cc) =>
        cc.costCenterName?.toLowerCase().includes(assignedSearchTerm.toLowerCase()) ||
        cc.costCenterCode?.toLowerCase().includes(assignedSearchTerm.toLowerCase())
      );
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

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
          Loading cost center assignment data...
        </Typography>
      </Box>
    );
  }

  const unassignedCostCenters = getUnassignedCostCenters();
  const assignedCostCenters = getAssignedCostCenters();

  return (
    <Box sx={{ width: "100%", bgcolor: "background.default" }}>
      <SectionHeader title='Assign Cost Centers to Users' />

      <Grid container spacing={2} sx={{ mb: 3, px: 3 }}>
        <Grid item xs={12} md={6} lg={4}>
          <FormControl fullWidth>
            <InputLabel>Select User</InputLabel>
            <Select
              value={selectedUser}
              onChange={handleUserChange}
              label='Select User'
            >
              {users.map((user) => (
                <MenuItem key={user.userId} value={user.userId}>
                  {user.firstName} {user.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {selectedUser && (
        <Grid container spacing={3} sx={{ px: 3 }}>
          {/* Unassigned Cost Centers */}
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
                <Business sx={{ color: "#228B22" }} />
                Available Cost Centers ({unassignedCostCenters.length})
              </Typography>

              <TextField
                size='small'
                placeholder='Search cost centers...'
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
                            unassignedCostCenters.length > 0 &&
                            selectedUnassignedCostCenters.length === unassignedCostCenters.length
                          }
                          indeterminate={
                            selectedUnassignedCostCenters.length > 0 &&
                            selectedUnassignedCostCenters.length < unassignedCostCenters.length
                          }
                          onChange={handleSelectAllUnassigned}
                          sx={{
                            color: "#228B22",
                            "&.Mui-checked": { color: "#228B22" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Code
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Type
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {unassignedCostCenters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align='center'>
                          <Typography variant='body2' color='text.secondary'>
                            No available cost centers
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      unassignedCostCenters
                        .slice(
                          unassignedPage * rowsPerPage,
                          unassignedPage * rowsPerPage + rowsPerPage
                        )
                        .map((costCenter) => (
                          <TableRow
                            key={costCenter.costCenterId}
                            hover
                            sx={{ "&:hover": { backgroundColor: "#f8fffa" } }}
                          >
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={selectedUnassignedCostCenters.includes(costCenter.costCenterId)}
                                onChange={() => handleUnassignedCostCenterToggle(costCenter.costCenterId)}
                                sx={{
                                  color: "#228B22",
                                  "&.Mui-checked": { color: "#228B22" },
                                }}
                              />
                            </TableCell>
                            <TableCell>{costCenter.code}</TableCell>
                            <TableCell>{costCenter.name}</TableCell>
                            <TableCell>
                              <Chip
                                label={costCenter.costCenterType || "Parent"}
                                size='small'
                                color={costCenter.costCenterType === "Parent" ? "success" : "warning"}
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
                count={unassignedCostCenters.length}
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

          {/* Assigned Cost Centers */}
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
                <Assignment sx={{ color: "#228B22" }} />
                Assigned Cost Centers ({assignedCostCenters.length})
              </Typography>

              <TextField
                size='small'
                placeholder='Search cost centers...'
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
                            assignedCostCenters.length > 0 &&
                            selectedAssignedCostCenters.length === assignedCostCenters.length
                          }
                          indeterminate={
                            selectedAssignedCostCenters.length > 0 &&
                            selectedAssignedCostCenters.length < assignedCostCenters.length
                          }
                          onChange={handleSelectAllAssigned}
                          sx={{
                            color: "#228B22",
                            "&.Mui-checked": { color: "#228B22" },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Code
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Name
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                        Type
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedCostCenters.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={3} align='center'>
                          <Typography variant='body2' color='text.secondary'>
                            No assigned cost centers
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      assignedCostCenters
                        .slice(
                          assignedPage * rowsPerPage,
                          assignedPage * rowsPerPage + rowsPerPage
                        )
                        .map((costCenter) => (
                          <TableRow
                            key={costCenter.costCenterId}
                            hover
                            sx={{ "&:hover": { backgroundColor: "#f8fffa" } }}
                          >
                            <TableCell padding='checkbox'>
                              <Checkbox
                                checked={selectedAssignedCostCenters.includes(costCenter.costCenterId)}
                                onChange={() => handleAssignedCostCenterToggle(costCenter.costCenterId)}
                                sx={{
                                  color: "#228B22",
                                  "&.Mui-checked": { color: "#228B22" },
                                }}
                              />
                            </TableCell>
                            <TableCell>{costCenter.costCenterCode}</TableCell>
                            <TableCell>{costCenter.costCenterName}</TableCell>
                            <TableCell>{costCenter.costCenterType}</TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component='div'
                count={assignedCostCenters.length}
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
      {selectedUser && (
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
              selectedUnassignedCostCenters.length === 0 &&
              selectedAssignedCostCenters.length === 0
            }
          >
            Update Cost Center Assignments
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

export default AssignCostCenters;
