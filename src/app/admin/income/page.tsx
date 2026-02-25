"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../../components/ui/button";
import { FaChevronLeft, FaChevronRight, FaEye } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { IoSearchSharp } from "react-icons/io5";

type Income = {
  _id: string;
  type: string;
  amount: number;
  date: string;
  purpose?: string;
  donorName?: string;
  paymentMode: string;
  receiptGenerated?: boolean;
};

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  const router = useRouter();

  useEffect(() => {
    fetchIncome();
  }, []);

  const fetchIncome = async () => {
    try {
      const res = await fetch("/api/admin/income");
      const data = await res.json();
      setIncomes(data);
    } catch (error) {
      console.error("Failed to fetch income");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this income?",
    );
    if (!confirmDelete) return;

    await fetch(`/api/admin/income/${id}`, {
      method: "DELETE",
    });

    setIncomes((prev) => prev.filter((item) => item._id !== id));
  };

  // 🔎 Filter Logic
  const filteredIncomes = useMemo(() => {
  return incomes.filter((income) => {
    // 🔥 If no search → allow all
    if (!search.trim()) {
      return typeFilter === "All" || income.type === typeFilter;
    }

    const searchValue = search.toLowerCase();

    const donor = income.donorName?.toLowerCase() || "";
    const purpose = income.purpose?.toLowerCase() || "";

    const matchesSearch =
      donor.includes(searchValue) ||
      purpose.includes(searchValue);

    const matchesType =
      typeFilter === "All" || income.type === typeFilter;

    return matchesSearch && matchesType;
  });
}, [incomes, search, typeFilter]);


  // 📄 Pagination Logic
  const totalPages = Math.ceil(filteredIncomes.length / rowsPerPage);

  const paginatedData = filteredIncomes.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalAmount = filteredIncomes.reduce(
    (sum, item) => sum + item.amount,
    0,
  );

  // Get unique types dynamically
  const uniqueTypes = [
    "All",
    ...Array.from(new Set(incomes.map((i) => i.type))),
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-emerald-700">
            Income Records
          </h2>
          <p className="text-gray-500 text-sm">
            Manage and track all mosque income entries.
          </p>
        </div>

        <Button onClick={() => router.push("/admin/income/add")}>
          + Add Income
        </Button>
      </div>

      {/* 🔎 Filter Section */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex items-center justify-center gap-2 w-full md:w-1/3">
            <IoSearchSharp size={24} color="#a0a0a0ff" />
            <input
              type="text"
              placeholder="Search by donor or purpose..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm
                   focus:outline-none transition"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Filter */}
          <div className="w-full md:w-48">
            <select
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm
                   focus:outline-none transition cursor-pointer"
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              {uniqueTypes.map((type) => (
                <option key={type} value={type}>
                  {type === "All" ? "All Types" : type.replace("-", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl mb-6 text-sm flex gap-8">
        <div>
          <span className="text-gray-600">Total Records:</span>{" "}
          <span className="font-semibold">{filteredIncomes.length}</span>
        </div>

        <div>
          <span className="text-gray-600">Total Amount:</span>{" "}
          <span className="font-semibold text-emerald-700">
            ₹{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredIncomes.length === 0 ? (
        <p className="text-gray-500">No income records found.</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-emerald-100 text-gray-700">
                <tr>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Payment</th>
                  <th className="px-5 py-4">Purpose</th>
                  <th className="px-5 py-4">Donor</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedData.map((income) => (
                  <tr
                    key={income._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-5 py-4">
                      {new Date(income.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td className="px-5 py-4 capitalize">
                      {income.type.replace("-", " ")}
                    </td>

                    <td className="px-5 py-4 font-semibold text-emerald-700">
                      ₹{income.amount.toLocaleString()}
                    </td>

                    <td className="px-5 py-4 capitalize">
                      {income.paymentMode}
                    </td>

                    <td className="px-5 py-4">{income.purpose || "-"}</td>

                    <td className="px-5 py-4">{income.donorName || "-"}</td>

                    <td className="px-5 py-4">
                      {income.receiptGenerated ? (
                        <span className="bg-green-100 text-green-700 text-xs py-2 px-3 rounded-full">
                          Issued
                        </span>
                      ) : (
                        <span className="bg-orange-100 text-gray-500 text-xs p-2 rounded-full">
                          Pending
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() =>
                            router.push(`/admin/income/${income._id}`)
                          }
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 p-2 rounded-lg transition cursor-pointer"
                        >
                          <FaEye />
                        </button>

                        <button
                          onClick={() => handleDelete(income._id)}
                          className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-lg transition cursor-pointer"
                        >
                          <RiDeleteBin5Fill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
        </>
      )}
    </div>
  );
}
