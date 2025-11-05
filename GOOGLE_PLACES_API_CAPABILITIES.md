# Google Places API - Capabilities & Integration Guide

## API Key Details

**Key ID:** API key 1  
**Project:** dbmethod (Project Number: 731053395356)  
**Created:** October 28, 2025  
**Status:** Active and Unrestricted  

---

## Current Configuration Status

### ⚠️ Security Warnings
- **No API restrictions** – Key can access any Google API (not recommended for production)
- **No application restrictions** – Can be called from any source (website, IP, app, etc.)

### 🔒 Recommended Production Restrictions
- **Restrict to specific APIs**: Places API only
- **Application type restrictions**: 
  - HTTP referrers (for websites)
  - IP address whitelist (for servers)
  - Android/iOS app restrictions (for mobile apps)

---

## Google Places API - Core Capabilities

### 1. Business Discovery & Search

#### Search Methods Available:
- **Nearby Search**: Find businesses within a specified location and radius
- **Text Search**: Search for specific business types or names across a geographic area
- **Place ID Search**: Retrieve detailed info using a specific place ID

### 2. Business Information Available

For each business listing, you can retrieve:

#### Basic Information
- Business name
- Business type/category
- Formatted address
- Phone number
- Website URL
- Email (when available)

#### Geographic Data
- Latitude/longitude coordinates
- Formatted address components
- Vicinity information

#### Operating Information
- Opening and closing times
- Days of operation
- Current status (open/closed)
- Special hours (holidays, etc.)

#### Ratings & Reviews
- Overall rating (1-5 stars)
- Total number of user reviews
- Individual review text and ratings
- Reviewer information
- Review timestamps

#### Visual Content
- Business photos uploaded by users
- Photo metadata
- Photo attribution requirements

#### Additional Details
- Price level indicator ($ to $$$$)
- Permanent closed status
- Wheelchair accessibility
- Delivery/takeout availability (for restaurants)

---

## API Endpoints & Request Methods

### Base URL
```
https://maps.googleapis.com/maps/api/place/
```

### Available Endpoints

#### 1. Nearby Search
```
GET /nearbysearch/json
```
**Purpose**: Find businesses within a specific radius  
**Required Parameters**:
- `location` - latitude,longitude
- `radius` - in meters (max 50,000)
- `key` - Your API key

**Optional Parameters**:
- `type` - Business category (e.g., hospital, pharmacy, therapist)
- `keyword` - Search term
- `rankby` - Sort by prominence or distance

#### 2. Text Search
```
GET /textsearch/json
```
**Purpose**: Search by business name or type across a geographic area  
**Required Parameters**:
- `query` - Search text
- `key` - Your API key

**Optional Parameters**:
- `location` - Bias results to location
- `radius` - Search radius
- `type` - Business category

#### 3. Place Details
```
GET /details/json
```
**Purpose**: Get comprehensive details for a specific place  
**Required Parameters**:
- `place_id` - Unique identifier from search results
- `key` - Your API key

**Optional Parameters**:
- `fields` - Specify which fields to return (to reduce costs)

#### 4. Photo Retrieval
```
GET /photo
```
**Purpose**: Retrieve business photos  
**Required Parameters**:
- `photoreference` - From place details
- `maxwidth` or `maxheight` - Size specification
- `key` - Your API key

---

## Implementation Parameters

### For Healthcare Provider Search (NeuroConnect Use Case)

#### Search for Nearby Providers:
```javascript
{
  location: "latitude,longitude",
  radius: 5000, // 5km
  type: "health", // or "doctor", "hospital", "physiotherapist"
  keyword: "autism specialist" // or "neurodevelopmental"
}
```

#### Get Provider Details:
```javascript
{
  place_id: "ChIJ...", // from search results
  fields: "name,formatted_address,formatted_phone_number,opening_hours,rating,reviews,website,geometry"
}
```

#### Filter by Rating:
```javascript
// Client-side filtering after retrieval
results.filter(place => place.rating >= 4.0)
```

---

## Limitations & Quotas

### Free Tier
- **$200/month** free credit
- Approximately **1,000-28,000 requests/month** depending on API calls
- Different API calls have different costs (see pricing below)

### Request Costs (as of 2025)
- **Nearby Search**: $32 per 1,000 requests
- **Text Search**: $32 per 1,000 requests
- **Place Details**: $17 per 1,000 requests (Basic Data)
- **Place Details**: Additional costs for Contact Data, Atmosphere Data
- **Photos**: $7 per 1,000 requests

### Rate Limits
- Standard rate: 1,000 requests per day (free tier)
- Can be increased with billing enabled

### Data Freshness
- Updates can take 24-48 hours to reflect changes
- Review data updates periodically
- Business hours updated regularly

### Review Limitations
- API returns limited review text (summaries)
- Maximum 5 most relevant reviews per place
- Full review text may be truncated

---

## Related APIs (Also Available in Project)

### 1. Geocoding API
**Purpose**: Convert addresses ↔ coordinates  
**Use Case**: Normalize business locations, convert user addresses to lat/lng

### 2. Maps JavaScript API
**Purpose**: Embed interactive maps  
**Use Case**: Visual display of provider locations

### 3. Places UI Kit
**Purpose**: Pre-built UI components  
**Use Case**: Quick implementation of place selection interfaces

---

## NeuroConnect Integration Strategy

### What We Can Build:

#### 1. ✅ Provider Directory with Real Data
- Search for healthcare providers by location and specialty
- Display provider ratings and review counts
- Show business hours and real-time open/closed status
- Pull contact info (phone, website, address)

#### 2. ✅ Smart Filtering
- Filter by rating threshold (e.g., 4+ stars only)
- Filter by price range
- Filter by distance from user
- Filter by currently open providers

#### 3. ✅ Interactive Map Integration
- Display providers on existing map component
- Show provider details on marker click
- Cluster markers for better UX
- Draw radius circles for search areas

#### 4. ✅ Caching Strategy
- Cache search results to minimize API calls
- Update cached data periodically (daily/weekly)
- Store frequently accessed provider details
- Implement localStorage for user session

#### 5. ✅ User Experience Enhancements
- Autocomplete for location search
- "Near me" functionality with geolocation
- Save favorite providers
- Request appointment feature (external link to provider website)

---

## Implementation Phases

### Phase 1: Basic Integration (Current Focus)
1. Set up API key in environment variables
2. Create API service module for Places API calls
3. Replace mock data in `PracticeMap.tsx` with real API data
4. Test with nearby search for healthcare providers

### Phase 2: Enhanced Features
1. Add filtering and sorting capabilities
2. Implement caching strategy
3. Add provider detail views with reviews
4. Integrate photos

### Phase 3: Optimization
1. Implement request batching
2. Add error handling and fallbacks
3. Optimize API call costs with field filtering
4. Implement rate limiting on client side

### Phase 4: Production Hardening
1. Restrict API key to specific APIs
2. Add HTTP referrer restrictions
3. Implement backend proxy for API key security
4. Add monitoring and analytics

---

## Security Best Practices

### 🔐 API Key Protection

#### Current Risk:
- Unrestricted key can be used by anyone if exposed

#### Recommended Approach:
1. **Environment Variables**: Store API key in `.env` file (never commit to Git)
2. **Backend Proxy**: Create server endpoint that proxies requests to Google
3. **API Restrictions**: Limit key to Places API only
4. **Referrer Restrictions**: Whitelist your domain
5. **Quota Monitoring**: Set up alerts for unusual usage

#### Implementation:
```javascript
// .env
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here

// In code
const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
```

---

## Sample Code Structure

### API Service Module
```typescript
// src/services/googlePlaces.ts
export class GooglePlacesService {
  private apiKey: string;
  private baseUrl = 'https://maps.googleapis.com/maps/api/place';
  
  async nearbySearch(params: NearbySearchParams): Promise<Place[]>
  async placeDetails(placeId: string): Promise<PlaceDetails>
  async textSearch(query: string): Promise<Place[]>
}
```

### Type Definitions
```typescript
// src/lib/types.ts
export interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: { lat: number; lng: number };
  };
  rating?: number;
  user_ratings_total?: number;
  types: string[];
}
```

---

## Next Steps

1. ✅ **Document API capabilities** (this file)
2. 🔄 **Create API service module** for Google Places
3. 🔄 **Update PracticeMap component** to use real data
4. 🔄 **Add environment variable** for API key
5. 🔄 **Test with real healthcare provider searches**
6. ⏭️ **Implement caching strategy**
7. ⏭️ **Add filtering and sorting**
8. ⏭️ **Secure API key for production**

---

## Useful Resources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Places API Pricing](https://developers.google.com/maps/documentation/places/web-service/usage-and-billing)
- [API Key Best Practices](https://developers.google.com/maps/api-security-best-practices)
- [TypeScript Types for Google Maps](https://www.npmjs.com/package/@types/google.maps)

---

## Support & Troubleshooting

### Common Issues:
1. **CORS Errors**: Use backend proxy or enable CORS on API key
2. **Quota Exceeded**: Monitor usage in Google Cloud Console
3. **No Results**: Check location parameters and search radius
4. **Invalid Key**: Verify key is enabled for Places API

### Monitoring:
- Check usage at: [Google Cloud Console](https://console.cloud.google.com/)
- Enable billing alerts for cost overruns
- Monitor error rates and response times
