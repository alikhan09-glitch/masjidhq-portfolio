"use client";

import {
  FiTrendingUp,
  FiDollarSign,
  FiUsers,
  FiActivity,
} from "react-icons/fi";

export default function SummaryCards({ stats }: any) {
  const balance = stats.totalIncome - stats.totalExpense;

  return (
    <div className="grid md:grid-cols-4 gap-6">

      <Card
        title="Total Income"
        value={stats.totalIncome}
        subValue={stats.currentMonthIncome}
        icon={<FiTrendingUp />}
        type="positive"
      />

      <Card
        title="Total Expense"
        value={stats.totalExpense}
        subValue={stats.currentMonthExpense}
        icon={<FiDollarSign />}
        type="negative"
      />

      <Card
        title="Net Balance"
        value={balance}
        icon={<FiActivity />}
        type={balance >= 0 ? "positive" : "negative"}
      />

      <Card
        title="Total Members"
        value={stats.totalMembers}
        icon={<FiUsers />}
        type="neutral"
      />

    </div>
  );
}

function Card({
  title,
  value,
  subValue,
  icon,
  type,
}: {
  title: string;
  value: number;
  subValue?: number;
  icon: React.ReactNode;
  type: "positive" | "negative" | "neutral";
}) {

  const typeStyles = {
    positive: "border-green-200 bg-green-50",
    negative: "border-red-200 bg-red-50",
    neutral: "border-gray-200 bg-white",
  };

  const iconColor = {
    positive: "text-green-600 bg-green-100",
    negative: "text-red-600 bg-red-100",
    neutral: "text-gray-600 bg-gray-100",
  };

  return (
    <div
      className={`p-6 rounded-2xl border shadow-sm hover:shadow-md transition ${typeStyles[type]}`}
    >
      <div className="flex items-center justify-between">

        <div className="space-y-2">

          <p className="text-xs uppercase tracking-wide text-gray-500">
            {title}
          </p>

          <p className="text-3xl font-bold tracking-tight">
            ₹{value.toLocaleString()}
          </p>

          {subValue !== undefined && (
            <p className="text-xs text-gray-500">
              This Month: ₹{subValue.toLocaleString()}
            </p>
          )}
        </div>

        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${iconColor[type]}`}
        >
          {icon}
        </div>

      </div>
    </div>
  );
}