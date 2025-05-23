import { query } from '@/lib/db/connection';

async function exploreDatabaseStructure() {
  console.log('🔍 Exploring TREB Database Structure...\n');

  try {
    // Get all tables
    const tablesResult = await query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log('📊 Available Tables:');
    console.log('==================');
    tablesResult.rows.forEach((row: any) => {
      console.log(`- ${row.table_name}`);
    });

    // Look for Property table specifically
    const propertyTable = tablesResult.rows.find((row: any) => 
      row.table_name.toLowerCase().includes('property')
    );

    if (propertyTable) {
      console.log(`\n📋 Exploring ${propertyTable.table_name} structure:`);
      console.log('=====================================');
      
      const columnsResult = await query(`
        SELECT 
          column_name, 
          data_type, 
          character_maximum_length,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `, [propertyTable.table_name]);

      columnsResult.rows.forEach((col: any) => {
        console.log(`  ${col.column_name} (${col.data_type}${col.character_maximum_length ? `(${col.character_maximum_length})` : ''}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
      });

      // Sample data
      console.log(`\n📝 Sample data from ${propertyTable.table_name}:`);
      console.log('=====================================');
      
      const sampleResult = await query(`
        SELECT * FROM ${propertyTable.table_name} 
        LIMIT 3;
      `);

      if (sampleResult.rows.length > 0) {
        console.log('Sample fields:', Object.keys(sampleResult.rows[0]).slice(0, 10).join(', '), '...');
        console.log(`Total sample records: ${sampleResult.rows.length}`);
      } else {
        console.log('No data found in property table');
      }
    }

    // Look for Media table
    const mediaTable = tablesResult.rows.find((row: any) => 
      row.table_name.toLowerCase().includes('media')
    );

    if (mediaTable) {
      console.log(`\n🖼️  Exploring ${mediaTable.table_name} structure:`);
      console.log('=====================================');
      
      const columnsResult = await query(`
        SELECT 
          column_name, 
          data_type 
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position 
        LIMIT 10;
      `, [mediaTable.table_name]);

      columnsResult.rows.forEach((col: any) => {
        console.log(`  ${col.column_name} (${col.data_type})`);
      });
    }

    // Check for indexes
    console.log('\n🔍 Checking indexes on property table:');
    console.log('=====================================');
    
    if (propertyTable) {
      const indexesResult = await query(`
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes
        WHERE tablename = $1
        LIMIT 10;
      `, [propertyTable.table_name]);

      indexesResult.rows.forEach((idx: any) => {
        console.log(`  ${idx.indexname}`);
      });
    }

  } catch (error) {
    console.error('❌ Error exploring database:', error);
  } finally {
    process.exit();
  }
}

exploreDatabaseStructure(); 