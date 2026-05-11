import "dotenv/config";
import mongoose from "mongoose";

async function testContactsDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.MONGODB_DB_NAME || "wedding_website";

  try {
    await mongoose.connect(uri, { dbName });
    console.log("Connected with Mongoose");

    const col = mongoose.connection.db.collection("contacts");

    const testContact = {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phoneNumber: "+1-555-123-4567",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Inserting test contact...");
    const insertResult = await col.insertOne(testContact);
    console.log("Contact inserted with ID:", insertResult.insertedId);

    console.log("Retrieving contact...");
    const retrievedContact = await col.findOne({ _id: insertResult.insertedId });
    console.log("Retrieved contact:", retrievedContact);

    console.log("Updating contact...");
    const updateResult = await col.updateOne(
      { _id: insertResult.insertedId },
      { $set: { phoneNumber: "+1-555-987-6543", updatedAt: new Date() } }
    );
    console.log("Update result:", updateResult.modifiedCount, "document(s) modified");

    console.log("Getting all contacts...");
    const allContacts = await col.find({}).toArray();
    console.log("Total contacts:", allContacts.length);

    console.log("Cleaning up test data...");
    const deleteResult = await col.deleteOne({ _id: insertResult.insertedId });
    console.log("Delete result:", deleteResult.deletedCount, "document(s) deleted");

    console.log("✅ Contact database test completed successfully!");
  } catch (error) {
    console.error("❌ Error testing contacts database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected.");
  }
}

testContactsDatabase().catch(console.error);
