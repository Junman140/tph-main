// Script to apply the event_registrations table migration
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('Applying event_registrations table migration...');
    
    // Read the migration SQL
    const migrationPath = path.join(__dirname, '..', 'migrations', 'create_event_registrations_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Migration SQL loaded, executing...');
    
    // Execute the SQL directly
    const { error } = await supabase.from('_exec_sql').rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error applying migration:', error);
      process.exit(1);
    }
    
    console.log('Migration applied successfully!');
    
    // Verify the table exists
    const { data, error: checkError } = await supabase
      .from('event_registrations')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error verifying table creation:', checkError);
      process.exit(1);
    }
    
    console.log('Table verification successful. The event_registrations table is ready to use.');
  } catch (err) {
    console.error('Unexpected error during migration:', err);
    process.exit(1);
  }
}

// Run the migration
applyMigration();
