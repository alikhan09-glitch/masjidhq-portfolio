"use client";

import { useRouter } from "next/navigation";
import {
  FiPlus,
  FiCreditCard,
  FiUsers,
  FiHome,
} from "react-icons/fi";

export default function QuickActions() {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
      <h2 className="font-semibold mb-6 text-lg">
        Quick Actions
      </h2>

      <div className="grid md:grid-cols-4 gap-4">

        <ActionCard
          title="Add Income"
          icon={<FiPlus />}
          onClick={() => router.push("/admin/income")}
        />

        <ActionCard
          title="Add Expense"
          icon={<FiCreditCard />}
          onClick={() => router.push("/admin/expense")}
        />

        <ActionCard
          title="Add Member"
          icon={<FiUsers />}
          onClick={() => router.push("/admin/members")}
        />

        <ActionCard
          title="Edit Mosque"
          icon={<FiHome />}
          onClick={() => router.push("/admin/settings/mosque")}
        />

      </div>
    </div>
  );
}

function ActionCard({ title, icon, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-gray-50 hover:bg-gray-100 transition p-4 rounded-xl border border-gray-200 flex items-center gap-3"
    >
      <div className="text-gray-600">{icon}</div>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );
}