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


