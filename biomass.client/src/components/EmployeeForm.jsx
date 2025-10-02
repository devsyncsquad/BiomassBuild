import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { employeeApi } from "../utils/api";

const EmployeeForm = ({ open, onClose, employee, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = !!employee;

  useEffect(() => {
    if (open) {
      if (employee) {
        setFormData({
          fullName: employee.fullName || "",
          designation: employee.designation || "",
          phone: employee.phone || "",
        });
      } else {
        setFormData({
          fullName: "",
          designation: "",
          phone: "",
        });
      }
      setError("");
      setSuccess("");
    }
  }, [open, employee]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = isEditing
        ? await employeeApi.updateEmployee(employee.employeeId, formData)
        : await employeeApi.createEmployee(formData);

      if (response.success) {
        setSuccess(
          isEditing ? "Employee updated successfully!" : "Employee created successfully!"
        );
        onSuccess(response.result);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError("Error saving employee: " + response.message);
      }
    } catch (error) {
      console.error("Error saving employee:", error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(", ");
        setError("Validation errors: " + errorMessages);
      } else if (error.response?.data?.message) {
        setError("Error saving employee: " + error.response.data.message);
      } else {
        setError("Error saving employee. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        fullName: "",
        designation: "",
        phone: "",
      });
      setError("");
      setSuccess("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: 16,
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: "#228B22",
          color: "white",
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ color: "white" }}>
          {isEditing ? "Edit Employee" : "Add New Employee"}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<CancelIcon />}
          onClick={handleClose}
          disabled={loading}
          sx={{
            color: "white",
            borderColor: "white",
            "&:hover": {
              borderColor: "white",
              bgcolor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          Close
        </Button>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#228B22",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#228B22",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="designation"
              label="Designation"
              value={formData.designation}
              onChange={handleChange}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#228B22",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#228B22",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              name="phone"
              label="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#228B22",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#228B22",
                    borderWidth: "2px",
                  },
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
          <Button
            variant="contained"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              bgcolor: "#228B22",
              "&:hover": { bgcolor: "#006400" },
              borderRadius: "12px",
              px: 3,
            }}
          >
            {loading
              ? "Saving..."
              : isEditing
              ? "Update Employee"
              : "Save Employee"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{
              borderColor: "#228B22",
              color: "#228B22",
              "&:hover": {
                borderColor: "#006400",
                bgcolor: "rgba(34, 139, 34, 0.04)",
              },
              borderRadius: "12px",
              px: 3,
            }}
          >
            Cancel
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeForm;
