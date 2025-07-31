import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

// Create connection specifically for the listings database
const listingsConnectionString = process.env.LISTINGS_DB_URL || 'postgresql://pooya:hR72fW9nTqZxB3dMvgKpY1CsJeULoXNb@listings.realtorpooya.ca:5432/listings'

// Create pool for listings database
const listingsPool = new Pool({
  connectionString: listingsConnectionString,
  ssl: { rejectUnauthorized: false }
})

// Create drizzle instance for listings database
export const listingsDb = drizzle(listingsPool) 