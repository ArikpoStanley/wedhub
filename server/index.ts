import "./crypto-hash-polyfill";
import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import session from "express-session";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { disconnectMongoose } from "./mongoose-db";

// Windows-specific environment setup
if (process.platform === 'win32') {
  // Set default encoding for Windows
  process.env.CHCP = '65001'; // UTF-8
}

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const sessionSecret = process.env.SESSION_SECRET || "dev-session-secret-change-me";
if (process.env.NODE_ENV === "production" && sessionSecret.includes("dev-session")) {
  console.warn("WARNING: Set SESSION_SECRET in production.");
}

app.use(
  session({
    name: "wedding.sid",
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  }),
);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  await disconnectMongoose();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  await disconnectMongoose();
  process.exit(0);
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  // Bind 0.0.0.0 so http://127.0.0.1:PORT and LAN URLs work; "localhost" alone can break fetch from 127.0.0.1.
  const host = process.env.LISTEN_HOST || "0.0.0.0";
  server.listen(port, host, () => {
    log(`serving on http://localhost:${port} (bound ${host})`);
  });
})();
