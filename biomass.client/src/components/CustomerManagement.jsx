import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomerLocations from "./CustomerLocations";
import CustomerLocationForm from "./CustomerLocationForm";
import "./CustomerManagement.css";

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [openRegistration, setOpenRegistration] = useState(false);
  const [openLocations, setOpenLocations] = useState(false);
  const [openLocationForm, setOpenLocationForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isEditing, setIsEditing] = useState(false);

  // Snackbar states
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyId: "",
    companyName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    status: "active",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const hideSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // Fetch companies from API
  const fetchCompanies = async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_LIVE_APP_BASEURL || "https://localhost:7084/api";
      const response = await axios.get(`${baseUrl}/Companies/GetAllCompanies`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setCompanies(response.data.result || []);
      } else {
        console.error("Error fetching companies:", response.data.message);
        // Fallback to sample companies if API fails
        setCompanies([
          { companyId: 1, companyName: "Tech Solutions Inc." },
          { companyId: 2, companyName: "Green Energy Corp." },
          { companyId: 3, companyName: "Eco Systems Ltd." },
          { companyId: 4, companyName: "BioTech Industries" },
          { companyId: 7, companyName: "SyncSquad" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      // Fallback to sample companies if API fails
      setCompanies([
        { companyId: 1, companyName: "Tech Solutions Inc." },
        { companyId: 2, companyName: "Green Energy Corp." },
        { companyId: 3, companyName: "Eco Systems Ltd." },
        { companyId: 4, companyName: "BioTech Industries" },
        { companyId: 7, companyName: "SyncSquad" },
      ]);
    }
  };

  // Fetch customers from API
  useEffect(() => {
    fetchCustomers();
    fetchCompanies();
  }, []);

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const baseUrl =
        import.meta.env.VITE_LIVE_APP_BASEURL || "https://localhost:7084/api";
      const response = await axios.get(`${baseUrl}/Customers/GetAllCustomers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        setCustomers(response.data.result || []);
      } else {
        console.error("Error fetching customers:", response.data.message);
        // Fallback to mock data if API fails
        setCustomers([
          {
            customerId: 1,
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@email.com",
            phone: "+1 (555) 123-4567",
            companyId: 1,
            companyName: "Tech Solutions Inc.",
            address: "123 Main Street",
            city: "New York",
            state: "NY",
            postalCode: "10001",
            country: "USA",
            status: "active",
            createdDate: "2024-01-15",
            locationCount: 3,
          },
          {
            customerId: 2,
            firstName: "Sarah",
            lastName: "Johnson",
            email: "sarah.johnson@email.com",
            phone: "+1 (555) 234-5678",
            companyId: 2,
            companyName: "Green Energy Corp.",
            address: "456 Oak Avenue",
            city: "Los Angeles",
            state: "CA",
            postalCode: "90210",
            country: "USA",
            status: "active",
            createdDate: "2024-01-20",
            locationCount: 2,
          },
          {
            customerId: 3,
            firstName: "Michael",
            lastName: "Brown",
            email: "michael.brown@email.com",
            phone: "+1 (555) 345-6789",
            companyId: 3,
            companyName: "Eco Systems Ltd.",
            address: "789 Pine Street",
            city: "Chicago",
            state: "IL",
            postalCode: "60601",
            country: "USA",
            status: "active",
            createdDate: "2024-01-25",
            locationCount: 1,
          },
        ]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      // Fallback to mock data if API fails
      setCustomers([
        {
          customerId: 1,
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          phone: "+1 (555) 123-4567",
          companyId: 1,
          companyName: "Tech Solutions Inc.",
          address: "123 Main Street",
          city: "New York",
          state: "NY",
          postalCode: "10001",
          country: "USA",
          status: "active",
          createdDate: "2024-01-15",
          locationCount: 3,
        },
        {
          customerId: 2,
          firstName: "Sarah",
          lastName: "Johnson",
          email: "sarah.johnson@email.com",
          phone: "+1 (555) 234-5678",
          companyId: 2,
          companyName: "Green Energy Corp.",
          address: "456 Oak Avenue",
          city: "Los Angeles",
          state: "CA",
          postalCode: "90210",
          country: "USA",
          status: "active",
          createdDate: "2024-01-20",
          locationCount: 2,
        },
        {
          customerId: 3,
          firstName: "Michael",
          lastName: "Brown",
          email: "michael.brown@email.com",
          phone: "+1 (555) 345-6789",
          companyId: 3,
          companyName: "Eco Systems Ltd.",
          address: "789 Pine Street",
          city: "Chicago",
          state: "IL",
          postalCode: "60601",
          country: "USA",
          status: "active",
          createdDate: "2024-01-25",
          locationCount: 1,
        },
      ]);
    }
  };

  const handleAddNew = () => {
    setIsEditing(false);
    setNewCustomer({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyId: "",
      companyName: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      status: "active",
    });
    setOpenRegistration(true);
  };

  const handleEditCustomer = (customer) => {
    setIsEditing(true);
    setNewCustomer({
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      companyId: customer.companyId || "",
      companyName: customer.companyName,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      postalCode: customer.postalCode,
      country: customer.country,
      status: customer.status,
    });
    setSelectedCustomer(customer);
    setOpenRegistration(true);
  };

  const handleSaveCustomer = async () => {
    try {
      // Get company name from selected company
      const selectedCompany = companies.find(
        (c) => c.companyId === parseInt(newCustomer.companyId)
      );
      const customerData = {
        ...newCustomer,
        companyName: selectedCompany ? selectedCompany.companyName : "",
      };

      let response;
      const baseUrl =
        import.meta.env.VITE_LIVE_APP_BASEURL || "https://localhost:7084/api";

      if (isEditing) {
        response = await axios.put(
          `${baseUrl}/Customers/UpdateCustomer/${selectedCustomer.customerId}`,
          customerData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${baseUrl}/Customers/CreateCustomer`,
          customerData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.success) {
        // Refresh the customers list
        await fetchCustomers();
        setOpenRegistration(false);
        setIsEditing(false);
        setSelectedCustomer(null);
        setNewCustomer({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          companyId: "",
          companyName: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
          status: "active",
        });

        showSnackbar(
          isEditing
            ? "Customer updated successfully!"
            : "Customer created successfully!",
          "success"
        );
      } else {
        showSnackbar(
          "Error saving customer: " + response.data.message,
          "error"
        );
      }
    } catch (error) {
      console.error("Error saving customer:", error);
      showSnackbar("Error saving customer. Please try again.", "error");
    }
  };

  const handleViewLocations = (customer) => {
    setSelectedCustomer(customer);
    setOpenLocations(true);
  };

  const handleAddLocation = (customer) => {
    setSelectedCustomer(customer);
    setOpenLocationForm(true);
  };

  const handleSaveLocation = (locationData) => {
    // Update the customer's location count
    setCustomers((prevCustomers) =>
      prevCustomers.map((customer) =>
        customer.customerId === selectedCustomer.customerId
          ? { ...customer, locationCount: customer.locationCount + 1 }
          : customer
      )
    );
    setOpenLocationForm(false);
  };

  const handleDeleteCustomer = async (customer) => {
    if (
      window.confirm(
        `Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`
      )
    ) {
      try {
        const baseUrl =
          import.meta.env.VITE_LIVE_APP_BASEURL || "https://localhost:7084/api";
        const response = await axios.delete(
          `${baseUrl}/Customers/DeleteCustomer/${customer.customerId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          await fetchCustomers();
          showSnackbar("Customer deleted successfully!", "success");
        } else {
          showSnackbar(
            "Error deleting customer: " + response.data.message,
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        showSnackbar("Error deleting customer. Please try again.", "error");
      }
    }
  };

  const handleCompanyChange = (companyId) => {
    const selectedCompany = companies.find(
      (c) => c.companyId === parseInt(companyId)
    );
    setNewCustomer((prev) => ({
      ...prev,
      companyId: companyId,
      companyName: selectedCompany ? selectedCompany.companyName : "",
    }));
  };

  const getCompanyNameById = (companyId) => {
    const company = companies.find((c) => c.companyId === companyId);
    return company ? company.companyName : "Unknown Company";
  };

  const filteredCustomers = customers.filter((customer) => {
    const companyName = customer.companyId
      ? getCompanyNameById(customer.companyId)
      : customer.companyName || "";
    const matchesSearch =
      customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || customer.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === "active" ? "success" : "error";
  };

  return (
    <Box sx={{ p: 0, backgroundColor: "#f8fffa", minHeight: "100vh" }}>
      {/* Enhanced Modern Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
          color: "white",
          p: 4,
          mb: 3,
          borderRadius: "0 0 24px 24px",
          boxShadow: "0 8px 32px rgba(34,139,34,0.2)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background Pattern */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "150px",
            height: "150px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            transform: "translate(-50%, 50%)",
          }}
        />

        <Box
          sx={{
            color: "white",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Box>
            <Typography
              variant='h4'
              gutterBottom
              sx={{
                color: "white",
                fontWeight: 500,
                mb: 0,
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              Customer Management
            </Typography>
            
          </Box>
          <Button
            variant='contained'
            startIcon={<AddIcon />}
            onClick={handleAddNew}
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
            Add New Customer
          </Button>
        </Box>
      </Box>

      {/* Enhanced Modern Filters */}
      <Box sx={{ mb: 4, px: 3 }}>
        <Box
          sx={{
            background: "white",
            borderRadius: 4,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            p: 3,
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
           
            <Typography variant='h6' sx={{ fontWeight: 600, color: "#228B22" }}>
              Search & Filters
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder='Search customers by name, email, or company...'
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
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size='medium'>
                <InputLabel>Status Filter</InputLabel>
                <Select
                  value={filterStatus}
                  label='Status Filter'
                  onChange={(e) => setFilterStatus(e.target.value)}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      "&:hover": {
                        borderColor: "#228B22",
                      },
                    },
                  }}
                >
                  <MenuItem value='all'>All Status</MenuItem>
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: "56px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: "#f8fafc",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{ fontWeight: 500 }}
                  >
                    Total:
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: "#228B22",
                      color: "white",
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      fontWeight: 600,
                      fontSize: "0.9rem",
                    }}
                  >
                    {filteredCustomers.length} customers
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Enhanced Modern Customers Table */}
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
                  Customer
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
                  Contact
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
                  Company
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
                  Location
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
                  Registration Date
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
              {filteredCustomers.map((customer, index) => (
                <TableRow
                  key={customer.customerId}
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
                          boxShadow: "0 2px 8px rgba(34, 139, 34, 0.3)",
                        }}
                      >
                        {customer.firstName.charAt(0)}
                        {customer.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography
                          variant='body1'
                          sx={{ fontWeight: 600, fontSize: "0.9rem", mb: 0.5 }}
                        >
                          {customer.firstName} {customer.lastName}
                        </Typography>
                        <Typography
                          variant='caption'
                          color='text.secondary'
                          sx={{ fontSize: "0.75rem" }}
                        >
                          ID: {customer.customerId}
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
                        {customer.email}
                      </Typography>
                      <Typography
                        variant='caption'
                        color='text.secondary'
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {customer.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant='body2'
                      sx={{
                        fontSize: "0.9rem",
                        fontWeight: 500,
                        color: customer.companyId
                          ? "text.primary"
                          : "text.secondary",
                      }}
                    >
                      {customer.companyId
                        ? getCompanyNameById(customer.companyId)
                        : customer.companyName || "No Company"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant='body2'
                      sx={{ fontSize: "0.9rem", fontWeight: 500, mb: 0.5 }}
                    >
                      {customer.city}, {customer.state}
                    </Typography>
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {customer.country}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Chip
                      label={customer.status}
                      color={getStatusColor(customer.status)}
                      size='small'
                      sx={{
                        textTransform: "capitalize",
                        fontSize: "0.75rem",
                        height: 24,
                        fontWeight: 600,
                        "& .MuiChip-label": {
                          px: 1.5,
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Typography
                      variant='body2'
                      sx={{ fontSize: "0.9rem", fontWeight: 500 }}
                    >
                      {new Date(customer.createdDate).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ py: 2 }}>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton
                        size='small'
                        onClick={() => handleViewLocations(customer)}
                        sx={{
                          color: "#228B22",
                          p: 1,
                          bgcolor: "rgba(34, 139, 34, 0.1)",
                          "&:hover": {
                            bgcolor: "rgba(34, 139, 34, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        title='View Locations'
                      >
                        <LocationOnIcon sx={{ fontSize: "1.1rem" }} />
                      </IconButton>

                      <IconButton
                        size='small'
                        sx={{
                          color: "#228B22",
                          p: 1,
                          bgcolor: "rgba(34, 139, 34, 0.1)",
                          "&:hover": {
                            bgcolor: "rgba(34, 139, 34, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        title='Edit'
                        onClick={() => handleEditCustomer(customer)}
                      >
                        <EditIcon sx={{ fontSize: "1.1rem" }} />
                      </IconButton>
                      <IconButton
                        size='small'
                        sx={{
                          color: "#006400",
                          p: 1,
                          bgcolor: "rgba(0, 100, 0, 0.1)",
                          "&:hover": {
                            bgcolor: "rgba(0, 100, 0, 0.2)",
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s ease",
                        }}
                        title='Delete'
                        onClick={() => handleDeleteCustomer(customer)}
                      >
                        <DeleteIcon sx={{ fontSize: "1.1rem" }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Enhanced Modern Customer Registration Dialog */}
      <Dialog
        open={openRegistration}
        onClose={() => setOpenRegistration(false)}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          },
        }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
            color: "white",
            fontWeight: 700,
            fontSize: "1.25rem",
            p: 3,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background Pattern */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "100px",
              height: "100px",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
              borderRadius: "50%",
              transform: "translate(30%, -30%)",
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {isEditing ? "Edit Customer" : "Customer Registration"}
          </Box>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='First Name'
                value={newCustomer.firstName}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, firstName: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Last Name'
                value={newCustomer.lastName}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, lastName: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Email'
                type='email'
                value={newCustomer.email}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, email: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Phone'
                value={newCustomer.phone}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, phone: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Company</InputLabel>
                <Select
                  value={newCustomer.companyId}
                  label='Company'
                  onChange={(e) => handleCompanyChange(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      "&:hover": {
                        borderColor: "#228B22",
                      },
                    },
                  }}
                >
                  <MenuItem value=''>
                    <em>Select a company</em>
                  </MenuItem>
                  {companies.map((company) => (
                    <MenuItem key={company.companyId} value={company.companyId}>
                      {company.companyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Address'
                value={newCustomer.address}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, address: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='City'
                value={newCustomer.city}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, city: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='State'
                value={newCustomer.state}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, state: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label='Postal Code'
                value={newCustomer.postalCode}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, postalCode: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label='Country'
                value={newCustomer.country}
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, country: e.target.value })
                }
                margin='normal'
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "&:hover fieldset": {
                      borderColor: "#228B22",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#228B22",
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newCustomer.status}
                  label='Status'
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, status: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      "&:hover": {
                        borderColor: "#228B22",
                      },
                    },
                  }}
                >
                  <MenuItem value='active'>Active</MenuItem>
                  <MenuItem value='inactive'>Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => setOpenRegistration(false)}
            variant='outlined'
            sx={{
              borderColor: "#228B22",
              color: "#228B22",
              "&:hover": {
                borderColor: "#006400",
                color: "#006400",
                bgcolor: "rgba(34, 139, 34, 0.04)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveCustomer}
            variant='contained'
            sx={{
              background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #006400 0%, #004d00 100%)",
              },
            }}
          >
            {isEditing ? "Update Customer" : "Register Customer"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Customer Locations Dialog */}
      <Dialog
        open={openLocations}
        onClose={() => setOpenLocations(false)}
        maxWidth='lg'
        fullWidth
      >
        <DialogContent sx={{ p: 0 }}>
          <CustomerLocations
            customer={selectedCustomer}
            onClose={() => setOpenLocations(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Customer Location Form Dialog */}
      <CustomerLocationForm
        open={openLocationForm}
        onClose={() => setOpenLocationForm(false)}
        customerId={selectedCustomer?.customerId}
        onSave={handleSaveLocation}
      />

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={hideSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Fade}
      >
        <Alert
          onClose={hideSnackbar}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            "& .MuiAlert-icon": {
              fontSize: "1.5rem",
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerManagement;
