import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';

const vendorKeys = {
  all: ['vendors'],
  lists: () => [...vendorKeys.all, 'list'],
  details: (id) => [...vendorKeys.all, 'detail', id],
  stats: () => [...vendorKeys.all, 'stats']
};

// Get all vendors
export const useVendors = () => {
  return useQuery({
    queryKey: vendorKeys.lists(),
    queryFn: () => apiRequest('/vendors/all', {
      method: 'GET'
    })
  });
};

// Get vendor stats
export const useVendorStats = () => {
  return useQuery({
    queryKey: vendorKeys.stats(),
    queryFn: () => apiRequest('/vendors/all', {
      method: 'GET'
    })
  });
};

// Get a single vendor
export const useVendorById = (id) => {
  return useQuery({
    queryKey: vendorKeys.details(id),
    queryFn: () => apiRequest(`/vendors/${id}`, {
      method: 'GET'
    }),
    enabled: !!id
  });
};

// Create a new vendor
export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData) => apiRequest('/vendors/create', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it with boundary
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.stats() });
    }
  });
};

// Update an existing vendor
export const useUpdateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }) => apiRequest(`/vendors/update/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let the browser set it with boundary
      }
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.stats() });
    }
  });
};