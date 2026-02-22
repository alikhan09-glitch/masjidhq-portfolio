import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { identifier, password } = await req.json();

  if (!identifier || !password) {
    return NextResponse.json(
      { error: "All fields required" },
      { status: 400 }
    );
  }

  // Simple demo credentials
  if (identifier !== "admin@demo.com" || password !== "123456") {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({
    message: "Login successful",
    role: "superadmin",
    mosqueName: "Masjid Al Noor",
    mosqueCode: "MSJ-2026",
  });

  // Demo cookie (non-secure, simple)
  response.cookies.set("demo-auth", "true", {
    httpOnly: false,
    path: "/",
  });

  return response;
}