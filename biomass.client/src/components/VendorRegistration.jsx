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
  IconButton,
  FormHelperText
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as CloudUploadIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import './VendorRegistration.css';


const VendorRegistration = ({ open, onClose, vendor, isEditMode, onSave, onEdit }) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    address: '',
    phone1: '',
    phone2: '',
    phone3: '',
    cnic: '',
    status: 'Active',
    vendorCnicFrontPic: null,
    vendorCnicBackPic: null
  });
  const [errors, setErrors] = useState({});
  const [cnicFrontPreview, setCnicFrontPreview] = useState('');
  const [cnicBackPreview, setCnicBackPreview] = useState('');

  // Available statuses
  const statuses = ['Active', 'Pending', 'Inactive'];

  useEffect(() => {
    if (vendor && open) {
      setFormData({
        vendorName: vendor.vendorName || '',
        address: vendor.address || '',
        phone1: vendor.phone1 || '',
        phone2: vendor.phone2 || '',
        phone3: vendor.phone3 || '',
        cnic: vendor.cnic || '',
        status: vendor.status || 'Active',
        vendorCnicFrontPic: vendor.vendorCnicFrontPic || null,
        vendorCnicBackPic: vendor.vendorCnicBackPic || null
      });
      setCnicFrontPreview(vendor.vendorCnicFrontPic || '');
      setCnicBackPreview(vendor.vendorCnicBackPic || '');
    } else if (!vendor && open) {
      // Reset form for new vendor
      setFormData({
        vendorName: '',
        address: '',
        phone1: '',
        phone2: '',
        phone3: '',
        cnic: '',
        status: 'Active',
        vendorCnicFrontPic: null,
        vendorCnicBackPic: null
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

    if (!formData.address.trim()) {
      newErrors.address = 'Vendor address is required';
    }

    if (!formData.phone1.trim()) {
      newErrors.phone1 = 'Primary phone number is required';
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(formData.phone1)) {
      newErrors.phone1 = 'Please enter a valid phone number (up to 20 characters)';
    }

    if (formData.phone2 && !/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(formData.phone2)) {
      newErrors.phone2 = 'Please enter a valid phone number (up to 20 characters)';
    }

    if (formData.phone3 && !/^[\+]?[0-9\s\-\(\)]{10,20}$/.test(formData.phone3)) {
      newErrors.phone3 = 'Please enter a valid phone number (up to 20 characters)';
    }

    if (!formData.cnic.trim()) {
      newErrors.cnic = 'CNIC is required';
    } else if (!/^\d{13}$|^\d{5}-\d{7}-\d$/.test(formData.cnic)) {
      newErrors.cnic = 'Please enter a valid CNIC (13 digits or format: 12345-1234567-1)';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required';
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
        setErrors(prev => ({
          ...prev,
          [field]: 'Please upload only PNG or JPG files'
        }));
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [field]: 'File size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: file
      }));

      // Clear any previous errors
      setErrors(prev => ({
        ...prev,
        [field]: ''
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

  const handleSave = async () => {
    if (validateForm()) {
      const vendorData = {
        vendorId: vendor?.vendorId,  // Include vendorId for updates
        vendorName: formData.vendorName,
        address: formData.address,
        phone1: formData.phone1,
        phone2: formData.phone2 || '',
        phone3: formData.phone3 || '',
        cnic: formData.cnic,
        status: formData.status,
        vendorCnicFrontPic: formData.vendorCnicFrontPic,
        vendorCnicBackPic: formData.vendorCnicBackPic
      };

      try {
        await onSave(vendorData);
      } catch (error) {
        setErrors(prev => ({
          ...prev,
          submit: error.message || 'An error occurred while saving'
        }));
      }
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
          minHeight: '80vh',
          backgroundColor: '#f8f9fa',
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          background: 'linear-gradient(135deg, #228B22 0%, #228B22 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2
        }}
      >
        <Box component="div" sx={{ display: 'flex', alignItems: 'center' }}>
          {isEditMode ? 'Edit Vendor' : vendor ? 'Vendor Details' : 'Vendor Registration'}
        </Box>
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
            <FormControl fullWidth disabled={isReadOnly} error={!!errors.status}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                label="Status"
                readOnly={isReadOnly}
              >
                {statuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
              {errors.status && <FormHelperText>{errors.status}</FormHelperText>}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="CNIC *"
              value={formData.cnic}
              onChange={(e) => handleInputChange('cnic', e.target.value)}
              error={!!errors.cnic}
              helperText={errors.cnic || 'Format: 12345-1234567-1 or 1234512345671'}
              disabled={isReadOnly}
              InputProps={{
                readOnly: isReadOnly
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address *"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address || 'Required field'}
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
              label="Phone Number 1 *"
              value={formData.phone1}
              onChange={(e) => handleInputChange('phone1', e.target.value)}
              error={!!errors.phone1}
              helperText={errors.phone1 || 'Required field'}
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
              value={formData.phone2}
              onChange={(e) => handleInputChange('phone2', e.target.value)}
              error={!!errors.phone2}
              helperText={errors.phone2 || 'Optional field'}
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
              value={formData.phone3}
              onChange={(e) => handleInputChange('phone3', e.target.value)}
              error={!!errors.phone3}
              helperText={errors.phone3 || 'Optional field'}
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
                onChange={(e) => handleFileUpload('vendorCnicFrontPic', e.target.files[0])}
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
                onChange={(e) => handleFileUpload('vendorCnicBackPic', e.target.files[0])}
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
              onClick={() => onEdit(vendor)}
              sx={{
                background: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1b6b1b 0%, #004d00 100%)',
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
                background: 'linear-gradient(135deg, #228B22 0%, #006400 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1b6b1b 0%, #004d00 100%)',
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