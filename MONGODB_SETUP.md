# MongoDB Backend Implementation

This wedding website now uses MongoDB as the backend database instead of PostgreSQL. Here's how to set it up and use it.

## Features Implemented

### 1. Database Models
- **RSVPs**: Store guest responses with attendance status, guest count, and messages
- **Guests**: Manage guest list with contact info, table assignments, and RSVP status
- **Wedding Events**: Store ceremony, reception, and other wedding event details

### 2. API Endpoints

#### RSVP Endpoints
- `POST /api/rsvp` - Submit a new RSVP
- `GET /api/rsvp/:id` - Get specific RSVP by ID
- `GET /api/rsvps` - Get all RSVPs (admin)
- `PUT /api/rsvp/:id` - Update an RSVP

#### Guest Endpoints
- `POST /api/guests` - Add a new guest
- `GET /api/guests` - Get all guests
- `GET /api/guests/:id` - Get specific guest

#### Wedding Event Endpoints
- `POST /api/events` - Create a wedding event
- `GET /api/events` - Get all wedding events
- `GET /api/events/:id` - Get specific event

#### Utility
- `GET /api/health` - Health check endpoint

### 3. Frontend Integration
- Updated RSVP form to use MongoDB backend
- Added admin dashboard to view RSVPs and guests
- Client-side API service for all backend interactions

## Setup Instructions

### Windows-Specific Setup
For Windows users, we've included a special setup script:

1. **Quick Setup (Recommended)**:
   ```cmd
   setup-windows.bat
   ```
   This will install dependencies and test your MongoDB connection.

2. **Manual Setup**: Follow the steps below.

### 1. Install MongoDB
Choose one of these options:

#### Option A: Local MongoDB (Recommended for Windows)
1. Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. During installation, make sure to:
   - Install MongoDB as a Windows Service
   - Install MongoDB Compass (GUI tool)
3. Start MongoDB service:
   ```cmd
   # Windows Command Prompt (as Administrator)
   net start MongoDB
   
   # Or using PowerShell (as Administrator)
   Start-Service MongoDB
   
   # Verify it's running
   sc query MongoDB
   ```
4. Update your `.env` file to use local MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=wedding_website
   ```

#### Option B: MongoDB Atlas (Cloud) - Windows Considerations
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. **Important for Windows**: Add your IP address to the IP whitelist
4. Create a database user with read/write permissions
5. Get your connection string
6. **Windows SSL/TLS Issues**: If you encounter SSL errors:
   - Try using Node.js LTS version (18.x or 20.x)
   - Check Windows firewall settings
   - Consider using local MongoDB instead

### 2. Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your MongoDB connection details:
   ```env
   # For local MongoDB
   MONGODB_URI=mongodb://localhost:27017
   MONGODB_DB_NAME=wedding_website
   
   # For MongoDB Atlas
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wedding_website?retryWrites=true&w=majority
   MONGODB_DB_NAME=wedding_website
   ```

### 3. Install Dependencies
```cmd
# Windows users should use --legacy-peer-deps flag
npm install --legacy-peer-deps

# Or run the Windows setup script
npm run setup:windows
```

### 4. Start the Application
```cmd
npm run dev

# Same command (kept for older notes/scripts):
npm run dev:clean

# Windows users can also use:
setup-windows.bat
```

After the app is running, open `/admin/setup` in the browser to create and publish your wedding site. Nothing is inserted into the database automatically.

## Usage

### For Guests
1. Visit the RSVP page at `/rsvp`
2. Fill out the form with your details
3. Submit your RSVP response

### For Wedding Couple/Admin
1. Visit the admin dashboard at `/admin`
2. View all RSVP responses
3. See guest statistics and details
4. Monitor attendance numbers

## Database Schema

### RSVP Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  whatsappInvite: "yes" | "no",
  willAttend?: "yes" | "no",
  guests: number,
  message?: string,
  tableNumber?: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Guest Collection
```typescript
{
  _id: ObjectId,
  name: string,
  email?: string,
  phone?: string,
  relationship?: string,
  inviteStatus: "pending" | "sent" | "delivered",
  rsvpStatus: "pending" | "confirmed" | "declined",
  tableNumber?: number,
  plusOne: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Wedding Events Collection
```typescript
{
  _id: ObjectId,
  title: string,
  description?: string,
  date: Date,
  startTime: string,
  endTime?: string,
  location: {
    name: string,
    address: string,
    coordinates?: { lat: number, lng: number }
  },
  eventType: "ceremony" | "reception" | "rehearsal" | "party" | "other",
  dressCode?: string,
  isPublic: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## API Examples

### Submit RSVP
```javascript
const response = await fetch('/api/rsvp', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    email: "john@example.com",
    whatsappInvite: "yes",
    willAttend: "yes",
    guests: 2,
    message: "Looking forward to celebrating with you!"
  })
});
```

### Get All RSVPs
```javascript
const response = await fetch('/api/rsvps');
const data = await response.json();
console.log(data.data); // Array of RSVPs
```

## Development Notes

- All API responses follow a consistent format with `success`, `message`, and `data` fields
- Input validation is handled using Zod schemas
- MongoDB ObjectIds are converted to strings for frontend compatibility
- Graceful error handling with appropriate HTTP status codes
- Database connection is established once and reused across requests

## Troubleshooting

### Windows-Specific Issues

#### SSL/TLS Connection Errors
If you see errors like "tlsv1 alert internal error":
1. **Use Local MongoDB**: This is the most reliable solution for Windows
2. **Update Node.js**: Use the latest LTS version (18.x or 20.x)
3. **Check Firewall**: Ensure Windows Firewall allows Node.js connections
4. **Try Different Network**: Some corporate networks block MongoDB Atlas

#### Command Not Found Errors
- Make sure Node.js and npm are in your PATH
- Restart your command prompt after installing Node.js
- Use PowerShell or Command Prompt as Administrator if needed

#### Permission Issues
- Run Command Prompt as Administrator for MongoDB service commands
- Check if MongoDB service is running: `sc query MongoDB`

### General Connection Issues
- Ensure MongoDB is running locally or your Atlas cluster is accessible
- Check your connection string format
- Verify network connectivity for Atlas connections
- Use `npm run setup:windows` to test your configuration

### Permission Issues
- Make sure your MongoDB user has read/write permissions
- For Atlas, check IP whitelist settings

### Data Issues
- Use the health check endpoint `/api/health` to verify the API is running
- Check server logs for detailed error messages
- Verify your environment variables are loaded correctly
- Run `npm run setup:windows` to verify your setup