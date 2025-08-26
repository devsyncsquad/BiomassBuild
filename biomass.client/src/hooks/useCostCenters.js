import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';

const costCenterKeys = {
  all: ['costCenters'],
  lists: () => [...costCenterKeys.all, 'list'],
  active: () => [...costCenterKeys.all, 'active']
};

export const useCostCenters = () => {
  return useQuery({
    queryKey: costCenterKeys.active(),
    queryFn: () => apiRequest('/cost-centers/active', {
      method: 'GET'
    })
  });
};
