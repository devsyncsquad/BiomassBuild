import { apiRequest } from './api';

// Get all drivers
export const getDrivers = async () => {
  return await apiRequest('/api/drivers', {
    method: 'GET'
  });
};

// Get a single driver by ID
export const getDriverById = async (id) => {
  return await apiRequest(`/api/drivers/${id}`, {
    method: 'GET'
  });
};

// Create a new driver
export const createDriver = async (driverData) => {
  return await apiRequest('/api/drivers', {
    method: 'POST',
    body: JSON.stringify(driverData)
  });
};

// Update an existing driver
export const updateDriver = async (id, driverData) => {
  return await apiRequest(`/api/drivers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(driverData)
  });
};

// Delete a driver
export const deleteDriver = async (id) => {
  return await apiRequest(`/api/drivers/${id}`, {
    method: 'DELETE'
  });
};
