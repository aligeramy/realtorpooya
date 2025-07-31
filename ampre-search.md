# AMPRE MLS Search Integration Documentation

## Overview
This document outlines the integration of AMPRE (TREB MLS) search functionality into the RealtorPooya real estate website. The integration allows searching both custom properties and MLS listings while prioritizing custom properties when duplicates exist.

## Architecture Flow
```
User Search → Custom DB Search + AMPRE API Search → Deduplication → Display Results
```

## API Configuration
- **Base URL**: `https://query.ampre.ca/odata/`
- **Authentication**: Bearer token (TREB_KEY from environment)
- **Protocol**: OData v4.0
- **Resources**: Property, Media, Lookup, Member, Office

## Key Implementation Decisions

### 1. Deduplication Strategy
- When a property exists in both custom DB and MLS, only show the custom version
- Match properties by address normalization
- Prioritize custom properties for better control over presentation

### 2. Image Handling
- Only fetch "Largest" images from MLS to avoid duplicates
- Limit to primary images for performance
- Cache images locally when possible

### 3. Field Mapping
Custom fields are mapped to RESO standard fields:
- `address` → `UnparsedAddress`
- `city` → `City`
- `province` → `StateOrProvince`
- `postalCode` → `PostalCode`
- `price` → `ListPrice`
- `bedrooms` → `BedroomsTotal`
- `bathrooms` → `BathroomsTotalInteger`
- `squareFeet` → `LivingArea`
- `propertyType` → `PropertyType` + `PropertySubType`

## Methods

### 1. Property Search
```typescript
// Search AMPRE properties with filters
GET /odata/Property?$filter=City eq 'Toronto' and ListPrice ge 500000
```

### 2. Media Fetch
```typescript
// Get images for a property
GET /odata/Media?$filter=ResourceRecordKey eq 'LISTING_ID' and ImageSizeDescription eq 'Largest'
```

### 3. Address Standardization
- Use fuzzy matching for address comparison
- Normalize addresses by removing unit numbers, standardizing abbreviations
- Consider using Google Geocoding API for precise matching

## Implementation Steps

1. **Create AMPRE API Client** (`lib/ampre-api.ts`)
2. **Extend Property Search** (`app/api/properties/route.ts`)
3. **Add MLS Property Display** (`app/listings/[id]/page.tsx`)
4. **Implement Deduplication Logic**
5. **Add Caching Layer**

## What I Did

### Research Phase
1. Studied AMPRE API documentation and RESO standards
2. Analyzed existing property schema for compatibility
3. Tested API endpoints with curl commands
4. Identified key differences between custom and MLS data
5. Discovered Toronto properties use district codes (e.g., "Toronto W01", "Toronto C01")

### Implementation Phase
1. Created AMPRE API client (`lib/ampre-api.ts`) with proper authentication
2. Extended properties API route to include MLS search capability
3. Implemented deduplication logic based on normalized addresses
4. Standardized field mapping between RESO and our schema
5. Added image filtering to only fetch largest images from MLS
6. Created individual property API endpoint that handles both custom and MLS properties

### Key Findings
- AMPRE API has 23,924+ Toronto properties as of testing
- Toronto listings use district codes: W01, W02, C01, etc.
- OData query syntax doesn't support `tolower` function
- Must use `contains(City, 'Toronto')` for Toronto search
- Images have multiple sizes; "Largest" designation prevents duplicates
- Properties can be for sale or for lease (check ListPrice carefully)

## Why These Decisions

1. **Prioritizing Custom Properties**: Gives full control over presentation and pricing
2. **Largest Images Only**: Reduces bandwidth and avoids duplicate images
3. **Address Normalization**: Ensures accurate deduplication
4. **Caching**: Improves performance and reduces API calls
5. **OData Filtering**: Leverages server-side filtering for efficiency

## Implementation Status

### ✅ Completed
1. **AMPRE API Client** (`lib/ampre-api.ts`)
   - Authentication with TREB_KEY
   - Property search with OData filters
   - Media fetching with largest image filtering
   - Field mapping between RESO and our schema

2. **API Integration** (`app/api/properties/route.ts`)
   - Combined search of custom and MLS properties
   - Deduplication based on normalized addresses
   - MLS properties marked with `isMLS: true` flag
   - Limited to 20 MLS properties per search for performance

3. **Individual Property API** (`app/api/properties/[id]/route.ts`)
   - Handles both custom properties (by UUID) and MLS properties (by mls-LISTINGKEY)
   - Fetches media for MLS properties dynamically

### 🔄 In Progress
1. **Property Display Page Updates**
   - Need to update `/app/listings/[id]/page.tsx` to handle MLS property display
   - Ensure MLS images are displayed correctly
   - Add MLS badge indicator

### 📋 What's Next

1. **Performance Optimization**
   - Implement Redis caching for MLS data
   - Add pagination for large result sets
   - Optimize image loading with CDN

2. **Enhanced Features**
   - Add map search functionality
   - Implement saved searches with MLS alerts
   - Add property comparison feature

3. **Data Synchronization**
   - Set up nightly sync for MLS updates
   - Implement webhook for real-time changes
   - Add monitoring for data quality

4. **UI Improvements**
   - Add MLS badge on property cards
   - Show brokerage information for MLS listings
   - Add "More from this agent" section

## Error Handling

1. **API Failures**: Fallback to custom properties only
2. **Rate Limiting**: Implement exponential backoff
3. **Invalid Data**: Log and skip malformed listings
4. **Network Issues**: Show cached data when available

## Security Considerations

1. **API Key Protection**: Store in environment variables
2. **Data Privacy**: Don't expose agent personal info
3. **Rate Limiting**: Implement client-side throttling
4. **Caching**: Respect data freshness requirements 