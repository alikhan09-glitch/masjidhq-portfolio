"use client";

export default function RangeSelector({ range, setRange }: any) {
  return (
    <div className="flex gap-3">
      {["monthly", "yearly", "all"].map(r => (
        <button
          key={r}
          onClick={() => setRange(r)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition
          ${range === r ? "bg-gray-900 text-white" : "bg-white border border-gray-300"}`}
        >
          {r.toUpperCase()}
        </button>
      ))}
    </div>
  );
}