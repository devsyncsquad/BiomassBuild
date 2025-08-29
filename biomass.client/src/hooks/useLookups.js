import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';

const lookupKeys = {
  all: ['lookups'],
  byDomain: (domain) => [...lookupKeys.all, domain]
};

export const useLookupsByDomain = (domain) => {
  return useQuery({
    queryKey: lookupKeys.byDomain(domain),
    queryFn: () => apiRequest('/lookups/by-domain', {
      method: 'POST',
      body: JSON.stringify({ domain })
    }),
    enabled: !!domain
  });
};
