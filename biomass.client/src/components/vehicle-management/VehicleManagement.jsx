import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Alert,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  DirectionsCar as CarIcon,
  Person as DriverIcon,
  Build as MaintenanceIcon,
  Block as InactiveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import VehicleForm from "./VehicleForm";
import useVehicles from "../../hooks/useVehicles";

const VehicleManagement = () => {
  const [openVehicleForm, setOpenVehicleForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openDriverDetails, setOpenDriverDetails] = useState(false);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  const { vehicles, loading, error, stats, totalCount, totalPages, refetchVehicles } = useVehicles(page, pageSize);

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setOpenVehicleForm(true);
  };

  const handleCloseForm = () => {
    setOpenVehicleForm(false);
    setSelectedVehicle(null);
  };

  const handleViewDriver = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenDriverDetails(true);
  };

  const handleCloseDriverDetails = () => {
    setOpenDriverDetails(false);
    setSelectedVehicle(null);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setOpenVehicleForm(true);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1); // Reset to first page when changing page size
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
      {/* <Container maxWidth='xl'> */}
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
              Vehicle Management & Driver
            </Typography>
            
          </Box>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAddVehicle}
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
            Add New Vehicle
          </Button>
        </Box>
      </Box>
      {/* <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#228B22', mb: 1 }}>
              Vehicle Management & Driver
            </Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Manage your vehicles and drivers efficiently
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddVehicle}
            sx={{
              bgcolor: '#228B22',
              '&:hover': { bgcolor: '#1b6b1b' }
            }}
          >
            Add New Vehicle
          </Button>
        </Box> */}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#228B22", color: "white", borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CarIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant='h4'
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {stats.total}
                </Typography>
                <Typography sx={{ color: "white" }}>Total Vehicles</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#4CAF50", color: "white", borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <DriverIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant='h4'
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {stats.active}
                </Typography>
                <Typography sx={{ color: "white" }}>Active</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#FF9800", color: "white", borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <MaintenanceIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant='h4'
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {stats.maintenance}
                </Typography>
                <Typography sx={{ color: "white" }}>Maintenance</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: "#F44336", color: "white", borderRadius: 2 }}>
            <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <InactiveIcon sx={{ fontSize: 40 }} />
              <Box>
                <Typography
                  variant='h4'
                  sx={{ fontWeight: "bold", color: "white" }}
                >
                  {stats.inactive}
                </Typography>
                <Typography sx={{ color: "white" }}>Inactive</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loading and Error States */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity='error' sx={{ my: 2 }}>
          {error}
        </Alert>
      )}

      {/* Vehicle List */}
      {!loading && !error && (
        <>
          {/* Pagination Controls */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 2,
            px: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Showing {vehicles.length} of {totalCount} vehicles
              </Typography>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <InputLabel>Per Page</InputLabel>
                <Select
                  value={pageSize}
                  label="Per Page"
                  onChange={handlePageSizeChange}
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          </Box>

          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "green" }}>
                  <TableCell>Vehicle Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Fuel Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell align='center'>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((vehicle) => (
                  <TableRow key={vehicle.vehicleId}>
                    <TableCell>{vehicle.vehicleNumber}</TableCell>
                    <TableCell>{vehicle.vehicleType}</TableCell>
                    <TableCell>{vehicle.capacity}</TableCell>
                    <TableCell>{vehicle.fuelType}</TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-block",
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor:
                            vehicle.status === "Active"
                              ? "#e8f5e9"
                              : vehicle.status === "Maintenance"
                              ? "#fff3e0"
                              : "#ffebee",
                          color:
                            vehicle.status === "Active"
                              ? "#2e7d32"
                              : vehicle.status === "Maintenance"
                              ? "#e65100"
                              : "#c62828",
                        }}
                      >
                        {vehicle.status}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {vehicle.driver ? (
                        <Button
                          startIcon={<DriverIcon />}
                          onClick={() => handleViewDriver(vehicle)}
                          size='small'
                        >
                          View Driver
                        </Button>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          No Driver Assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton
                        size='small'
                        onClick={() => handleEditVehicle(vehicle)}
                        color='primary'
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Bottom Pagination */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2,
            px: 2
          }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* Vehicle Form Dialog */}
      <VehicleForm
        open={openVehicleForm}
        onClose={handleCloseForm}
        vehicle={selectedVehicle}
        onSuccess={refetchVehicles}
      />

      {/* Driver Details Dialog */}
      <Dialog
        open={openDriverDetails}
        onClose={handleCloseDriverDetails}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle>Driver Details</DialogTitle>
        <DialogContent>
          {selectedVehicle?.driver && (
            <Box sx={{ pt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Name: {selectedVehicle.driver.fullName}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='body1'>
                    CNIC: {selectedVehicle.driver.cnic}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='body1'>
                    License: {selectedVehicle.driver.licenseNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant='body1'>
                    Phone: {selectedVehicle.driver.phoneNumber}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='body1'>
                    Address: {selectedVehicle.driver.address}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      bgcolor:
                        selectedVehicle.driver.status === "Active"
                          ? "#e8f5e9"
                          : "#ffebee",
                      color:
                        selectedVehicle.driver.status === "Active"
                          ? "#2e7d32"
                          : "#c62828",
                    }}
                  >
                    Status: {selectedVehicle.driver.status}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
      </Dialog>
      {/* </Container> */}
    </Box>
  );
};

export default VehicleManagement;
