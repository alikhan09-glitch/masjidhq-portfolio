"use client";

export default function ExpenseCategoryBreakdown({ categories }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4">Top Expense Categories</h2>

      <div className="space-y-2">
        {categories.map((cat: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{cat._id}</span>
            <span>₹{cat.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}