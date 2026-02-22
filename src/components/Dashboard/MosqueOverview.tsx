"use client";

import { FiMapPin, FiUser } from "react-icons/fi";

export default function MosqueOverview({ data }: any) {
  const mosque = data.info;
  const imam = data.imam;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">

      <h2 className="text-lg font-semibold">Mosque Overview</h2>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <p className="text-xs text-gray-500">Name</p>
          <p className="font-semibold">{mosque.name}</p>

          <p className="text-xs text-gray-500 mt-3">Location</p>
          <p>{mosque.city}, {mosque.state}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Current Imam</p>
          <p className="font-semibold">{imam?.name || "Not Assigned"}</p>

          {imam?.phone && (
            <p className="text-sm text-gray-500 mt-1">{imam.phone}</p>
          )}
        </div>

      </div>
    </div>
  );
}