import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  GridView as GridViewIcon,
  Add as AddIcon,
  Business as BusinessIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Cancel as CancelIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import VendorRegistration from "./VendorRegistration";
import "./VendorManagement.css";
import {
  useVendors,
  useCreateVendor,
  useUpdateVendor,
  useVendorStats,
  useDeleteVendor,
} from "../hooks/useVendors";
import { debounce } from "lodash";
import { colors, borderRadius } from "../theme/theme";
import { green } from "@mui/material/colors";
import { dark } from "@mui/material/styles/createPalette";
import axios from "axios";
import { getAuthHeaders } from "../utils/auth";
import { getBaseUrl } from "../utils/api";

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [openVendorForm, setOpenVendorForm] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // React Query hooks
  const { data: vendorsData, isLoading: isLoadingVendors } = useVendors();
  const { data: statsData, isLoading: isLoadingStats } = useVendorStats();
  const createVendorMutation = useCreateVendor();
  const updateVendorMutation = useUpdateVendor();
  const deleteVendorMutation = useDeleteVendor();

  // Debug logs
  console.log("Vendors Data:", vendorsData);
  console.log("Stats Data:", statsData);

  // Debounced search handler
  const debouncedSearch = useMemo(
    () => debounce((term) => setSearchTerm(term), 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (event) => {
    debouncedSearch(event.target.value);
  };

  // Handle status filter change
  const handleStatusChange = (status) => {
    setSelectedStatus(status === selectedStatus ? "" : status);
  };

  // Handle snackbar
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Handle vendor save
  const handleSaveVendor = async (vendorData) => {
    try {
      if (isEditMode && selectedVendor) {
        await updateVendorMutation.mutateAsync({
          id: selectedVendor.vendorId,
          formData: vendorData.formData,
        });
        setSnackbar({
          open: true,
          message: "Vendor updated successfully",
          severity: "success",
        });
      } else {
        await createVendorMutation.mutateAsync(vendorData.formData);
        setSnackbar({
          open: true,
          message: "Vendor created successfully",
          severity: "success",
        });
      }
      setOpenVendorForm(false);
      setSelectedVendor(null);
      setIsEditMode(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "An error occurred",
        severity: "error",
      });
    }
  };

  // Filter vendors on the client side
  const vendors = useMemo(() => {
    const allVendors = vendorsData?.result || [];
    console.log("All Vendors:", allVendors); // Debug log
    return allVendors.filter((vendor) => {
      const matchesSearch =
        !searchTerm ||
        (vendor.vendorName && vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vendor.address && vendor.address.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (vendor.cnic && vendor.cnic.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        !selectedStatus ||
        vendor.status?.toLowerCase() === selectedStatus?.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [vendorsData?.result, searchTerm, selectedStatus]);

  // Use API stats or calculate from filtered vendors as fallback
  const stats = useMemo(() => {
    if (statsData?.result) {
      return statsData.result;
    }
    // Fallback to calculated stats if API stats are not available
    return {
      total: vendors.length,
      active: vendors.filter((v) => v.status?.toLowerCase() === "active")
        .length,
      pending: vendors.filter((v) => v.status?.toLowerCase() === "pending")
        .length,
      inactive: vendors.filter((v) => v.status?.toLowerCase() === "inactive")
        .length,
    };
  }, [statsData?.result, vendors]);

  // Loading states
  if (isLoadingVendors || isLoadingStats) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if we have data
  if (!vendorsData?.result) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>No vendors data available</Typography>
      </Box>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "inactive":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return <CheckCircleIcon />;
      case "pending":
        return <WarningIcon />;
      case "inactive":
        return <CancelIcon />;
      default:
        return <BusinessIcon />;
    }
  };

  const handleAddVendor = () => {
    setSelectedVendor(null);
    setIsEditMode(false);
    setOpenVendorForm(true);
  };

  const handleViewDetails = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditMode(false);
    setOpenVendorForm(true);
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setIsEditMode(true);
    setOpenVendorForm(true);
  };

  const handleDeleteVendor = async (vendor) => {
    // Show confirmation dialog
    if (window.confirm(`Are you sure you want to delete "${vendor.vendorName}"? This action cannot be undone.`)) {
      try {
        await deleteVendorMutation.mutateAsync(vendor.vendorId);
        
        // Show success message
        setSnackbar({
          open: true,
          message: `Vendor "${vendor.vendorName}" deleted successfully!`,
          severity: "success",
        });
      } catch (error) {
        console.error("Error deleting vendor:", error);
        
        // Show error message
        setSnackbar({
          open: true,
          message: error.response?.data?.message || "Failed to delete vendor. Please try again.",
          severity: "error",
        });
      }
    }
  };

  return (
    <Box
      sx={{
        p: 0,
        // pt: 3,
        width: "100%",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
          color: "white",
          p: 3,
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
              Vendor Management
            </Typography>
            <Typography
              variant='body1'
              sx={{
                color: "white",
                opacity: 0.9,
                fontWeight: 300,
                textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                fontSize: "0.9rem",
              }}
            >
              Manage your vendor relationships, track performance, and
              streamline procurement processes.
            </Typography>
          </Box>
          <Button
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
          </Button>
        </Box>
      </Box>
      {/* <Box sx={{ mb: 4, px: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 600,
              color: '#228B22',
              mb: 1
            }}
          >
            Vendor Management
          </Typography>
          <Typography variant="body1" sx={{ color: '#2e7d32' }}>
            Manage your vendor relationships, track performance, and streamline procurement processes.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddVendor}
          sx={{
            bgcolor: 'green',
            color: 'white',
            borderRadius: '8px',
            textTransform: 'none',
            '&:hover': {
              bgcolor: '#1565c0'
            }
          }}
        >
          Add New Vendor
        </Button>
      </Box> */}

     

      {/* Search and Filter Section */}
      <Box sx={{ mb: 3, px: 3 }}>
        <Grid container spacing={2} alignItems='center'>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                fullWidth
                placeholder='Search vendors...'
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon sx={{ color: colors.text.secondary }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: colors.background.paper,
                    borderRadius: borderRadius.md,
                    "& fieldset": {
                      borderColor: colors.gray[200],
                    },
                    "&:hover fieldset": {
                      borderColor: colors.primary.main,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: colors.primary.main,
                    },
                  },
                }}
              />
             
             
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Vendor Cards */}
      <Grid container spacing={3} sx={{ px: 3 }}>
        {vendors.length === 0 ? (
          <Grid item xs={12}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                py: 8,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: colors.text.secondary,
                  mb: 2,
                  fontWeight: 500,
                }}
              >
                {searchTerm || selectedStatus
                  ? "No vendors match your search criteria"
                  : "No vendors found"}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: colors.text.secondary,
                  mb: 3,
                }}
              >
                {searchTerm || selectedStatus
                  ? "Try adjusting your search terms or filters"
                  : "Add your first vendor to get started"}
              </Typography>
              {(searchTerm || selectedStatus) && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedStatus("");
                  }}
                  sx={{
                    borderColor: colors.primary.main,
                    color: colors.primary.main,
                    "&:hover": {
                      borderColor: colors.primary.dark,
                      backgroundColor: colors.primary.light,
                    },
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Grid>
        ) : (
          vendors.map((vendor) => (
          <Grid item xs={12} sm={6} md={4} key={vendor.vendorId}>
            <Card
              sx={{
                bgcolor: colors.background.paper,
                borderRadius: borderRadius.lg,
                boxShadow: `0 1px 3px ${colors.gray[200]}`,
                transition: "all 0.2s",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                },
              }}
            >
              <CardContent
                sx={{
                  flex: 1, // Take remaining space
                  display: "flex",
                  flexDirection: "column",
                  bgcolor: colors.background.paper,
                  color: colors.primary.main,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor:
                        vendor.status === "Active"
                          ? colors.success.main
                          : vendor.status === "Pending"
                          ? colors.warning.main
                          : colors.error.main,
                      mr: 2,
                    }}
                  >
                    {vendor.vendorName.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      variant='h6'
                      sx={{
                        fontWeight: 600,
                        color: colors.text.primary,
                        fontSize: "1rem",
                        mb: 0.5,
                      }}
                    >
                      {vendor.vendorName}
                    </Typography>
                    <Typography
                      variant='body2'
                      sx={{
                        color: colors.text.secondary,
                        fontSize: "0.875rem",
                      }}
                    >
                      {vendor.address}
                    </Typography>
                  </Box>
                  <Chip
                    label={vendor.status}
                    color={
                      vendor.status === "Active"
                        ? "success"
                        : vendor.status === "Pending"
                        ? "warning"
                        : "error"
                    }
                    size='small'
                    icon={getStatusIcon(vendor.status)}
                    sx={{
                      textTransform: "capitalize",
                      "& .MuiChip-label": {
                        fontWeight: 500,
                      },
                    }}
                  />
                </Box>

                {/* Service Type Indicators */}
                {(vendor.isVehicleLoader || vendor.isLabour) && (
                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant='body2'
                      sx={{
                        color: colors.text.secondary,
                        fontSize: "0.75rem",
                        mb: 0.5,
                        fontWeight: 500,
                      }}
                    >
                      Services:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {vendor.isVehicleLoader && (
                        <Chip
                          label="Vehicle Loader"
                          size="small"
                          sx={{
                            fontSize: "0.7rem",
                            height: "20px",
                            bgcolor: colors.primary.light,
                            color: "white",
                          }}
                        />
                      )}
                      {vendor.isLabour && (
                        <Chip
                          label="Labour"
                          size="small"
                          sx={{
                            fontSize: "0.7rem",
                            height: "20px",
                            bgcolor: colors.info.light,
                            color: "white",
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                )}

                <Box
                  sx={{
                    mb: 2,
                    mt: "auto",
                    borderTop: `1px solid ${colors.gray[200]}`,
                    pt: 2,
                  }}
                >
                  <Typography
                    variant='body2'
                    sx={{
                      mb: 0.5,
                      color: colors.text.secondary,
                      fontSize: "0.875rem",
                    }}
                  >
                    Phone: {vendor.phone1}
                  </Typography>
                  {vendor.phone2 && (
                    <Typography
                      variant='body2'
                      sx={{
                        mb: 0.5,
                        color: colors.text.secondary,
                        fontSize: "0.875rem",
                      }}
                    >
                      Alt Phone: {vendor.phone2}
                    </Typography>
                  )}
                  <Typography
                    variant='body2'
                    sx={{
                      color: colors.text.secondary,
                      fontSize: "0.875rem",
                    }}
                  >
                    CNIC: {vendor.cnic}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    variant='contained'
                    size='small'
                    fullWidth
                    onClick={() => handleViewDetails(vendor)}
                    sx={{
                      bgcolor: '#228B22',
                      color: "white",
                      fontWeight: 500,
                      fontSize: "0.875rem",
                      "&:hover": {
                        bgcolor: '#1b6b1b',
                      },
                    }}
                  >
                    View Details
                  </Button>
                  <IconButton
                    size='small'
                    onClick={() => handleDeleteVendor(vendor)}
                    sx={{
                      color: '#ef4444',
                      bgcolor: 'rgba(239, 69, 70, 0.1)',
                      border: '1px solid rgba(239, 69, 70, 0.3)',
                      "&:hover": {
                        bgcolor: 'rgba(239, 69, 70, 0.2)',
                        border: '1px solid rgba(239, 69, 70, 0.5)',
                      },
                      minWidth: '40px',
                      height: '32px',
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))
        )}
      </Grid>

      {/* Field Requirements Footer */}
      <Box
        sx={{
          mt: 6,
          p: 3,
          bgcolor: colors.background.paper,
          borderRadius: borderRadius.lg,
          boxShadow: 1,
          mx: 3,
        }}
      >
        <Typography variant='h6' sx={{ mb: 2, fontWeight: "bold" }}>
          Field Requirements
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle1' sx={{ fontWeight: "bold", mb: 1 }}>
              Mandatory Fields
            </Typography>
            <Box component='ul' sx={{ pl: 2 }}>
              <Typography component='li' variant='body2'>
                Vendor Name
              </Typography>
              <Typography component='li' variant='body2'>
                Vendor Address
              </Typography>
              <Typography component='li' variant='body2'>
                Primary Phone Number
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='subtitle1' sx={{ fontWeight: "bold", mb: 1 }}>
              Optional Fields
            </Typography>
            <Box component='ul' sx={{ pl: 2 }}>
              <Typography component='li' variant='body2'>
                CNIC Front Image
              </Typography>
              <Typography component='li' variant='body2'>
                CNIC Back Image
              </Typography>
              <Typography component='li' variant='body2'>
                Additional Phone Numbers
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Vendor Registration Dialog */}
      <VendorRegistration
        open={openVendorForm}
        onClose={() => {
          setOpenVendorForm(false);
          setSelectedVendor(null);
          setIsEditMode(false);
        }}
        vendor={selectedVendor}
        isEditMode={isEditMode}
        onSave={handleSaveVendor}
        onEdit={handleEditVendor}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant='filled'
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VendorManagement;
