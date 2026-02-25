"use client";

import { useEffect, useState } from "react";
import { Button } from "../../../../components/ui/button";
import { FaTrash, FaPlus, FaArrowLeft } from "react-icons/fa";
import { useRouter } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  isDefault: boolean;
};

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchCategories = async () => {
    const res = await fetch("/api/admin/expense-category");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/expense-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to create");
        return;
      }

      setName("");
      fetchCategories();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmDelete) return;

    const res = await fetch("/api/admin/expense-category", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Cannot delete");
      return;
    }

    fetchCategories();
  };

  return (
    <>
      <div>
        <Button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-400"
              >
                <FaArrowLeft /> Back
              </Button>
      </div>
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-6">
        <h2 className="text-3xl font-bold text-emerald-700 mb-2">
          Expense Categories
        </h2>
        <p className="text-gray-500 mb-8">
          Manage and organize expense categories for better financial tracking.
        </p>

        {/* Add Category */}
        <div className="flex gap-3 mb-10">
          <input
            className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Enter new category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Button
            onClick={handleCreate}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <FaPlus />
            {loading ? "Adding..." : "Add"}
          </Button>
        </div>

        {/* Chips Section */}
        {categories.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No categories found.
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition
                ${
                  cat.isDefault
                    ? "bg-gray-100 text-gray-700 border-gray-300"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200"
                }
              `}
              >
                <span>{cat.name}</span>

                {cat.isDefault && (
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}

                {!cat.isDefault && (
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FaTrash className="cursor-pointer" size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
