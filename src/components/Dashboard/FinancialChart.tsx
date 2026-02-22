"use client";

export default function FinancialChart({ chartData }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="font-semibold mb-4 text-lg">
        Income vs Expense (Last 6 Months)
      </h2>

      <div className="h-72 flex items-center justify-center text-gray-400">
        Chart integration ready — connect Recharts here
      </div>
    </div>
  );
}