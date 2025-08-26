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
} from '@mui/material';
import {
  Add as AddIcon,
  DirectionsCar as CarIcon,
  Person as DriverIcon,
  Build as MaintenanceIcon,
  Block as InactiveIcon
} from '@mui/icons-material';
import VehicleForm from './VehicleForm';

const VehicleManagement = () => {
  const [openVehicleForm, setOpenVehicleForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setOpenVehicleForm(true);
  };

  const handleCloseForm = () => {
    setOpenVehicleForm(false);
    setSelectedVehicle(null);
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
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>24</Typography>
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
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>18</Typography>
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
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>4</Typography>
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
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>2</Typography>
                  <Typography>Inactive</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Vehicle Form Dialog */}
        <VehicleForm
          open={openVehicleForm}
          onClose={handleCloseForm}
          vehicle={selectedVehicle}
        />
      </Container>
    </Box>
  );
};

export default VehicleManagement;
