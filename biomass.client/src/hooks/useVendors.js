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
    queryFn: () => apiRequest('/api/vendors/stats', {
      method: 'GET'
    })
  });
};

// Get a single vendor
export const useVendorById = (id) => {
  return useQuery({
    queryKey: vendorKeys.details(id),
    queryFn: () => apiRequest(`/api/vendors/${id}`, {
      method: 'GET'
    }),
    enabled: !!id
  });
};

// Create a new vendor
export const useCreateVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => apiRequest('/api/vendors/create', {
      method: 'POST',
      body: JSON.stringify(data)
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
    mutationFn: ({ id, ...data }) => apiRequest(`/api/vendors/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vendorKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vendorKeys.details(variables.id) });
      queryClient.invalidateQueries({ queryKey: vendorKeys.stats() });
    }
  });
};