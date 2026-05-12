"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/password-field";
import { Heart } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { readApiJson } from "@/lib/read-api-response";
import { apiUrl } from "@/lib/api-base";

export default function Signup() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(apiUrl("/api/auth/register"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const { ok, status, data } = await readApiJson<{ success?: boolean; message?: string }>(res);
      if (!ok || data.success !== true) {
        setError(
          typeof data.message === "string" && data.message
            ? data.message
            : `Could not create account (${status})`,
        );
        return;
      }
      await refresh();
      router.replace("/admin/setup");
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not reach the server. Try again or confirm the app is running (e.g. npm run dev).",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-full bg-[#800000]/10 flex items-center justify-center">
            <Heart className="w-7 h-7 text-[#800000]" aria-hidden />
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-serif text-[#800000] text-center mb-1">Create your account</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Then you can set up your wedding site and publish when you are ready.
        </p>
        <Card className="p-6 shadow-md border-rose-100">
          <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
            {error ? (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">{error}</div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              minLength={8}
              required
              helperText="At least 8 characters."
            />
            <Button type="submit" className="w-full bg-[#800000]" disabled={busy}>
              {busy ? "Creating account…" : "Sign up"}
            </Button>
          </form>
          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#800000] font-medium underline-offset-2 hover:underline">
              Log in
            </Link>
          </p>
        </Card>
        <p className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-800">
            ← Back to home
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
