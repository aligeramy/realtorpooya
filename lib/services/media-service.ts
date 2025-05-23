import { query } from '@/lib/db/connection';
import type { ListingMedia } from '@/types/listing';

// Configuration for Ampere API
const AMPERE_API_BASE = 'https://query.ampre.ca/odata';
const AMPERE_API_KEY = process.env.AMPERE_API_KEY || '';

export class MediaService {
  /**
   * Get media URLs for a listing from local database
   */
  static async getListingMedia(listingId: string): Promise<ListingMedia[]> {
    const result = await query(`
      SELECT 
        media_key,
        listing_id,
        media_type,
        media_category,
        media_url,
        media_status,
        image_height,
        image_width,
        is_preferred,
        display_order
      FROM listing_media
      WHERE listing_id = $1
      ORDER BY is_preferred DESC, display_order ASC
    `, [listingId]);

    return result.rows;
  }

  /**
   * Get media URLs for multiple listings efficiently
   */
  static async getBatchListingMedia(listingIds: string[]): Promise<Map<string, ListingMedia[]>> {
    if (listingIds.length === 0) return new Map();

    const result = await query(`
      SELECT 
        media_key,
        listing_id,
        media_type,
        media_category,
        media_url,
        media_status,
        image_height,
        image_width,
        is_preferred,
        display_order
      FROM listing_media
      WHERE listing_id = ANY($1)
      ORDER BY listing_id, is_preferred DESC, display_order ASC
    `, [listingIds]);

    // Group by listing_id
    const mediaMap = new Map<string, ListingMedia[]>();
    result.rows.forEach((row: ListingMedia) => {
      if (!mediaMap.has(row.listing_id)) {
        mediaMap.set(row.listing_id, []);
      }
      mediaMap.get(row.listing_id)!.push(row);
    });

    return mediaMap;
  }

  /**
   * Fetch media from Ampere API if not in local database
   * According to https://developer.ampre.ca/docs/resources/media
   */
  static async fetchMediaFromAmpere(mediaKey: string): Promise<any> {
    if (!AMPERE_API_KEY) {
      console.warn('Ampere API key not configured');
      return null;
    }

    try {
      const response = await fetch(`${AMPERE_API_BASE}/Media('${mediaKey}')`, {
        headers: {
          'Authorization': `Bearer ${AMPERE_API_KEY}`,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch media: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching media from Ampere:', error);
      return null;
    }
  }

  /**
   * Sync media data from Ampere API for a specific listing
   * According to https://developer.ampre.ca/docs/resources/media
   * Fetch media records for Property resource
   */
  static async syncListingMedia(listingKey: string, resourceRecordKey: string): Promise<void> {
    if (!AMPERE_API_KEY) {
      console.warn('Ampere API key not configured');
      return;
    }

    try {
      // Fetch media records for this listing from Ampere
      const response = await fetch(
        `${AMPERE_API_BASE}/Media?$filter=ResourceRecordKey eq '${resourceRecordKey}' and ResourceName eq 'Property'&$orderby=Order,MediaKey`,
        {
          headers: {
            'Authorization': `Bearer ${AMPERE_API_KEY}`,
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch media list: ${response.statusText}`);
      }

      const data = await response.json();
      const mediaRecords = data.value || [];

      // Insert or update media records in local database
      for (const media of mediaRecords) {
        await query(`
          INSERT INTO listing_media (
            media_key,
            listing_id,
            media_type,
            media_category,
            media_url,
            media_status,
            image_height,
            image_width,
            is_preferred,
            display_order
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (media_key) 
          DO UPDATE SET
            media_type = EXCLUDED.media_type,
            media_category = EXCLUDED.media_category,
            media_url = EXCLUDED.media_url,
            media_status = EXCLUDED.media_status,
            image_height = EXCLUDED.image_height,
            image_width = EXCLUDED.image_width,
            is_preferred = EXCLUDED.is_preferred,
            display_order = EXCLUDED.display_order
        `, [
          media.MediaKey,
          listingKey,
          media.MediaType || 'Image',
          media.MediaCategory || 'Photo',
          media.MediaURL,
          media.MediaStatus || 'Active',
          media.ImageHeight,
          media.ImageWidth,
          media.PreferredMedia || false,
          media.Order || 0
        ]);
      }

      console.log(`Synced ${mediaRecords.length} media records for listing ${listingKey}`);
    } catch (error) {
      console.error('Error syncing media from Ampere:', error);
    }
  }

  /**
   * Get primary image URL for a listing
   */
  static async getPrimaryImageUrl(listingId: string, preferredMediaKey?: string): Promise<string | null> {
    let whereClause = 'listing_id = $1';
    const params: any[] = [listingId];

    // If preferred media key is specified, try to get that first
    if (preferredMediaKey) {
      whereClause += ' AND media_key = $2';
      params.push(preferredMediaKey);
    }

    const result = await query(`
      SELECT media_url
      FROM listing_media
      WHERE ${whereClause}
        AND media_type IN ('Image', 'Photo', 'image/jpeg', 'image/png', 'image/jpg')
        AND media_status = 'Active'
      ORDER BY is_preferred DESC, display_order ASC
      LIMIT 1
    `, params);

    return result.rows[0]?.media_url || null;
  }

  /**
   * Get all image URLs for a listing
   */
  static async getListingImages(listingId: string): Promise<string[]> {
    const result = await query(`
      SELECT media_url
      FROM listing_media
      WHERE listing_id = $1
        AND media_type IN ('Image', 'Photo', 'image/jpeg', 'image/png', 'image/jpg')
        AND media_status = 'Active'
      ORDER BY is_preferred DESC, display_order ASC
    `, [listingId]);

    return result.rows.map(row => row.media_url);
  }

  /**
   * Build Ampere image URL from media key
   * Based on the URL pattern seen in the database
   */
  static buildAmpereImageUrl(mediaKey: string, size: 'thumbnail' | 'medium' | 'large' = 'large'): string {
    const dimensions = {
      thumbnail: '320:320',
      medium: '960:960', 
      large: '1920:1920'
    };
    
    // Remove any size suffixes from the media key
    const baseKey = mediaKey.replace(/-(t|m|l|nw)$/, '');
    
    return `https://trreb-image.ampre.ca/${baseKey}/rs:fit:${dimensions[size]}/L3RycmViL2xpc3RpbmdzLyR7baseKey}.jpg`;
  }
} 