import mongoose from "mongoose";

let connecting: Promise<typeof mongoose> | null = null;

export async function connectMongoose(): Promise<typeof mongoose> {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }
  if (connecting) {
    return connecting;
  }

  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
  const dbName = process.env.MONGODB_DB_NAME || "wedding_website";

  const options = {
    dbName,
    serverSelectionTimeoutMS: 30_000,
    connectTimeoutMS: 30_000,
    socketTimeoutMS: 45_000,
    maxPoolSize: 10,
    ...(process.platform === "win32" && { family: 4 as const }),
  };

  connecting = mongoose.connect(uri, options).then(() => mongoose);
  try {
    await connecting;
    return mongoose;
  } finally {
    connecting = null;
  }
}

export async function disconnectMongoose(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
