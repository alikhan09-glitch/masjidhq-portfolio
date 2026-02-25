"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/button";
import { FaArrowLeft } from "react-icons/fa";

export default function EditMemberPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    const res = await fetch(`/api/admin/members/${id}`);
    const data = await res.json();
    setForm(data.member);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(`/api/admin/members/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      // 🔥 Redirect properly based on status
      router.push(
        `/admin/members?status=${
          form.isActive ? "active" : "inactive"
        }`
      );
    } else {
      alert("Update failed");
    }

    setLoading(false);
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto">

      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400 mb-4"
      >
        <FaArrowLeft /> Back
      </Button>

      <div className="bg-white shadow-2xl rounded-2xl p-10">
        <h2 className="text-3xl font-bold text-emerald-700 mb-2">
          Edit Member
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              className="border rounded-xl px-4 py-2"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              className="border rounded-xl px-4 py-2"
              placeholder="Phone"
              value={form.phone || ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />

            <input
              className="border rounded-xl px-4 py-2"
              placeholder="Email"
              value={form.email || ""}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              className="border rounded-xl px-4 py-2"
              placeholder="Address"
              value={form.address || ""}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
          </div>

          {/* Role & Status */}
          <div className="grid md:grid-cols-2 gap-6">
            <select
              className="border rounded-xl px-4 py-2"
              value={form.roleType}
              onChange={(e) =>
                setForm({ ...form, roleType: e.target.value })
              }
            >
              <option value="member">Member</option>
              <option value="committee">Committee</option>
              <option value="volunteer">Volunteer</option>
              <option value="staff">Staff</option>
            </select>

            <select
              className="border rounded-xl px-4 py-2"
              value={form.isActive ? "active" : "inactive"}
              onChange={(e) =>
                setForm({
                  ...form,
                  isActive: e.target.value === "active",
                })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Contribution */}
          <div className="grid md:grid-cols-2 gap-6">
            <select
              className="border rounded-xl px-4 py-2"
              value={form.contributionType}
              onChange={(e) =>
                setForm({
                  ...form,
                  contributionType: e.target.value,
                })
              }
            >
              <option value="none">None</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>

            {form.contributionType !== "none" && (
              <input
                type="number"
                className="border rounded-xl px-4 py-2"
                placeholder="Contribution Amount"
                value={form.contributionAmount || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    contributionAmount: Number(e.target.value),
                  })
                }
              />
            )}
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            <input
              type="date"
              className="border rounded-xl px-4 py-2"
              value={
                form.joinedAt
                  ? new Date(form.joinedAt)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  joinedAt: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border rounded-xl px-4 py-2"
              value={
                form.leftAt
                  ? new Date(form.leftAt)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  leftAt: e.target.value,
                })
              }
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3"
          >
            {loading ? "Updating..." : "Update Member"}
          </Button>

        </form>
      </div>
    </div>
  );
}
