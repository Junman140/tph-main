// Script to apply database migrations
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with service role key for admin access
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigrations() {
  console.log('Starting database migrations...');
  
  // Get all SQL files from migrations directory
  const migrationsDir = path.join(__dirname, '..', 'migrations');
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Apply in alphabetical order
  
  console.log(`Found ${migrationFiles.length} migration files`);
  
  // Apply each migration
  for (const file of migrationFiles) {
    console.log(`Applying migration: ${file}`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // Execute the SQL
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error(`Error applying migration ${file}:`, error);
      process.exit(1);
    }
    
    console.log(`Successfully applied migration: ${file}`);
  }
  
  console.log('All migrations applied successfully!');
}

// Run migrations
applyMigrations().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
