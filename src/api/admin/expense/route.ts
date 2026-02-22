import { NextResponse } from "next/server";

let mockExpenses = [
  {
    _id: "1",
    title: "Electricity Bill",
    amount: 12000,
    date: "2026-02-01",
    paymentMode: "cash",
    category: { name: "Utilities" },
    status: "approved",
  },
  {
    _id: "2",
    title: "Cleaning Supplies",
    amount: 4500,
    date: "2026-02-10",
    paymentMode: "online",
    category: { name: "Maintenance" },
    status: "pending",
  },
];

/* ================= CREATE EXPENSE ================= */
export async function POST(req: Request) {
  const body = await req.json();

  const newExpense = {
    _id: Date.now().toString(),
    title: body.title,
    amount: Number(body.amount),
    date: body.date,
    paymentMode: body.paymentMode || "cash",
    category: { name: "General" },
    status: "pending",
  };

  mockExpenses.unshift(newExpense);

  return NextResponse.json(newExpense, { status: 201 });
}

/* ================= GET ALL EXPENSES ================= */
export async function GET() {
  return NextResponse.json(mockExpenses);
}