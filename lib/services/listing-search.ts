import { query } from '@/lib/db/connection';
import type { TREBListing, SearchResult, SearchFilters, SearchSuggestion } from '@/types/listing';

export class ListingSearchService {
  /**
   * Main search function with advanced filtering and suggestions
   */
  static async search(filters: SearchFilters): Promise<SearchResult> {
    const page = filters.page || 1;
    const pageSize = filters.page_size || 20;
    const offset = (page - 1) * pageSize;

    // Build WHERE conditions
    const conditions: string[] = ['standard_status = $1'];
    const params: any[] = ['Active'];
    let paramIndex = 2;

    // Full-text search on multiple fields
    if (filters.query) {
      const searchQuery = filters.query.trim();
      conditions.push(`(
        LOWER(unparsed_address) LIKE LOWER($${paramIndex}) OR
        LOWER(street_name) LIKE LOWER($${paramIndex}) OR
        LOWER(city) LIKE LOWER($${paramIndex}) OR
        LOWER(postal_code) LIKE LOWER($${paramIndex}) OR
        LOWER(public_remarks) LIKE LOWER($${paramIndex}) OR
        LOWER(property_type) LIKE LOWER($${paramIndex})
      )`);
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    // City filter
    if (filters.city) {
      conditions.push(`LOWER(city) = LOWER($${paramIndex})`);
      params.push(filters.city);
      paramIndex++;
    }

    // Property type filter
    if (filters.property_type) {
      conditions.push(`LOWER(property_type) = LOWER($${paramIndex})`);
      params.push(filters.property_type);
      paramIndex++;
    }

    // Price range
    if (filters.min_price !== undefined) {
      conditions.push(`list_price >= $${paramIndex}`);
      params.push(filters.min_price);
      paramIndex++;
    }
    if (filters.max_price !== undefined) {
      conditions.push(`list_price <= $${paramIndex}`);
      params.push(filters.max_price);
      paramIndex++;
    }

    // Bedrooms
    if (filters.min_bedrooms !== undefined) {
      conditions.push(`bedrooms_total >= $${paramIndex}`);
      params.push(filters.min_bedrooms);
      paramIndex++;
    }
    if (filters.max_bedrooms !== undefined) {
      conditions.push(`bedrooms_total <= $${paramIndex}`);
      params.push(filters.max_bedrooms);
      paramIndex++;
    }

    // Bathrooms
    if (filters.min_bathrooms !== undefined) {
      conditions.push(`bathrooms_total_integer >= $${paramIndex}`);
      params.push(filters.min_bathrooms);
      paramIndex++;
    }
    if (filters.max_bathrooms !== undefined) {
      conditions.push(`bathrooms_total_integer <= $${paramIndex}`);
      params.push(filters.max_bathrooms);
      paramIndex++;
    }

    // Area
    if (filters.min_area !== undefined) {
      conditions.push(`living_area >= $${paramIndex}`);
      params.push(filters.min_area);
      paramIndex++;
    }
    if (filters.max_area !== undefined) {
      conditions.push(`living_area <= $${paramIndex}`);
      params.push(filters.max_area);
      paramIndex++;
    }

    const whereClause = conditions.join(' AND ');

    // Determine sort order
    let orderBy = 'list_date DESC'; // Default
    switch (filters.sort_by) {
      case 'price_asc':
        orderBy = 'list_price ASC NULLS LAST';
        break;
      case 'price_desc':
        orderBy = 'list_price DESC NULLS LAST';
        break;
      case 'date_asc':
        orderBy = 'list_date ASC';
        break;
      case 'date_desc':
        orderBy = 'list_date DESC';
        break;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM listings 
      WHERE ${whereClause}
    `;
    const countResult = await query(countQuery, params);
    const total = parseInt(countResult.rows[0].total);

    // Get listings with pagination
    const listingsQuery = `
      SELECT 
        id,
        listing_key,
        unparsed_address,
        street_number,
        street_name,
        street_suffix,
        unit_number,
        city,
        province,
        postal_code,
        property_type,
        property_sub_type,
        bedrooms_total,
        bathrooms_total_integer as bathrooms_total,
        living_area,
        lot_size_area,
        list_price,
        public_remarks,
        media_keys,
        preferred_media_key,
        virtual_tour_url,
        list_date,
        latitude,
        longitude,
        year_built,
        parking_features,
        interior_features,
        exterior_features
      FROM listings 
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(pageSize, offset);

    const listingsResult = await query(listingsQuery, params);

    // Get suggestions if search query exists
    let suggestions: SearchSuggestion[] = [];
    if (filters.query) {
      suggestions = await this.getSuggestions(filters.query);
    }

    return {
      listings: listingsResult.rows,
      total,
      page,
      pageSize,
      suggestions
    };
  }

  /**
   * Get search suggestions based on query
   */
  static async getSuggestions(searchQuery: string): Promise<SearchSuggestion[]> {
    const suggestions: SearchSuggestion[] = [];
    const lowerQuery = searchQuery.toLowerCase();

    // Get city suggestions
    const cityQuery = `
      SELECT city, COUNT(*) as count
      FROM listings
      WHERE standard_status = 'Active' 
        AND LOWER(city) LIKE $1
      GROUP BY city
      ORDER BY count DESC
      LIMIT 5
    `;
    const cityResult = await query(cityQuery, [`%${lowerQuery}%`]);
    
    cityResult.rows.forEach((row: any) => {
      suggestions.push({
        type: 'city',
        value: row.city,
        count: parseInt(row.count)
      });
    });

    // Get property type suggestions
    const propertyTypeQuery = `
      SELECT property_type, COUNT(*) as count
      FROM listings
      WHERE standard_status = 'Active' 
        AND LOWER(property_type) LIKE $1
      GROUP BY property_type
      ORDER BY count DESC
      LIMIT 5
    `;
    const propertyTypeResult = await query(propertyTypeQuery, [`%${lowerQuery}%`]);
    
    propertyTypeResult.rows.forEach((row: any) => {
      suggestions.push({
        type: 'property_type',
        value: row.property_type,
        count: parseInt(row.count)
      });
    });

    // Get street suggestions
    const streetQuery = `
      SELECT street_name, city, COUNT(*) as count
      FROM listings
      WHERE standard_status = 'Active' 
        AND LOWER(street_name) LIKE $1
      GROUP BY street_name, city
      ORDER BY count DESC
      LIMIT 5
    `;
    const streetResult = await query(streetQuery, [`%${lowerQuery}%`]);
    
    streetResult.rows.forEach((row: any) => {
      suggestions.push({
        type: 'street',
        value: `${row.street_name}, ${row.city}`,
        count: parseInt(row.count)
      });
    });

    return suggestions;
  }

  /**
   * Get available filter options for dropdowns
   */
  static async getFilterOptions() {
    const [cities, propertyTypes, priceRange] = await Promise.all([
      // Get cities
      query(`
        SELECT DISTINCT city, COUNT(*) as count
        FROM listings
        WHERE standard_status = 'Active' AND city IS NOT NULL
        GROUP BY city
        ORDER BY count DESC
        LIMIT 50
      `),
      
      // Get property types
      query(`
        SELECT DISTINCT property_type, COUNT(*) as count
        FROM listings
        WHERE standard_status = 'Active' AND property_type IS NOT NULL
        GROUP BY property_type
        ORDER BY count DESC
      `),
      
      // Get price range
      query(`
        SELECT 
          MIN(list_price) as min_price,
          MAX(list_price) as max_price,
          AVG(list_price) as avg_price
        FROM listings
        WHERE standard_status = 'Active' AND list_price IS NOT NULL
      `)
    ]);

    return {
      cities: cities.rows.map(r => ({ value: r.city, count: parseInt(r.count) })),
      propertyTypes: propertyTypes.rows.map(r => ({ value: r.property_type, count: parseInt(r.count) })),
      priceRange: priceRange.rows[0]
    };
  }

  /**
   * Get featured listings for homepage
   */
  static async getFeaturedListings(limit: number = 3): Promise<TREBListing[]> {
    const result = await query(`
      SELECT 
        id,
        listing_key,
        unparsed_address,
        street_number,
        street_name,
        street_suffix,
        unit_number,
        city,
        province,
        postal_code,
        property_type,
        property_sub_type,
        bedrooms_total,
        bathrooms_total_integer as bathrooms_total,
        living_area,
        lot_size_area,
        list_price,
        public_remarks,
        media_keys,
        preferred_media_key,
        virtual_tour_url,
        list_date,
        latitude,
        longitude,
        year_built
      FROM listings 
      WHERE standard_status = 'Active'
        AND list_price IS NOT NULL
        AND media_keys IS NOT NULL
        AND array_length(media_keys, 1) > 0
      ORDER BY list_price DESC, list_date DESC
      LIMIT $1
    `, [limit]);

    return result.rows;
  }
} 