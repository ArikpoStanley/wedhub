// Windows-specific setup script
import "dotenv/config";
import mongoose from "mongoose";

console.log("🪟 Windows Setup Script for Wedding Website");
console.log("==========================================\n");

// Check Node.js version
console.log(`Node.js version: ${process.version}`);
console.log(`Platform: ${process.platform}`);
console.log(`Architecture: ${process.arch}\n`);

// Test database connection with Windows-friendly options (Mongoose only)
async function testDatabaseConnection() {
  console.log("Testing database connection (Mongoose)...");

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not found in .env file");
    return false;
  }

  console.log("Connection URI:", uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));

  try {
    await mongoose.connect(uri, {
      dbName: process.env.MONGODB_DB_NAME || "wedding_website",
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      family: 4,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    console.log("✅ Connection successful!");

    const db = mongoose.connection.db;
    if (db) {
      await db.command({ ping: 1 });
      console.log("✅ Database ping successful!");
    }

    await mongoose.disconnect();
    return true;
  } catch (error) {
    console.error("❌ Connection failed:", error instanceof Error ? error.message : error);

    if (
      error instanceof Error &&
      (error.message.includes("SSL") || error.message.includes("TLS"))
    ) {
      console.log("\n💡 SSL/TLS Error Solutions:");
      console.log("1. Check if your Atlas cluster allows connections from your IP");
      console.log("2. Try using a local database instance instead");
      console.log("3. Check Windows firewall settings");
      console.log("4. Update Node.js to the latest LTS version");
    }

    try {
      await mongoose.disconnect();
    } catch {
      /* ignore */
    }
    return false;
  }
}

// Check required dependencies
async function checkDependencies() {
  console.log("Checking dependencies...");

  const requiredDeps = ["express", "mongoose", "dotenv", "cross-env"];
  const fs = await import("fs");
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));

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
    console.log("");

    const ok = await testDatabaseConnection();

    console.log("\n==========================================");
    if (ok) {
      console.log("🎉 Setup complete! You can now run: npm run dev");
    } else {
      console.log("⚠️  Setup completed with warnings. Check your connection string.");
      console.log("You can still try running: npm run dev after fixing your connection string.");
    }
  } catch (error) {
    console.error("Setup failed:", error);
  }
}

runSetup();
