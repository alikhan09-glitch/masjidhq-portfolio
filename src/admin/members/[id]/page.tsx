"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FaArrowLeft, FaEdit } from "react-icons/fa";

type Member = {
  _id: string;
  name: string;
  roleType: string;
  contributionType: string;
  contributionAmount?: number;
  joinedAt: string;
  lastContributionDate?: string;
  isActive: boolean;
};

type Income = {
  _id: string;
  amount: number;
  date: string;
  paymentMode: string;
  type: string;
};

export default function MemberDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [member, setMember] = useState<Member | null>(null);
  const [payments, setPayments] = useState<Income[]>([]);
  const [totalPaid, setTotalPaid] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/admin/members/${id}`);
      const data = await res.json();

      setMember(data.member);
      setPayments(data.payments);
      setTotalPaid(data.totalPaid);
    } catch (error) {
      console.error("Error loading member");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!member) return <p>Member not found.</p>;

  // 🔥 This Month Paid Check
  const now = new Date();
  const thisMonthPaid = payments.some((income) => {
    const incomeDate = new Date(income.date);
    return (
      incomeDate.getMonth() === now.getMonth() &&
      incomeDate.getFullYear() === now.getFullYear()
    );
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 mb-4"
        >
          <FaArrowLeft /> Back
        </Button>

        <Button
          onClick={() => router.push(`/admin/members/${member._id}/edit`)}
          className="flex items-center gap-2 text-gray-400 mb-4"
        >
          <FaEdit /> Edit
        </Button>
      </div>

      {/* Member Info Card */}
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
        <h2 className="text-3xl font-bold text-emerald-700 mb-4">
          {member.name}
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-gray-500">Role</p>
            <p className="font-semibold capitalize">{member.roleType}</p>
          </div>

          <div>
            <p className="text-gray-500">Joined</p>
            <p className="font-semibold">
              {new Date(member.joinedAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                member.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {member.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div>
            <p className="text-gray-500">Expected Contribution</p>
            <p className="font-semibold">
              {member.contributionType !== "none"
                ? `₹${member.contributionAmount} (${member.contributionType})`
                : "None"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Last Contribution</p>
            <p className="font-semibold">
              {member.lastContributionDate
                ? new Date(member.lastContributionDate).toLocaleDateString()
                : "No payments yet"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">This Month</p>
            <span
              className={`px-3 py-1 rounded-full text-xs ${
                thisMonthPaid
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {thisMonthPaid ? "Paid" : "Due"}
            </span>
          </div>

          <div>
            <p className="text-gray-500">Total Paid</p>
            <p className="font-bold text-emerald-700">
              ₹{totalPaid.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Payment History */}
      <div className="overflow-x-auto bg-white shadow-xl rounded-2xl">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-emerald-100 text-gray-700">
            <tr>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Payment Mode</th>
              <th className="px-5 py-4">Income Type</th>
            </tr>
          </thead>

          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No payments recorded.
                </td>
              </tr>
            ) : (
              payments.map((income) => (
                <tr key={income._id} className="border-t hover:bg-gray-50">
                  <td className="px-5 py-4">
                    {new Date(income.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>

                  <td className="px-5 py-4 font-semibold text-emerald-700">
                    ₹{income.amount.toLocaleString()}
                  </td>

                  <td className="px-5 py-4 capitalize">{income.paymentMode}</td>

                  <td className="px-5 py-4 capitalize">
                    {income.type.replace("-", " ")}
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
