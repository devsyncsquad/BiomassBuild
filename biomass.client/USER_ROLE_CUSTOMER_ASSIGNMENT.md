# User Role & Customer Assignment Feature

## Overview
This feature enhances the authentication API and user management module to include user roles and customer assignments.

## Features Implemented

### 1. Enhanced Authentication Response
- **Login API**: Now returns user role and assigned customer information
- **Local Storage**: Stores role and customer data for frontend use
- **Token Management**: Includes role information in JWT token

### 2. User Management - Add User
- **Customer Assignment**: Multi-select dropdown for assigning customers to users
- **Role Selection**: Dropdown for selecting user roles
- **Form Validation**: Enhanced validation for customer assignments

### 3. User Management - Grid View
- **Customer Assignment Column**: Shows customer assignment status
- **Display Logic**: 
  - "No Customer Assigned" for users without customers
  - "X Customer(s)" for users with customer assignments
- **Color Coding**: Different colors for assigned vs. unassigned users

### 4. Dashboard Enhancements
- **User Info Cards**: Display current user's role and customer assignment count
- **Customer Overview**: Shows assigned customers with detailed information

## Technical Implementation

### Frontend Components Updated
1. **Login.jsx**: Enhanced to store role and customer data
2. **auth.js**: New utility functions for role and customer management
3. **AddUser.jsx**: Customer assignment multi-select functionality
4. **ViewUsers.jsx**: Customer assignment display in grid
5. **Dashboard.jsx**: User role and customer information display

### New Utility Functions
```javascript
// Get user role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Get user's assigned customers
export const getUserCustomers = () => {
  const customersStr = localStorage.getItem('customers');
  return customersStr ? JSON.parse(customersStr) : [];
};

// Check if user has customer assignments
export const hasCustomerAssignment = () => {
  const customers = getUserCustomers();
  return customers && customers.length > 0;
};

// Get customer assignment count
export const getCustomerAssignmentCount = () => {
  const customers = getUserCustomers();
  return customers ? customers.length : 0;
};
```

### API Endpoints Used
- **Authentication**: `POST /api/users/authenticate`
- **Customers**: `GET /api/Customers/GetAllCustomers`
- **User Management**: Various endpoints for CRUD operations

## Data Flow

### 1. User Login
1. User submits credentials
2. Backend validates and returns user data + role + customers
3. Frontend stores data in localStorage
4. User redirected to dashboard

### 2. Customer Assignment
1. Admin selects customers from multi-select dropdown
2. Form data includes `customerIds` array
3. Backend saves user-customer relationships
4. Grid view displays assignment status

### 3. Display Logic
1. Check if user has `customerIds` array
2. If empty: show "No Customer Assigned"
3. If populated: show count (e.g., "3 Customers")

## Usage Examples

### Adding a New User with Customer Assignment
1. Navigate to User Management → Users
2. Fill in user details
3. Select role from dropdown
4. Select one or more customers from multi-select
5. Submit form

### Viewing Customer Assignments
1. Navigate to User Management → Users
2. View "Customer Assignment" column
3. See assignment status for each user

### Dashboard Overview
1. Login to see role and customer count
2. View assigned customers in dashboard cards
3. Access customer details and locations

## Browser Storage Structure

```javascript
// User data
localStorage.setItem('user', JSON.stringify({
  userId: 3,
  firstName: 'admin',
  lastName: 'admin',
  username: 'admin',
  empId: 4,
  roleId: 2
}));

// Role information
localStorage.setItem('userRole', '2');

// Customer assignments
localStorage.setItem('customers', JSON.stringify([
  {
    customerId: 1,
    firstName: 'BSP(Bullah Shah)',
    lastName: 'Doe',
    companyName: 'Tech Solutions Inc.',
    // ... other customer properties
  }
]));
```

## Future Enhancements
- Customer assignment bulk operations
- Role-based customer access control
- Customer assignment history tracking
- Advanced filtering by customer assignments
- Customer assignment reports and analytics

## Testing
1. Test login with different user roles
2. Verify customer assignment storage
3. Test user creation with customer assignments
4. Verify grid display logic
5. Test dashboard information display
