# Database Access Documentation

This document explains how to connect to and fetch data from the CRM database from external applications.

## Database Connection Details

**Database Type**: PostgreSQL (Supabase)
**Host**: `aws-0-us-east-1.pooler.supabase.com`
**Port**: `5432` (direct) / `6543` (pooled)
**Database**: `postgres`
**Schema**: `public`

## Authentication Methods

### 1. Service Role Key (Admin Access)
For server-side applications that need full database access:

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ktbfuijzvgbzfoodraza.supabase.co'
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YmZ1aWp6dmdiemZvb2RyYXphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgyNDc3MywiZXhwIjoyMDYyNDAwNzczfQ.PVCdndBHP28uS4y159pZpvcO6PdPfBmvHfxKuoUMA2E'

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
```

### 2. Anonymous Key (Public Access)
For client-side applications with Row Level Security:

```javascript
const supabaseUrl = 'https://ktbfuijzvgbzfoodraza.supabase.co'
const anonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0YmZ1aWp6dmdiemZvb2RyYXphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MjQ3NzMsImV4cCI6MjA2MjQwMDc3M30.WBYAonOzLWyj_lb4EuxsseGuMqLVzkv-mqIQhxpV5gc'

const supabase = createClient(supabaseUrl, anonKey)
```

### 3. Direct PostgreSQL Connection
For applications that prefer direct database access:

```javascript
// Node.js with pg
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: 'postgres://postgres.ktbfuijzvgbzfoodraza:wb7P51mATjWuK8t1@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require&supa=base-pooler.x'
})

// Python with psycopg2
import psycopg2
conn = psycopg2.connect(
    host="aws-0-us-east-1.pooler.supabase.com",
    port=6543,
    database="postgres",
    user="postgres.ktbfuijzvgbzfoodraza",
    password="wb7P51mATjWuK8t1",
    sslmode="require"
)
```

## Database Schema

### Core Tables

#### Properties
```sql
-- Main property listings table
SELECT * FROM properties;

-- Key columns:
-- id (uuid) - Primary key
-- mls_id (text) - MLS listing ID
-- address, city, province, postal_code - Location
-- price (integer) - Property price
-- property_type (enum) - detached, condo, townhouse, lot, multi-res
-- status (enum) - coming_soon, active, conditional, sold, leased, archived
-- bedrooms (text) - Supports formats like "3+1", "4+x"
-- bathrooms (integer)
-- description (text)
-- media_urls (text[]) - Array of image URLs
-- hero_image (text) - Main property image
-- listing_date (timestamp)
-- agent_owner_id (uuid) - FK to agents table
```

#### Clients
```sql
-- Client/customer information
SELECT * FROM clients;

-- Key columns:
-- id (uuid) - Primary key
-- full_name (text)
-- email (text)
-- phone (text)
-- client_type (enum) - buyer, seller, investor, tenant, landlord
-- stage (enum) - new lead, engaged, offer sent, closed won, closed lost
-- agent_id (uuid) - FK to agents table
-- archived (boolean) - Soft delete flag
```

#### Agents
```sql
-- Real estate agents
SELECT * FROM agents;

-- Key columns:
-- id (uuid) - Primary key
-- name (text)
-- email (text)
-- phone (text)
-- user_id (uuid) - FK to auth.users
```

#### Showings
```sql
-- Property showing appointments
SELECT * FROM showings;

-- Key columns:
-- id (uuid) - Primary key
-- property_id (uuid) - FK to properties
-- client_id (uuid) - FK to clients
-- scheduled_at (timestamp)
-- status (enum) - scheduled, completed, cancelled
-- feedback (text)
-- agent_id (uuid) - FK to agents
```

#### Offers
```sql
-- Purchase offers
SELECT * FROM offers;

-- Key columns:
-- id (uuid) - Primary key
-- client_id (uuid) - FK to clients
-- property_id (uuid) - FK to properties
-- offer_price (integer)
-- status (enum) - pending, accepted, rejected, withdrawn
-- submitted_at (timestamp)
```

#### Tasks
```sql
-- Agent tasks and reminders
SELECT * FROM tasks;

-- Key columns:
-- id (uuid) - Primary key
-- title (text)
-- due_at (timestamp)
-- status (enum) - pending, done, snoozed
-- priority (enum) - low, medium, high
-- client_id (uuid) - FK to clients (optional)
-- property_id (uuid) - FK to properties (optional)
-- created_by (uuid) - FK to agents
```

## Common Queries

### 1. Get All Active Properties
```javascript
// Supabase JS
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .neq('status', 'archived')
  .order('listing_date', { ascending: false })

// SQL
SELECT * FROM properties 
WHERE status != 'archived' 
ORDER BY listing_date DESC;
```

### 2. Get Properties with Agent Info
```javascript
// Supabase JS
const { data, error } = await supabase
  .from('properties')
  .select(`
    *,
    agents (
      id,
      name,
      email,
      phone
    )
  `)
  .eq('status', 'active')

// SQL
SELECT p.*, a.name as agent_name, a.email as agent_email, a.phone as agent_phone
FROM properties p
LEFT JOIN agents a ON p.agent_owner_id = a.id
WHERE p.status = 'active';
```

### 3. Get Client Activity
```javascript
// Supabase JS - Get client with recent showings and offers
const { data, error } = await supabase
  .from('clients')
  .select(`
    *,
    showings (
      id,
      scheduled_at,
      status,
      properties (address, city, price)
    ),
    offers (
      id,
      offer_price,
      status,
      submitted_at,
      properties (address, city, list_price: price)
    )
  `)
  .eq('id', clientId)
  .single()
```

### 4. Get Agent Dashboard Data
```javascript
// Supabase JS
const agentId = 'your-agent-id'

// Get properties count by status
const { data: propertyCounts } = await supabase
  .from('properties')
  .select('status')
  .eq('agent_owner_id', agentId)

// Get recent showings
const { data: recentShowings } = await supabase
  .from('showings')
  .select(`
    *,
    properties (address, city),
    clients (full_name, email)
  `)
  .eq('agent_id', agentId)
  .gte('scheduled_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
  .order('scheduled_at', { ascending: false })

// Get pending tasks
const { data: pendingTasks } = await supabase
  .from('tasks')
  .select(`
    *,
    clients (full_name),
    properties (address, city)
  `)
  .eq('created_by', agentId)
  .eq('status', 'pending')
  .order('due_at', { ascending: true })
```

### 5. Search Properties
```javascript
// Supabase JS - Full-text search
const { data, error } = await supabase
  .from('properties')
  .select('*')
  .or(`address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
  .neq('status', 'archived')

// SQL with filters
SELECT * FROM properties 
WHERE status != 'archived'
  AND (
    address ILIKE '%search_term%' 
    OR city ILIKE '%search_term%'
    OR description ILIKE '%search_term%'
  )
  AND price BETWEEN 300000 AND 800000
  AND property_type = 'detached';
```

## Real-Time Subscriptions

### Listen to Property Changes
```javascript
const subscription = supabase
  .channel('properties')
  .on('postgres_changes', 
    { 
      event: '*', 
      schema: 'public', 
      table: 'properties' 
    }, 
    (payload) => {
      console.log('Property changed:', payload)
      // Handle the change
    }
  )
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

### Listen to New Showings
```javascript
const subscription = supabase
  .channel('showings')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'showings' 
    }, 
    (payload) => {
      console.log('New showing scheduled:', payload.new)
    }
  )
  .subscribe()
```

## REST API Endpoints

The CRM also exposes REST endpoints for external integrations:

### Base URL
```
https://your-crm-domain.com/api
```

### Available Endpoints

#### Properties
```bash
# Get all properties
GET /api/properties

# Get single property
GET /api/properties?id={property_id}

# Create property
POST /api/properties
Content-Type: application/json
{
  "address": "123 Main St",
  "city": "Toronto",
  "province": "Ontario",
  "postalCode": "M5V 2H1",
  "price": 650000,
  "propertyType": "detached",
  "status": "active"
}
```

#### Clients
```bash
# Get all clients
GET /api/clients

# Get client with related data
GET /api/clients/{client_id}/related
```

#### Showings
```bash
# Get all showings
GET /api/showings

# Get showing with related data
GET /api/showings/{showing_id}/related
```

## Example Applications

### 1. Property Website Integration
```javascript
// Fetch active properties for public website
async function getActiveProperties() {
  const { data: properties } = await supabase
    .from('properties')
    .select(`
      id,
      address,
      city,
      province,
      price,
      property_type,
      bedrooms,
      bathrooms,
      description,
      media_urls,
      hero_image,
      listing_date
    `)
    .eq('status', 'active')
    .order('listing_date', { ascending: false })
    .limit(20)
  
  return properties
}
```

### 2. Mobile App Sync
```javascript
// Sync agent data for mobile app
async function syncAgentData(agentId) {
  const [properties, clients, showings, tasks] = await Promise.all([
    // Agent's properties
    supabase
      .from('properties')
      .select('*')
      .eq('agent_owner_id', agentId)
      .neq('status', 'archived'),
    
    // Agent's clients
    supabase
      .from('clients')
      .select('*')
      .eq('agent_id', agentId)
      .eq('archived', false),
    
    // Upcoming showings
    supabase
      .from('showings')
      .select(`*, properties(*), clients(*)`)
      .eq('agent_id', agentId)
      .gte('scheduled_at', new Date().toISOString()),
    
    // Pending tasks
    supabase
      .from('tasks')
      .select(`*, clients(*), properties(*)`)
      .eq('created_by', agentId)
      .eq('status', 'pending')
  ])
  
  return {
    properties: properties.data,
    clients: clients.data,
    showings: showings.data,
    tasks: tasks.data
  }
}
```

### 3. Analytics Dashboard
```javascript
// Get analytics data
async function getAnalytics(agentId, startDate, endDate) {
  // Properties sold in date range
  const { data: soldProperties } = await supabase
    .from('properties')
    .select('price, closing_date')
    .eq('agent_owner_id', agentId)
    .eq('status', 'sold')
    .gte('closing_date', startDate)
    .lte('closing_date', endDate)
  
  // New clients acquired
  const { data: newClients } = await supabase
    .from('clients')
    .select('id, created_at, stage')
    .eq('agent_id', agentId)
    .gte('created_at', startDate)
    .lte('created_at', endDate)
  
  // Showings completed
  const { data: completedShowings } = await supabase
    .from('showings')
    .select('id, scheduled_at')
    .eq('agent_id', agentId)
    .eq('status', 'completed')
    .gte('scheduled_at', startDate)
    .lte('scheduled_at', endDate)
  
  return {
    totalSales: soldProperties?.reduce((sum, p) => sum + p.price, 0) || 0,
    propertiesSold: soldProperties?.length || 0,
    newClients: newClients?.length || 0,
    showingsCompleted: completedShowings?.length || 0
  }
}
```

## Security Considerations

### Row Level Security (RLS)
The database uses RLS policies to ensure data isolation:

- **Agents** can only see their own properties, clients, and related data
- **Service role** bypasses all RLS policies (use carefully)
- **Anonymous access** is restricted by RLS policies

### Best Practices

1. **Use Service Role Key only on secure servers**
2. **Implement proper authentication** for client applications
3. **Validate all inputs** before database operations
4. **Use prepared statements** to prevent SQL injection
5. **Monitor database access** through Supabase dashboard

### Rate Limiting
- Supabase has built-in rate limiting
- For high-volume applications, consider implementing caching
- Use connection pooling for better performance

## Error Handling

```javascript
// Proper error handling example
async function fetchProperties() {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
    
    if (error) {
      console.error('Database error:', error.message)
      throw new Error('Failed to fetch properties')
    }
    
    return data
  } catch (error) {
    console.error('Fetch error:', error)
    // Handle error appropriately
    return []
  }
}
```

## Support

For additional help:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Review the CRM codebase for implementation examples
3. Contact the development team for specific integration questions

---

**Note**: Keep all API keys and connection strings secure. Never expose service role keys in client-side code. 