"use client";

import { useMemo, useState } from "react";
import {
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";

type ChartItem = {
  label: string;
  income: number;
  expense: number;
};

type Props = {
  chartData: ChartItem[];
};

const ranges = ["7D", "30D", "90D", "1Y"] as const;
type RangeType = (typeof ranges)[number];

export default function IncomeExpenseChart({ chartData }: Props) {
  const [selectedRange, setSelectedRange] =
    useState<RangeType>("30D");

  const filteredData = useMemo(() => {
    switch (selectedRange) {
      case "7D":
        return chartData.slice(0, 2);
      case "30D":
        return chartData.slice(0, 4);
      case "90D":
        return chartData.slice(0, 6);
      default:
        return chartData;
    }
  }, [selectedRange, chartData]);

  const totals = useMemo(() => {
    const income = filteredData.reduce((a, b) => a + b.income, 0);
    const expense = filteredData.reduce((a, b) => a + b.expense, 0);
    return { income, expense };
  }, [filteredData]);

  const net = totals.income - totals.expense;
  const isPositive = net >= 0;

  return (
    <div className="rounded-2xl bg-white border border-gray-200 p-8 shadow-sm">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Income vs Expense
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Financial overview
          </p>
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1 text-xs rounded-md transition ${
                selectedRange === range
                  ? "bg-white shadow text-gray-900"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* NET */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">
            Net
          </p>
          <p
            className={`text-2xl font-semibold ${
              isPositive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            ₹{net.toLocaleString()}
          </p>
        </div>

        <div
          className={`p-2 rounded-full ${
            isPositive
              ? "bg-emerald-50 text-emerald-600"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isPositive ? <FiTrendingUp size={16} /> : <FiTrendingDown size={16} />}
        </div>
      </div>

      {/* ROWS */}
      <div className="space-y-8">
        {filteredData.map((item, i) => {
          const max = Math.max(item.income, item.expense, 1);
          const incomePercent = (item.income / max) * 100;
          const expensePercent = (item.expense / max) * 100;

          return (
            <div key={i}>
              {/* LABEL ROW */}
              <div className="flex justify-between mb-2 text-sm">
                <span className="font-medium text-gray-800">
                  {item.label}
                </span>
                <span className="text-gray-500">
                  ₹{item.income.toLocaleString()} / ₹
                  {item.expense.toLocaleString()}
                </span>
              </div>

              {/* EXPENSE */}
              <ProgressBar
                percent={expensePercent}
                gradient="from-red-400 to-red-600"
              />

              {/* INCOME */}
              <ProgressBar
                percent={incomePercent}
                gradient="from-emerald-400 to-emerald-600"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* CLEAN PREMIUM PROGRESS */
function ProgressBar({
  percent,
  gradient,
}: {
  percent: number;
  gradient: string;
}) {
  return (
    <div className="relative group mt-2">
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* subtle tooltip */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-white bg-gray-800 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">
        {percent.toFixed(0)}%
      </div>
    </div>
  );
}