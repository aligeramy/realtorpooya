import { NextResponse } from 'next/server';
import { query } from '@/lib/db/connection';

export async function GET() {
  try {
    // Test 1: Basic connection
    const testConnection = await query('SELECT NOW() as current_time');
    
    // Test 2: Count listings
    const countResult = await query(`
      SELECT COUNT(*) as total,
             COUNT(CASE WHEN standard_status = 'Active' THEN 1 END) as active_count
      FROM listings
    `);
    
    // Test 3: Sample listing
    const sampleResult = await query(`
      SELECT id, street_number, street_name, city, list_price, bedrooms_total
      FROM listings 
      WHERE standard_status = 'Active' 
      LIMIT 1
    `);
    
    return NextResponse.json({
      success: true,
      data: {
        connection: 'OK',
        currentTime: testConnection.rows[0].current_time,
        totalListings: countResult.rows[0].total,
        activeListings: countResult.rows[0].active_count,
        sampleListing: sampleResult.rows[0] || null
      }
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
} 