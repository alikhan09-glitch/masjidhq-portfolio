"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Category = {
  _id: string;
  name: string;
};

type Expense = {
  _id: string;
  title: string;
  amount: number;
  category: { _id: string; name: string };
  date: string;
  paymentMode: string;
  vendorName?: string;
  vendorPhone?: string;
  billNumber?: string;
  description?: string;
  note?: string;
  status: string;
};

export default function EditExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  /* ================= FETCH DATA ================= */

  const fetchData = async () => {
    try {
      const [expenseRes, categoryRes] = await Promise.all([
        fetch(`/api/admin/expense/${id}`),
        fetch(`/api/admin/expense-category`),
      ]);

      const expenseData = await expenseRes.json();
      const categoryData = await categoryRes.json();

      setExpense(expenseData);
      setCategories(categoryData);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  /* ================= UPDATE ================= */

  const handleUpdate = async () => {
    if (!expense) return;

    if (
      !expense.title ||
      !expense.amount ||
      !expense.category?._id ||
      !expense.date
    ) {
      alert("All required fields must be filled");
      return;
    }

    setLoading(true);

    const res = await fetch(`/api/admin/expense/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: expense.title,
        amount: expense.amount,
        category: expense.category._id,
        date: expense.date,
        paymentMode: expense.paymentMode,
        vendorName: expense.vendorName,
        vendorPhone: expense.vendorPhone,
        billNumber: expense.billNumber,
        description: expense.description,
        note: expense.note,
      }),
    });

    if (res.ok) {
      router.push(`/admin/expense/${id}`);
    } else {
      const err = await res.json();
      alert(err.error || "Update failed");
    }

    setLoading(false);
  };

  if (fetching)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading expense...
      </div>
    );

  if (!expense)
    return (
      <div className="p-10 text-center text-red-500">
        Expense not found
      </div>
    );

  const isApproved = expense.status === "approved";

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-6">
      <h2 className="text-2xl font-bold mb-6 text-emerald-700">
        Edit Expense
      </h2>

      {isApproved && (
        <div className="mb-6 p-4 bg-yellow-100 text-yellow-700 rounded-lg">
          Approved expenses cannot be edited.
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">

        {/* Title */}
        <InputField
          label="Title *"
          value={expense.title}
          disabled={isApproved}
          onChange={(v) =>
            setExpense({ ...expense, title: v })
          }
        />

        {/* Amount */}
        <InputField
          label="Amount *"
          type="number"
          value={expense.amount.toString()}
          disabled={isApproved}
          onChange={(v) =>
            setExpense({
              ...expense,
              amount: Number(v),
            })
          }
        />

        {/* Category */}
        <div>
          <label className="block mb-1 text-gray-600">
            Category *
          </label>
          <select
            disabled={isApproved}
            value={expense.category?._id}
            onChange={(e) =>
              setExpense({
                ...expense,
                category: {
                  _id: e.target.value,
                  name:
                    categories.find(
                      (c) => c._id === e.target.value
                    )?.name || "",
                },
              })
            }
            className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Date */}
        <InputField
          label="Date *"
          type="date"
          disabled={isApproved}
          value={expense.date.slice(0, 10)}
          onChange={(v) =>
            setExpense({ ...expense, date: v })
          }
        />

        {/* Payment Mode */}
        <InputField
          label="Payment Mode"
          value={expense.paymentMode || ""}
          disabled={isApproved}
          onChange={(v) =>
            setExpense({
              ...expense,
              paymentMode: v,
            })
          }
        />

        {/* Vendor Name */}
        <InputField
          label="Vendor Name"
          value={expense.vendorName || ""}
          disabled={isApproved}
          onChange={(v) =>
            setExpense({
              ...expense,
              vendorName: v,
            })
          }
        />

        {/* Vendor Phone */}
        <InputField
          label="Vendor Phone"
          value={expense.vendorPhone || ""}
          disabled={isApproved}
          onChange={(v) =>
            setExpense({
              ...expense,
              vendorPhone: v,
            })
          }
        />

        {/* Bill Number */}
        <InputField
          label="Bill Number"
          value={expense.billNumber || ""}
          disabled={isApproved}
          onChange={(v) =>
            setExpense({
              ...expense,
              billNumber: v,
            })
          }
        />

      </div>

      {/* Description */}
      <div className="mt-6">
        <label className="block mb-1 text-gray-600">
          Description
        </label>
        <textarea
          disabled={isApproved}
          value={expense.description || ""}
          onChange={(e) =>
            setExpense({
              ...expense,
              description: e.target.value,
            })
          }
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Note */}
      <div className="mt-4">
        <label className="block mb-1 text-gray-600">
          Note
        </label>
        <textarea
          disabled={isApproved}
          value={expense.note || ""}
          onChange={(e) =>
            setExpense({
              ...expense,
              note: e.target.value,
            })
          }
          className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
        />
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-3">
        {!isApproved && (
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() =>
            router.push(`/admin/expense/${id}`)
          }
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block mb-1 text-gray-600">
        {label}
      </label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-gray-100"
      />
    </div>
  );
}
