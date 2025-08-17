import { apiRequest } from './api';

export const lookupApi = {
  getLookups: ({ domain = '', page = 1, pageSize = 10 } = {}) =>
    apiRequest(`/api/lookups?${new URLSearchParams({ domain, page, pageSize })}`),

  getById: (id) => apiRequest(`/api/lookups/${id}`),

  create: (payload) =>
    apiRequest('/api/lookups', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/api/lookups/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiRequest(`/api/lookups/${id}`, {
      method: 'DELETE',
    }),
};

// Individual exports for backward compatibility
export const getLookups = (options = {}) => lookupApi.getLookups(options);
export const getLookupById = (id) => lookupApi.getById(id);
export const createLookup = (payload) => lookupApi.create(payload);
export const updateLookup = (id, payload) => lookupApi.update(id, payload);
export const deleteLookup = (id) => lookupApi.remove(id);


