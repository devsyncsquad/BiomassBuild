# Company Management - Enhanced Features Test Guide

This guide covers the enhanced company management functionality with editable view details and real API integration.

## ✅ **What's New**

1. **Editable View Details**: Click "View Details" then "Edit Company" to make changes
2. **Real API Integration**: Connected to backend Companies API
3. **Database Setup**: Complete SQL script with sample data
4. **Enhanced Form**: All fields are editable in view mode
5. **Proper Error Handling**: Better error messages and validation

## 🗄️ **Database Setup**

### **Step 1: Run the SQL Script**

Execute the SQL script in your database:
```sql
-- File: Biomass.Server/App_Data/Migrations/CompanyTable.sql
-- This creates the Companies table and inserts 5 sample companies
```

### **Step 2: Verify Database**

Check that the following companies exist:
- BSP (Bullah Shah) - Energy, Large, Lahore
- Sapphaler - Healthcare, Medium, Islamabad  
- Nishat - Banking, Large, Karachi
- Ithad Chemicals - Manufacturing, Medium, Faisalabad
- TechVision Solutions - Technology, Medium, Karachi

## 🧪 **Testing Steps**

### **Step 1: Start Both Servers**

**Backend Server:**
```bash
cd Biomass.Server
dotnet run
```

**Frontend Server:**
```bash
cd biomass.client
npm run dev
```

### **Step 2: Access Dashboard**

Navigate to: `https://localhost:53731/dashboard`

### **Step 3: Test Company Management**

#### **A. View Companies List**
1. Click on "Company Management" in the sidebar
2. Verify that 5 companies are displayed
3. Check that all company cards show:
   - Company name and description
   - NTN, contact person, phone
   - Industry, size, location
   - "View Details" button

#### **B. Test View Details (Read-Only Mode)**
1. Click "View Details" on any company
2. Verify the popup opens with company information
3. Check that all fields are **disabled** (read-only)
4. Verify the buttons show:
   - "Close" button
   - "Edit Company" button

#### **C. Test Edit Mode**
1. Click "Edit Company" button
2. Verify all fields become **enabled** (editable)
3. Make some changes to the form:
   - Change company name
   - Update contact person
   - Modify description
   - Change industry or size
4. Click "Update Company Details"
5. Verify the changes are saved
6. Check that the form returns to read-only mode

#### **D. Test Add New Company**
1. Click "Add Company" button
2. Fill in the required fields:
   - Company Name (required)
   - Company Address (required)
   - Other optional fields
3. Click "Save Company Details"
4. Verify the new company appears in the list

#### **E. Test Search and Filters**
1. Use the search box to find companies by name
2. Filter by Industry (Energy, Healthcare, etc.)
3. Filter by Company Size (Small, Medium, Large)
4. Filter by Location (Lahore, Karachi, etc.)
5. Combine multiple filters
6. Click "Clear All" to reset filters

## 🎯 **Expected Behavior**

### **View Mode (Read-Only)**
- ✅ All form fields are disabled
- ✅ Company data is displayed correctly
- ✅ "Edit Company" button is visible
- ✅ "Close" button works

### **Edit Mode**
- ✅ All form fields are enabled
- ✅ User can modify any field
- ✅ "Cancel Edit" resets to original values
- ✅ "Update Company Details" saves changes
- ✅ Form returns to read-only mode after save

### **API Integration**
- ✅ Companies load from database
- ✅ Updates are saved to database
- ✅ New companies are created in database
- ✅ Error handling works properly

### **Form Validation**
- ✅ Company Name is required
- ✅ Company Address is required
- ✅ Error messages display correctly
- ✅ Form won't submit with invalid data

## 🔧 **API Endpoints**

The following endpoints should be working:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/companies` | Get all companies |
| GET | `/api/companies/{id}` | Get company by ID |
| POST | `/api/companies` | Create new company |
| PUT | `/api/companies/{id}` | Update company |
| DELETE | `/api/companies/{id}` | Delete company |
| GET | `/api/companies/search` | Search companies |

## 🚨 **Troubleshooting**

### **If Companies Don't Load:**
1. Check if backend server is running
2. Verify database connection
3. Check browser console for errors
4. Ensure SQL script was executed

### **If Edit Mode Doesn't Work:**
1. Check if "Edit Company" button is visible
2. Verify form fields become enabled
3. Check browser console for JavaScript errors

### **If Save Fails:**
1. Check required fields are filled
2. Verify API endpoint is accessible
3. Check backend logs for errors
4. Ensure database is accessible

### **If Search/Filters Don't Work:**
1. Verify companies are loaded
2. Check filter logic in component
3. Ensure search terms match company data

## 🎉 **Success Criteria**

✅ **Database Integration**: Companies load from real database  
✅ **View Mode**: Read-only display works correctly  
✅ **Edit Mode**: All fields become editable  
✅ **Save Functionality**: Changes are persisted to database  
✅ **Add Company**: New companies can be created  
✅ **Search & Filters**: All filtering options work  
✅ **Error Handling**: Proper error messages display  
✅ **Form Validation**: Required fields are enforced  
✅ **UI/UX**: Smooth transitions between modes  

## 📝 **Sample Test Data**

After running the SQL script, you should see:

1. **BSP (Bullah Shah)**
   - Industry: Energy
   - Size: Large
   - Location: Lahore
   - NTN: 123456789

2. **Sapphaler**
   - Industry: Healthcare
   - Size: Medium
   - Location: Islamabad
   - NTN: 987654321

3. **Nishat**
   - Industry: Banking
   - Size: Large
   - Location: Karachi
   - NTN: 456789123

4. **Ithad Chemicals**
   - Industry: Manufacturing
   - Size: Medium
   - Location: Faisalabad
   - NTN: 789123456

5. **TechVision Solutions**
   - Industry: Technology
   - Size: Medium
   - Location: Karachi
   - NTN: 321654987

---

**Note**: The company management system is now fully functional with real database integration and editable view details! 🚀 