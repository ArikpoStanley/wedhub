# Windows Setup Guide for Wedding Website

This guide provides Windows-specific instructions for setting up and running the wedding website.

## Quick Start

1. **Run the Windows setup script**:
   ```cmd
   setup-windows.bat
   ```
   This will automatically install dependencies and test your MongoDB connection.

2. **Start the development server**:
   ```cmd
   npm run dev
   ```

## Manual Setup

### Prerequisites
- Node.js (LTS version 18.x or 20.x recommended)
- Git for Windows
- MongoDB (local installation recommended)

### Step 1: Install MongoDB Locally (Recommended)

1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. During installation:
   - ✅ Install MongoDB as a Windows Service
   - ✅ Install MongoDB Compass (optional GUI)
   - ✅ Add MongoDB to PATH

3. Start MongoDB service:
   ```cmd
   # As Administrator
   net start MongoDB
   ```

4. Verify MongoDB is running:
   ```cmd
   sc query MongoDB
   ```

### Step 2: Configure Environment

1. Copy the `.env` file and update it:
   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=wedding_website
   ```

### Step 3: Install Dependencies

```cmd
npm install --legacy-peer-deps
```

### Step 4: Test Setup

```cmd
npm run setup:windows
```

### Step 5: Start Development

```cmd
npm run dev
```

Then open `/admin/setup` to create your site. Use `npm run dev:clean` only if you rely on that script name; it runs the same server as `dev`.

## Common Windows Issues & Solutions

### Issue: "NODE_ENV is not recognized"
**Solution**: The project uses `cross-env` to handle this. Make sure dependencies are installed.

### Issue: SSL/TLS errors with MongoDB Atlas
**Solutions**:
1. Use local MongoDB instead (recommended)
2. Update Node.js to latest LTS
3. Check Windows Firewall settings
4. Try a different network

### Issue: "mongod is not recognized"
**Solution**: 
1. Reinstall MongoDB and ensure "Add to PATH" is checked
2. Restart Command Prompt
3. Or use full path: `"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe"`

### Issue: Permission denied errors
**Solution**: Run Command Prompt as Administrator

### Issue: Port 5000 already in use
**Solution**: 
1. Find what's using port 5000: `netstat -ano | findstr :5000`
2. Kill the process: `taskkill /PID <process_id> /F`
3. Or change the port in `.env`: `PORT=3000`

## Development Commands

```cmd
# Start development server
npm run dev

# Alias of dev (same behavior)
npm run dev:clean

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run check

# Windows setup check
npm run setup:windows
```

## File Structure

```
wedding-website/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── .env             # Environment variables
├── setup-windows.js # Windows setup script
└── setup-windows.bat # Windows batch setup
```

## Getting Help

1. Run the setup script: `npm run setup:windows`
2. Check the logs for specific error messages
3. Refer to `MONGODB_SETUP.md` for detailed MongoDB setup
4. For SSL/TLS issues, try local MongoDB instead of Atlas

## Production Deployment

For Windows Server deployment:
1. Install Node.js and MongoDB on the server
2. Use PM2 or similar process manager
3. Configure Windows Firewall for the application port
4. Set up MongoDB as a Windows Service

```cmd
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "wedding-website" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```