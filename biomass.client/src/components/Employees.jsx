import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { employeeApi } from "../utils/api";
import EmployeeForm from "./EmployeeForm";

const Employees = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [searchTerm, employees]);

  // Reset to first page when filter changes
  useEffect(() => {
    setPage(0);
  }, [searchTerm]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await employeeApi.getAllEmployees(1, 100); // Get all employees
      if (response.success) {
        setEmployees(response.result.items || []);
      } else {
        enqueueSnackbar("Error loading employees: " + response.message, {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error loading employees:", error);
      enqueueSnackbar("Error loading employees. Please try again.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = [...employees];

    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (employee) =>
          (employee.fullName || "").toLowerCase().includes(searchLower) ||
          (employee.designation || "").toLowerCase().includes(searchLower) ||
          (employee.phone || "").toLowerCase().includes(searchLower)
      );
    }

    setFilteredEmployees(filtered);
    // Reset to first page when filter changes
    setPage(0);
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when changing rows per page
  };

  // Get paginated data
  const getPaginatedData = () => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredEmployees.slice(startIndex, endIndex);
  };

  const handleAddEmployee = () => {
    setEditingEmployee(null);
    setOpenDialog(true);
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setOpenDialog(true);
  };

  const handleFormSuccess = () => {
    loadData(); // Refresh the list
    setOpenDialog(false);
    setEditingEmployee(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEmployee(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box sx={{ p: 0, backgroundColor: "#f8fffa", minHeight: "100vh" }}>
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
          color: "white",
          p: 4,
          mb: 3,
          borderRadius: "0 0 24px 24px",
          boxShadow: "0 8px 32px rgba(34,139,34,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(-50%, 50%)",
          }}
        />

        <Box
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              gutterBottom
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Employees
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: "white",
                opacity: 0.9,
                fontWeight: 300,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Manage your team members and their information.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddEmployee}
            sx={{
              background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #006400 0%, #004d00 100%)",
              },
              borderRadius: "12px",
              px: 3,
              py: 1.5,
            }}
          >
            Add Employee
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Section */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            {/* Search Bar */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, designation, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "green" }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    "&:hover": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                    },
                    "&.Mui-focused": {
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "green",
                      },
                    },
                  },
                }}
              />
            </Grid>

            {/* Count Display */}
            <Grid item xs={12} md={6}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <PersonIcon sx={{ color: "#228B22", fontSize: 24 }} />
                <Typography variant="body1" color="text.secondary">
                  Total Employees: <strong>{filteredEmployees.length}</strong>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f8fffa" }}>
                  <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                    Full Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                    Designation
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                    Phone
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: "#228B22" }}>
                    Created Date
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, color: "#228B22", textAlign: "center" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                      <CircularProgress sx={{ color: "#228B22" }} />
                      <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                        Loading employees...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : getPaginatedData().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} sx={{ textAlign: "center", py: 4 }}>
                      <PersonIcon sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No employees found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {searchTerm
                          ? "Try adjusting your search criteria"
                          : "Add your first employee to get started"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  getPaginatedData().map((employee) => (
                    <TableRow
                      key={employee.employeeId}
                      sx={{
                        "&:hover": {
                          backgroundColor: "rgba(34, 139, 34, 0.04)",
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              borderRadius: "50%",
                              backgroundColor: "#228B22",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: 600,
                            }}
                          >
                            {employee.fullName?.charAt(0)?.toUpperCase() || "?"}
                          </Box>
                          <Typography variant="body1" fontWeight={500}>
                            {employee.fullName || "N/A"}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={employee.designation || "Not specified"}
                          variant="outlined"
                          sx={{
                            borderColor: "#228B22",
                            color: "#228B22",
                            "&:hover": {
                              backgroundColor: "rgba(34, 139, 34, 0.04)",
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {employee.phone || "Not provided"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(employee.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        <IconButton
                          onClick={() => handleEditEmployee(employee)}
                          sx={{
                            color: "#228B22",
                            "&:hover": {
                              backgroundColor: "rgba(34, 139, 34, 0.1)",
                            },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {filteredEmployees.length > 0 && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredEmployees.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                borderTop: "1px solid #e0e0e0",
                "& .MuiTablePagination-toolbar": {
                  color: "#228B22",
                },
                "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
                  {
                    color: "#228B22",
                  },
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Employee Form Dialog */}
      <EmployeeForm
        open={openDialog}
        onClose={handleCloseDialog}
        employee={editingEmployee}
        onSuccess={handleFormSuccess}
      />
    </Box>
  );
};

export default Employees;
