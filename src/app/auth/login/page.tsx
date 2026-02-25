"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "../../../components/ui/Input";
import { Button } from "../../../components/ui/button";

export default function LoginPage() {
  const router = useRouter();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  if (loading) return;

  setError("");

  const cleanIdentifier = identifier.trim();
  const cleanPassword = password.trim();

  if (!cleanIdentifier || !cleanPassword) {
    setError("All fields required");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[6-9]\d{9}$/;

  // 🔍 Detect email or mobile
  if (cleanIdentifier.includes("@")) {
    if (!emailRegex.test(cleanIdentifier)) {
      setError("Please enter a valid email address");
      return;
    }
  } else {
    if (!mobileRegex.test(cleanIdentifier)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
  }

  setLoading(true);

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: cleanIdentifier,
        password: cleanPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Invalid credentials");
      setLoading(false);
      return;
    }

    // Clear form
    setIdentifier("");
    setPassword("");

    router.push("/admin");
    router.refresh();

  } catch (err) {
    setError("Something went wrong. Try again.");
    setLoading(false);
  }
};


  return (
    <div className="w-[50%] px-4">

      <div className="p-8 shadow-xl">

        <h2 className="mb-2 text-center text-2xl font-bold text-emerald-700">
         Mosque Manager Login
        </h2>

        <p className="mb-6 text-center text-sm text-gray-500">
          Sign in to manage your mosque
        </p>

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-2 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">

          <Input
            label="Email or Mobile"
            placeholder="Enter email or 10-digit mobile"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            disabled={loading}
            className="mt-4 w-full"
          >
            {loading ? "Signing in..." : "Login"}
          </Button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/auth/register"
            className="font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            Register here
          </Link>
        </div>

      </div>
    </div>
  );
}
