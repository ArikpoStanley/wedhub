const { MongoClient } = require('mongodb');

async function testContactsDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.MONGODB_DB_NAME || 'wedding_website';
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const contactsCollection = db.collection('contacts');
    
    // Test data
    const testContact = {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1-555-123-4567",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Insert test contact
    console.log('Inserting test contact...');
    const insertResult = await contactsCollection.insertOne(testContact);
    console.log('Contact inserted with ID:', insertResult.insertedId);
    
    // Retrieve the contact
    console.log('Retrieving contact...');
    const retrievedContact = await contactsCollection.findOne({ _id: insertResult.insertedId });
    console.log('Retrieved contact:', retrievedContact);
    
    // Update the contact
    console.log('Updating contact...');
    const updateResult = await contactsCollection.updateOne(
      { _id: insertResult.insertedId },
      { $set: { phoneNumber: "+1-555-987-6543", updatedAt: new Date() } }
    );
    console.log('Update result:', updateResult.modifiedCount, 'document(s) modified');
    
    // Get all contacts
    console.log('Getting all contacts...');
    const allContacts = await contactsCollection.find({}).toArray();
    console.log('Total contacts:', allContacts.length);
    
    // Clean up - delete test contact
    console.log('Cleaning up test data...');
    const deleteResult = await contactsCollection.deleteOne({ _id: insertResult.insertedId });
    console.log('Delete result:', deleteResult.deletedCount, 'document(s) deleted');
    
    console.log('✅ Contact database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing contacts database:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the test
testContactsDatabase().catch(console.error);