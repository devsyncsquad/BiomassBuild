import { apiRequest } from './api';

export const coaApi = {
  search: ({ level = '', parentId = '', term = '', page = 1, pageSize = 10 } = {}) =>
    apiRequest(`/api/chart-of-accounts?${new URLSearchParams({ level, parentId, term, page, pageSize })}`),

  getById: (id) => apiRequest(`/api/chart-of-accounts/${id}`),

  create: (payload) =>
    apiRequest('/api/chart-of-accounts', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/api/chart-of-accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiRequest(`/api/chart-of-accounts/${id}`, {
      method: 'DELETE',
    }),
};


