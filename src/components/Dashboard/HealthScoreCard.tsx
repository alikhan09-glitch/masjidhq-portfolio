"use client";

export default function HealthScoreCard({ score }: any) {
  const color =
    score >= 80 ? "bg-green-100 text-green-700" :
    score >= 50 ? "bg-yellow-100 text-yellow-700" :
    "bg-red-100 text-red-700";

  return (
    <div className={`p-6 rounded-2xl shadow-sm border ${color}`}>
      <p className="text-xs uppercase tracking-wide">System Health</p>
      <p className="text-3xl font-bold mt-2">{score}%</p>
    </div>
  );
}