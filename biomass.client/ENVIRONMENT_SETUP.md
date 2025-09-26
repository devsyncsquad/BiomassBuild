# Environment Setup for Biomass Portal

## Overview

This document explains how to configure environment variables for different deployment environments.

## Environment Variables

### API Configuration

The application uses the following environment variable for API configuration:

```bash
VITE_LIVE_APP_BASEURL=http://100.42.177.77:88/api
```

**Note**: In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## Setup Instructions

### Option 1: Environment File (Recommended for Development)

1. Create a `.env` file in the root directory of the project:

```bash
# .env
VITE_LIVE_APP_BASEURL=http://100.42.177.77:88/api
```

2. For production, create a `.env.production` file:

```bash
# .env.production
VITE_LIVE_APP_BASEURL=https://your-production-domain.com/api
```

### Option 2: System Environment Variables

Set the environment variable in your system:

**Windows (PowerShell):**

```powershell
$env:VITE_LIVE_APP_BASEURL="http://100.42.177.77:88/api"
```

**Windows (Command Prompt):**

```cmd
set VITE_LIVE_APP_BASEURL=http://100.42.177.77:88/api
```

**Linux/macOS:**

```bash
export VITE_LIVE_APP_BASEURL="http://100.42.177.77:88/api"
```

### Option 3: Package.json Scripts

Add environment variables to your npm scripts in `package.json`:

```json
{
  "scripts": {
    "dev": "VITE_LIVE_APP_BASEURL=http://100.42.177.77:88/api vite",
    "build": "VITE_LIVE_APP_BASEURL=https://your-production-domain.com/api vite build"
  }
}
```

## Current Configuration

The application is currently configured to use:

- **Development**: `http://100.42.177.77:88/api`
- **Fallback**: If no environment variable is set, it defaults to the development URL

## API Endpoints

With the current configuration, the following endpoints are available:

- **Authentication**: `http://100.42.177.77:88/api/users/authenticate`
- **User Management**: `http://100.42.177.77:88/api/UserManagement/*`
- **Customers**: `http://100.42.177.77:88/api/Customers/*`
- **Companies**: `http://100.42.177.77:88/api/companies/*`
- **Vendors**: `http://100.42.177.77:88/api/vendors/*`

## Troubleshooting

### Environment Variable Not Working?

1. Make sure the variable name starts with `VITE_`
2. Restart your development server after setting environment variables
3. Check that the `.env` file is in the correct location (project root)
4. Verify the variable is accessible in the browser console

### Checking Current Configuration

You can check the current API base URL in the browser console:

```javascript
console.log(import.meta.env.VITE_LIVE_APP_BASEURL);
```

## Security Notes

- Environment variables prefixed with `VITE_` are exposed to the browser
- Never include sensitive information like API keys in these variables
- Use server-side environment variables for sensitive data

## Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Production with Custom API URL

```bash
VITE_LIVE_APP_BASEURL=https://your-production-domain.com/api npm run build
```

## Support

If you encounter issues with environment configuration, check:

1. Vite documentation on environment variables
2. Your deployment platform's environment variable configuration
3. The browser console for any configuration errors
