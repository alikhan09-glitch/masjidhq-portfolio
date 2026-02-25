"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Input from "../../../../components/ui/Input";
import { Button } from "../../../../components/ui/button";
import { FaArrowLeft, FaFileInvoice } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

export default function IncomeDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/income");
    const data = await res.json();

    const current = data.find((item: any) => item._id === slug);

    if (current) {
      setForm({
        ...current,
        date: current.date?.split("T")[0],
      });
    }

    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const res = await fetch(`/api/admin/income/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setEditMode(false);
      await fetchIncome();
      alert("Updated successfully");
    } else {
      const error = await res.json();
      alert(error.error || "Update failed");
    }

    setSaving(false);
  };

  const handleGenerateReceipt = async () => {
    if (!form.donorName) {
      alert("Donor name is required before generating receipt.");
      return;
    }

    const confirmAction = confirm(
      "Generate receipt? This action cannot be undone."
    );

    if (!confirmAction) return;

    const res = await fetch(
      `/api/admin/income/${slug}/generate-receipt`,
      { method: "POST" }
    );

    if (res.ok) {
      await fetchIncome();
      alert("Receipt Generated Successfully");
    } else {
      const error = await res.json();
      alert(error.error || "Failed to generate receipt");
    }
  };

  const handleDownloadPDF = () => {
    window.open(`/api/admin/income/${slug}/receipt`, "_blank");
  };

  const formattedDate = new Date(form?.date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (loading || !form)
    return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-black"
        >
          <FaArrowLeft /> Back
        </button>

        <div className="flex gap-3">
          {!editMode && !form.receiptGenerated && (
            <Button onClick={() => setEditMode(true)}>
              <MdEdit className="mr-1" /> Edit
            </Button>
          )}

          {!form.receiptGenerated && (
            <Button onClick={handleGenerateReceipt}>
              <FaFileInvoice className="mr-1" />
              Generate Receipt
            </Button>
          )}

          {form.receiptGenerated && (
            <Button onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="bg-white shadow-2xl rounded-2xl p-10">
        {/* Status Badge */}
        <div className="mb-6 flex gap-3">
          {form.receiptGenerated ? (
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Receipt Issued
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm font-medium">
              Receipt Not Generated
            </span>
          )}

          {editMode && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              Editing Mode
            </span>
          )}
        </div>

        {/* ================= VIEW MODE ================= */}
        {!editMode && (
          <div className="space-y-10 text-gray-800">
            <div>
              <h3 className="text-lg font-semibold mb-4">Income Details</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <Info label="Amount" value={`₹ ${form.amount}`} highlight />
                <Info label="Type" value={form.type} />
                <Info label="Date" value={formattedDate} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Payment Information
              </h3>
              <div className="grid md:grid-cols-3 gap-8">
                <Info label="Payment Mode" value={form.paymentMode} />
                <Info
                  label="Transaction ID"
                  value={form.transactionId || "—"}
                />
                <Info
                  label="Receipt Number"
                  value={form.receiptNumber || "—"}
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                Donor Information
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <Info label="Donor Name" value={form.donorName || "-"} />
                <Info label="Donor Phone" value={form.donorPhone || "-"} />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Purpose</h3>
              <Info label="Purpose" value={form.purpose || "-"} />
            </div>

            {form.note && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Notes</h3>
                <div className="bg-gray-50 p-4 rounded-xl">{form.note}</div>
              </div>
            )}
          </div>
        )}

        {/* ================= EDIT MODE ================= */}
        {editMode && (
          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Input
                label="Amount"
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

              {/* Type Dropdown */}
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Type
                </label>
                <select
                  className="w-full border rounded-xl p-3"
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                >
                  <option value="jummah">Jummah Collection</option>
                  <option value="eid">Eid Collection</option>
                  <option value="special-nights">Special Nights</option>
                  <option value="donation">Donation</option>
                  <option value="membership">Membership</option>
                  <option value="rental-assets">Rental Assets</option>
                </select>
              </div>

              {/* Payment Mode Dropdown */}
              <div>
                <label className="text-sm text-gray-500 mb-1 block">
                  Payment Mode
                </label>
                <select
                  className="w-full border rounded-xl p-3"
                  value={form.paymentMode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      paymentMode: e.target.value,
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <Input
                label="Donor Name"
                value={form.donorName || ""}
                onChange={(e) =>
                  setForm({ ...form, donorName: e.target.value })
                }
              />

              <Input
                label="Donor Phone"
                value={form.donorPhone || ""}
                onChange={(e) =>
                  setForm({ ...form, donorPhone: e.target.value })
                }
              />

              <Input
                label="Transaction ID"
                value={form.transactionId || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    transactionId: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-1 block">
                Notes
              </label>
              <textarea
                className="w-full border rounded-xl p-3"
                rows={4}
                value={form.note || ""}
                onChange={(e) =>
                  setForm({ ...form, note: e.target.value })
                }
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? "Updating..." : "Save Changes"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEditMode(false);
                  fetchIncome();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

function Info({ label, value, highlight }: any) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p
        className={`font-semibold ${
          highlight ? "text-xl text-green-600" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
