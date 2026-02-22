"use client";

import { ReactNode } from "react";
import {
  FiTrendingUp,
  FiDollarSign,
  FiActivity,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";

type FinancialData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

type CardType = "positive" | "negative";

type CardProps = {
  title: string;
  value: number;
  icon: ReactNode;
  type: CardType;
  growth?: number;
  subtitle?: string;
};

export default function FinancialOverview({ data }: { data: FinancialData }) {
  return (
    <div className="grid md:grid-cols-3 gap-10">
      <PremiumCard
        title="Total Income"
        value={data.totalIncome}
        icon={<FiTrendingUp />}
        type="positive"
        growth={14}
        subtitle="Revenue this month"
      />

      <PremiumCard
        title="Total Expense"
        value={data.totalExpense}
        icon={<FiDollarSign />}
        type="negative"
        growth={-6}
        subtitle="Operational costs"
      />

      <PremiumCard
        title="Net Balance"
        value={data.balance}
        icon={<FiActivity />}
        type={data.balance >= 0 ? "positive" : "negative"}
        growth={data.balance >= 0 ? 8 : -8}
        subtitle="Available funds"
      />
    </div>
  );
}

function PremiumCard({
  title,
  value,
  icon,
  type,
  growth = 0,
  subtitle,
}: CardProps) {
  const isPositive = type === "positive";

  return (
    <div className="group relative">

      {/* Animated Gradient Border */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 via-white/10 to-white/40 opacity-60 blur-xl group-hover:opacity-100 transition duration-500"></div>

      {/* Main Card */}
      <div
        className="
        relative rounded-3xl p-4
        bg-white/70 dark:bg-neutral-900/70
        backdrop-blur-2xl
        border border-white/20
        shadow-[0_10px_40px_rgba(0,0,0,0.08)]
        group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        transition-all duration-500
        hover:-translate-y-2
        overflow-hidden
      "
      >

        {/* Soft Top Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-white/20 rounded-full blur-3xl opacity-40"></div>

        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 font-medium">
              {title}
            </p>

            <h2 className="text-4xl font-semibold mt-4 text-gray-900 dark:text-white">
              ₹{value.toLocaleString()}
            </h2>

            {subtitle && (
              <p className="text-sm text-gray-500 mt-2">
                {subtitle}
              </p>
            )}
          </div>

          {/* Icon Container */}
          <div
            className={`
              relative h-16 w-16 flex items-center justify-center
              rounded-2xl
              backdrop-blur-xl
              border shadow-lg
              transition-all duration-500
              group-hover:scale-110 group-hover:rotate-6
              ${
                isPositive
                  ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-600"
                  : "bg-red-500/10 border-red-400/30 text-red-600"
              }
            `}
          >
            {/* Icon Glow */}
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-40 bg-current"></div>
            <div className="relative text-2xl">{icon}</div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-4 opacity-40"></div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Growth Badge */}
          <div
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
              backdrop-blur-md border
              ${
                growth >= 0
                  ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-600"
                  : "bg-red-500/10 border-red-400/30 text-red-600"
              }
            `}
          >
            {growth >= 0 ? (
              <FiArrowUpRight />
            ) : (
              <FiArrowDownRight />
            )}
            {Math.abs(growth)}%
          </div>

          <span className="text-xs text-gray-400 tracking-wide">
            Updated just now
          </span>
        </div>
      </div>
    </div>
  );
}