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
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  Business as BusinessIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

const CompanyForm = ({ company, isViewMode, onClose, onSaved }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyAddress: "",
    ntn: "",
    strn: "",
    pra: "",
    contactPersonName: "",
    contactPersonPhone: "",
    companyDescription: "",
    industry: "",
    companySize: "",
    location: "",
    logoPath: "",
    logo: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        companyAddress: company.companyAddress || "",
        ntn: company.ntn || "",
        strn: company.strn || "",
        pra: company.pra || "",
        contactPersonName: company.contactPersonName || "",
        contactPersonPhone: company.contactPersonPhone || "",
        companyDescription: company.companyDescription || "",
        industry: company.industry || "",
        companySize: company.companySize || "",
        location: company.location || "",
        logoPath: company.logoPath || "",
        logo: company.logoPath ? { url: company.logoPath } : null,
      });
      setLogoPreview(company.logoPath || "");
    }
    // Reset editing mode when company changes
    setIsEditing(false);
  }, [company]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }

    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = "Company address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const iconUrl =
        import.meta.env.VITE_LIVE_APP_BASEURL || "https://localhost:7084/api";
      let response;

      if (company) {
        // Update existing company
        const updateData = {
          companyId: company.companyId,
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          ntn: formData.ntn,
          strn: formData.strn,
          pra: formData.pra,
          contactPersonName: formData.contactPersonName,
          contactPersonPhone: formData.contactPersonPhone,
          companyDescription: formData.companyDescription,
          industry: formData.industry,
          companySize: formData.companySize,
          location: formData.location,
          logoPath: formData.logoPath,
        };

        response = await fetch(
          `${iconUrl}/Companies/UpdateCompany?id=${company.companyId}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
          }
        );

        // Logo upload functionality is currently disabled in the backend
        // TODO: Implement logo upload when backend endpoint is available
      } else {
        // Create new company
        const createData = {
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          ntn: formData.ntn,
          strn: formData.strn,
          pra: formData.pra,
          contactPersonName: formData.contactPersonName,
          contactPersonPhone: formData.contactPersonPhone,
          companyDescription: formData.companyDescription,
          industry: formData.industry,
          companySize: formData.companySize,
          location: formData.location,
          logoPath: formData.logoPath,
        };

        response = await fetch(`${iconUrl}/Companies/CreateCompany`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(createData),
        });

        const result = await response.json();

        // Logo upload functionality is currently disabled in the backend
        // TODO: Implement logo upload when backend endpoint is available
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to save company");
      }

      // Get the result from the response
      let finalResult;
      if (company) {
        // For update operations, we need to get the result from the response
        finalResult = await response.json();
      } else {
        // For create operations, we already have the result
        finalResult = result;
      }

      if (finalResult.success) {
        onSaved();
      } else {
        setError(finalResult.message || "Failed to save company");
      }
    } catch (error) {
      console.error("Error saving company:", error);
      setError("Failed to save company. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (
        ![
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/bmp",
        ].includes(file.type)
      ) {
        alert("Please upload only image files (JPG, PNG, GIF, BMP)");
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      // Store the file and create preview
      setFormData((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        companyAddress: company.companyAddress || "",
        ntn: company.ntn || "",
        strn: company.strn || "",
        pra: company.pra || "",
        contactPersonName: company.contactPersonName || "",
        contactPersonPhone: company.contactPersonPhone || "",
        companyDescription: company.companyDescription || "",
        industry: company.industry || "",
        companySize: company.companySize || "",
        location: company.location || "",
        logoPath: company.logoPath || "",
        logo: company.logoPath ? { url: company.logoPath } : null,
      });
      setLogoPreview(company.logoPath || "");
    }
  };

  const getCompanyInitials = (companyName) => {
    return companyName
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
          maxHeight: "90vh",
        },
      }}
    >
      {/* Enhanced Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #228B22 0%, #006400 100%)",
          color: "white",
          p: 3,
        }}
      >
        <DialogTitle sx={{ p: 0, color: "white" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant='h4' sx={{ fontWeight: 700, mb: 1 }}>
                {company
                  ? isViewMode
                    ? "Company Details"
                    : "Edit Company"
                  : "Add New Company"}
              </Typography>
              <Typography variant='h6' sx={{ opacity: 0.9, fontWeight: 300 }}>
                {company
                  ? "Update company information and compliance details"
                  : "Create a new company profile with complete details"}
              </Typography>
            </Box>
            <IconButton
              onClick={onClose}
              size='large'
              sx={{
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {error && (
          <Box sx={{ p: 3, pb: 0 }}>
            <Alert severity='error' sx={{ borderRadius: 2 }}>
              {error}
            </Alert>
          </Box>
        )}

        <Box sx={{ p: 3 }}>
          <Grid container spacing={4}>
            {/* Company Logo Section */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <BusinessIcon sx={{ color: "#228B22" }} />
                    Company Logo & Branding
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Avatar
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: "#e0e0e0",
                        border: "3px dashed #ccc",
                        fontSize: "2rem",
                        fontWeight: 600,
                      }}
                      src={
                        logoPreview ||
                        (company?.logoPath
                          ? `${
                              import.meta.env.VITE_LIVE_APP_BASEURL ||
                              "https://localhost:7084/api"
                            }/Companies/${company.companyId}/logo`
                          : null)
                      }
                    >
                      {formData.companyName ? (
                        getCompanyInitials(formData.companyName)
                      ) : (
                        <BusinessIcon sx={{ fontSize: 50, color: "#999" }} />
                      )}
                    </Avatar>
                    <Box>
                      <input
                        accept='image/*'
                        style={{ display: "none" }}
                        id='logo-upload'
                        type='file'
                        onChange={handleLogoUpload}
                        disabled={isViewMode && !isEditing}
                      />
                      <label htmlFor='logo-upload'>
                        <Button
                          variant='contained'
                          component='span'
                          startIcon={<UploadIcon />}
                          disabled={isViewMode && !isEditing}
                          sx={{
                            borderRadius: 2,
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            bgcolor: "#228B22",
                            "&:hover": {
                              bgcolor: "#006400",
                            },
                          }}
                        >
                          {logoPreview || company?.logoPath
                            ? "Change Logo"
                            : "Upload Logo"}
                        </Button>
                      </label>
                      <Typography
                        variant='caption'
                        display='block'
                        sx={{ mt: 2, color: "text.secondary" }}
                      >
                        PNG, JPG, GIF, BMP up to 5MB
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <BusinessIcon sx={{ color: "#228B22" }} />
                    Basic Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Company Name'
                        value={formData.companyName}
                        onChange={(e) =>
                          handleInputChange("companyName", e.target.value)
                        }
                        error={!!errors.companyName}
                        helperText={
                          errors.companyName ||
                          "Legal name of your business company"
                        }
                        required
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Company Address'
                        value={formData.companyAddress}
                        onChange={(e) =>
                          handleInputChange("companyAddress", e.target.value)
                        }
                        error={!!errors.companyAddress}
                        helperText={
                          errors.companyAddress ||
                          "Complete registered address including city, state, and postal code"
                        }
                        multiline
                        rows={3}
                        required
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Tax & Registration Details Section */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <WorkIcon sx={{ color: "#228B22" }} />
                    Tax & Registration Details
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label='Company NTN (Optional)'
                        value={formData.ntn}
                        onChange={(e) =>
                          handleInputChange("ntn", e.target.value)
                        }
                        placeholder='Enter NTN number'
                        helperText='National Tax Number'
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label='Company STRN (If applicable)'
                        value={formData.strn}
                        onChange={(e) =>
                          handleInputChange("strn", e.target.value)
                        }
                        placeholder='Enter STRN number'
                        helperText='Sales Tax Registration Number'
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label='Company PRA (If applicable)'
                        value={formData.pra}
                        onChange={(e) =>
                          handleInputChange("pra", e.target.value)
                        }
                        placeholder='Enter PRA number'
                        helperText='Pakistan Revenue Authority registration number'
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Primary Contact Information Section */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PhoneIcon sx={{ color: "#228B22" }} />
                    Primary Contact Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='Contact Person Name (Optional)'
                        value={formData.contactPersonName}
                        onChange={(e) =>
                          handleInputChange("contactPersonName", e.target.value)
                        }
                        placeholder='Enter person name'
                        helperText='Primary contact person for business communications'
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label='Contact Person Phone (Optional)'
                        value={formData.contactPersonPhone}
                        onChange={(e) =>
                          handleInputChange(
                            "contactPersonPhone",
                            e.target.value
                          )
                        }
                        placeholder='Enter number with country code'
                        helperText='Phone number with country code'
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Additional Information Section */}
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant='h6'
                    gutterBottom
                    sx={{
                      fontWeight: 600,
                      mb: 3,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <PeopleIcon sx={{ color: "#228B22" }} />
                    Additional Information
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label='Company Description'
                        value={formData.companyDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "companyDescription",
                            e.target.value
                          )
                        }
                        placeholder='Enter company description'
                        multiline
                        rows={3}
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Industry</InputLabel>
                        <Select
                          value={formData.industry}
                          label='Industry'
                          onChange={(e) =>
                            handleInputChange("industry", e.target.value)
                          }
                          disabled={isViewMode && !isEditing}
                          sx={{
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#228B22",
                            },
                          }}
                        >
                          <MenuItem value=''>Select Industry</MenuItem>
                          <MenuItem value='Technology'>Technology</MenuItem>
                          <MenuItem value='Healthcare'>Healthcare</MenuItem>
                          <MenuItem value='Finance'>Finance</MenuItem>
                          <MenuItem value='Manufacturing'>
                            Manufacturing
                          </MenuItem>
                          <MenuItem value='Energy'>Energy</MenuItem>
                          <MenuItem value='Retail'>Retail</MenuItem>
                          <MenuItem value='Education'>Education</MenuItem>
                          <MenuItem value='Other'>Other</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <FormControl fullWidth>
                        <InputLabel>Company Size</InputLabel>
                        <Select
                          value={formData.companySize}
                          label='Company Size'
                          onChange={(e) =>
                            handleInputChange("companySize", e.target.value)
                          }
                          disabled={isViewMode && !isEditing}
                          sx={{
                            borderRadius: 2,
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#228B22",
                            },
                          }}
                        >
                          <MenuItem value=''>Select Size</MenuItem>
                          <MenuItem value='Small'>
                            Small (1-50 employees)
                          </MenuItem>
                          <MenuItem value='Medium'>
                            Medium (51-200 employees)
                          </MenuItem>
                          <MenuItem value='Large'>
                            Large (200+ employees)
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label='Location'
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        placeholder='Enter location'
                        disabled={isViewMode && !isEditing}
                        variant='outlined'
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
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      {/* Enhanced Actions */}
      <DialogActions
        sx={{ p: 3, background: "#f8fafc", borderTop: "1px solid #e0e0e0" }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant='body2' color='text.secondary'>
              *Required fields
            </Typography>
            {company && (
              <Chip
                label={isViewMode ? "View Mode" : "Edit Mode"}
                color={isViewMode ? "default" : "primary"}
                size='small'
                variant='outlined'
                sx={{
                  borderColor: "#228B22",
                  color: "#228B22",
                }}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {isViewMode && !isEditing ? (
              // View mode - show Edit and Close buttons
              <>
                <Button
                  variant='outlined'
                  onClick={onClose}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: "#228B22",
                    color: "#228B22",
                    "&:hover": {
                      borderColor: "#006400",
                      color: "#006400",
                      bgcolor: "rgba(34, 139, 34, 0.04)",
                    },
                  }}
                >
                  Close
                </Button>
                <Button
                  variant='contained'
                  onClick={handleEditToggle}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    bgcolor: "#228B22",
                    "&:hover": {
                      bgcolor: "#006400",
                    },
                  }}
                >
                  Edit Company
                </Button>
              </>
            ) : (
              // Edit mode or Add mode - show Cancel and Save buttons
              <>
                <Button
                  variant='outlined'
                  onClick={isViewMode ? handleCancelEdit : onClose}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    borderColor: "#228B22",
                    color: "#228B22",
                    "&:hover": {
                      borderColor: "#006400",
                      color: "#006400",
                      bgcolor: "rgba(34, 139, 34, 0.04)",
                    },
                  }}
                >
                  {isViewMode ? "Cancel Edit" : "Cancel"}
                </Button>
                {isViewMode && (
                  <Button
                    variant='outlined'
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      px: 4,
                      py: 1.5,
                      fontWeight: 600,
                      borderColor: "#228B22",
                      color: "#228B22",
                      "&:hover": {
                        borderColor: "#006400",
                        color: "#006400",
                        bgcolor: "rgba(34, 139, 34, 0.04)",
                      },
                    }}
                  >
                    Save as Draft
                  </Button>
                )}
                <Button
                  variant='contained'
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                    fontWeight: 600,
                    bgcolor: "#228B22",
                    "&:hover": {
                      bgcolor: "#006400",
                      transform: "translateY(-1px)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {company ? "Update Company Details" : "Save Company Details"}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CompanyForm;
