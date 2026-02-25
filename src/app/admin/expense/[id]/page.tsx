"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type Expense = {
  _id: string;
  title: string;
  amount: number;
  date: string;
  status: string;
  paymentMode?: string;
  vendorName?: string;
  vendorPhone?: string;
  billNumber?: string;
  description?: string;
  note?: string;
  category?: {
    _id: string;
    name: string;
  };
};

export default function ViewExpensePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchExpense = async () => {
    try {
      const res = await fetch(`/api/admin/expense/${id}`);
      if (!res.ok) {
        setExpense(null);
        return;
      }
      const data = await res.json();
      setExpense(data);
    } catch {
      setExpense(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchExpense();
  }, [id]);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Loading expense details...
      </div>
    );

  if (!expense)
    return (
      <div className="p-10 text-center text-red-500">
        Expense not found
      </div>
    );

  const statusColor =
    expense.status === "approved"
      ? "bg-green-100 text-green-700"
      : expense.status === "pending"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-6">

      {/* HEADER CARD */}
      <div className="bg-white shadow-2xl rounded-2xl p-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {expense.title}
          </h1>

          <div className="mt-3 flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
            >
              {expense.status}
            </span>

            <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
              {expense.category?.name || "Uncategorized"}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-gray-500 text-sm">Amount</p>
          <h2 className="text-3xl font-bold text-red-600">
            ₹ {expense.amount.toLocaleString()}
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            {new Date(expense.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Transaction Info */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Transaction Details
          </h3>

          <Detail label="Payment Mode" value={expense.paymentMode || "-"} />
          <Detail label="Bill Number" value={expense.billNumber || "-"} />
        </div>

        {/* Vendor Info */}
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Vendor Details
          </h3>

          <Detail label="Vendor Name" value={expense.vendorName || "-"} />
          <Detail label="Vendor Phone" value={expense.vendorPhone || "-"} />
        </div>
      </div>

      {/* DESCRIPTION */}
      {expense.description && (
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {expense.description}
          </p>
        </div>
      )}

      {/* NOTE */}
      {expense.note && (
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-700">
            Note
          </h3>
          <p className="text-gray-600 leading-relaxed">
            {expense.note}
          </p>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <Button
          onClick={() =>
            router.push(`/admin/expense/${expense._id}/edit`)
          }
        >
          Edit Expense
        </Button>

        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between border-b py-2 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-700">{value}</span>
    </div>
  );
}
