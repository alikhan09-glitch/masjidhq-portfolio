"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";

type Category = {
  _id: string;
  name: string;
  isDefault: boolean;
};

export default function AddExpensePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] =
    useState(false);

  const [form, setForm] = useState({
    category: "",
    title: "",
    amount: "",
    date: new Date().toISOString().split("T")[0],
    paymentMode: "cash",
    transactionId: "",
    vendorName: "",
    vendorPhone: "",
    billNumber: "",
    description: "",
    note: "",
  });

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await fetch(
        "/api/admin/expense-category"
      );

      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  /* =========================
     SUBMIT HANDLER
  ========================= */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.category) {
      alert("Please select expense category.");
      return;
    }

    if (!form.title.trim()) {
      alert("Expense title required.");
      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Enter valid amount.");
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

      const res = await fetch("/api/admin/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          amount: Number(form.amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to add expense");
        setLoading(false);
        return;
      }

      router.push("/admin/expense");
      router.refresh();
    } catch (error) {
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Back Button */}
      <Button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-400"
      >
        <FaArrowLeft /> Back
      </Button>

      {/* Card Container */}
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-10 mt-4">
        <h2 className="text-3xl font-bold text-emerald-700 mb-2">
          Add Expense Entry
        </h2>
        <p className="text-gray-500 mb-8">
          Record mosque expenses securely and professionally.
        </p>

        <form onSubmit={handleSubmit} className="space-y-10">

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Expense Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="">
                {loadingCategories
                  ? "Loading categories..."
                  : "Select Category"}
              </option>

              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <Input
            label="Expense Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
          />

          {/* Amount + Date */}
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
              label="Expense Date"
              type="date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
              required
            />
          </div>

          {/* Payment Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              Payment Details
            </h3>

            <select
              value={form.paymentMode}
              onChange={(e) =>
                setForm({
                  ...form,
                  paymentMode: e.target.value,
                })
              }
              className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="bank">Bank Transfer</option>
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

          {/* Vendor Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Vendor Name (Optional)"
              value={form.vendorName}
              onChange={(e) =>
                setForm({
                  ...form,
                  vendorName: e.target.value,
                })
              }
            />

            <Input
              label="Vendor Phone (Optional)"
              value={form.vendorPhone}
              onChange={(e) =>
                setForm({
                  ...form,
                  vendorPhone: e.target.value,
                })
              }
            />
          </div>

          <Input
            label="Bill Number (Optional)"
            value={form.billNumber}
            onChange={(e) =>
              setForm({
                ...form,
                billNumber: e.target.value,
              })
            }
          />

          <Input
            label="Description (Optional)"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full text-lg py-3"
          >
            {loading ? "Saving..." : "Add Expense"}
          </Button>
        </form>
      </div>
    </div>
  );
}
