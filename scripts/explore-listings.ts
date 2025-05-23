import { query } from '@/lib/db/connection';

async function exploreListingsTable() {
  console.log('🏠 Exploring Listings Table Structure...\n');

  try {
    // Get all columns from listings table
    const columnsResult = await query(`
      SELECT 
        column_name, 
        data_type, 
        character_maximum_length,
        is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'listings' 
      ORDER BY ordinal_position;
    `);

    console.log('📋 Listings Table Columns:');
    console.log('========================');
    
    const searchableColumns: string[] = [];
    
    columnsResult.rows.forEach((col: any) => {
      console.log(`  ${col.column_name} (${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''})`);
      
      // Identify potentially searchable text columns
      if (col.data_type === 'text' || col.data_type === 'character varying') {
        searchableColumns.push(col.column_name);
      }
    });

    console.log('\n🔍 Potentially Searchable Text Columns:');
    console.log('=====================================');
    searchableColumns.forEach(col => console.log(`  - ${col}`));

    // Get sample data
    console.log('\n📝 Sample Listings Data:');
    console.log('======================');
    
    const sampleResult = await query(`
      SELECT 
        listing_id,
        list_price,
        street_number,
        street_name,
        street_type,
        city,
        postal_code,
        property_type,
        property_sub_type,
        bedrooms_total,
        bathrooms_total,
        building_area_total,
        lot_size_area,
        public_remarks,
        listing_contract_date,
        modification_timestamp,
        status
      FROM listings 
      WHERE status = 'Active'
      LIMIT 5;
    `);

    if (sampleResult.rows.length > 0) {
      sampleResult.rows.forEach((listing: any, index: number) => {
        console.log(`\n--- Listing ${index + 1} ---`);
        console.log(`ID: ${listing.listing_id}`);
        console.log(`Address: ${listing.street_number} ${listing.street_name} ${listing.street_type}, ${listing.city} ${listing.postal_code}`);
        console.log(`Price: $${listing.list_price?.toLocaleString()}`);
        console.log(`Type: ${listing.property_type} - ${listing.property_sub_type}`);
        console.log(`Beds/Baths: ${listing.bedrooms_total}/${listing.bathrooms_total}`);
        console.log(`Area: ${listing.building_area_total} sqft`);
        console.log(`Remarks: ${listing.public_remarks?.substring(0, 100)}...`);
      });
    }

    // Check indexes for performance
    console.log('\n⚡ Indexes on Listings Table:');
    console.log('============================');
    
    const indexesResult = await query(`
      SELECT 
        indexname,
        indexdef
      FROM pg_indexes
      WHERE tablename = 'listings';
    `);

    indexesResult.rows.forEach((idx: any) => {
      console.log(`  ${idx.indexname}`);
      console.log(`    Definition: ${idx.indexdef.substring(0, 100)}...`);
    });

    // Count total active listings
    const countResult = await query(`
      SELECT COUNT(*) as total FROM listings WHERE status = 'Active';
    `);
    
    console.log(`\n📊 Total Active Listings: ${countResult.rows[0].total}`);

    // Check for full-text search capabilities
    console.log('\n🔍 Checking for Full-Text Search Support:');
    console.log('=======================================');
    
    const ftsResult = await query(`
      SELECT 
        attname as column_name,
        typname as data_type
      FROM pg_attribute a
      JOIN pg_type t ON a.atttypid = t.oid
      WHERE a.attrelid = 'listings'::regclass
      AND typname = 'tsvector';
    `);

    if (ftsResult.rows.length > 0) {
      console.log('Full-text search columns found:');
      ftsResult.rows.forEach((col: any) => {
        console.log(`  - ${col.column_name}`);
      });
    } else {
      console.log('No tsvector columns found. May need to create full-text search indexes.');
    }

  } catch (error) {
    console.error('❌ Error exploring listings table:', error);
  } finally {
    process.exit();
  }
}

exploreListingsTable(); 