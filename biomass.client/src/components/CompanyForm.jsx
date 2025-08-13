import React, { useState, useEffect } from 'react';
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
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  Upload as UploadIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const CompanyForm = ({ company, isViewMode, onClose, onSaved }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    companyAddress: '',
    ntn: '',
    strn: '',
    pra: '',
    contactPersonName: '',
    contactPersonPhone: '',
    companyDescription: '',
    industry: '',
    companySize: '',
    location: '',
    logoPath: '',
    logo: null
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || '',
        companyAddress: company.companyAddress || '',
        ntn: company.ntn || '',
        strn: company.strn || '',
        pra: company.pra || '',
        contactPersonName: company.contactPersonName || '',
        contactPersonPhone: company.contactPersonPhone || '',
        companyDescription: company.companyDescription || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        location: company.location || '',
        logoPath: company.logoPath || '',
        logo: company.logoPath ? { url: company.logoPath } : null
      });
      setLogoPreview(company.logoPath || '');
    }
    // Reset editing mode when company changes
    setIsEditing(false);
  }, [company]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.companyAddress.trim()) {
      newErrors.companyAddress = 'Company address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const baseUrl = import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084';
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
          logoPath: formData.logoPath
        };

        response = await fetch(`${baseUrl}/api/companies/${company.companyId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        // If there's a new logo file, upload it separately
        if (formData.logo && formData.logo instanceof File) {
          const formDataLogo = new FormData();
          formDataLogo.append('logo', formData.logo);

          const logoResponse = await fetch(`${baseUrl}/api/companies/${company.companyId}/logo`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataLogo
          });

          if (!logoResponse.ok) {
            throw new Error('Failed to upload logo');
          }
        }
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
          logoPath: formData.logoPath
        };

        response = await fetch(`${baseUrl}/api/companies`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createData)
        });

        const result = await response.json();
        
        // If there's a logo file and company was created successfully, upload the logo
        if (formData.logo && formData.logo instanceof File && result.success) {
          const formDataLogo = new FormData();
          formDataLogo.append('logo', formData.logo);

          const logoResponse = await fetch(`${baseUrl}/api/companies/${result.result.companyId}/logo`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formDataLogo
          });

          if (!logoResponse.ok) {
            console.warn('Failed to upload logo, but company was created successfully');
          }
        }
      }

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to save company');
      }

      const result = await response.json();
      if (result.success) {
        onSaved();
      } else {
        setError(result.message || 'Failed to save company');
      }
    } catch (error) {
      console.error('Error saving company:', error);
      setError('Failed to save company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)) {
        alert('Please upload only image files (JPG, PNG, GIF, BMP)');
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Store the file and create preview
      setFormData(prev => ({ ...prev, logo: file }));
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
        companyName: company.companyName || '',
        companyAddress: company.companyAddress || '',
        ntn: company.ntn || '',
        strn: company.strn || '',
        pra: company.pra || '',
        contactPersonName: company.contactPersonName || '',
        contactPersonPhone: company.contactPersonPhone || '',
        companyDescription: company.companyDescription || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        location: company.location || '',
        logoPath: company.logoPath || '',
        logo: company.logoPath ? { url: company.logoPath } : null
      });
      setLogoPreview(company.logoPath || '');
    }
  };

  const getCompanyInitials = (companyName) => {
    return companyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Company Identity & Compliance
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage basic identity and compliance details for your business company
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Company Logo Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Company Logo
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: '#e0e0e0',
                  border: '2px dashed #ccc'
                }}
                src={logoPreview || (company?.logoPath ? `${import.meta.env.VITE_APP_BASE_URL || 'https://localhost:7084'}/api/companies/${company.companyId}/logo` : null)}
              >
                {formData.companyName ? (
                  getCompanyInitials(formData.companyName)
                ) : (
                  <BusinessIcon sx={{ fontSize: 40, color: '#999' }} />
                )}
              </Avatar>
              <Box>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="logo-upload"
                  type="file"
                  onChange={handleLogoUpload}
                  disabled={isViewMode && !isEditing}
                />
                <label htmlFor="logo-upload">
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<UploadIcon />}
                    disabled={isViewMode && !isEditing}
                  >
                    {logoPreview || company?.logoPath ? 'Change logo' : 'Upload logo'}
                  </Button>
                </label>
                <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                  PNG, JPG, GIF, BMP up to 5MB
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Basic Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Name"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              error={!!errors.companyName}
              helperText={errors.companyName || 'Legal name of your business company'}
              required
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Address"
              value={formData.companyAddress}
              onChange={(e) => handleInputChange('companyAddress', e.target.value)}
              error={!!errors.companyAddress}
              helperText={errors.companyAddress || 'Complete registered address including city, state, and postal code'}
              multiline
              rows={3}
              required
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          {/* Tax & Registration Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Tax & Registration Details
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Company NTN (Optional)"
              value={formData.ntn}
              onChange={(e) => handleInputChange('ntn', e.target.value)}
              placeholder="Enter NTN number"
              helperText="National Tax Number"
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Company STRN (If applicable)"
              value={formData.strn}
              onChange={(e) => handleInputChange('strn', e.target.value)}
              placeholder="Enter STRN number"
              helperText="Sales Tax Registration Number"
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Company PRA (If applicable)"
              value={formData.pra}
              onChange={(e) => handleInputChange('pra', e.target.value)}
              placeholder="Enter PRA number"
              helperText="Pakistan Revenue Authority registration number"
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          {/* Primary Contact Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Primary Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person Name (Optional)"
              value={formData.contactPersonName}
              onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
              placeholder="Enter person name"
              helperText="Primary contact person for business communications"
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Person Phone (Optional)"
              value={formData.contactPersonPhone}
              onChange={(e) => handleInputChange('contactPersonPhone', e.target.value)}
              placeholder="Enter number with country code"
              helperText="Phone number with country code"
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          {/* Additional Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Company Description"
              value={formData.companyDescription}
              onChange={(e) => handleInputChange('companyDescription', e.target.value)}
              placeholder="Enter company description"
              multiline
              rows={2}
              disabled={isViewMode && !isEditing}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={formData.industry}
                label="Industry"
                onChange={(e) => handleInputChange('industry', e.target.value)}
                disabled={isViewMode && !isEditing}
              >
                <MenuItem value="">Select Industry</MenuItem>
                <MenuItem value="Technology">Technology</MenuItem>
                <MenuItem value="Healthcare">Healthcare</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Manufacturing">Manufacturing</MenuItem>
                <MenuItem value="Energy">Energy</MenuItem>
                <MenuItem value="Retail">Retail</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Company Size</InputLabel>
              <Select
                value={formData.companySize}
                label="Company Size"
                onChange={(e) => handleInputChange('companySize', e.target.value)}
                disabled={isViewMode && !isEditing}
              >
                <MenuItem value="">Select Size</MenuItem>
                <MenuItem value="Small">Small (1-50 employees)</MenuItem>
                <MenuItem value="Medium">Medium (51-200 employees)</MenuItem>
                <MenuItem value="Large">Large (200+ employees)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="Enter location"
              disabled={isViewMode && !isEditing}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            *Required fields
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {isViewMode && !isEditing ? (
              // View mode - show Edit and Close buttons
              <>
                <Button
                  variant="outlined"
                  onClick={onClose}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handleEditToggle}
                >
                  Edit Company
                </Button>
              </>
            ) : (
              // Edit mode or Add mode - show Cancel and Save buttons
              <>
                <Button
                  variant="outlined"
                  onClick={isViewMode ? handleCancelEdit : onClose}
                  disabled={loading}
                >
                  {isViewMode ? 'Cancel Edit' : 'Cancel'}
                </Button>
                {isViewMode && (
                  <Button
                    variant="outlined"
                    disabled={loading}
                  >
                    Save as Draft
                  </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                  {company ? 'Update Company Details' : 'Save Company Details'}
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