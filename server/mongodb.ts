import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
let db: Db;

export async function connectToMongoDB(): Promise<Db> {
  if (db) {
    return db;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'wedding_website';

  try {
    // Windows-friendly MongoDB connection options
    const options = {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      // Handle Windows SSL/TLS issues
      ...(process.platform === 'win32' && {
        family: 4, // Force IPv4 on Windows
      })
    };
    
    client = new MongoClient(uri, options);
    await client.connect();
    
    // Test the connection
    await client.db("admin").command({ ping: 1 });
    
    db = client.db(dbName);
    console.log('Connected to MongoDB successfully');
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    console.error('If you\'re on Windows and seeing SSL errors, try using a local MongoDB instance or check your network settings');
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongoDB first.');
  }
  return db;
}

export async function closeMongoDB(): Promise<void> {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Collection getters
export function getRSVPCollection(): Collection {
  return getDatabase().collection('rsvps');
}

export function getGuestCollection(): Collection {
  return getDatabase().collection('guests');
}

export function getWeddingEventCollection(): Collection {
  return getDatabase().collection('wedding_events');
}

export function getContactCollection(): Collection {
  return getDatabase().collection('contacts');
}