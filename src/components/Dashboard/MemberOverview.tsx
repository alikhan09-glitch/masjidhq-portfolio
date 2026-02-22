"use client";

import { FiUsers } from "react-icons/fi";

export default function MemberOverview({ data }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-4">

      <h2 className="text-lg font-semibold flex items-center gap-2">
        <FiUsers /> Members Overview
      </h2>

      <div className="grid md:grid-cols-3 gap-6">

        <Stat label="Total Members" value={data.total} />
        <Stat label="Active Members" value={data.active} />
        <Stat label="New Members (Range)" value={data.newInRange} />

      </div>

    </div>
  );
}

function Stat({ label, value }: any) {
  return (
    <div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}