"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/Input";
import { FaArrowLeft } from "react-icons/fa";

export default function AddMemberPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    roleType: "member",
    contributionType: "none",
    contributionAmount: "",
    note: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Member name is required");
      return;
    }

    if (
      form.contributionType !== "none" &&
      !form.contributionAmount
    ) {
      alert("Contribution amount required");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        contributionAmount:
          form.contributionType !== "none"
            ? Number(form.contributionAmount)
            : undefined,
      }),
    });

    if (!res.ok) {
      alert("Failed to create member");
      setLoading(false);
      return;
    }

    router.push("/admin/members");
    router.refresh();
  };

  return (
    <div>
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 cursor-pointer"
      >
        <FaArrowLeft /> Back
      </Button>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10 mt-4">
        <h2 className="text-3xl font-bold text-emerald-700 mb-2">
          Add Member
        </h2>
        <p className="text-gray-500 mb-8">
          Register a new member for your mosque system.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Basic Info Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-700">
              Basic Information
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Full Name *"
                placeholder="Enter member name"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />

              <Input
                label="Phone"
                placeholder="10-digit mobile number"
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
              />

              <Input
                label="Email"
                placeholder="Enter email address"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />

              <Input
                label="Address"
                placeholder="Enter address"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
          </div>

          {/* Role Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Role Details
            </h3>

            <select
              value={form.roleType}
              onChange={(e) =>
                setForm({ ...form, roleType: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="member">Member</option>
              <option value="committee">Committee Member</option>
              <option value="volunteer">Volunteer</option>
              <option value="staff">Staff</option>
            </select>
          </div>

          {/* Contribution Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Contribution Settings
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Contribution Type
                </label>
                <select
                  value={form.contributionType}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contributionType: e.target.value,
                    })
                  }
                  className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="none">None</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              {form.contributionType !== "none" && (
                <Input
                  label="Contribution Amount (₹)"
                  type="number"
                  placeholder="Enter amount"
                  value={form.contributionAmount}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      contributionAmount: e.target.value,
                    })
                  }
                  required
                />
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Additional Notes
            </h3>

            <textarea
              value={form.note}
              onChange={(e) =>
                setForm({ ...form, note: e.target.value })
              }
              rows={3}
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Optional notes about member"
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg py-3"
          >
            {loading ? "Saving..." : "Add Member"}
          </Button>
        </form>
      </div>
    </div>
  );
}
