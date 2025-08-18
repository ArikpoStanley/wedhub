// Windows-specific setup script
import 'dotenv/config';
import { MongoClient } from 'mongodb';

console.log('🪟 Windows Setup Script for Wedding Website');
console.log('==========================================\n');

// Check Node.js version
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}\n`);

// Test MongoDB connection with Windows-friendly options
async function testMongoConnection() {
  console.log('Testing MongoDB connection...');
  
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env file');
    return false;
  }
  
  console.log('Connection URI:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4, // Force IPv4 on Windows
      maxPoolSize: 10,
      minPoolSize: 5,
    });
    
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const db = client.db(process.env.MONGODB_DB_NAME || 'wedding_website');
    await db.command({ ping: 1 });
    console.log('✅ Database ping successful!');
    
    await client.close();
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n💡 SSL/TLS Error Solutions:');
      console.log('1. Check if your MongoDB Atlas cluster allows connections from your IP');
      console.log('2. Try using a local MongoDB instance instead');
      console.log('3. Check Windows firewall settings');
      console.log('4. Update Node.js to the latest LTS version');
    }
    
    return false;
  }
}

// Check required dependencies
async function checkDependencies() {
  console.log('Checking dependencies...');

  const requiredDeps = ['express', 'mongodb', 'dotenv', 'cross-env'];
  const fs = await import('fs');
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

  for (const dep of requiredDeps) {
    if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
      console.log(`✅ ${dep} is installed`);
    } else {
      console.log(`❌ ${dep} is missing`);
    }
  }
}

// Main setup function
async function runSetup() {
  try {
    await checkDependencies();
    console.log('');

    const mongoSuccess = await testMongoConnection();

    console.log('\n==========================================');
    if (mongoSuccess) {
      console.log('🎉 Setup complete! You can now run: npm run dev');
    } else {
      console.log('⚠️  Setup completed with warnings. Check MongoDB connection.');
      console.log('You can still try running: npm run dev:clean (without database seeding)');
    }

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

runSetup();