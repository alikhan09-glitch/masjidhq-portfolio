import { NextResponse } from "next/server";

let mockMembers = [
  {
    _id: "1",
    name: "Ahmed Khan",
    phone: "9876543210",
    isActive: true,
    thisMonthPaid: true,
    roleType: "donor",
  },
  {
    _id: "2",
    name: "Rahman Ali",
    phone: "9123456780",
    isActive: true,
    thisMonthPaid: false,
    roleType: "volunteer",
  },
  {
    _id: "3",
    name: "Usman Sheikh",
    phone: "9988776655",
    isActive: false,
    thisMonthPaid: false,
    roleType: "staff",
  },
];

/* ================= GET MEMBERS ================= */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  let filtered = mockMembers;

  if (status === "active") {
    filtered = mockMembers.filter((m) => m.isActive);
  } else if (status === "inactive") {
    filtered = mockMembers.filter((m) => !m.isActive);
  }

  return NextResponse.json(filtered);
}

/* ================= CREATE MEMBER ================= */
export async function POST(req: Request) {
  const body = await req.json();

  const newMember = {
    _id: Date.now().toString(),
    name: body.name,
    phone: body.phone,
    isActive: true,
    thisMonthPaid: false,
    roleType: body.roleType || "donor",
  };

  mockMembers.unshift(newMember);

  return NextResponse.json(newMember, { status: 201 });
}