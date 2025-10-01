import React, { useState, useEffect } from "react";
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
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  FormControlLabel,
  Switch,
  DialogContentText,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  AccountBalance as BankIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
} from "@mui/icons-material";
import axios from "axios";
import { getBaseUrl, lookupApi } from "../utils/api";

const MoneyAccount = () => {
  const [moneyAccounts, setMoneyAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Pagination and filters
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [kindLookupId, setKindLookupId] = useState(6); // Default to Bank
  const [accountTypes, setAccountTypes] = useState([]);
  const [loadingAccountTypes, setLoadingAccountTypes] = useState(false);

  const [formData, setFormData] = useState({
    accountCode: "",
    name: "",
    kindLookupId: 6,
    accountHolder: "",
    companyRegNo: "",
    bankName: "",
    branchName: "",
    branchCode: "",
    accountNumber: "",
    iban: "",
    swiftBic: "",
    walletProvider: "",
    walletPhone: "",
    currency: "PKR",
    openingBalance: 0,
    openingBalanceAsOf: "",
    isDefault: false,
    isActive: true,
    notes: "",
    createdBy: "",
    updatedBy: "",
  });

  // Load money accounts from API
  useEffect(() => {
    loadMoneyAccounts();
  }, [page, pageSize, kindLookupId]);

  // Load account types from lookup API
  useEffect(() => {
    loadAccountTypes();
  }, []);

  // Load account types from lookup API
  const loadAccountTypes = async () => {
    try {
      setLoadingAccountTypes(true);
      const response = await lookupApi.getLookupsByDomain("MoneyAccountKind");
      
      if (response.success) {
        setAccountTypes(response.result || []);
        // Set default to first available account type if none selected
        if (response.result && response.result.length > 0 && !kindLookupId) {
          setKindLookupId(response.result[0].lookupId);
        }
      } else {
        console.error("Failed to load account types:", response.message);
        setAccountTypes([]);
      }
    } catch (error) {
      console.error("Error loading account types:", error);
      setAccountTypes([]);
    } finally {
      setLoadingAccountTypes(false);
    }
  };

  // Get current user info for createdBy and updatedBy
  const getCurrentUser = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.empId || user.userId || 1; // Return user ID (empId) instead of name
  };

  const loadMoneyAccounts = async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl =
        getBaseUrl();
      const response = await axios.get(
        `${baseUrl}/MoneyAccount/GetAllMoneyAccount`,
        {
          params: {
            page,
            pageSize,
            kindLookupId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setMoneyAccounts(response.data.result.items || []);
        setTotalCount(response.data.result.totalCount || 0);
        setTotalPages(response.data.result.totalPages || 1);
      } else {
        setError(response.data.message || "Failed to load money accounts");
      }
    } catch (error) {
      setError(error.message || "Error loading money accounts");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Account name is required";
    }

    if (!formData.accountHolder?.trim()) {
      errors.accountHolder = "Account holder is required";
    }

    if (formData.kindLookupId === 6 && !formData.bankName?.trim()) {
      errors.bankName = "Bank name is required for bank accounts";
    }

    if (formData.kindLookupId === 7 && !formData.walletProvider?.trim()) {
      errors.walletProvider = "Wallet provider is required for wallet accounts";
    }

    if (formData.openingBalance < 0) {
      errors.openingBalance = "Opening balance cannot be negative";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsEditMode(false);
    const currentUserId = getCurrentUser();
    setFormData({
      accountCode: "",
      name: "",
      kindLookupId: 6,
      accountHolder: "",
      companyRegNo: "",
      bankName: "",
      branchName: "",
      branchCode: "",
      accountNumber: "",
      iban: "",
      swiftBic: "",
      walletProvider: "",
      walletPhone: "",
      currency: "PKR",
      openingBalance: 0,
      openingBalanceAsOf: "",
      isDefault: false,
      isActive: true,
      notes: "",
      createdBy: currentUserId,
      updatedBy: currentUserId,
    });
    setFormErrors({});
    setOpenDialog(true);
  };

  const handleViewAccount = async (account) => {
    try {
      setLoading(true);
      const baseUrl =
        getBaseUrl();
      const response = await axios.get(
        `${baseUrl}/MoneyAccount/GetById/${account.moneyAccountId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        const accountData = response.data.result;
        setSelectedAccount(accountData);
        setIsEditMode(false);
        const currentUserId = getCurrentUser();
        setFormData({
          accountCode: accountData.accountCode || "",
          name: accountData.name || "",
          kindLookupId: accountData.kindLookupId || 6,
          accountHolder: accountData.accountHolder || "",
          companyRegNo: accountData.companyRegNo || "",
          bankName: accountData.bankName || "",
          branchName: accountData.branchName || "",
          branchCode: accountData.branchCode || "",
          accountNumber: accountData.accountNumber || "",
          iban: accountData.iban || "",
          swiftBic: accountData.swiftBic || "",
          walletProvider: accountData.walletProvider || "",
          walletPhone: accountData.walletPhone || "",
          currency: accountData.currency || "PKR",
          openingBalance: accountData.openingBalance || 0,
          openingBalanceAsOf: accountData.openingBalanceAsOf
            ? new Date(accountData.openingBalanceAsOf)
                .toISOString()
                .split("T")[0]
            : "",
          isDefault: accountData.isDefault || false,
          isActive: accountData.isActive || true,
          notes: accountData.notes || "",
          createdBy: accountData.createdBy || currentUserId,
          updatedBy: currentUserId,
        });
        setFormErrors({});
        setOpenDialog(true);
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to load account details",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error loading account details",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    // Update the updatedBy field when entering edit mode
    setFormData((prev) => ({
      ...prev,
      updatedBy: getCurrentUser(),
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const baseUrl =
        getBaseUrl();
      let response;

      if (isEditMode && selectedAccount) {
        // Update existing account
        response = await axios.put(
          `${baseUrl}/MoneyAccount/UpdateMoneyAccount/${selectedAccount.moneyAccountId}`,
          {
            accountCode: formData.accountCode,
            name: formData.name,
            kindLookupId: formData.kindLookupId,
            accountHolder: formData.accountHolder,
            companyRegNo: formData.companyRegNo,
            bankName: formData.bankName,
            branchName: formData.branchName,
            branchCode: formData.branchCode,
            accountNumber: formData.accountNumber,
            iban: formData.iban,
            swiftBic: formData.swiftBic,
            walletProvider: formData.walletProvider,
            walletPhone: formData.walletPhone,
            currency: formData.currency,
            openingBalance: formData.openingBalance,
            openingBalanceAsOf: formData.openingBalanceAsOf
              ? new Date(formData.openingBalanceAsOf)
              : null,
            isDefault: formData.isDefault,
            isActive: formData.isActive,
            notes: formData.notes,
            updatedBy: formData.updatedBy,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        // Create new account
        response = await axios.post(
          `${baseUrl}/MoneyAccount/CreateMoneyAccount`,
          {
            accountCode: formData.accountCode,
            name: formData.name,
            kindLookupId: formData.kindLookupId,
            accountHolder: formData.accountHolder,
            companyRegNo: formData.companyRegNo,
            bankName: formData.bankName,
            branchName: formData.branchName,
            branchCode: formData.branchCode,
            accountNumber: formData.accountNumber,
            iban: formData.iban,
            swiftBic: formData.swiftBic,
            walletProvider: formData.walletProvider,
            walletPhone: formData.walletPhone,
            currency: formData.currency,
            openingBalance: formData.openingBalance,
            openingBalanceAsOf: formData.openingBalanceAsOf
              ? new Date(formData.openingBalanceAsOf)
              : null,
            isDefault: formData.isDefault,
            notes: formData.notes,
            createdBy: formData.createdBy,
            updatedBy: formData.updatedBy,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: isEditMode
            ? "Money account updated successfully"
            : "Money account created successfully",
          severity: "success",
        });
        setOpenDialog(false);
        setSelectedAccount(null);
        setIsEditMode(false);
        await loadMoneyAccounts();
      } else {
        setError(response.data.message || "Failed to save money account");
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to save money account",
          severity: "error",
        });
      }
    } catch (error) {
      setError(error.message || "Error saving money account");
      setSnackbar({
        open: true,
        message: error.message || "Error saving money account",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (account) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      setLoading(true);
      const baseUrl =
        getBaseUrl();
      const response = await axios.delete(
        `${baseUrl}/MoneyAccount/DeleteMoneyAccount/${accountToDelete.moneyAccountId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Money account deleted successfully",
          severity: "success",
        });
        setDeleteDialogOpen(false);
        setAccountToDelete(null);
        await loadMoneyAccounts();
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to delete money account",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error deleting money account",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefault = async (account) => {
    try {
      setLoading(true);
      const baseUrl =
        getBaseUrl();
      const response = await axios.put(
        `${baseUrl}/MoneyAccount/SetDefault/${account.moneyAccountId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSnackbar({
          open: true,
          message: "Default account set successfully",
          severity: "success",
        });
        await loadMoneyAccounts();
      } else {
        setSnackbar({
          open: true,
          message: response.data.message || "Failed to set default account",
          severity: "error",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error setting default account",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setOpenDialog(false);
    setSelectedAccount(null);
    setIsEditMode(false);
    setError(null);
    setFormErrors({});
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusColor = (isActive) => {
    return isActive ? "success" : "error";
  };

  const getAccountTypeColor = (kindLookupId) => {
    switch (kindLookupId) {
      case 6:
        return "primary"; // Bank
      case 7:
        return "secondary"; // Wallet
      case 8:
        return "info"; // Cash
      default:
        return "default";
    }
  };

  const getAccountTypeName = (kindLookupId) => {
    switch (kindLookupId) {
      case 6:
        return "Bank";
      case 7:
        return "Wallet";
      case 8:
        return "Cash";
      default:
        return "Unknown";
    }
  };

  const filteredAccounts = moneyAccounts.filter(
    (account) =>
      (account.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (account.accountCode?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (account.bankName?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (account.accountHolder?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      )
  );

  if (loading && moneyAccounts.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 0,
        width: "100%",
        backgroundColor: "#f8fffa",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
          color: "white",
          p: 4,
          mb: 3,
          borderRadius: "0 0 24px 24px",
          boxShadow: "0 8px 32px rgba(34,139,34,0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              variant='h4'
              gutterBottom
              sx={{ color: "white", fontWeight: 700, mb: 1 }}
            >
              Money Account Management
            </Typography>
           
          </Box>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAddAccount}
            size='large'
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              background: "rgba(255,255,255,0.2)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
              "&:hover": {
                background: "rgba(255,255,255,0.3)",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
              },
              transition: "all 0.3s ease",
            }}
          >
            Add Account
          </Button>
        </Box>
      </Box>

      {/* Error Alert */}
      {error && (
        <Box sx={{ px: 3, mb: 3 }}>
          <Alert severity='error' onClose={() => setError(null)}>
            {error}
          </Alert>
        </Box>
      )}

      {/* Filters Section */}
      <Box sx={{ mb: 4, px: 3 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            overflow: "visible",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography
                variant='h5'
                sx={{ fontWeight: 600, color: "#228B22" }}
              >
                Search & Filters
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder='Search accounts...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size='medium'
                  variant='outlined'
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <SearchIcon sx={{ color: "#228B22" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover fieldset": {
                        borderColor: "#228B22",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size='medium'>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={kindLookupId}
                    label='Account Type'
                    onChange={(e) => setKindLookupId(e.target.value)}
                    disabled={loadingAccountTypes}
                    sx={{
                      borderRadius: 2,
                      "& .MuiOutlinedInput-notchedOutline": {
                        "&:hover": {
                          borderColor: "#228B22",
                        },
                      },
                    }}
                  >
                    {loadingAccountTypes ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading account types...
                      </MenuItem>
                    ) : (
                      accountTypes.map((accountType) => (
                        <MenuItem key={accountType.lookupId} value={accountType.lookupId}>
                          {accountType.lookupName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography
                    variant='body2'
                    sx={{ color: "#228B22", fontWeight: 500 }}
                  >
                    Total: {totalCount}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

      {/* Money Accounts Table */}
      <Box sx={{ px: 3, mb: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Table size='medium'>
            <TableHead>
              <TableRow
                sx={{
                  background:
                    "linear-gradient(135deg, #228B22 0%, #006400 100%)",
                  "& th": { border: 0 },
                }}
              >
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    py: 2,
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Account
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    py: 2,
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Details
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    py: 2,
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Type
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    py: 2,
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    py: 2,
                    color: "white",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow
                  key={account.moneyAccountId}
                  hover
                  sx={{
                    "&:nth-of-type(even)": { bgcolor: "#fafbfc" },
                    "&:hover": {
                      bgcolor: "#f0f4ff",
                      transform: "scale(1.001)",
                      transition: "all 0.2s ease",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: "#228B22",
                          width: 40,
                          height: 40,
                          fontSize: "1rem",
                          fontWeight: 600,
                          boxShadow: "0 2px 8px rgba(34,139,34,0.3)",
                        }}
                      >
                        {account.accountCode?.charAt(0) || "A"}
                      </Avatar>
                      <Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Typography
                            variant='body1'
                            sx={{
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              mb: 0.5,
                            }}
                          >
                            {account.accountCode}
                          </Typography>
                          {account.isDefault && (
                            <Tooltip title='Default Account'>
                              <StarIcon
                                sx={{ color: "#FFD700", fontSize: "1rem" }}
                              />
                            </Tooltip>
                          )}
                        </Box>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ fontSize: "0.75rem" }}
                        >
                          {account.name}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box>
                      <Typography
                        variant='body2'
                        sx={{ fontSize: "0.9rem", fontWeight: 500, mb: 0.5 }}
                      >
                        {account.accountHolder}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {account.bankName}
                      </Typography>
                      {account.iban && (
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ fontSize: "0.75rem", display: "block" }}
                        >
                          IBAN: {account.iban}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={getAccountTypeName(account.kindLookupId)}
                      color={getAccountTypeColor(account.kindLookupId)}
                      size='small'
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={account.isActive ? "Active" : "Inactive"}
                      color={getStatusColor(account.isActive)}
                      size='small'
                      sx={{ textTransform: "capitalize" }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title='View Details'>
                        <IconButton
                          size='small'
                          onClick={() => handleViewAccount(account)}
                          sx={{
                            color: "#228B22",
                            p: 1,
                            bgcolor: "rgba(34,139,34,0.1)",
                            "&:hover": {
                              bgcolor: "rgba(34,139,34,0.2)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <ViewIcon sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Edit'>
                        <IconButton
                          size='small'
                          sx={{
                            color: "#FF9800",
                            p: 1,
                            bgcolor: "rgba(255,152,0,0.1)",
                            "&:hover": {
                              bgcolor: "rgba(255,152,0,0.2)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleViewAccount(account)}
                        >
                          <EditIcon sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title='Delete'>
                        <IconButton
                          size='small'
                          onClick={() => handleDelete(account)}
                          sx={{
                            color: "#F44336",
                            p: 1,
                            bgcolor: "rgba(244,67,54,0.1)",
                            "&:hover": {
                              bgcolor: "rgba(244,67,54,0.2)",
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s ease",
                          }}
                        >
                          <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color='primary'
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  backgroundColor: "#228B22",
                  color: "white",
                },
                "& .MuiPaginationItem-root:hover": {
                  backgroundColor: "rgba(34,139,34,0.1)",
                },
              }}
            />
          </Box>
        )}
      </Box>

      {/* Dialog for Add/Edit/View */}
      <Dialog
        open={openDialog}
        onClose={handleCancel}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: "90vh",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
            color: "white",
            fontWeight: 600,
          }}
        >
          {isEditMode
            ? "Edit Money Account"
            : selectedAccount
            ? "View Money Account"
            : "Add New Money Account"}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant='h6' gutterBottom color='text.secondary'>
              {isEditMode
                ? "Edit Money Account"
                : selectedAccount
                ? "Money Account Details"
                : "Fill in the required information to create a new money account."}
            </Typography>

            <Grid container spacing={3} sx={{ mt: 2 }}>
              {/* Basic Account Information */}
              <Grid item xs={12}>
                <Typography
                  variant='subtitle1'
                  color='error'
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    borderBottom: "2px solid #f44336",
                    pb: 0.5,
                  }}
                >
                  Basic Account Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Account Code'
                  value={formData.accountCode}
                  onChange={(e) =>
                    setFormData({ ...formData, accountCode: e.target.value })
                  }
                  disabled={!isEditMode && selectedAccount}
                  variant='outlined'
                  error={!!formErrors.accountCode}
                  helperText={formErrors.accountCode}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Account Name *'
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  disabled={!isEditMode && selectedAccount}
                  required
                  variant='outlined'
                  error={!!formErrors.name}
                  helperText={formErrors.name}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!formErrors.kindLookupId}>
                  <InputLabel>Account Type *</InputLabel>
                  <Select
                    value={formData.kindLookupId}
                    onChange={(e) =>
                      setFormData({ ...formData, kindLookupId: e.target.value })
                    }
                    disabled={!isEditMode && selectedAccount || loadingAccountTypes}
                    label='Account Type *'
                    variant='outlined'
                  >
                    {loadingAccountTypes ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading account types...
                      </MenuItem>
                    ) : (
                      accountTypes.map((accountType) => (
                        <MenuItem key={accountType.lookupId} value={accountType.lookupId}>
                          {accountType.lookupName}
                        </MenuItem>
                      ))
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Account Holder *'
                  value={formData.accountHolder}
                  onChange={(e) =>
                    setFormData({ ...formData, accountHolder: e.target.value })
                  }
                  disabled={!isEditMode && selectedAccount}
                  required
                  variant='outlined'
                  error={!!formErrors.accountHolder}
                  helperText={formErrors.accountHolder}
                />
              </Grid>

              {/* Bank Details */}
              {formData.kindLookupId === 6 && (
                <>
                  <Grid item xs={12}>
                    <Typography
                      variant='subtitle1'
                      color='success.main'
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        borderBottom: "2px solid #4caf50",
                        pb: 0.5,
                        mt: 2,
                      }}
                    >
                      Bank Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Bank Name *'
                      value={formData.bankName}
                      onChange={(e) =>
                        setFormData({ ...formData, bankName: e.target.value })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                      error={!!formErrors.bankName}
                      helperText={formErrors.bankName}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Branch Name'
                      value={formData.branchName}
                      onChange={(e) =>
                        setFormData({ ...formData, branchName: e.target.value })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Branch Code'
                      value={formData.branchCode}
                      onChange={(e) =>
                        setFormData({ ...formData, branchCode: e.target.value })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Account Number'
                      value={formData.accountNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value,
                        })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='IBAN'
                      value={formData.iban}
                      onChange={(e) =>
                        setFormData({ ...formData, iban: e.target.value })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='SWIFT/BIC'
                      value={formData.swiftBic}
                      onChange={(e) =>
                        setFormData({ ...formData, swiftBic: e.target.value })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                    />
                  </Grid>
                </>
              )}

              {/* Wallet Details */}
              {formData.kindLookupId === 7 && (
                <>
                  <Grid item xs={12}>
                    <Typography
                      variant='subtitle1'
                      color='info.main'
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        borderBottom: "2px solid #2196f3",
                        pb: 0.5,
                        mt: 2,
                      }}
                    >
                      Wallet Details
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Wallet Provider *'
                      value={formData.walletProvider}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          walletProvider: e.target.value,
                        })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                      error={!!formErrors.walletProvider}
                      helperText={formErrors.walletProvider}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label='Wallet Phone'
                      value={formData.walletPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          walletPhone: e.target.value,
                        })
                      }
                      disabled={!isEditMode && selectedAccount}
                      variant='outlined'
                    />
                  </Grid>
                </>
              )}

              {/* Financial Information */}
              <Grid item xs={12}>
                <Typography
                  variant='subtitle1'
                  color='warning.main'
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    borderBottom: "2px solid #ff9800",
                    pb: 0.5,
                    mt: 2,
                  }}
                >
                  Financial Information
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Currency'
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  disabled={!isEditMode && selectedAccount}
                  variant='outlined'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Opening Balance'
                  type='number'
                  value={formData.openingBalance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      openingBalance: parseFloat(e.target.value) || 0,
                    })
                  }
                  disabled={!isEditMode && selectedAccount}
                  variant='outlined'
                  error={!!formErrors.openingBalance}
                  helperText={formErrors.openingBalance}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Notes'
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  disabled={!isEditMode && selectedAccount}
                  multiline
                  rows={3}
                  variant='outlined'
                />
              </Grid>

              {/* Settings */}
              <Grid item xs={12}>
                <Typography
                  variant='subtitle1'
                  color='primary.main'
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    borderBottom: "2px solid #2196f3",
                    pb: 0.5,
                    mt: 2,
                  }}
                >
                  Settings
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isDefault}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isDefault: e.target.checked,
                        })
                      }
                      disabled={!isEditMode && selectedAccount}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#228B22",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#228B22",
                          },
                      }}
                    />
                  }
                  label='Default Account'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isActive}
                      onChange={(e) =>
                        setFormData({ ...formData, isActive: e.target.checked })
                      }
                      disabled={!isEditMode && selectedAccount}
                      sx={{
                        "& .MuiSwitch-switchBase.Mui-checked": {
                          color: "#228B22",
                        },
                        "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                          {
                            backgroundColor: "#228B22",
                          },
                      }}
                    />
                  }
                  label='Active Account'
                />
              </Grid>

              {/* User Tracking Fields */}
              <Grid item xs={12}>
                <Typography
                  variant='subtitle1'
                  color='secondary.main'
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    borderBottom: "2px solid #9c27b0",
                    pb: 0.5,
                    mt: 2,
                  }}
                >
                  User Tracking
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Created By (User ID)'
                  value={formData.createdBy || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      createdBy: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={true} // This should be read-only
                  variant='outlined'
                  helperText='User ID who created this account'
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Updated By (User ID)'
                  value={formData.updatedBy || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      updatedBy: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={true} // This should be read-only
                  variant='outlined'
                  helperText='User ID who last updated this account'
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          {selectedAccount && !isEditMode && (
            <Button
              variant='contained'
              startIcon={<EditIcon />}
              onClick={handleEdit}
              sx={{
                background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #006400 0%, #004d00 100%)",
                },
              }}
            >
              Edit
            </Button>
          )}
          {(isEditMode || !selectedAccount) && (
            <Button
              variant='contained'
              onClick={handleSave}
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #006400 0%, #004d00 100%)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={20} color='inherit' />
              ) : isEditMode ? (
                "Update"
              ) : (
                "Save Account"
              )}
            </Button>
          )}
          <Button variant='outlined' onClick={handleCancel} disabled={loading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth='sm'
        fullWidth
      >
        <DialogTitle sx={{ color: "#F44336", fontWeight: 600 }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the money account "
            {accountToDelete?.name}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button variant='outlined' onClick={() => setDeleteDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant='contained'
            color='error'
            onClick={confirmDelete}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MoneyAccount;
