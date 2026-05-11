import type { Express, Request } from "express";
import { z } from "zod";
import { registerSchema, loginSchema } from "@shared/auth-schema";
import { createUser, verifyUserCredentials, getUserById } from "./user-storage";

function regenerateSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.regenerate((err) => (err ? reject(err) : resolve()));
  });
}

function saveSession(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.save((err) => (err ? reject(err) : resolve()));
  });
}

export function registerAuthRoutes(app: Express): void {
  app.get("/api/auth/me", async (req, res) => {
    try {
      const uid = req.session?.userId;
      if (!uid) {
        return res.json({ success: true, data: { user: null } });
      }
      const user = await getUserById(uid);
      if (!user) {
        await new Promise<void>((resolve) => req.session.destroy(() => resolve()));
        return res.json({ success: true, data: { user: null } });
      }
      res.json({ success: true, data: { user } });
    } catch (e) {
      console.error(e);
      res.status(500).json({ success: false, message: "Failed to load session" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const body = registerSchema.parse(req.body);
      const out = await createUser(body.email, body.password);
      if ("error" in out) {
        return res.status(409).json({
          success: false,
          message: "An account with this email already exists",
        });
      }
      await regenerateSession(req);
      req.session.userId = out.id;
      await saveSession(req);
      res.status(201).json({
        success: true,
        message: "Account created",
        data: { user: out },
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: e.issues[0]?.message ?? "Invalid input",
        });
      }
      console.error(e);
      res.status(500).json({ success: false, message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const body = loginSchema.parse(req.body);
      const user = await verifyUserCredentials(body.email, body.password);
      if (!user) {
        return res.status(401).json({ success: false, message: "Invalid email or password" });
      }
      await regenerateSession(req);
      req.session.userId = user.id;
      await saveSession(req);
      res.json({ success: true, message: "Signed in", data: { user } });
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: e.issues[0]?.message ?? "Invalid input",
        });
      }
      console.error(e);
      res.status(500).json({ success: false, message: "Sign in failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Could not sign out" });
      }
      res.json({ success: true, message: "Signed out" });
    });
  });
}
