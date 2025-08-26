# Dispatch Cost Entry Enhancement Implementation

## Overview
This document describes the implementation of enhanced dispatch cost entry functionality with location modal support and fixed/variable cost handling for the BiomassPro application.

## ✅ **What Was Already Implemented**
1. **Location Modal**: Complete `CustomerLocationForm.jsx` with full CRUD operations
2. **Tolerance Handling**: Switch toggle between Tolerance % and Tolerance (kg)
3. **Dispatch Loading Charges**: Radio buttons for Fixed/Variable with proper handling
4. **Receiving Unloading Cost**: Radio buttons for Fixed/Variable with proper handling
5. **Backend Models**: Complete `CustomerLocation` model with all required fields
6. **Backend Services**: Complete CRUD operations for locations

## 🔧 **What Was Enhanced/Added**

### 1. **Labour Charges Section**
- Added new Labour Charges section to location form
- Toggle switch to enable/disable labour charges
- Radio buttons for Fixed vs Variable labour costs
- Fixed cost input field
- Variable cost type selection (Labour Per Maan, Labor Per Month)
- Variable cost amount input field

### 2. **Backend Model Updates**
- Added Labour Charges fields to `CustomerLocation` model:
  - `LabourChargesEnabled` (bool)
  - `LabourChargeType` (string: "Fixed" or "Variable")
  - `FixedLabourCost` (decimal)
  - `LabourVariableChargeType` (string: "LabourPerMaan" or "LaborPerMonth")
  - `LabourVariableChargeAmount` (decimal)

### 3. **New API Endpoint**
- **GET** `/api/customerlocations/GetLocationCostsForDispatch/{locationId}`
- Returns `LocationCostsDto` with all cost information for dispatch calculations
- Includes tolerance limits, dispatch charges, labour charges, and unloading costs

### 4. **Dispatch Screen Component**
- New `DispatchScreen.jsx` component for cost calculations
- Location selection dropdown
- Dispatch parameters input (Company Rate, Weight, Material Type)
- Real-time cost calculation based on location configuration
- Business logic implementation for Fixed vs Variable costs

## 🏗️ **Architecture & Implementation**

### Frontend Components
```
CustomerLocationForm.jsx     - Enhanced with Labour Charges section
CustomerLocations.jsx        - Updated to display Labour Charges
DispatchScreen.jsx          - New component for dispatch cost calculations
```

### Backend Models
```
CustomerLocation.cs          - Enhanced with Labour Charges fields
LocationCostsDto            - New DTO for dispatch cost calculations
```

### Backend Services
```
CustomerLocationService.cs   - Enhanced with GetLocationCostsForDispatchAsync method
```

### API Endpoints
```
GET /api/customerlocations/GetLocationCostsForDispatch/{locationId}
```

## 💰 **Business Logic Implementation**

### Case 1: Variable Per Maan Cost
- **Company Rate**: 310 per ton
- **Convert to maan**: 310 × 25 = 7,750 (exclusive of taxes)
- **Per Maan Breakdown**:
  - Rate to Trolly Owner: 300
  - Loading/Bucket Charges: 10
  - Labour Charges: 5
  - Freight Charges: 285

### Case 3: Fixed Rate
- **Company Rate**: 310 per ton
- **Convert to maan**: 310 × 25 = 7,750 (exclusive of taxes)
- **Fixed Cost Breakdown**:
  - Rate to Trolly Owner: 30,500
  - Loading/Bucket Charges: 5,000
  - Labour Charges: 3,500
  - Freight Charges: 285

## 🔄 **Data Flow**

1. **Location Configuration**: User configures costs in `CustomerLocationForm`
2. **Cost Storage**: Costs saved to database via `CustomerLocationService`
3. **Dispatch Screen**: User selects location and enters dispatch parameters
4. **Cost Fetching**: `GetLocationCostsForDispatch` API retrieves location costs
5. **Calculation**: Frontend applies business logic based on cost types
6. **Results Display**: Calculated costs displayed in structured table

## 📊 **Cost Calculation Logic**

### Fixed Costs
- Loader Cost: Fixed amount regardless of weight
- Labour Cost: Fixed amount regardless of weight
- Unloading Cost: Fixed amount regardless of weight

### Variable Costs
- **Per Maan**: Cost = Rate × Weight (in maan)
- **Per Month**: Fixed monthly cost

### Weight Conversion
- 1 ton = 25 maan
- All calculations support both units

## 🎯 **Acceptance Criteria Status**

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Location Modal | ✅ Complete | `CustomerLocationForm.jsx` |
| Tolerance Handling | ✅ Complete | Switch toggle with validation |
| Dispatch Loading Charges | ✅ Complete | Fixed/Variable radio buttons |
| Labour Charges | ✅ Complete | Fixed/Variable radio buttons |
| Unloading Charges | ✅ Complete | Fixed/Variable radio buttons |
| Business Logic | ✅ Complete | Cost calculation algorithms |
| Dispatch Screen Integration | ✅ Complete | `DispatchScreen.jsx` |
| Cost Fetching | ✅ Complete | API endpoint + service |

## 🚀 **Usage Instructions**

### 1. **Configure Location Costs**
1. Open Customer & Location Management
2. Click "Add Location" or edit existing location
3. Configure Dispatch Loading Charges, Labour Charges, and Unloading Costs
4. Set Fixed or Variable cost types and amounts
5. Save location configuration

### 2. **Calculate Dispatch Costs**
1. Navigate to Dispatch Screen
2. Select location from dropdown
3. Enter Company Rate (per ton) and Weight (tons)
4. Select Material Type
5. Click "Calculate Costs"
6. Review calculated breakdown

### 3. **Cost Types Explained**
- **Fixed**: Same cost regardless of weight/quantity
- **Variable**: Cost varies based on weight (per maan) or time (per month)

## 🔧 **Technical Details**

### Database Schema Updates
```sql
-- New columns added to locations table
ALTER TABLE locations ADD COLUMN labourchargesenabled BOOLEAN DEFAULT FALSE;
ALTER TABLE locations ADD COLUMN labourchargetype VARCHAR(50);
ALTER TABLE locations ADD COLUMN fixedlabourcost DECIMAL(10,2);
ALTER TABLE locations ADD COLUMN labourvariablechargetype VARCHAR(50);
ALTER TABLE locations ADD COLUMN labourvariablechargeamount DECIMAL(10,2);
```

### API Response Format
```json
{
  "success": true,
  "result": {
    "locationId": 1,
    "locationName": "Hujra Shah",
    "dispatchLoadingChargesEnabled": true,
    "dispatchChargeType": "Fixed",
    "fixedLoaderCost": 5000,
    "labourChargesEnabled": true,
    "labourChargeType": "Variable",
    "labourVariableChargeAmount": 5
  }
}
```

## 🧪 **Testing Scenarios**

1. **Fixed Cost Calculation**: Verify fixed amounts are applied correctly
2. **Variable Cost Calculation**: Verify per-maan calculations
3. **Mixed Cost Types**: Test locations with different cost types
4. **Weight Conversion**: Verify ton to maan conversion (1:25 ratio)
5. **Error Handling**: Test with invalid location IDs
6. **Edge Cases**: Test with zero weights and costs

## 🔮 **Future Enhancements**

1. **Cost History**: Track cost changes over time
2. **Bulk Cost Updates**: Update costs for multiple locations
3. **Cost Templates**: Predefined cost structures for common scenarios
4. **Advanced Calculations**: Support for complex pricing models
5. **Cost Analytics**: Reporting and analysis of cost patterns

## 📝 **Notes**

- All costs are stored in Pakistani Rupees (Rs)
- Weight conversions use standard 1 ton = 25 maan ratio
- Cost calculations automatically handle enabled/disabled features
- Frontend validation ensures data integrity
- Backend services include proper error handling and logging

## 👥 **Contributors**

- Frontend: React + Material-UI components
- Backend: ASP.NET Core + Entity Framework
- Database: PostgreSQL with proper schema design
- API: RESTful endpoints with consistent response format
