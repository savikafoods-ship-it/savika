// Test script to check email configuration
const fs = require('fs');
const path = require('path');

// Try to read .env.local
const envPath = path.join(__dirname, '.env.local');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  
  lines.forEach(line => {
    if (line.includes('RESEND_API_KEY') || line.includes('ADMIN_EMAIL') || line.includes('NEXT_PUBLIC_FROM_EMAIL')) {
      console.log('Found:', line);
    }
  });
}

console.log('Environment check complete');
