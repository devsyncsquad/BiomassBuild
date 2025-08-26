# Rate Popup Implementation

This document describes the implementation of the Rate popup with two tabs as requested in the task.

## Overview

The Rate popup system consists of two main components:
1. **RatePopup** - A comprehensive popup with two tabs
2. **MaterialRateForm** - An updated form component for individual rate management

## Components

### 1. RatePopup Component

**File:** `RatePopup.jsx`

A comprehensive dialog component with two tabs:

#### Features:
- **Add Rate Tab**: Form to enter new rates with a grid showing existing rates
- **Previous Rates Tab**: History of past rates with filtering capabilities
- **Inline Editing**: Edit button on each row to update values
- **Automatic Refresh**: Grid updates after add/edit operations
- **Responsive Design**: Works on all screen sizes

#### Props:
```jsx
<RatePopup
  open={boolean}                    // Controls popup visibility
  onClose={function}               // Called when popup is closed
  locationId={number}              // Current location ID
  locationName={string}            // Current location name
  customerId={number}              // Current customer ID
  customerName={string}            // Current customer name
  onSave={function}                // Called when a rate is saved
/>
```

#### Tab 1: Add Rate
- **Form Fields:**
  - Customer (dropdown)
  - Location (dropdown, filtered by customer)
  - Effective Date
  - Company Rate
  - Transporter Rate
  - Route
  - Material Type
  - Status (Active/Inactive)

- **Grid Columns:**
  - Rate ID (hidden, primary key)
  - Customer ID
  - Effective Date
  - Company Rate
  - Transporter Rate
  - Route
  - Material Type
  - Status
  - Created By
  - Created On
  - Location ID
  - Actions (Edit button)

#### Tab 2: Previous Rates
- **Filter Options:**
  - Customer
  - Location
  - Date Range (Start/End)
  - Status

- **Read-only Table:**
  - Same columns as Add Rate grid
  - No edit functionality
  - Advanced filtering capabilities

### 2. MaterialRateForm Component

**File:** `MaterialRateForm.jsx`

An updated form component for individual rate management.

#### Features:
- **Form Validation**: Required field validation
- **Customer-Location Relationship**: Dynamic location loading based on customer selection
- **Edit Mode**: Supports editing existing rates
- **Error Handling**: Comprehensive error messages
- **Responsive Design**: Mobile-friendly layout

## Backend Integration

### API Endpoints Used:
- `GET /api/customers/GetAllCustomers` - Load customers
- `GET /api/customerlocations/GetLocationsByCustomerId/{customerId}` - Load locations by customer
- `GET /api/materialrates/GetMaterialRatesByLocationId/{locationId}` - Load rates by location
- `GET /api/materialrates/GetAllMaterialRates` - Load all rates
- `POST /api/materialrates/CreateMaterialRate` - Create new rate
- `PUT /api/materialrates/UpdateMaterialRate/{id}` - Update existing rate

### Data Models:
The system uses the existing `MaterialRate` model with the following fields:
- `rateid` (primary key)
- `customerid`
- `location_id`
- `effectivedate`
- `company_rate`
- `transporter_rate`
- `route`
- `materialtype`
- `status`
- `createdby`
- `createdon`

## Usage Examples

### Basic Usage:
```jsx
import RatePopup from './components/RatePopup';

function MyComponent() {
  const [open, setOpen] = useState(false);
  
  return (
    <RatePopup
      open={open}
      onClose={() => setOpen(false)}
      locationId={1}
      locationName="Hujra Shah"
      customerId={1}
      customerName="Demo Customer"
      onSave={(rate) => console.log('Rate saved:', rate)}
    />
  );
}
```

### Integration with Customer Locations:
```jsx
// In your customer locations component
const handleRateClick = (location) => {
  setSelectedLocation(location);
  setRatePopupOpen(true);
};

<RatePopup
  open={ratePopupOpen}
  onClose={() => setRatePopupOpen(false)}
  locationId={selectedLocation.locationId}
  locationName={selectedLocation.locationName}
  customerId={selectedLocation.customerId}
  customerName={selectedLocation.customerName}
  onSave={handleRateSave}
/>
```

## Styling

### CSS File:
**File:** `RatePopup.css`

The component includes comprehensive styling with:
- Responsive design
- Material-UI theme integration
- Custom scrollbars
- Hover effects
- Loading and error states
- Mobile-friendly layouts

### Theme Colors:
- Primary: `#228B22` (Forest Green)
- Hover: `#006400` (Dark Green)
- Background: `#f8f9fa`
- Borders: `#e0e0e0`

## Features Implemented

### ✅ Acceptance Criteria Met:
1. **Two Tabs**: Add Rate & Previous Rates visible
2. **Form Validation**: Required fields validated before saving
3. **Data Insertion**: Saving inserts new row with correct column mapping
4. **Grid Updates**: Grid updates automatically after save/edit
5. **Edit Functionality**: Edit button allows modifying rate details
6. **Historical Data**: Previous Rates tab shows historical data with working filters
7. **Audit Fields**: Created by and created on captured automatically

### ✅ Additional Features:
- **Responsive Design**: Works on all screen sizes
- **Error Handling**: Comprehensive error messages and validation
- **Loading States**: Visual feedback during operations
- **Filter System**: Advanced filtering for historical data
- **Customer-Location Relationship**: Dynamic loading based on selections
- **Status Management**: Active/Inactive status support
- **Material Type Support**: Predefined material type options

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive
- Touch-friendly interface
- Progressive Web App ready

## Performance Considerations

- Lazy loading of data
- Efficient filtering algorithms
- Optimized re-renders
- Minimal API calls
- Debounced user inputs

## Future Enhancements

Potential improvements for future versions:
1. **Bulk Operations**: Import/export rates
2. **Advanced Filtering**: Date range picker, search functionality
3. **Rate Templates**: Predefined rate structures
4. **Audit Trail**: Complete change history
5. **Notifications**: Real-time updates
6. **Offline Support**: PWA capabilities

## Troubleshooting

### Common Issues:
1. **API Connection**: Ensure backend is running on `https://localhost:7084`
2. **CORS**: Backend must allow requests from frontend origin
3. **Data Loading**: Check browser console for API errors
4. **Validation**: Ensure all required fields are filled

### Debug Mode:
Enable console logging by setting `console.log` statements in the component.

## Support

For issues or questions regarding the Rate popup implementation, refer to:
- Component documentation
- API endpoint specifications
- Backend service implementations
- Database schema definitions
