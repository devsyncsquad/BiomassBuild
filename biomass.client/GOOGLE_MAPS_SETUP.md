# Google Maps API Setup Guide

This guide will help you set up Google Maps API integration for real location tracking in the Biomass application.

## Step 1: Get a Google Maps API Key

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" or create a new one
3. Give your project a name (e.g., "Biomass Location Tracking")

### 1.2 Enable the Maps JavaScript API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Maps JavaScript API"
3. Click on "Maps JavaScript API"
4. Click "Enable"

### 1.3 Create API Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key (it will look like: `AIzaSyC...`)

### 1.4 (Optional) Restrict the API Key
For security, you can restrict the API key:
1. Click on the API key you just created
2. Under "Application restrictions", select "HTTP referrers"
3. Add your domain: `https://localhost:53731/*`
4. Under "API restrictions", select "Restrict key"
5. Select "Maps JavaScript API"
6. Click "Save"

## Step 2: Update the Configuration

### 2.1 Update the API Key
1. Open `src/config/maps.js`
2. Replace `'YOUR_ACTUAL_API_KEY_HERE'` with your actual API key:

```javascript
export const MAPS_CONFIG = {
  API_KEY: 'AIzaSyC...', // Your actual API key here
  // ... rest of the config
};
```

### 2.2 Test the Integration
1. Start your development server: `npm run dev`
2. Navigate to the Customer & Location Management section
3. Click on a location icon to view the map
4. You should see a real Google Map with interactive features

## Step 3: Database Integration

### 3.1 Add Coordinates to Your Database
To show real locations, you need to add latitude and longitude to your `CustomerLocations` table:

```sql
-- Add coordinate columns to CustomerLocations table
ALTER TABLE "CustomerLocations" 
ADD COLUMN "Latitude" DECIMAL(10, 8),
ADD COLUMN "Longitude" DECIMAL(11, 8);

-- Update existing locations with sample coordinates
UPDATE "CustomerLocations" 
SET "Latitude" = 31.5204, "Longitude" = 74.3587 
WHERE "LocationId" = 1;

UPDATE "CustomerLocations" 
SET "Latitude" = 31.5497, "Longitude" = 74.3436 
WHERE "LocationId" = 2;

-- Add more locations with real coordinates as needed
```

### 3.2 Update the Backend Model
Make sure your `CustomerLocation` model includes the coordinate fields:

```csharp
public class CustomerLocation
{
    // ... existing properties
    public decimal? Latitude { get; set; }
    public decimal? Longitude { get; set; }
}
```

## Step 4: Features Available

Once set up, you'll have access to:

### 4.1 Interactive Map Features
- **Real-time location tracking**: Shows actual GPS coordinates
- **Zoom and pan**: Users can explore the map
- **Street view**: Click the street view icon to see ground-level views
- **Fullscreen mode**: Click the fullscreen button for better viewing
- **Map type switching**: Switch between roadmap, satellite, and terrain views

### 4.2 Enhanced Markers
- **Animated markers**: Markers drop in with animation
- **Hover effects**: Markers bounce when hovered
- **Detailed info windows**: Click markers to see location details
- **Custom styling**: Professional-looking markers with your brand colors

### 4.3 Location Information
Each marker shows:
- Location name
- Location type
- Location code
- Full address
- GPS coordinates

## Step 5: Troubleshooting

### 5.1 Common Issues

**"Failed to load Google Maps API"**
- Check that your API key is correct in `config/maps.js`
- Verify the Maps JavaScript API is enabled in Google Cloud Console
- Check browser console for specific error messages

**"This API project is not authorized"**
- Make sure you've enabled the Maps JavaScript API
- Check if you have billing set up (required for Google Maps API)

**"Quota exceeded"**
- Google Maps API has usage limits
- Check your usage in Google Cloud Console
- Consider setting up billing for higher limits

**Map shows but no markers**
- Check that your location data has valid coordinates
- Verify the coordinate format (decimal degrees)
- Check browser console for JavaScript errors

### 5.2 Testing Coordinates
You can test with these sample coordinates for Pakistan:
- Lahore: 31.5204, 74.3587
- Karachi: 24.8607, 67.0011
- Islamabad: 33.6844, 73.0479
- Faisalabad: 31.4167, 73.0833

## Step 6: Production Deployment

### 6.1 Environment Variables
For production, consider using environment variables:

```javascript
// In config/maps.js
export const MAPS_CONFIG = {
  API_KEY: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_ACTUAL_API_KEY_HERE',
  // ... rest of config
};
```

### 6.2 Security Best Practices
- Restrict your API key to specific domains
- Set up billing alerts in Google Cloud Console
- Monitor API usage regularly
- Use environment variables for API keys

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your API key is working in the Google Cloud Console
3. Test with the sample coordinates provided above
4. Check that all required APIs are enabled

For more information, visit:
- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API Pricing](https://developers.google.com/maps/pricing) 