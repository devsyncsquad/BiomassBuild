import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  IconButton
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import './VendorRegistration.css';

const VendorRegistration = ({ open, onClose, vendor, isEditMode, onSave }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    vendorAddress: '',
    primaryPhone: '',
    phoneNumber2: '',
    phoneNumber3: '',
    category: '',
    cnicFront: null,
    cnicBack: null
  });
  const [errors, setErrors] = useState({});
  const [cnicFrontPreview, setCnicFrontPreview] = useState('');
  const [cnicBackPreview, setCnicBackPreview] = useState('');

  const categories = [
    'Technology',
    'Manufacturing',
    'Design & Marketing',
    'Logistics',
    'Raw Materials',
    'Research & Development',
    'Services',
    'Construction',
    'Healthcare',
    'Education'
  ];

  useEffect(() => {
    if (vendor && open) {
      setFormData({
        vendorName: vendor.name || '',
        vendorAddress: vendor.address || '',
        primaryPhone: vendor.primaryPhone || '',
        phoneNumber2: vendor.phoneNumber2 || '',
        phoneNumber3: vendor.phoneNumber3 || '',
        category: vendor.category || '',
        cnicFront: vendor.cnicFront || null,
        cnicBack: vendor.cnicBack || null
      });
      setCnicFrontPreview(vendor.cnicFrontPreview || '');
      setCnicBackPreview(vendor.cnicBackPreview || '');
    } else if (!vendor && open) {
      // Reset form for new vendor
      setFormData({
        vendorName: '',
        vendorAddress: '',
        primaryPhone: '',
        phoneNumber2: '',
        phoneNumber3: '',
        category: '',
        cnicFront: null,
        cnicBack: null
      });
      setCnicFrontPreview('');
      setCnicBackPreview('');
    }
  }, [vendor, open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vendorName.trim()) {
      newErrors.vendorName = 'Vendor name is required';
    }

    if (!formData.vendorAddress.trim()) {
      newErrors.vendorAddress = 'Vendor address is required';
    }

    if (!formData.primaryPhone.trim()) {
      newErrors.primaryPhone = 'Primary phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.primaryPhone)) {
      newErrors.primaryPhone = 'Please enter a valid phone number';
    }

    if (formData.phoneNumber2 && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phoneNumber2)) {
      newErrors.phoneNumber2 = 'Please enter a valid phone number';
    }

    if (formData.phoneNumber3 && !/^[\+]?[0-9\s\-\(\)]{10,}$/.test(formData.phoneNumber3)) {
      newErrors.phoneNumber3 = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleFileUpload = (field, file) => {
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        alert('Please upload only PNG or JPG files');
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (field === 'cnicFront') {
          setCnicFrontPreview(e.target.result);
        } else if (field === 'cnicBack') {
          setCnicBackPreview(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (validateForm()) {
      const vendorData = {
        id: vendor?.id || Date.now(),
        name: formData.vendorName,
        address: formData.vendorAddress,
        primaryPhone: formData.primaryPhone,
        phoneNumber2: formData.phoneNumber2,
        phoneNumber3: formData.phoneNumber3,
        category: formData.category,
        cnicFront: formData.cnicFront,
        cnicBack: formData.cnicBack,
        cnicFrontPreview,
        cnicBackPreview,
        status: vendor?.status || 'pending',
        rating: vendor?.rating || 0,
        projects: vendor?.projects || 0,
        lastActive: vendor?.lastActive || 'Just now',
        color: vendor?.color || '#757575'
      };
      onSave(vendorData);
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const isReadOnly = !isEditMode && vendor;

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          {isEditMode ? 'Edit Vendor' : vendor ? 'Vendor Details' : 'Vendor Registration'}
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          {isEditMode ? 'Edit Vendor Information' : vendor ? 'Vendor Information' : 'Register and manage supplier information for raw materials and services.'}
        </Typography>

        <Grid container spacing={3}>
          {/* Basic Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#6366F1' }}>
              Basic Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Vendor Name *"
              value={formData.vendorName}
              onChange={(e) => handleInputChange('vendorName', e.target.value)}
              error={!!errors.vendorName}
              helperText={errors.vendorName || 'Required field'}
              disabled={isReadOnly}
              InputProps={{
                readOnly: isReadOnly
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth disabled={isReadOnly}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                label="Category"
                readOnly={isReadOnly}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Vendor Address *"
              value={formData.vendorAddress}
              onChange={(e) => handleInputChange('vendorAddress', e.target.value)}
              error={!!errors.vendorAddress}
              helperText={errors.vendorAddress || 'Required field'}
              multiline
              rows={3}
              disabled={isReadOnly}
              InputProps={{
                readOnly: isReadOnly
              }}
            />
          </Grid>

          {/* Contact Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#6366F1' }}>
              Contact Information
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Primary Phone Number *"
              value={formData.primaryPhone}
              onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
              error={!!errors.primaryPhone}
              helperText={errors.primaryPhone || 'Required field'}
              disabled={isReadOnly}
              InputProps={{
                readOnly: isReadOnly
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Phone Number 2 (Optional)"
              value={formData.phoneNumber2}
              onChange={(e) => handleInputChange('phoneNumber2', e.target.value)}
              error={!!errors.phoneNumber2}
              helperText={errors.phoneNumber2 || 'Optional field'}
              disabled={isReadOnly}
              InputProps={{
                readOnly: isReadOnly
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Phone Number 3 (Optional)"
              value={formData.phoneNumber3}
              onChange={(e) => handleInputChange('phoneNumber3', e.target.value)}
              error={!!errors.phoneNumber3}
              helperText={errors.phoneNumber3 || 'Optional field'}
              disabled={isReadOnly}
              InputProps={{
                readOnly: isReadOnly
              }}
            />
          </Grid>

          {/* CNIC Documentation Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#2563eb' }}>
              CNIC Documentation
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload vendor CNIC images for verification purposes (Optional)
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                border: '2px dashed #ddd',
                borderRadius: 2,
                textAlign: 'center',
                cursor: isReadOnly ? 'default' : 'pointer',
                '&:hover': isReadOnly ? {} : { borderColor: '#2563eb' }
              }}
              onClick={() => !isReadOnly && document.getElementById('cnicFront').click()}
            >
              {cnicFrontPreview ? (
                <Box>
                  <img 
                    src={cnicFrontPreview} 
                    alt="CNIC Front" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 8 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    CNIC Front Image
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    CNIC Front Image (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PNG, JPG up to 5MB
                  </Typography>
                </Box>
              )}
              <input
                id="cnicFront"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload('cnicFront', e.target.files[0])}
                disabled={isReadOnly}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper 
              sx={{ 
                p: 2, 
                border: '2px dashed #ddd',
                borderRadius: 2,
                textAlign: 'center',
                cursor: isReadOnly ? 'default' : 'pointer',
                '&:hover': isReadOnly ? {} : { borderColor: '#2563eb' }
              }}
              onClick={() => !isReadOnly && document.getElementById('cnicBack').click()}
            >
              {cnicBackPreview ? (
                <Box>
                  <img 
                    src={cnicBackPreview} 
                    alt="CNIC Back" 
                    style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: 8 }}
                  />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    CNIC Back Image
                  </Typography>
                </Box>
              ) : (
                <Box>
                  <CloudUploadIcon sx={{ fontSize: 48, color: '#999', mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 'bold', mb: 1 }}>
                    CNIC Back Image (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    PNG, JPG up to 5MB
                  </Typography>
                </Box>
              )}
              <input
                id="cnicBack"
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload('cnicBack', e.target.files[0])}
                disabled={isReadOnly}
              />
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, justifyContent: 'space-between' }}>
        <Typography variant="body2" color="text.secondary">
          *Required fields
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          
          {!isReadOnly && (
            <Button variant="outlined" color="secondary">
              Save as Draft
            </Button>
          )}
          
          {isReadOnly ? (
            <Button 
              variant="contained"
              onClick={() => {
                // Switch to edit mode
                onClose();
                // This will trigger the edit mode in parent component
              }}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                }
              }}
            >
              Edit Vendor
            </Button>
          ) : (
            <Button 
              variant="contained"
              onClick={handleSave}
              sx={{
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                }
              }}
            >
              {isEditMode ? 'Update Vendor' : 'Register Vendor'}
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default VendorRegistration; 