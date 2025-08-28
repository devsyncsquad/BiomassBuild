import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Add as AddIcon,
  DirectionsCar as CarIcon,
  Person as DriverIcon,
  Build as MaintenanceIcon,
  Block as InactiveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import VehicleForm from './VehicleForm';
import useVehicles from '../../hooks/useVehicles';

const VehicleManagement = () => {
  const [openVehicleForm, setOpenVehicleForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openDriverDetails, setOpenDriverDetails] = useState(false);
  const { vehicles, loading, error, stats, refetchVehicles } = useVehicles();

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

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
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
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#228B22', color: 'white', borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CarIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.total}</Typography>
                  <Typography>Total Vehicles</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#4CAF50', color: 'white', borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <DriverIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.active}</Typography>
                  <Typography>Active</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#FF9800', color: 'white', borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <MaintenanceIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.maintenance}</Typography>
                  <Typography>Maintenance</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ bgcolor: '#F44336', color: 'white', borderRadius: 2 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <InactiveIcon sx={{ fontSize: 40 }} />
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{stats.inactive}</Typography>
                  <Typography>Inactive</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Loading and Error States */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        )}

        {/* Vehicle List */}
        {!loading && !error && (
          <TableContainer component={Paper} sx={{ mt: 4 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                  <TableCell>Vehicle Number</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Capacity</TableCell>
                  <TableCell>Fuel Type</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Driver</TableCell>
                  <TableCell align="center">Actions</TableCell>
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
                          display: 'inline-block',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          bgcolor: vehicle.status === 'Active' ? '#e8f5e9' : 
                                  vehicle.status === 'Maintenance' ? '#fff3e0' : '#ffebee',
                          color: vehicle.status === 'Active' ? '#2e7d32' :
                                vehicle.status === 'Maintenance' ? '#e65100' : '#c62828'
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
                          size="small"
                        >
                          View Driver
                        </Button>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No Driver Assigned
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={() => handleEditVehicle(vehicle)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Vehicle Form Dialog */}
        <VehicleForm
          open={openVehicleForm}
          onClose={handleCloseForm}
          vehicle={selectedVehicle}
          onSuccess={refetchVehicles}
        />

        {/* Driver Details Dialog */}
        <Dialog open={openDriverDetails} onClose={handleCloseDriverDetails} maxWidth="sm" fullWidth>
          <DialogTitle>Driver Details</DialogTitle>
          <DialogContent>
            {selectedVehicle?.driver && (
              <Box sx={{ pt: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Name: {selectedVehicle.driver.fullName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      CNIC: {selectedVehicle.driver.cnic}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      License: {selectedVehicle.driver.licenseNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      Phone: {selectedVehicle.driver.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      Address: {selectedVehicle.driver.address}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        bgcolor: selectedVehicle.driver.status === 'Active' ? '#e8f5e9' : '#ffebee',
                        color: selectedVehicle.driver.status === 'Active' ? '#2e7d32' : '#c62828'
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
      </Container>
    </Box>
  );
};

export default VehicleManagement;
