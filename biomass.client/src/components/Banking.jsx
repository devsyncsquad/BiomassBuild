import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Chip,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Alert,
  CircularProgress,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  AccountBalance as BankIcon
} from '@mui/icons-material';
import { bankingApi } from '../utils/bankingApi';

const Banking = () => {
  const [bankAccounts, setBankAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    branch_code: '',
    branch_address: '',
    account_name: '',
    account_number: '',
    account_iban_no: 'PK000000000000000000',
    bank_name: '',
    account_type: '',
    employee_id: '',
    opening_balance: 0
  });

  // Load bank accounts from API
  useEffect(() => {
    loadBankAccounts();
  }, []);

  const loadBankAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bankingApi.getAllBankAccounts();
      if (response.success) {
        setBankAccounts(response.result || []);
        setSnackbar({ open: true, message: 'Bank accounts loaded successfully', severity: 'success' });
      } else {
        setError(response.message || 'Failed to load bank accounts');
        setSnackbar({ open: true, message: response.message || 'Failed to load bank accounts', severity: 'error' });
      }
    } catch (error) {
      setError(error.message || 'Error loading bank accounts');
      setSnackbar({ open: true, message: error.message || 'Error loading bank accounts', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddBank = () => {
    setSelectedAccount(null);
    setIsEditMode(false);
    setFormData({
      branch_code: '',
      branch_address: '',
      account_name: '',
      account_number: '',
      account_iban_no: 'PK000000000000000000',
      bank_name: '',
      account_type: '',
      employee_id: '',
      opening_balance: 0
    });
    setOpenDialog(true);
  };

  const handleViewCard = (account) => {
    setSelectedAccount(account);
    setIsEditMode(false);
    setFormData({
      branch_code: account.branchCode || '',
      branch_address: account.branchAddress || '',
      account_name: account.accountName || '',
      account_number: account.accountNumber || '',
      account_iban_no: account.accountIbanNo || '',
      bank_name: account.bankName || '',
      account_type: account.accountType || '',
      employee_id: account.employeeId || '',
      opening_balance: account.openingBalance || 0
    });
    setOpenDialog(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isEditMode && selectedAccount) {
        // Update existing account
        const updateData = {
          bankAccountId: selectedAccount.bankAccountId,
          accountName: formData.account_name,
          accountNumber: formData.account_number,
          accountIbanNo: formData.account_iban_no,
          bankName: formData.bank_name,
          branchCode: formData.branch_code,
          branchAddress: formData.branch_address,
          accountType: formData.account_type,
          employeeId: formData.employee_id ? parseInt(formData.employee_id) : null,
          openingBalance: parseFloat(formData.opening_balance) || 0
        };
        const response = await bankingApi.updateBankAccount(selectedAccount.bankAccountId, updateData);
        if (response.success) {
          await loadBankAccounts(); // Reload the list
          setOpenDialog(false);
          setSelectedAccount(null);
          setIsEditMode(false);
          setSnackbar({ open: true, message: 'Bank account updated successfully', severity: 'success' });
        } else {
          setError(response.message || 'Failed to update bank account');
          setSnackbar({ open: true, message: response.message || 'Failed to update bank account', severity: 'error' });
        }
      } else {
        // Add new account
        const createData = {
          accountName: formData.account_name,
          accountNumber: formData.account_number,
          accountIbanNo: formData.account_iban_no,
          bankName: formData.bank_name,
          branchCode: formData.branch_code,
          branchAddress: formData.branch_address,
          accountType: formData.account_type,
          employeeId: formData.employee_id ? parseInt(formData.employee_id) : null,
          openingBalance: parseFloat(formData.opening_balance) || 0
        };
        const response = await bankingApi.createBankAccount(createData);
        if (response.success) {
          await loadBankAccounts(); // Reload the list
          setOpenDialog(false);
          setSelectedAccount(null);
          setIsEditMode(false);
          setSnackbar({ open: true, message: 'Bank account created successfully', severity: 'success' });
        } else {
          setError(response.message || 'Failed to create bank account');
          setSnackbar({ open: true, message: response.message || 'Failed to create bank account', severity: 'error' });
        }
      }
    } catch (error) {
      setError(error.message || 'Error saving bank account');
      setSnackbar({ open: true, message: error.message || 'Error saving bank account', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
    setIsEditMode(false);
    setError(null);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Blocked':
        return 'error';
      case 'Inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCardGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    ];
    return gradients[index % gradients.length];
  };

  const filteredAccounts = bankAccounts.filter(account =>
    (account.accountName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (account.bankName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (account.accountNumber || '').includes(searchTerm)
  );

  if (loading && bankAccounts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 0, width: '100%', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        color: 'white',
        p: 3,
        mb: 3
      }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          My Cards
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          Manage and view all your bank cards
        </Typography>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 3, mb: 3 }}>
          <Alert severity="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Search and Add Bank */}
      <Box sx={{ px: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search cards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1, minWidth: 200 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddBank}
            sx={{
              background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
              }
            }}
          >
            Add Bank
          </Button>
        </Box>
      </Box>

      {/* Bank Cards Grid */}
      <Box sx={{ px: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : filteredAccounts.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No bank accounts found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchTerm ? 'Try adjusting your search terms' : 'Click "Add Bank" to create your first bank account'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredAccounts.map((account, index) => (
              <Grid item xs={12} sm={6} md={4} key={account.bankAccountId || index}>
                <Card
                  sx={{
                    background: getCardGradient(index),
                    color: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                    }
                  }}
                  onClick={() => handleViewCard(account)}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                          **** **** **** {account.accountNumber?.slice(-4) || '****'}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {account.accountName || 'Unknown Account'}
                        </Typography>
                      </Box>
                      <BankIcon sx={{ fontSize: 32, opacity: 0.7 }} />
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Box>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          Account Balance: {account.openingBalance}
                        </Typography>
                        <Chip
                          label={account.status || 'Active'}
                          size="small"
                          color={getStatusColor(account.status || 'Active')}
                          sx={{ mt: 1, color: 'white' }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {account.bankName || 'Unknown Bank'}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Dialog for Add/Edit/View */}
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
          color: 'white',
          fontWeight: 600
        }}>
          {isEditMode ? 'Edit Bank Account' : selectedAccount ? 'View Bank Account' : 'Register New Bank Account'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="h6" gutterBottom color="text.secondary">
              {isEditMode ? 'Edit Bank Account' : selectedAccount ? 'Bank Account Details' : 'Fill in the required information to register a new bank account for your company.'}
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* MANDATORY Basic Account Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="error" gutterBottom sx={{ fontWeight: 600, borderBottom: '2px solid #f44336', pb: 0.5 }}>
                  MANDATORY Basic Account Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={formData.bank_name}
                  onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                  disabled={!isEditMode && selectedAccount}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Branch Code"
                  value={formData.branch_code}
                  onChange={(e) => setFormData({...formData, branch_code: e.target.value})}
                  disabled={!isEditMode && selectedAccount}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Branch Address"
                  value={formData.branch_address}
                  onChange={(e) => setFormData({...formData, branch_address: e.target.value})}
                  disabled={!isEditMode && selectedAccount}
                  multiline
                  rows={2}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Number"
                  value={formData.account_number}
                  onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                  disabled={!isEditMode && selectedAccount}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account IBAN Number"
                  value={formData.account_iban_no}
                  onChange={(e) => setFormData({...formData, account_iban_no: e.target.value})}
                  disabled={!isEditMode && selectedAccount}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Account Name"
                  value={formData.account_name}
                  onChange={(e) => setFormData({...formData, account_name: e.target.value})}
                  disabled={!isEditMode && selectedAccount}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={formData.account_type}
                    onChange={(e) => setFormData({...formData, account_type: e.target.value})}
                    disabled={!isEditMode && selectedAccount}
                    label="Account Type"
                    variant="outlined"
                  >
                    <MenuItem value="Savings">Savings</MenuItem>
                    <MenuItem value="Checking">Checking</MenuItem>
                    <MenuItem value="Credit">Credit</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Current">Current</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {/* OPTIONAL Financial Information */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" color="success.main" gutterBottom sx={{ fontWeight: 600, borderBottom: '2px solid #4caf50', pb: 0.5, mt: 2 }}>
                  OPTIONAL Financial Information
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Opening Balance"
                  type="number"
                  value={formData.opening_balance}
                  onChange={(e) => setFormData({...formData, opening_balance: parseFloat(e.target.value) || 0})}
                  disabled={!isEditMode && selectedAccount}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Employee ID"
                  type="number"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({...formData, employee_id: parseInt(e.target.value) || ''})}
                  disabled={!isEditMode && selectedAccount}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          {selectedAccount && !isEditMode && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                }
              }}
            >
              Edit
            </Button>
          )}
          {(isEditMode || !selectedAccount) && (
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                }
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : (isEditMode ? 'Update' : 'Save Account')}
            </Button>
          )}
          <Button variant="outlined" onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Banking;
