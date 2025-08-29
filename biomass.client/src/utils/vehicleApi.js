import { apiRequest } from './api';

// Get all vehicles
export const getVehicles = async () => {
  return await apiRequest('/api/vehicles', {
    method: 'GET'
  });
};

// Get a single vehicle by ID
export const getVehicleById = async (id) => {
  return await apiRequest(`/api/vehicles/${id}`, {
    method: 'GET'
  });
};

// Create a new vehicle with optional driver
export const createVehicle = async (vehicleData) => {
  return await apiRequest('/api/vehicles', {
    method: 'POST',
    body: JSON.stringify(vehicleData)
  });
};

// Update an existing vehicle with optional driver
export const updateVehicle = async (id, vehicleData) => {
  return await apiRequest(`/api/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vehicleData)
  });
};

// Delete a vehicle
export const deleteVehicle = async (id) => {
  return await apiRequest(`/api/vehicles/${id}`, {
    method: 'DELETE'
  });
};
