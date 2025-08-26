# Location API Fixes Summary

## Issues Identified and Fixed

### 1. **Database Schema Alignment**
- **Problem**: Frontend and backend models didn't match the actual database table structure
- **Database Table**: `locations` with columns like `labor_charges_enabled`, `labor_charge_type`, `labor_charges_cost`
- **Fix**: Updated all models to use the correct column names and field structure

#### Updated Field Names:
- `labourChargesEnabled` → `laborChargesEnabled` (matches `labor_charges_enabled`)
- `labourChargeType` → `laborChargeType` (matches `labor_charge_type`)
- `fixedLabourCost` → `laborChargesCost` (matches `labor_charges_cost`)
- Removed `labourVariableChargeType` and `labourVariableChargeAmount` (not in database)

#### Database Column Mapping:
```csharp
// Old (incorrect)
[Column("labourchargesenabled")]
public bool LabourChargesEnabled { get; set; }

// New (correct)
[Column("labor_charges_enabled")]
public bool LaborChargesEnabled { get; set; }
```

### 2. **Frontend Form Issues**

#### Problem:
- Customer Name field was editable instead of read-only
- Form was sending `CustomerName` to backend (which doesn't exist in the model)
- Customer name validation was unnecessary since it's read-only

#### Fixes Applied:
```javascript
// CustomerLocationForm.jsx
// Made Customer Name field read-only
<TextField
  fullWidth
  label="Customer Name"
  value={formData.customerName}
  InputProps={{
    readOnly: true,
  }}
  sx={{ 
    '& .MuiInputBase-root': {
      backgroundColor: '#f5f5f5',
      '&.Mui-focused': {
        backgroundColor: '#f5f5f5'
      }
    }
  }}
  helperText="Customer name is read-only and will be saved with the location"
/>

// Removed CustomerName from backend data
const backendData = {
  CustomerId: parseInt(formData.customerId) || 0,
  // ... other fields
  // Removed: CustomerName: formData.customerName,
};
```

### 3. **API Endpoint Mismatches**
- **Problem**: Frontend was calling wrong API endpoints that didn't match backend routes
- **Result**: 404 errors when trying to create/update locations
- **Fix**: Updated all API calls to use correct endpoints:
  - `POST /api/customerlocations/CreateLocation` (was: `POST /api/customerlocations`)
  - `PUT /api/customerlocations/UpdateLocation/{id}` (was: `PUT /api/customerlocations/{id}`)
  - `DELETE /api/customerlocations/DeleteLocation/{id}` (was: `DELETE /api/customerlocations/{id}`)

### 4. **Form Logic Issues**
- **Problem**: Form was incorrectly determining if it was editing an existing location or creating a new one
- **Fix**: Updated logic to check for `locationId` presence:
```javascript
// Check if we have a complete location object with locationId (editing existing)
const isEditingExisting = locationData && locationData.locationId;

if (isEditingExisting) {
  setIsEditing(true);
  // Load existing data
} else {
  setIsEditing(false);
  // Initialize new location form
}
```

### 5. **UI/UX Improvements**
- **Problem**: Form used radio buttons instead of dropdowns as shown in mockup
- **Fix**: Updated to use Material-UI Select components with proper labels:
```javascript
// Old: Radio buttons
<RadioGroup row value={formData.dispatchChargeType}>
  <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
  <FormControlLabel value="Variable" control={<Radio />} label="Variable" />
</RadioGroup>

// New: Dropdown with proper label
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
  <Typography variant="body1" fontWeight="medium">
    Loader cost:
  </Typography>
  <FormControl size="small" sx={{ minWidth: 120 }}>
    <Select value={formData.dispatchChargeType}>
      <MenuItem value="Fixed">Fixed</MenuItem>
      <MenuItem value="Variable">Variable</MenuItem>
    </Select>
  </FormControl>
</Box>
```

## Files Updated

### Backend:
- `Biomass.Server/Models/Customer/CustomerLocation.cs` - Updated field names and column mappings
- `Biomass.Server/Data/ApplicationDbContext.cs` - Updated entity configuration
- `Biomass.Server/Services/CustomerLocationService.cs` - Updated service methods

### Frontend:
- `biomass.client/src/components/CustomerLocationForm.jsx` - Updated form state and UI
- `biomass.client/src/components/CustomerLocations.jsx` - Updated field mappings
- `test_location_api.js` - Updated test data structure

## Current Status

All issues have been resolved and the Location API should now work correctly:
1. ✅ Database schema alignment completed
2. ✅ API endpoints corrected
3. ✅ Form logic fixed
4. ✅ UI updated to match mockup design
5. ✅ Customer ID properly saved (not customer name)
6. ✅ All field names match database structure

The system now properly handles:
- Creating new locations with correct customer ID
- Editing existing locations
- Proper field validation and data mapping
- UI that matches the provided mockup design
