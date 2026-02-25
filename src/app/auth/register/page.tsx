"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "../../../components/ui/Input";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    mosqueName: "",
    city: "",
    state: "",
    country: "India",
    registrationNumber: "", // 🔥 optional but supported
    name: "",
    email: "",
    mobile: "",
    password: "",
  });

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");

    const mosqueName = form.mosqueName.trim().replace(/\s+/g, " ");
    const city = form.city.trim();
    const state = form.state.trim();
    const country = form.country.trim() || "India";
    const registrationNumber = form.registrationNumber.trim();
    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const mobile = form.mobile.trim();
    const password = form.password.trim();

    /* ================= BASIC VALIDATION ================= */

    if (!mosqueName) return setError("Mosque name is required");
    if (!city) return setError("City is required");
    if (!state) return setError("State is required");
    if (!name) return setError("Trustee name is required");
    if (!password) return setError("Password is required");

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!email && !mobile) {
      return setError("Email or Mobile is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[6-9]\d{9}$/;
    const regRegex = /^[A-Za-z0-9\/-]+$/;

    if (email && !emailRegex.test(email)) {
      return setError("Please enter a valid email address");
    }

    if (mobile && !mobileRegex.test(mobile)) {
      return setError("Please enter a valid 10-digit mobile number");
    }

    /* ================= REGISTRATION NUMBER VALIDATION ================= */

    if (registrationNumber) {
      if (registrationNumber.length < 5) {
        return setError("Registration number too short");
      }

      if (!regRegex.test(registrationNumber)) {
        return setError(
          "Registration number can only contain letters, numbers, / and -"
        );
      }
    }

    setLoading(true);

    try {
      /* ================= REGISTER ================= */

      const registerRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mosqueName,
          city,
          state,
          country,
          registrationNumber: registrationNumber || undefined,
          name,
          email: email || undefined,
          mobile: mobile || undefined,
          password,
        }),
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setError(registerData.error || "Registration failed");
        setLoading(false);
        return;
      }

      /* ================= AUTO LOGIN ================= */

      const identifier = email || mobile;

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      if (!loginRes.ok) {
        setError(
          "Account created, but auto-login failed. Please login manually."
        );
        setLoading(false);
        router.push("/auth/login");
        return;
      }

      /* ================= SUCCESS ================= */

      router.push("/admin");
      router.refresh();

    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-[80%] px-4">
      <div className="rounded-2xl shadow-xl p-10">

        <h2 className="text-3xl font-bold text-center text-emerald-700">
          Register Your Mosque
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Create your mosque management account
        </p>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-10">

          {/* 🕌 Mosque Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-6">
              Mosque Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

  <Input
    label="Mosque Name"
    placeholder="Enter mosque name"
    value={form.mosqueName}
    onChange={(e) =>
      setForm({ ...form, mosqueName: e.target.value })
    }
    required
  />

  <Input
    label="Registration Number (Optional)"
    placeholder="Enter official registration number"
    value={form.registrationNumber}
    onChange={(e) =>
      setForm({ ...form, registrationNumber: e.target.value })
    }
  />

  <Input
    label="City"
    placeholder="Enter city"
    value={form.city}
    onChange={(e) =>
      setForm({ ...form, city: e.target.value })
    }
    required
  />

  <Input
    label="State"
    placeholder="Enter state"
    value={form.state}
    onChange={(e) =>
      setForm({ ...form, state: e.target.value })
    }
    required
  />

  <Input
    label="Country"
    placeholder="Enter country"
    value={form.country}
    onChange={(e) =>
      setForm({ ...form, country: e.target.value })
    }
  />

</div>

          </div>

          {/* 👤 Admin Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 mb-6">
              Mosque Admin Details
            </h3>

            <div className="grid md:grid-cols-2 gap-6">

              <Input
                label="Mosque Manager Name"
                placeholder="Enter manager name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <Input
                label="Email"
                type="email"
                placeholder="Enter valid email address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Input
                label="Mobile"
                placeholder="Enter 10-digit mobile number"
                value={form.mobile}
                onChange={(e) =>
                  setForm({ ...form, mobile: e.target.value })
                }
              />

              <Input
                label="Password"
                type="password"
                placeholder="Create strong password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />

            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold transition duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="font-medium text-emerald-600 hover:underline"
          >
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
}
