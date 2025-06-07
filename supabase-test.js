// Supabase connection test script
const { createClient } = require('@supabase/supabase-js');
const https = require('https');

// Use the provided Supabase credentials
const supabaseUrl = 'https://pfcagyqrrzpepgssjrav.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmY2FneXFycnpwZXBnc3NqcmF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MjQ0MzksImV4cCI6MjA2MDIwMDQzOX0.stgXQJDdOI47aIP0yh9RZqt1PSX-EWa6-OcfTpsrtf8';

// First, let's check if the Supabase URL is reachable
function checkUrlReachable(url) {
  return new Promise((resolve) => {
    const hostname = new URL(url).hostname;
    console.log(`Checking if ${hostname} is reachable...`);
    
    const req = https.request(
      {
        hostname: hostname,
        port: 443,
        path: '/',
        method: 'HEAD',
        timeout: 5000, // 5 second timeout
      },
      (res) => {
        console.log(`Status code: ${res.statusCode}`);
        resolve(res.statusCode < 500); // Consider anything below 500 as "reachable"
      }
    );

    req.on('error', (err) => {
      console.error(`Error reaching ${hostname}:`, err.message);
      resolve(false);
    });

    req.on('timeout', () => {
      console.error(`Timeout reaching ${hostname}`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
}

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Test connection by querying system time
    const { data, error } = await supabase.from('posts').select('count()', { count: 'exact' });
    
    if (error) {
      console.error('Connection error:', error.message);
      return false;
    }
    
    console.log('Connection successful!');
    console.log('Database contains posts:', data);
    
    // Test a few more tables to verify schema
    const tablesTest = [
      { name: 'events', query: () => supabase.from('events').select('count()', { count: 'exact' }) },
      { name: 'prayers', query: () => supabase.from('prayers').select('count()', { count: 'exact' }) },
      { name: 'prayer_support', query: () => supabase.from('prayer_support').select('count()', { count: 'exact' }) },
      { name: 'testimonies', query: () => supabase.from('testimonies').select('count()', { count: 'exact' }) }
    ];
    
    for (const table of tablesTest) {
      const { data, error } = await table.query();
      if (error) {
        console.log(`Table ${table.name} error:`, error.message);
      } else {
        console.log(`Table ${table.name} exists and contains:`, data);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

testConnection()
  .then(isConnected => {
    if (!isConnected) {
      console.log('Failed to connect to Supabase');
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
  });
