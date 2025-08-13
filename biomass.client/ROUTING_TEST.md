# Routing Test Guide

This guide helps you test the URL routing functionality in the Biomass Portal application.

## ✅ **What's Fixed**

1. **History API Fallback**: Added custom Vite plugin to handle client-side routing
2. **Direct URL Access**: You can now access URLs directly in the browser
3. **API URL Corrections**: All API endpoints now use the correct port (7084)
4. **CSS-in-JS Errors**: Fixed style tag issues in Login and Signup components

## 🧪 **Testing Steps**

### **Step 1: Start the Development Servers**

```bash
# Terminal 1 - Start the backend server
cd Biomass.Server
dotnet run

# Terminal 2 - Start the frontend server
cd biomass.client
npm run dev
```

### **Step 2: Test Direct URL Access**

Try these URLs directly in your browser:

1. **Dashboard (Protected Route)**:
   ```
   https://localhost:53731/dashboard
   ```
   - If not logged in → Should redirect to `/login`
   - If logged in → Should show dashboard

2. **Login Page (Public Route)**:
   ```
   https://localhost:53731/login
   ```
   - If not logged in → Should show login page
   - If logged in → Should redirect to `/dashboard`

3. **Signup Page (Public Route)**:
   ```
   https://localhost:53731/signup
   ```
   - If not logged in → Should show signup page
   - If logged in → Should redirect to `/dashboard`

4. **Root URL**:
   ```
   https://localhost:53731/
   ```
   - Should redirect to `/dashboard`

5. **Unknown Routes**:
   ```
   https://localhost:53731/any-unknown-route
   ```
   - Should redirect to `/dashboard`

### **Step 3: Test Authentication Flow**

1. **Clear browser storage** (if needed):
   - Open DevTools (F12)
   - Go to Application/Storage tab
   - Clear localStorage
   - Refresh the page

2. **Test login flow**:
   - Go to `https://localhost:53731/login`
   - Login with valid credentials
   - Should redirect to `/dashboard`

3. **Test logout flow**:
   - Click logout in dashboard
   - Should redirect to `/login`

### **Step 4: Test Browser Navigation**

1. **Bookmark pages** and access them directly
2. **Use browser back/forward buttons**
3. **Refresh pages** at different routes

## 🔧 **Debug Information**

If you encounter issues, visit the debug page:
```
https://localhost:53731/debug
```

This page shows:
- Current authentication status
- Token and user data presence
- Current URL
- Manual navigation buttons

## 🚨 **Common Issues & Solutions**

### **Issue: 404 Error on Direct URL Access**
**Solution**: The custom Vite plugin should handle this. Make sure both servers are running.

### **Issue: Infinite Redirects**
**Solution**: Clear browser storage and try again.

### **Issue: API Connection Errors**
**Solution**: Ensure the backend server is running on `https://localhost:7084`

### **Issue: Certificate Errors**
**Solution**: Accept the self-signed certificate in your browser.

## 📝 **Expected Behavior**

| URL | Not Logged In | Logged In |
|-----|---------------|-----------|
| `/dashboard` | → `/login` | ✅ Dashboard |
| `/login` | ✅ Login | → `/dashboard` |
| `/signup` | ✅ Signup | → `/dashboard` |
| `/` | → `/login` | → `/dashboard` |
| `/*` | → `/login` | → `/dashboard` |

## 🎯 **Success Criteria**

✅ **Direct URL access works** - You can bookmark and access any route directly  
✅ **Authentication redirects work** - Unauthenticated users are redirected to login  
✅ **Browser navigation works** - Back/forward buttons work correctly  
✅ **Page refresh works** - Refreshing any page maintains the correct route  
✅ **No console errors** - Clean console without routing-related errors  

## 🔄 **Restart Instructions**

If you make changes to the Vite configuration:

1. Stop the development server (Ctrl+C)
2. Restart the development server:
   ```bash
   npm run dev
   ```
3. Test the URLs again

---

**Note**: The routing should now work correctly for direct URL access at `https://localhost:53731/dashboard` and all other routes! 