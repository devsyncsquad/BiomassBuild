"use client";

import React, { useState, useEffect } from "react";
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
  Typography,
  Chip,
  Avatar,
  Tooltip,
  TextField,
  InputAdornment,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
} from "@mui/material";
import { Edit, Delete, Search, Security, Refresh } from "@mui/icons-material";
import axios from "axios";
import { getAuthHeaders } from "../../../utils/auth";
import { useGetRoleListQuery } from "../../../redux/apis/userManagementApi";

const ViewRoles = ({ setInitialData }) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use RTK Query instead of local state
  const {
    data: rolesResponse,
    isLoading: loading,
    error: rolesError,
    refetch: refetchRoles,
  } = useGetRoleListQuery();

  // Debug logging
  console.log("ViewRoles RTK Query Debug:", {
    rolesResponse,
    loading,
    rolesError,
    errorDetails: rolesError?.data || rolesError?.message
  });

  // Extract roles from response
  const roles = rolesResponse?.result || [];
  const error = rolesError ? 
    `Failed to fetch roles: ${rolesError?.data?.message || rolesError?.message || 'Unknown error'}` : "";

  // Debug logging
  console.log("ViewRoles RTK Query Debug:", {
    rolesResponse,
    extractedRoles: roles,
    rolesLength: roles.length,
    loading,
    rolesError
  });

  const handleEditRole = (role) => {
    setInitialData(role);
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        const response = await axios.delete(
          `https://localhost:7084/api/UserManagement/DeleteRoleById?roleId=${roleId}`,
          {
            headers: getAuthHeaders(),
          }
        );

        if (response.data && response.data.success) {
          // Refetch roles to update the list
          refetchRoles();
        } else {
          alert(response.data?.message || "Failed to delete role");
        }
      } catch (error) {
        console.error("Error deleting role:", error);
        alert("Failed to delete role. Please try again.");
      }
    }
  };

  const handleViewRole = (role) => {
    console.log("View role:", role);
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.roleName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (enabled) => {
    return enabled === "Y" ? "success" : "error";
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      {/* <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 4,
          p: 3,
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box>
          <Typography
            variant='h5'
            sx={{
              fontWeight: 700,
              color: "#228B22",
              mb: 1,
            }}
          >
            Roles Management
          </Typography>
          <Typography variant='body2' sx={{ color: "#64748b" }}>
            Manage and monitor all system roles and their permissions
          </Typography>
        </Box>
        <Button
          variant='outlined'
          startIcon={<Refresh />}
          onClick={refetchRoles}
          disabled={loading}
          sx={{
            borderColor: "#228B22",
            color: "#228B22",
            "&:hover": {
              borderColor: "#1B5E20",
              bgcolor: "rgba(34, 139, 34, 0.04)",
              transform: "translateY(-1px)",
              boxShadow: "0 4px 12px rgba(34, 139, 34, 0.15)",
            },
            transition: "all 0.2s ease",
            borderRadius: "12px",
            px: 3,
            py: 1,
          }}
        >
          Refresh
        </Button>
      </Box> */}

      {/* Error Alert */}
      {error && (
        <Alert severity='error' sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}


      {/* Search Bar */}
      <Card
        sx={{
          // mb: 4,
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(34, 139, 34, 0.08)",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <Security sx={{ color: "#228B22", fontSize: "1.5rem" }} /> */}
            <TextField
              fullWidth
              placeholder='Search roles by name or description...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Search sx={{ color: "#228B22" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: 500,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
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
          </Box>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress sx={{ color: "#228B22" }} size={48} />
        </Box>
      )}

      {/* Roles Table */}
      {!loading && (
        <Card
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(34, 139, 34, 0.08)",
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow
                  sx={{
                    background:
                      "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
                    "& th": {
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      borderBottom: "none",
                      py: 2,
                    },
                  }}
                >
                  <TableCell>Role</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRoles.map((role) => (
                  <TableRow
                    key={role.roleId}
                    hover
                    sx={{
                      "&:nth-of-type(even)": { bgcolor: "#f8fafc" },
                      "&:hover": {
                        bgcolor: "rgba(34, 139, 34, 0.02)",
                        transform: "scale(1.01)",
                        transition: "all 0.2s ease",
                      },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            mr: 2,
                            bgcolor: "#228B22",
                            boxShadow: "0 4px 12px rgba(34, 139, 34, 0.3)",
                            width: 40,
                            height: 40,
                          }}
                        >
                          <Security sx={{ color: "white" }} />
                        </Avatar>
                        <Box>
                          <Typography
                            variant='body2'
                            sx={{ fontWeight: 600, color: "#1e293b" }}
                          >
                            {role.roleName}
                          </Typography>
                          <Typography
                            variant='caption'
                            sx={{ color: "#228B22", fontWeight: 500 }}
                          >
                            ID: {role.roleId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ color: "#475569" }}>
                        {role.description || "No description"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={role.enabled === "Y" ? "Active" : "Inactive"}
                        size='small'
                        sx={{
                          bgcolor:
                            role.enabled === "Y"
                              ? "rgba(34, 197, 94, 0.1)"
                              : "rgba(239, 68, 68, 0.1)",
                          color: role.enabled === "Y" ? "#22c55e" : "#ef4444",
                          fontWeight: 600,
                          borderRadius: "8px",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant='body2' sx={{ color: "#475569" }}>
                        {role.createdAt
                          ? new Date(role.createdAt).toLocaleDateString()
                          : "N/A"}
                      </Typography>
                    </TableCell>
                    <TableCell align='center'>
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title='Edit Role'>
                          <IconButton
                            size='small'
                            onClick={() => handleEditRole(role)}
                            sx={{
                              color: "#228B22",
                              p: 1,
                              bgcolor: "rgba(34, 139, 34, 0.1)",
                              "&:hover": {
                                bgcolor: "rgba(34, 139, 34, 0.2)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <Edit sx={{ fontSize: "1.1rem" }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Delete Role'>
                          <IconButton
                            size='small'
                            onClick={() => handleDeleteRole(role.roleId)}
                            sx={{
                              color: "#ef4444",
                              p: 1,
                              bgcolor: "rgba(239, 68, 68, 0.1)",
                              "&:hover": {
                                bgcolor: "rgba(239, 68, 68, 0.2)",
                                transform: "scale(1.1)",
                              },
                              transition: "all 0.2s ease",
                            }}
                          >
                            <Delete sx={{ fontSize: "1.1rem" }} />
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

      {!loading && filteredRoles.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography color='text.secondary'>
            {roles.length === 0
              ? "No roles found."
              : "No roles match your search criteria."}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ViewRoles;
