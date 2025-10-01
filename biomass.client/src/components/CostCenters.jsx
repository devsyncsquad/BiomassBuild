import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Stack,
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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  FilterList as FilterIcon,
  AccountTree as AccountTreeIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { getApiBaseUrl } from "../config/config";

const CostCenters = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [costCenters, setCostCenters] = useState([]);
  const [filteredCostCenters, setFilteredCostCenters] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCostCenter, setEditingCostCenter] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    parentCostCenterId: null,
    hasParent: false,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [filterType, searchTerm, costCenters]);

  // Reset to first page when filter changes
  useEffect(() => {
    setPage(0);
  }, [filterType]);

  const loadData = async () => {
    setLoading(true);
    try {
      console.log("Fetching cost centers from API...");
      const apiBaseUrl = getApiBaseUrl();
      const fullUrl = `${apiBaseUrl}/cost-centers/GetAllCostCentersView`;
      console.log("API Base URL from config:", apiBaseUrl);
      console.log("Full API URL:", fullUrl);
      console.log("Current window location:", window.location.href);

      const response = await axios.get(fullUrl);
      console.log("API Response:", response);
      console.log("Response data:", response.data);
      console.log("Response status:", response.status);

      // The API returns { "result": [...] } directly, not wrapped in success property
      if (response.data?.result && Array.isArray(response.data.result)) {
        console.log("Setting cost centers:", response.data.result);
        setCostCenters(response.data.result || []);
      } else {
        console.log("API returned no result array");
        console.log("API data structure:", response.data);
        enqueueSnackbar("No cost center data received from API", {
          variant: "warning",
        });
      }
    } catch (error) {
      console.error("Error loading cost centers:", error);
      console.error("Error response:", error.response);
      console.error("Error message:", error.message);
      console.error("Error config:", error.config);

      if (error.code === "ERR_NETWORK") {
        enqueueSnackbar(
          "Network error: Unable to connect to API server. Check if backend is running on port 7084.",
          { variant: "error" }
        );
      } else if (error.response?.status === 404) {
        enqueueSnackbar(
          "API endpoint not found. Check if the backend route exists.",
          { variant: "error" }
        );
      } else {
        enqueueSnackbar(`Error loading cost centers: ${error.message}`, {
          variant: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    console.log("Applying filter. Filter type:", filterType);
    console.log("Search term:", searchTerm);
    console.log("Total cost centers:", costCenters.length);

    let filtered = [...costCenters];

    // Apply type filter
    switch (filterType) {
      case "parent":
        filtered = filtered.filter((cc) => !cc.isChild);
        break;
      case "child":
        filtered = filtered.filter((cc) => cc.isChild);
        break;
      default:
        break;
    }

    // Apply search filter if search term exists
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (cc) =>
          (cc.name || "").toLowerCase().includes(searchLower) ||
          (cc.code || "").toLowerCase().includes(searchLower) ||
          (cc.status || "").toLowerCase().includes(searchLower)
      );
    }

    console.log("Filtered results:", filtered);
    setFilteredCostCenters(filtered);
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
    return filteredCostCenters.slice(startIndex, endIndex);
  };

  const handleAddCostCenter = () => {
    setIsEditMode(false);
    setEditingCostCenter(null);
    setFormData({
      name: "",
      parentCostCenterId: null,
      hasParent: false,
    });
    setOpenDialog(true);
  };

  const handleEditCostCenter = (costCenter) => {
    setIsEditMode(true);
    setEditingCostCenter(costCenter);
    setFormData({
      name: costCenter.name,
      parentCostCenterId: costCenter.parentCostCenterId, // Changed from parent_cost_center_id
      hasParent: !!costCenter.parentCostCenterId,
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCostCenter(null);
    setIsEditMode(false);
    setFormData({
      name: "",
      parentCostCenterId: null,
      hasParent: false,
    });
  };

  const generateCode = (name, costCenterId) => {
    if (!name || !costCenterId) return "";

    // Get first 3 letters of name, uppercase
    const abbreviation = name.substring(0, 3).toUpperCase();
    return `${abbreviation}_${costCenterId}`;
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      enqueueSnackbar("Name is required", { variant: "warning" });
      return;
    }

    setSaving(true);
    try {
      const apiBaseUrl = getApiBaseUrl();

      if (isEditMode) {
        // Update existing cost center
        const updateData = {
          costCenterId: editingCostCenter.costCenterId,
          name: formData.name.trim(),
          parentCostCenterId: formData.hasParent
            ? formData.parentCostCenterId
            : null,
          isActive: editingCostCenter.isActive,
          code: editingCostCenter.code, // Keep existing code
        };

        console.log("Updating cost center:", updateData);
        const response = await axios.put(
          `${apiBaseUrl}/cost-centers/${editingCostCenter.costCenterId}`,
          updateData
        );

        if (response.data?.success) {
          // Update local state with the response data
          const updatedCostCenter = response.data.result;
          setCostCenters((prev) =>
            prev.map((cc) =>
              cc.costCenterId === editingCostCenter.costCenterId
                ? updatedCostCenter
                : cc
            )
          );

          enqueueSnackbar("Cost center updated successfully", {
            variant: "success",
          });
        } else {
          enqueueSnackbar(
            response.data?.message || "Failed to update cost center",
            { variant: "error" }
          );
        }
      } else {
        // Create new cost center with proper structure
        const createData = {
          name: formData.name.trim(),
          parentCostCenterId: formData.hasParent ? formData.parentCostCenterId : null,
          isActive: true,
          code: `${formData.name.substring(0, 3).toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`, // Generate unique code with random string
          createdAt: new Date().toISOString()
        };

        console.log("Creating cost center:", createData);
        const response = await axios.post(
          `${apiBaseUrl}/cost-centers`,
          createData
        );

        if (response.data?.success) {
          // Add new cost center to local state
          const newCostCenter = response.data.result;
          setCostCenters((prev) => [...prev, newCostCenter]);

          enqueueSnackbar("Cost center created successfully", {
            variant: "success",
          });
        } else {
          enqueueSnackbar(
            response.data?.message || "Failed to create cost center",
            { variant: "error" }
          );
        }
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Error saving cost center:", error);
      console.error("Error response:", error.response);

      if (error.response?.status === 400) {
        enqueueSnackbar(
          error.response.data?.message ||
            "Validation error. Please check your input.",
          { variant: "error" }
        );
      } else if (error.response?.status === 404) {
        enqueueSnackbar("Cost center not found. It may have been deleted.", {
          variant: "error",
        });
      } else if (error.code === "ERR_NETWORK") {
        enqueueSnackbar("Network error: Unable to connect to API server.", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(`Error saving cost center: ${error.message}`, {
          variant: "error",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const getParentCostCenters = () => {
    return costCenters.filter((cc) => !cc.isChild); // Changed from is_child
  };

  const getStatusColor = (isChild) => {
    return isChild ? "warning" : "success";
  };

  const getStatusLabel = (isChild) => {
    return isChild ? "Child" : "Parent";
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
              variant='h4'
              gutterBottom
              sx={{
                color: "white",
                fontWeight: 700,
                mb: 1,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Cost Centers
            </Typography>
            
          </Box>
          <Grid item xs={12} md={4} sx={{ textAlign: "right" }}>
              <Button
                variant='contained'
                startIcon={<AddIcon />}
                onClick={handleAddCostCenter}
                sx={{
                  background:
                    "linear-gradient(135deg, #228B22 0%, #006400 100%)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #006400 0%, #004d00 100%)",
                  },
                }}
              >
                Add Cost Centers
              </Button>
            </Grid>
          {/* <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAddVendor}
            size='large'
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              "&:hover": {
                background: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add New Vendor
          </Button> */}
        </Box>
      </Box>
      {/* <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2
          }}
        >
          Cost Centers
        </Typography>
        <Typography variant="h6" color="#228B22" sx={{ mb: 3 }}>
          Manage your cost center hierarchy and organizational structure
        </Typography>
      </Box> */}

      {/* Top Section Controls */}
      <Card sx={{ mb: 3, boxShadow: 2 }}>
        <CardContent>
          <Grid container spacing={3} alignItems='center'>
            {/* Search Bar */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name, code or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'green' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'green',
                      },
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'green',
                      },
                    },
                  }
                }}
              />
            </Grid>

            {/* Filter Type */}
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Filter Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label='Filter Type'
                >
                  <MenuItem value='all'>All</MenuItem>
                  <MenuItem value='parent'>Parent</MenuItem>
                  <MenuItem value='child'>Child</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Count Display */}
            <Grid item xs={12} md={3}>
              <Typography variant='body2' color='text.secondary'>
                Showing {filteredCostCenters.length} of {costCenters.length}{" "}
                cost centers
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Cost Centers Table */}
      <Card sx={{ boxShadow: 2 }}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant='h6' color='text.secondary'>
                Loading cost centers...
              </Typography>
            </Box>
          ) : costCenters.length === 0 ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <Typography variant='h6' color='text.secondary'>
                No cost centers found
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mt: 1 }}>
                The API returned an empty result. Check the console for
                debugging information.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#228B22" }}>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Code
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Name
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Parent
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Created
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getPaginatedData().map((costCenter) => (
                    <TableRow key={costCenter.costCenterId} hover>
                      <TableCell>
                        <Typography variant='body2' fontWeight='medium'>
                          {costCenter.code}
                        </Typography>
                        
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' fontWeight='medium'>
                          {costCenter.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(costCenter.isChild)}
                          color={getStatusColor(costCenter.isChild)}
                          size='small'
                          icon={<AccountTreeIcon />}
                        />
                      </TableCell>
                      <TableCell>
                        {costCenter.parentName ? (
                          <Chip
                            label={costCenter.parentName}
                            variant='outlined'
                            size='small'
                            color='secondary'
                          />
                        ) : (
                          <Typography variant='body2' color='text.secondary'>
                            -
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant='body2' color='text.secondary'>
                          {costCenter.createdAt}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          size='small'
                          variant='outlined'
                          startIcon={<EditIcon />}
                          onClick={() => handleEditCostCenter(costCenter)}
                          sx={{ color: "#228B22", borderColor: "#228B22" }}
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component='div'
                count={filteredCostCenters.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#228B22",
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant='h6' sx={{ color: "white" }}>
            {isEditMode ? "Edit Cost Center" : "Add New Cost Center"}
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3} sx={{ pt: 10 }}>
            {/* Name Field */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                label='Name *'
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                variant='outlined'
                size='medium'
                placeholder='Enter cost center name'
              />
            </Grid>

            {/* Parent Checkbox and Selector */}
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.hasParent}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        hasParent: e.target.checked,
                        parentCostCenterId: e.target.checked
                          ? prev.parentCostCenterId
                          : null,
                      }))
                    }
                    sx={{ color: "#228B22" }}
                  />
                }
                label='Has Parent Cost Center'
              />
            </Grid>

            {formData.hasParent && (
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Parent Cost Center</InputLabel>
                  <Select
                    value={formData.parentCostCenterId || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        parentCostCenterId: e.target.value,
                      }))
                    }
                    label='Parent Cost Center'
                  >
                    {getParentCostCenters().map((parent) => (
                      <MenuItem
                        key={parent.costCenterId}
                        value={parent.costCenterId}
                      >
                        {parent.name} ({parent.code})
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            {/* Auto-generated Code Preview */}
            {formData.name && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: "#f5f5f5" }}>
                  <Typography variant='body2' color='text.secondary'>
                    Auto-generated Code:{" "}
                    <strong>
                      {generateCode(
                        formData.name,
                        isEditMode ? editingCostCenter?.costCenterId : "NEW"
                      )}
                    </strong>
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={handleCloseDialog}
            variant='outlined'
            disabled={saving} sx={{ color: "black", borderColor: "black" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant='contained'
            disabled={saving}
            sx={{
              background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #006400 0%, #004d00 100%)",
              },
            }}
          >
            {saving ? "Saving..." : isEditMode ? "Update" : "Create"} Cost
            Center
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CostCenters;
