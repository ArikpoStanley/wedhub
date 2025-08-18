import { MongoClient } from 'mongodb';

async function testConnection() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'wedding_website';

  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('URI:', uri);
    console.log('Database:', dbName);
    
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB successfully!');
    
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 It looks like MongoDB is not running locally.');
      console.log('Options:');
      console.log('1. Install and start MongoDB locally');
      console.log('2. Use MongoDB Atlas (cloud database)');
      console.log('3. Use Docker: docker run -d -p 27017:27017 mongo');
    }
  }
}

testConnection();