import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} from '../utils/vehicleApi';

const vehicleKeys = {
  all: ['vehicles'],
  lists: () => [...vehicleKeys.all, 'list'],
  details: (id) => [...vehicleKeys.all, 'detail', id]
};

export const useVehicles = () => {
  return useQuery({
    queryKey: vehicleKeys.lists(),
    queryFn: getVehicles
  });
};

export const useVehicleById = (id) => {
  return useQuery({
    queryKey: vehicleKeys.details(id),
    queryFn: () => getVehicleById(id),
    enabled: !!id
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    }
  });
};

export const useUpdateVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => updateVehicle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.details(variables.id) });
    }
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
    }
  });
};
