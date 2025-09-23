// React Imports
import React, { useState, useEffect } from "react";

// Other Imports
import axios from "axios";
import { useSnackbar } from "notistack";

// MUI Imports
import {
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import { Security, Save, Clear } from "@mui/icons-material";

// Component Imports
import { useGetRoleListQuery, useSaveRoleMutation, useUpdateRoleMutation } from "../../../redux/apis/userManagementApi";

// Utility Imports
import { getAuthHeaders, getCurrentUser } from "../../../utils/auth";

const baseUrl = import.meta.env.VITE_APP_BASE_URL || "https://localhost:7084";

const AddRole = ({ initialData, onRoleSaved, onCancel }) => {
  // Get current user from auth utility
  const user = getCurrentUser();
  const { enqueueSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    roleId: 0,
    roleName: "",
    description: "",
    enabled: "Y",
    createdBy: 0,
    createdAt: new Date().toISOString(),
    updatedBy: 0,
    updatedAt: new Date().toISOString(),
  });
  const [isRoleSaveLoading, setIsRoleSaveLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const {
    data: rolesData,
    isLoading: isRolesLoading,
    error: rolesError,
    refetch: refetchRoleList,
  } = useGetRoleListQuery();

  // RTK Query mutations
  const [saveRole] = useSaveRoleMutation();
  const [updateRole] = useUpdateRoleMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error when the user starts typing
  };

  const validateFields = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.roleName || !formData.roleName.trim()) {
      newErrors.roleName = "Role name is required";
      isValid = false;
    }

    if (!formData.enabled) {
      newErrors.enabled = "Status is required";
      isValid = false;
    }

    // Check if role name already exists (for new roles)
    if (!initialData && formData.roleName.trim()) {
      const existingRole = rolesData?.result?.find(
        (role) =>
          role.roleName.toLowerCase() === formData.roleName.toLowerCase()
      );
      if (existingRole) {
        newErrors.roleName = "Role name already exists";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    setIsRoleSaveLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      // Check if user is authenticated
      if (!user || !user.empId) {
        enqueueSnackbar("User not authenticated. Please login again.", {
          variant: "error",
          autoHideDuration: 5000,
        });
        return;
      }

      console.log("Current user for role operation:", {
        empId: user.empId,
        username: user.username || "N/A",
        role: user.role || "N/A",
      });

      let response;
      let isUpdate = !!initialData;

      if (isUpdate) {
        // Update existing role - preserve original creator, update the updater
        const updateData = {
          roleId: formData.roleId,
          roleName: formData.roleName.trim(),
          description: formData.description || "",
          enabled: formData.enabled,
          createdBy: formData.createdBy, // Keep original creator ID
          createdAt: formData.createdAt, // Keep original creation date
          updatedBy: user.empId, // Set current user as updater
          updatedAt: new Date().toISOString(),
        };

        console.log("Updating role:", updateData);
        response = await updateRole(updateData).unwrap();
      } else {
        // Create new role - set current user as both creator and updater
        const createData = {
          roleId: 0, // API expects 0 for new roles
          roleName: formData.roleName.trim(),
          description: formData.description || "",
          enabled: formData.enabled,
          createdBy: user.empId, // Set current user as creator
          createdAt: new Date().toISOString(),
          updatedBy: user.empId, // Set current user as updater
          updatedAt: new Date().toISOString(),
        };

        console.log("Creating role:", createData);
        response = await saveRole(createData).unwrap();
      }

      console.log("API Response:", response);

      if (response && response.success) {
        setSuccessMessage(
          isUpdate ? "Role updated successfully!" : "Role created successfully!"
        );

        // Reset form for new role creation
        if (!isUpdate) {
          setFormData({
            roleId: 0,
            roleName: "",
            description: "",
            enabled: "Y",
            createdBy: 0,
            createdAt: new Date().toISOString(),
            updatedBy: 0,
            updatedAt: new Date().toISOString(),
          });
        }

        // Refresh role list
        refetchRoleList();

        // Notify parent component
        if (onRoleSaved) {
          onRoleSaved(response.result);
        }

        enqueueSnackbar(response.message || "Role saved successfully", {
          variant: "success",
          autoHideDuration: 5000,
        });
      } else {
        const errorMsg = response?.message || "Failed to save role";
        setErrors({ submit: errorMsg });
        enqueueSnackbar(errorMsg, {
          variant: "error",
          autoHideDuration: 5000,
        });
      }
    } catch (error) {
      console.error("Error saving role:", error);
      console.error("Error response:", error.data);
      console.error("Error status:", error.status);

      let errorMessage = "Error saving role. Please try again.";

      if (error.status === 400) {
        errorMessage =
          error.data?.message ||
          "Validation error. Please check your input.";
      } else if (error.status === 401) {
        errorMessage = "Unauthorized. Please check your authentication.";
      } else if (error.status === 409) {
        errorMessage = "Role name already exists.";
      } else if (error.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }

      setErrors({ submit: errorMessage });
      enqueueSnackbar(errorMessage, {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setIsRoleSaveLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      // Reset form
      setFormData({
        roleId: 0,
        roleName: "",
        description: "",
        enabled: "Y",
        createdBy: 0,
        createdAt: new Date().toISOString(),
        updatedBy: 0,
        updatedAt: new Date().toISOString(),
      });
      setErrors({});
      setSuccessMessage("");
    }
  };

  useEffect(() => {
    if (initialData) {
      console.log("Populating form with initial data:", initialData);

      const populatedFormData = {
        roleId: initialData.roleId || 0,
        roleName: initialData.roleName || "",
        description: initialData.description || "",
        enabled: initialData.enabled || "Y",
        createdBy: initialData.createdBy || 0, // Preserve original creator
        createdAt: initialData.createdAt || new Date().toISOString(),
        updatedBy: initialData.updatedBy || 0,
        updatedAt: initialData.updatedAt || new Date().toISOString(),
      };

      console.log("Setting form data for edit:", populatedFormData);
      console.log(
        "Original creator ID preserved:",
        populatedFormData.createdBy
      );

      setFormData(populatedFormData);
    } else {
      console.log("Initializing form for new role creation");
      // Reset form for new role
      const newFormData = {
        roleId: 0,
        roleName: "",
        description: "",
        enabled: "Y",
        createdBy: 0, // Will be set to current user on save
        createdAt: new Date().toISOString(),
        updatedBy: 0, // Will be set to current user on save
        updatedAt: new Date().toISOString(),
      };

      console.log("Setting form data for new role:", newFormData);
      setFormData(newFormData);
    }
  }, [initialData]);

  return (
    <Box sx={{ width: "100%", p: 2 }}>
      <Card
        sx={{
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #228B22 0%, #32CD32 100%)",
            p: 3,
            color: "white",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Security sx={{ fontSize: "2rem" }} />
            <Box>
              <Typography
                variant='h5'
                color='#ffffff'
                sx={{ fontWeight: 700, mb: 0.5 }}
              >
                {initialData ? "Edit Role" : "Add New Role"}
              </Typography>
              {/* <Typography variant="body2" sx={{ opacity: 0.9 }}>
                {initialData ? 'Update role information and permissions' : 'Create a new role with specific permissions'}
              </Typography> */}
            </Box>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {/* Success Message */}
          {successMessage && (
            <Alert severity='success' sx={{ mb: 3, borderRadius: "12px" }}>
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {errors.submit && (
            <Alert severity='error' sx={{ mb: 3, borderRadius: "12px" }}>
              {errors.submit}
            </Alert>
          )}

          {/* Form */}
          <Box component='form' onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Role Name *'
                  value={formData.roleName}
                  name='roleName'
                  placeholder='Enter role name'
                  onChange={handleChange}
                  required
                  error={!!errors.roleName}
                  helperText={errors.roleName}
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

              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label='Description'
                  value={formData.description}
                  name='description'
                  placeholder='Enter role description'
                  onChange={handleChange}
                  multiline
                  rows={1}
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

              <Grid item xs={12} md={4}>
                <FormControl fullWidth error={!!errors.enabled}>
                  <InputLabel>Status *</InputLabel>
                  <Select
                    value={formData.enabled}
                    name='enabled'
                    onChange={handleChange}
                    label='Status *'
                    sx={{
                      borderRadius: "12px",
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#228B22",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#228B22",
                        borderWidth: "2px",
                      },
                    }}
                  >
                    <MenuItem value='Y'>Active</MenuItem>
                    <MenuItem value='N'>Inactive</MenuItem>
                  </Select>
                  {errors.enabled && (
                    <Typography
                      variant='caption'
                      color='error'
                      sx={{ mt: 0.5, ml: 1.5 }}
                    >
                      {errors.enabled}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 4,
              }}
            >
              <Button
                type='button'
                variant='outlined'
                onClick={handleCancel}
                startIcon={<Clear />}
                sx={{
                  borderColor: "#228B22",
                  color: "#228B22",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    borderColor: "#1B5E20",
                    bgcolor: "rgba(34, 139, 34, 0.04)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                variant='contained'
                disabled={isRoleSaveLoading}
                
                sx={{
                  bgcolor: "#228B22",
                  borderRadius: "12px",
                  px: 4,
                  py: 1.5,
                  "&:hover": {
                    bgcolor: "#1B5E20",
                  },
                  "&:disabled": {
                    bgcolor: "#9CA3AF",
                  },
                }}
              >
                {isRoleSaveLoading
                  ? "Saving..."
                  : initialData
                  ? "Update Role"
                  : "Save Role"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddRole;
