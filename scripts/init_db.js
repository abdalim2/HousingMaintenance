// Database initialization script
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection URL
const dbUrl = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';

// Path to SQL file
const sqlFilePath = path.join(__dirname, 'init_database.sql');

console.log('Starting database initialization...');
console.log('Reading SQL file...');

// Read the SQL file
fs.readFile(sqlFilePath, 'utf8', (err, sql) => {
  if (err) {
    console.error('Error reading SQL file:', err);
    process.exit(1);
  }

  // Command to execute the SQL script
  const command = `psql "${dbUrl}" -f "${sqlFilePath}"`;
  
  console.log('Executing SQL script...');
  
  // Execute the SQL script
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error executing SQL script:', error);
      console.error(stderr);
      process.exit(1);
    }
    
    console.log('SQL execution output:');
    console.log(stdout);
    console.log('Database initialization completed successfully!');
  });
});