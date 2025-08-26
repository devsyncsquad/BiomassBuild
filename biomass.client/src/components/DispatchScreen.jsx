import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  Divider,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Calculate as CalculateIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import axios from 'axios';

const DispatchScreen = () => {
  const [selectedLocationId, setSelectedLocationId] = useState('');
  const [locationCosts, setLocationCosts] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dispatch calculation inputs
  const [dispatchData, setDispatchData] = useState({
    companyRate: 310, // per ton
    weight: 1, // in tons
    materialType: 'Paper'
  });
  
  // Calculated results
  const [calculatedCosts, setCalculatedCosts] = useState(null);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await axios.get('https://localhost:7084/api/customerlocations/GetAllLocations');
      if (response.data.success) {
        setLocations(response.data.result);
      }
    } catch (error) {
      console.error('Error loading locations:', error);
      setError('Failed to load locations');
    }
  };

  const loadLocationCosts = async (locationId) => {
    if (!locationId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.get(`https://localhost:7084/api/customerlocations/GetLocationCostsForDispatch/${locationId}`);
      if (response.data.success) {
        setLocationCosts(response.data.result);
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error loading location costs:', error);
      setError('Failed to load location costs');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationChange = (locationId) => {
    setSelectedLocationId(locationId);
    if (locationId) {
      loadLocationCosts(locationId);
    } else {
      setLocationCosts(null);
      setCalculatedCosts(null);
    }
  };

  const handleInputChange = (field, value) => {
    setDispatchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateCosts = () => {
    if (!locationCosts) return;

    const companyRatePerTon = parseFloat(dispatchData.companyRate);
    const weightInTons = parseFloat(dispatchData.weight);
    
    // Convert to maan (1 ton = 25 maan)
    const companyRatePerMaan = companyRatePerTon * 25;
    const weightInMaan = weightInTons * 25;
    
    let loaderCost = 0;
    let labourCost = 0;
    let unloadingCost = 0;
    
    // Calculate Loader Cost
    if (locationCosts.dispatchLoadingChargesEnabled) {
      if (locationCosts.dispatchChargeType === 'Fixed') {
        loaderCost = locationCosts.fixedLoaderCost || 0;
      } else if (locationCosts.dispatchChargeType === 'Variable') {
        if (locationCosts.variableChargeType === 'LoaderPerMaan') {
          loaderCost = (locationCosts.variableChargeAmount || 0) * weightInMaan;
        } else {
          loaderCost = locationCosts.variableChargeAmount || 0;
        }
      }
    }
    
    // Calculate Labour Cost
    if (locationCosts.labourChargesEnabled) {
      if (locationCosts.labourChargeType === 'Fixed') {
        labourCost = locationCosts.fixedLabourCost || 0;
      } else if (locationCosts.labourChargeType === 'Variable') {
        if (locationCosts.labourVariableChargeType === 'LabourPerMaan') {
          labourCost = (locationCosts.labourVariableChargeAmount || 0) * weightInMaan;
        } else {
          labourCost = locationCosts.labourVariableChargeAmount || 0;
        }
      }
    }
    
    // Calculate Unloading Cost
    if (locationCosts.receivingUnloadingCostEnabled) {
      if (locationCosts.receivingChargeType === 'Fixed') {
        unloadingCost = locationCosts.fixedUnloadingCost || 0;
      } else if (locationCosts.receivingChargeType === 'Variable') {
        if (locationCosts.receivingVariableChargeType === 'UnloadingPerMaan') {
          unloadingCost = (locationCosts.receivingVariableChargeAmount || 0) * weightInMaan;
        } else {
          unloadingCost = locationCosts.receivingVariableChargeAmount || 0;
        }
      }
    }
    
    // Calculate total cost
    const totalCost = loaderCost + labourCost + unloadingCost;
    
    // Calculate freight charges (remaining after deducting other costs)
    const freightCharges = (companyRatePerMaan * weightInMaan) - totalCost;
    
    setCalculatedCosts({
      companyRatePerTon,
      companyRatePerMaan,
      weightInTons,
      weightInMaan,
      loaderCost,
      labourCost,
      unloadingCost,
      totalCost,
      freightCharges,
      breakdown: {
        rateToTrollyOwner: companyRatePerMaan * weightInMaan,
        loaderCharges: loaderCost,
        labourCharges: labourCost,
        freightCharges: freightCharges
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
        Dispatch Cost Calculator
      </Typography>
      
      <Grid container spacing={3}>
        {/* Location Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Location
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Location</InputLabel>
                <Select
                  value={selectedLocationId}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">Select a location</MenuItem>
                  {locations.map((location) => (
                    <MenuItem key={location.locationId} value={location.locationId}>
                      {location.locationName} ({location.locationCode}) - {location.customerName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {locationCosts && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Selected: {locationCosts.locationName} ({locationCosts.locationCode})
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Customer: {locationCosts.customerName}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        {/* Dispatch Inputs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Dispatch Parameters
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Company Rate (per ton)"
                    type="number"
                    value={dispatchData.companyRate}
                    onChange={(e) => handleInputChange('companyRate', e.target.value)}
                    InputProps={{
                      startAdornment: <Typography variant="body2">Rs</Typography>
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight (tons)"
                    type="number"
                    value={dispatchData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Material Type</InputLabel>
                    <Select
                      value={dispatchData.materialType}
                      onChange={(e) => handleInputChange('materialType', e.target.value)}
                      label="Material Type"
                    >
                      <MenuItem value="Paper">Paper</MenuItem>
                      <MenuItem value="Plastic">Plastic</MenuItem>
                      <MenuItem value="Glass">Glass</MenuItem>
                      <MenuItem value="Metal">Metal</MenuItem>
                      <MenuItem value="Textile">Textile</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Button
                variant="contained"
                startIcon={<CalculateIcon />}
                onClick={calculateCosts}
                disabled={!locationCosts || loading}
                sx={{ mt: 2, bgcolor: '#228B22', '&:hover': { bgcolor: '#006400' } }}
                fullWidth
              >
                Calculate Costs
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Location Costs Display */}
        {locationCosts && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Location Cost Configuration
                </Typography>
                <Grid container spacing={3}>
                  {/* Dispatch Loading Charges */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Dispatch Loading Charges
                    </Typography>
                    <Box>
                      <Chip 
                        label={locationCosts.dispatchLoadingChargesEnabled ? 'Enabled' : 'Disabled'} 
                        color={locationCosts.dispatchLoadingChargesEnabled ? 'success' : 'default'}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      {locationCosts.dispatchLoadingChargesEnabled && (
                        <Box>
                          <Typography variant="body2">
                            Type: {locationCosts.dispatchChargeType}
                          </Typography>
                          {locationCosts.dispatchChargeType === 'Fixed' && (
                            <Typography variant="body2">
                              Fixed Cost: Rs {locationCosts.fixedLoaderCost?.toLocaleString()}
                            </Typography>
                          )}
                          {locationCosts.dispatchChargeType === 'Variable' && (
                            <Box>
                              <Typography variant="body2">
                                Variable Type: {locationCosts.variableChargeType}
                              </Typography>
                              <Typography variant="body2">
                                Amount: Rs {locationCosts.variableChargeAmount}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  
                  {/* Labour Charges */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Labour Charges
                    </Typography>
                    <Box>
                      <Chip 
                        label={locationCosts.labourChargesEnabled ? 'Enabled' : 'Disabled'} 
                        color={locationCosts.labourChargesEnabled ? 'success' : 'default'}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      {locationCosts.labourChargesEnabled && (
                        <Box>
                          <Typography variant="body2">
                            Type: {locationCosts.labourChargeType}
                          </Typography>
                          {locationCosts.labourChargeType === 'Fixed' && (
                            <Typography variant="body2">
                              Fixed Cost: Rs {locationCosts.fixedLabourCost?.toLocaleString()}
                            </Typography>
                          )}
                          {locationCosts.labourChargeType === 'Variable' && (
                            <Box>
                              <Typography variant="body2">
                                Variable Type: {locationCosts.labourVariableChargeType}
                              </Typography>
                              <Typography variant="body2">
                                Amount: Rs {locationCosts.labourVariableChargeAmount}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  
                  {/* Receiving Unloading Cost */}
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Receiving Unloading Cost
                    </Typography>
                    <Box>
                      <Chip 
                        label={locationCosts.receivingUnloadingCostEnabled ? 'Enabled' : 'Disabled'} 
                        color={locationCosts.receivingUnloadingCostEnabled ? 'success' : 'default'}
                        size="small"
                        sx={{ mb: 1 }}
                      />
                      {locationCosts.receivingUnloadingCostEnabled && (
                        <Box>
                          <Typography variant="body2">
                            Type: {locationCosts.receivingChargeType}
                          </Typography>
                          {locationCosts.receivingChargeType === 'Fixed' && (
                            <Typography variant="body2">
                              Fixed Cost: Rs {locationCosts.fixedUnloadingCost?.toLocaleString()}
                            </Typography>
                          )}
                          {locationCosts.receivingChargeType === 'Variable' && (
                            <Box>
                              <Typography variant="body2">
                                Variable Type: {locationCosts.receivingVariableChargeType}
                              </Typography>
                              <Typography variant="body2">
                                Amount: Rs {locationCosts.receivingVariableChargeAmount}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Calculated Results */}
        {calculatedCosts && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cost Calculation Results
                </Typography>
                
                <TableContainer component={Paper} sx={{ mb: 3 }}>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#228B22' }}>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Description</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Value</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Amount (Rs)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Company Rate (per ton)</TableCell>
                        <TableCell>{calculatedCosts.companyRatePerTon}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Company Rate (per maan)</TableCell>
                        <TableCell>{calculatedCosts.companyRatePerMaan}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight (tons)</TableCell>
                        <TableCell>{calculatedCosts.weightInTons}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Weight (maan)</TableCell>
                        <TableCell>{calculatedCosts.weightInMaan}</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                        <TableCell><strong>Rate to Trolly Owner</strong></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell><strong>{calculatedCosts.breakdown.rateToTrollyOwner.toLocaleString()}</strong></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Loader Charges</TableCell>
                        <TableCell>{locationCosts?.dispatchChargeType}</TableCell>
                        <TableCell>{calculatedCosts.loaderCost.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Labour Charges</TableCell>
                        <TableCell>{locationCosts?.labourChargeType}</TableCell>
                        <TableCell>{calculatedCosts.labourCost.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Freight Charges</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>{calculatedCosts.freightCharges.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow sx={{ bgcolor: '#e8f5e8' }}>
                        <TableCell><strong>Total Cost</strong></TableCell>
                        <TableCell>-</TableCell>
                        <TableCell><strong>{calculatedCosts.totalCost.toLocaleString()}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Business Logic Summary */}
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="body2">
                    <strong>Business Logic Applied:</strong> Based on the selected location configuration, 
                    the system automatically calculates costs using {locationCosts?.dispatchChargeType?.toLowerCase()} loader charges, 
                    {locationCosts?.labourChargeType?.toLowerCase()} labour charges, and {locationCosts?.receivingChargeType?.toLowerCase()} unloading costs.
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        )}
        
        {/* Error Display */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">
              {error}
            </Alert>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default DispatchScreen;
