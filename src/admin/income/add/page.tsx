"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";

type Member = {
  _id: string;
  name: string;
  phone?: string;
  isActive: boolean;
};

export default function AddIncomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  const [form, setForm] = useState({
    sourceType: "external",
    member: "",
    type: "jummah",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    purpose: "",
    donorName: "",
    donorPhone: "",
    paymentMode: "cash",
    transactionId: "",
    assetName: "",
    note: "",
  });

  /* ================= FETCH ACTIVE MEMBERS ================= */
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await fetch("/api/admin/members?status=active");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Failed to fetch members");
    } finally {
      setLoadingMembers(false);
    }
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter valid amount.");
      return;
    }

    if (form.sourceType === "member" && !form.member) {
      alert("Please select member.");
      return;
    }

    if (
      (form.paymentMode === "upi" ||
        form.paymentMode === "bank" ||
        form.paymentMode === "cheque") &&
      !form.transactionId
    ) {
      alert("Transaction ID required.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/admin/income", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
          member:
            form.sourceType === "member"
              ? form.member
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add income");
        setLoading(false);
        return;
      }

      router.push("/admin/income");
      router.refresh();
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400"
      >
        <FaArrowLeft /> Back
      </Button>

      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10 mt-4">
        <h2 className="text-3xl font-bold text-emerald-700 mb-2">
          Add Income Entry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* SOURCE */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Income Source
            </h3>

            <div className="flex gap-6">
              <label>
                <input
                  type="radio"
                  value="external"
                  checked={form.sourceType === "external"}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sourceType: e.target.value,
                      member: "",
                    })
                  }
                />
                External Donor
              </label>

              <label>
                <input
                  type="radio"
                  value="member"
                  checked={form.sourceType === "member"}
                  onChange={(e) =>
                    setForm({ ...form, sourceType: e.target.value })
                  }
                />
                Registered Member
              </label>
            </div>
          </div>

          {/* MEMBER SELECT */}
          {form.sourceType === "member" && (
            <div>
              <label className="block mb-2">Select Member</label>
              <select
                value={form.member}
                onChange={(e) => {
                  const selected = members.find(
                    (m) => m._id === e.target.value
                  );

                  setForm({
                    ...form,
                    member: e.target.value,
                    donorName: selected?.name || "",
                    donorPhone: selected?.phone || "",
                  });
                }}
                className="w-full border rounded-xl px-4 py-2"
                required
              >
                <option value="">
                  {loadingMembers
                    ? "Loading..."
                    : "Select Member"}
                </option>

                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* DONOR DETAILS (External or Auto-filled) */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Donor Name"
              value={form.donorName}
              onChange={(e) =>
                setForm({ ...form, donorName: e.target.value })
              }
              required
            />

            <Input
              label="Donor Phone"
              value={form.donorPhone}
              onChange={(e) =>
                setForm({ ...form, donorPhone: e.target.value })
              }
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="block mb-2">Income Type</label>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2"
            >
              <option value="jummah">Jummah</option>
              <option value="eid">Eid</option>
              <option value="special-nights">Special Nights</option>
              <option value="donation">Donation</option>
              <option value="membership">Membership</option>
              <option value="rental-assets">Rental Assets</option>
            </select>
          </div>

          {/* AMOUNT + DATE */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Amount (₹)"
              type="number"
              value={form.amount}
              onChange={(e) =>
                setForm({ ...form, amount: e.target.value })
              }
              required
            />

            <Input
              label="Date"
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />
          </div>

          {/* PURPOSE */}
          <Input
            label="Purpose"
            value={form.purpose}
            onChange={(e) =>
              setForm({ ...form, purpose: e.target.value })
            }
          />

          {/* ASSET NAME */}
          <Input
            label="Asset Name (if rental)"
            value={form.assetName}
            onChange={(e) =>
              setForm({ ...form, assetName: e.target.value })
            }
          />

          {/* NOTE */}
          <Input
            label="Internal Note"
            value={form.note}
            onChange={(e) =>
              setForm({ ...form, note: e.target.value })
            }
          />

          {/* PAYMENT */}
          <div>
            <label className="block mb-2">Payment Mode</label>
            <select
              value={form.paymentMode}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentMode: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-2"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank</option>
              <option value="cheque">Cheque</option>
            </select>

            {(form.paymentMode === "upi" ||
              form.paymentMode === "bank" ||
              form.paymentMode === "cheque") && (
              <Input
                label="Transaction ID"
                value={form.transactionId}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transactionId: e.target.value,
                  })
                }
                required
              />
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3"
          >
            {loading ? "Saving..." : "Add Income"}
          </Button>
        </form>
      </div>
    </div>
  );
}
