import { NextResponse } from "next/server";

let mockIncomes = [
  {
    _id: "1",
    type: "donation",
    amount: 15000,
    date: "2026-02-01",
    sourceType: "external",
    donorName: "Ahmed Khan",
    paymentMode: "cash",
  },
  {
    _id: "2",
    type: "jummah",
    amount: 22000,
    date: "2026-02-07",
    sourceType: "member",
    member: { name: "Rahman Ali" },
    paymentMode: "online",
  },
];

/* ================= CREATE INCOME ================= */
export async function POST(req: Request) {
  const body = await req.json();

  if (!body.type || !body.amount || !body.date) {
    return NextResponse.json(
      { error: "Type, amount and date are required" },
      { status: 400 }
    );
  }

  const newIncome = {
    _id: Date.now().toString(),
    type: body.type,
    amount: Number(body.amount),
    date: body.date,
    sourceType: body.sourceType || "external",
    donorName: body.donorName || undefined,
    member: body.sourceType === "member"
      ? { name: "Demo Member" }
      : undefined,
    paymentMode: body.paymentMode || "cash",
  };

  mockIncomes.unshift(newIncome);

  return NextResponse.json(newIncome, { status: 201 });
}

/* ================= GET ALL INCOME ================= */
export async function GET() {
  return NextResponse.json(mockIncomes);
}