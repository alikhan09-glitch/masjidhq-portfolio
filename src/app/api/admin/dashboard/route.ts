import { NextResponse } from "next/server";

export async function GET() {
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun"];

  const chart = monthNames.map((month, index) => ({
    label: `${month} 2026`,
    income: 100000 + index * 5000,
    expense: 60000 + index * 4000,
  }));

  return NextResponse.json({
    success: true,
    data: {
      financial: {
        totalIncome: 650000,
        totalExpense: 380000,
        balance: 270000,
        rangeIncome: 120000,
        rangeExpense: 75000,
        chart,
        categoryBreakdown: [
          { _id: "Maintenance", total: 50000 },
          { _id: "Utilities", total: 30000 },
          { _id: "Events", total: 20000 },
        ],
        pendingExpenses: 3,
      },

      members: {
        total: 240,
        active: 210,
        newInRange: 12,
        roleBreakdown: [
          { _id: "donor", count: 120 },
          { _id: "volunteer", count: 80 },
          { _id: "staff", count: 40 },
        ],
      },

      mosque: {
        info: {
          name: "Masjid Al Noor",
          code: "MSJ-2026",
          city: "Jaipur",
          state: "Rajasthan",
          type: "Jama Masjid",
        },
        imam: {
          name: "Maulana Rashid",
        },
      },

      system: {
        range: "monthly",
        healthScore: 88,
        generatedAt: new Date(),
      },
    },
  });
}