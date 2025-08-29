import { apiRequest } from './api';

// Get all vendors
export const getVendors = async () => {
  return await apiRequest('/vendors/all', {
    method: 'GET'
  });
};

// Get a single vendor by ID
export const getVendorById = async (id) => {
  return await apiRequest(`/vendors/${id}`, {
    method: 'GET'
  });
};

// Create a new vendor
export const createVendor = async (vendorData) => {
  return await apiRequest('/vendors/create', {
    method: 'POST',
    body: JSON.stringify(vendorData)
  });
};

// Update an existing vendor
export const updateVendor = async (id, vendorData) => {
  return await apiRequest(`/vendors/update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(vendorData)
  });
};

// Delete a vendor
export const deleteVendor = async (id) => {
  return await apiRequest(`/api/Vendors/DeleteVendor/${id}`, {
    method: 'DELETE'
  });
};

// Search vendors by term
export const searchVendors = async (term) => {
  return await apiRequest('/api/Vendors/SearchVendors', {
    method: 'GET',
    params: { term }
  });
};

// Get vendors by status
export const getVendorsByStatus = async (status) => {
  return await apiRequest(`/api/Vendors/GetVendorsByStatus/${status}`, {
    method: 'GET'
  });
};

// Upload vendor document
export const uploadVendorDocument = async (id, documentData) => {
  const formData = new FormData();
  Object.keys(documentData).forEach(key => {
    formData.append(key, documentData[key]);
  });
  return await apiRequest(`/api/Vendors/UploadDocument/${id}`, {
    method: 'POST',
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// Get vendor categories
export const getVendorCategories = async () => {
  return await apiRequest('/api/Vendors/GetVendorCategories', {
    method: 'GET'
  });
};

// Get vendor statuses
export const getVendorStatuses = async () => {
  return await apiRequest('/api/Vendors/GetVendorStatuses', {
    method: 'GET'
  });
};

// Get vendor statistics
export const getVendorStats = async () => {
  return await apiRequest('/api/vendors/stats', {
    method: 'GET'
  });
};
