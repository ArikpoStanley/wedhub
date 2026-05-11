import "dotenv/config";
import { resolve } from "path";
import { config } from "dotenv";
config({ path: resolve(process.cwd(), "server/.env") });

import mongoose from "mongoose";

async function testConnection() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.MONGODB_DB_NAME || "wedding_website";

  try {
    console.log("Attempting to connect with Mongoose...");
    console.log("Database:", dbName);

    await mongoose.connect(uri, { dbName });
    console.log("✅ Connected successfully!");

    const names = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections:", names.map((c) => c.name).join(", ") || "(none)");

    await mongoose.disconnect();
    console.log("Disconnected.");
  } catch (error) {
    console.error("❌ Failed:", error instanceof Error ? error.message : error);
  }
}

testConnection();
