"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { IoSearchSharp } from "react-icons/io5";

type Member = {
  _id: string;
  name: string;
  roleType: string;
  contributionType: string;
  contributionAmount?: number;
  isActive: boolean;
  thisMonthPaid?: boolean;
};

export default function MembersPage() {
  const router = useRouter();

  const [members, setMembers] = useState<Member[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [statusFilter]);

  const fetchMembers = async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/members?status=${statusFilter}`);
    const data = await res.json();
    setMembers(data);
    setLoading(false);
  };

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch = member.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesRole =
        roleFilter === "all" || member.roleType === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  // ✅ Toggle Active/Inactive (Instant UI Update)
  const handleToggleStatus = async (member: Member) => {
    const res = await fetch(`/api/admin/members/${member._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isActive: !member.isActive,
        leftAt: member.isActive ? new Date() : null,
      }),
    });

    if (res.ok) {
      setMembers((prev) =>
        prev.map((m) =>
          m._id === member._id ? { ...m, isActive: !m.isActive } : m,
        ),
      );
    } else {
      alert("Failed to update status");
    }
  };

  // ✅ Permanent Delete (Instant Remove from UI)
  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "This will permanently delete the member. Continue?",
    );
    if (!confirmDelete) return;

    const res = await fetch(`/api/admin/members/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      // Remove instantly from UI
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-emerald-700">Members</h2>

        <Button onClick={() => router.push("/admin/members/add")}>
          + Add Member
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex items-center justify-center gap-2 ">
            <IoSearchSharp size={24} color="#a0a0a0ff" />

            <input
              type="text"
              placeholder="Search by name..."
              className="w-full shadow-lg border-t-1 border-gray-100 focus:outline-none rounded-lg px-4 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
            <select
              className="cursor-pointer shadow-lg border-t-1 border-gray-100 focus:outline-none rounded-lg px-4 py-2"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="member">Member</option>
              <option value="committee">Committee</option>
              <option value="volunteer">Volunteer</option>
              <option value="staff">Staff</option>
            </select>

            <select
              className="cursor-pointer shadow-lg border-t-1 border-gray-100 focus:outline-none rounded-lg px-4 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-emerald-100 text-gray-700">
            <tr>
              <th className="px-5 py-4">Name</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Contribution</th>
              <th className="px-5 py-4">This Month</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  Loading...
                </td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center p-6">
                  No members found.
                </td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member._id} className="border-t">
                  <td className="px-5 py-4 font-medium">{member.name}</td>

                  <td className="px-5 py-4 capitalize">{member.roleType}</td>

                  <td className="px-5 py-4">
                    {member.contributionType !== "none"
                      ? `₹${member.contributionAmount} (${member.contributionType})`
                      : "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        member.thisMonthPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {member.thisMonthPaid ? "Paid" : "Due"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleToggleStatus(member)}
                      className={`px-3 py-1 rounded-full text-xs cursor-pointer ${
                        member.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {member.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          router.push(`/admin/members/${member._id}`)
                        }
                        className="cursor-pointer bg-blue-50 p-2 rounded-lg text-blue-600"
                      >
                        <FaEye />
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/admin/members/${member._id}/edit`)
                        }
                        className="cursor-pointer bg-yellow-50 p-2 rounded-lg text-yellow-600"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(member._id)}
                        className="cursor-pointer bg-red-50 p-2 rounded-lg text-red-600"
                      >
                        <RiDeleteBin5Fill />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
