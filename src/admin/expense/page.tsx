"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  FaPlus,
  FaCheck,
  FaTrash,
  FaEdit,
  FaEye,
  FaUndo,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

type Expense = {
  _id: string;
  title: string;
  amount: number;
  date: string;
  receiptNumber?: string;
  paymentMode: string;
  status: "pending" | "approved" | "rejected";
  category?: { name: string };
};

export default function ExpensePage() {
  const router = useRouter();

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  const [filterType, setFilterType] = useState<
    "month" | "year" | "range" | "all"
  >("month");

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  /* =========================
     FETCH
  ========================= */
  const fetchExpenses = async () => {
    const res = await fetch("/api/admin/expense");
    const data = await res.json();
    setExpenses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  /* =========================
     CATEGORY LIST
  ========================= */
  const categories = useMemo(() => {
    const unique = new Set(
      expenses.map((e) => e.category?.name).filter(Boolean),
    );
    return Array.from(unique);
  }, [expenses]);

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const d = new Date(e.date);

      // 🔹 Date filtering
      if (filterType === "year") {
        if (d.getFullYear() !== selectedYear) return false;
      }

      if (filterType === "month") {
        if (d.getFullYear() !== selectedYear || d.getMonth() !== selectedMonth)
          return false;
      }

      if (filterType === "range") {
        if (fromDate && toDate) {
          const from = new Date(fromDate);
          const to = new Date(toDate);
          to.setHours(23, 59, 59, 999);
          if (d < from || d > to) return false;
        }
      }

      // 🔹 Category filtering
      if (selectedCategory !== "all" && e.category?.name !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [
    expenses,
    filterType,
    selectedYear,
    selectedMonth,
    fromDate,
    toDate,
    selectedCategory,
  ]);

  /* =========================
     SUMMARY
  ========================= */
  const totalAmount = useMemo(() => {
    return filteredExpenses
      .filter((e) => e.status === "approved")
      .reduce((sum, e) => sum + e.amount, 0);
  }, [filteredExpenses]);

  const pendingCount = filteredExpenses.filter(
    (e) => e.status === "pending",
  ).length;

  const approvedCount = filteredExpenses.filter(
    (e) => e.status === "approved",
  ).length;

  /* =========================
     CATEGORY ANALYSIS
  ========================= */
  const categoryBreakdown = useMemo(() => {
    const map: Record<string, number> = {};

    filteredExpenses.forEach((e) => {
      if (e.status !== "approved") return;
      const cat = e.category?.name || "Uncategorized";
      map[cat] = (map[cat] || 0) + e.amount;
    });

    return map;
  }, [filteredExpenses]);

  const topCategory = useMemo(() => {
    let max = 0;
    let top = "";

    Object.entries(categoryBreakdown).forEach(([cat, amount]) => {
      if (amount > max) {
        max = amount;
        top = cat;
      }
    });

    return { name: top, amount: max };
  }, [categoryBreakdown]);

  const getFilterLabel = () => {
    if (filterType === "all") {
      return "All Records";
    }

    if (filterType === "month") {
      return `${months[selectedMonth]} ${selectedYear}`;
    }

    if (filterType === "year") {
      return `Year ${selectedYear}`;
    }

    if (filterType === "range" && fromDate && toDate) {
      return `${new Date(fromDate).toLocaleDateString("en-IN")} - ${new Date(
        toDate,
      ).toLocaleDateString("en-IN")}`;
    }

    return "Filtered Records";
  };

   /* ================= PAGINATION ================= */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* ================= PAGINATED DATA ================= */
  const totalPages = Math.ceil(
    filteredExpenses.length / itemsPerPage
  );

  const paginatedExpenses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredExpenses.slice(
      start,
      start + itemsPerPage
    );
  }, [filteredExpenses, currentPage]);

   /* ================= RESET PAGE IF FILTER CHANGES ================= */
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredExpenses]);

  /* =========================
     ACTIONS
  ========================= */
  const handleApprove = async (id: string) => {
    await fetch(`/api/admin/expense/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    fetchExpenses();
  };

  const handleRevert = async (id: string) => {
    await fetch(`/api/admin/expense/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "pending" }),
    });
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/expense/${id}`, {
      method: "DELETE",
    });
    fetchExpenses();
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-emerald-700">
          Expense Management
        </h1>

        <Button onClick={() => router.push("/admin/expense/add-expense")}>
          <FaPlus className="mr-2" />
          Add Expense
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-4">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="border-1 border-gray-300 px-3 py-2 rounded-lg focus:outline-none shadow-md"
        >
          <option value="month">Month</option>
          <option value="year">Year</option>
          <option value="range">Custom Range</option>
          <option value="all">All</option>
        </select>

        {(filterType === "month" || filterType === "year") && (
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border-1 border-gray-300 px-3 py-2 rounded-lg focus:outline-none shadow-md"
          >
            {Array.from({ length: 8 }, (_, i) => currentYear - 5 + i).map(
              (y) => (
                <option key={y}>{y}</option>
              ),
            )}
          </select>
        )}

        {filterType === "month" && (
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="border-1 border-gray-300 px-3 py-2 rounded-lg focus:outline-none shadow-md"
          >
            {months.map((m, i) => (
              <option key={i} value={i}>
                {m}
              </option>
            ))}
          </select>
        )}

        {filterType === "range" && (
          <>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-1 border-gray-300 px-3 py-2 rounded-lg focus:outline-none shadow-md"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border-1 border-gray-300 px-3 py-2 rounded-lg focus:outline-none shadow-md"
            />
          </>
        )}

        {/* 🔥 CATEGORY FILTER */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border-1 border-gray-300 px-3 py-2 rounded-lg focus:outline-none shadow-md"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* ================= SUMMARY SECTION ================= */}
      <div className="space-y-8">
        {/* ===== ROW 1 : FINANCIAL OVERVIEW ===== */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Total Approved Amount */}
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-8 shadow-2xl">
            <p className="text-sm opacity-80">Total Approved Expense</p>
            <h2 className="text-3xl font-bold mt-2">
              ₹ {totalAmount.toLocaleString()}
            </h2>
            <p className="text-xs opacity-70 mt-2">
              Approved transactions only
            </p>
          </div>

          {/* Total Expenses Count */}
          <div className="bg-white rounded-2xl p-8 shadow-xl">
            <p className="text-gray-500 text-sm">Total Expenses</p>

            <h2 className="text-3xl font-bold text-gray-800 mt-2">
              {filteredExpenses.length}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Showing: {getFilterLabel()}
            </p>
          </div>
        </div>

        {/* ===== ROW 2 : STATUS OVERVIEW ===== */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-gray-500 text-sm">Pending Approval</p>
            <h2 className="text-2xl font-bold text-yellow-500 mt-2">
              {pendingCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-gray-500 text-sm">Approved Expenses</p>
            <h2 className="text-2xl font-bold text-green-600 mt-2">
              {approvedCount}
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md">
            <p className="text-gray-500 text-sm">Approval Rate</p>
            <h2 className="text-2xl font-bold text-blue-600 mt-2">
              {expenses.length > 0
                ? Math.round((approvedCount / expenses.length) * 100)
                : 0}
              %
            </h2>
          </div>
        </div>

        {/* ===== ROW 3 : INSIGHT CARD ===== */}
        <div className="bg-white rounded-2xl p-8 shadow-xl">
          <p className="text-gray-500 text-sm">Highest Spending Category</p>

          <div className="flex justify-between items-center mt-3">
            <h2 className="text-xl font-bold text-purple-600">
              {topCategory.name || "N/A"}
            </h2>

            <span className="text-lg font-semibold text-gray-800">
              ₹ {topCategory.amount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredExpenses.length === 0 ? (
        <p className="text-gray-500">No income records found.</p>
      ) : (
        <>
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-emerald-100 text-gray-700">
            <tr>
              <th className="p-4">Date</th>
              {/* <th className="p-4">Receipt</th> */}
              <th className="p-4">Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-gray-400">
                  No expenses found
                </td>
              </tr>
            ) : (
              filteredExpenses.map((exp) => (
                <tr key={exp._id} className="border-t">
                  <td className="p-4">
                    {new Date(exp.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  {/* <td className="p-4">
                    {exp.receiptNumber}
                  </td> */}
                  <td className="p-4">{exp.title}</td>
                  <td className="p-4">{exp.category?.name}</td>
                  <td className="p-4 text-red-600 font-semibold">
                    ₹ {exp.amount}
                  </td>
                  <td className="p-4">{exp.status}</td>
                  <td className="p-4 flex gap-3">
                    <FaEye
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/expense/${exp._id}`)}
                    />
                    <FaEdit
                      className="cursor-pointer"
                      onClick={() =>
                        router.push(`/admin/expense/${exp._id}/edit`)
                      }
                    />
                    {exp.status === "pending" && (
                      <FaCheck
                        className="cursor-pointer text-green-600"
                        onClick={() => handleApprove(exp._id)}
                      />
                    )}
                    {exp.status === "approved" && (
                      <FaUndo
                        className="cursor-pointer text-orange-600"
                        onClick={() => handleRevert(exp._id)}
                      />
                    )}
                    {exp.status !== "approved" && (
                      <FaTrash
                        className="cursor-pointer text-red-600"
                        onClick={() => handleDelete(exp._id)}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
                <div className="flex justify-end mt-4 gap-3">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    <FaChevronLeft />
                  </button>
      
                  <span className="px-4 py-2">
                    {currentPage} / {totalPages || 1}
                  </span>
      
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                  >
                    <FaChevronRight />
                  </button>
                </div>
      </>   )}
    </div>
  );
}
