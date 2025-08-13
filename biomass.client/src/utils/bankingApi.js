import { getBaseUrl, getHeaders } from './api';

const baseUrl = getBaseUrl();

export const bankingApi = {
  // Get all bank accounts
  getAllBankAccounts: async () => {
    try {
      const response = await fetch(`${baseUrl}/api/banking`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      throw error;
    }
  },

  // Get bank account by ID
  getBankAccountById: async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/banking/${id}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching bank account:', error);
      throw error;
    }
  },

  // Create new bank account
  createBankAccount: async (bankAccountData) => {
    try {
      const response = await fetch(`${baseUrl}/api/banking`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(bankAccountData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating bank account:', error);
      throw error;
    }
  },

  // Update bank account
  updateBankAccount: async (id, bankAccountData) => {
    try {
      const response = await fetch(`${baseUrl}/api/banking/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(bankAccountData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating bank account:', error);
      throw error;
    }
  },

  // Delete bank account
  deleteBankAccount: async (id) => {
    try {
      const response = await fetch(`${baseUrl}/api/banking/${id}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting bank account:', error);
      throw error;
    }
  },

  // Search bank accounts
  searchBankAccounts: async (searchParams) => {
    try {
      const queryString = new URLSearchParams(searchParams).toString();
      const response = await fetch(`${baseUrl}/api/banking/search?${queryString}`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching bank accounts:', error);
      throw error;
    }
  },

  // Get bank account count
  getBankAccountCount: async () => {
    try {
      const response = await fetch(`${baseUrl}/api/banking/count`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching bank account count:', error);
      throw error;
    }
  },
};
