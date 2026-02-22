import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const {
    mosqueName,
    city,
    state,
    name,
    password,
  } = await req.json();

  if (!mosqueName || !city || !state || !name || !password) {
    return NextResponse.json(
      { error: "All required fields must be filled" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      message: "Demo registration successful",
      mosqueCode: "MSJ-DEMO-2026",
    },
    { status: 201 }
  );
}