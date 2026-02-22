"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FiHome,
  FiSettings,
  FiChevronDown,
  FiLogOut,FiBarChart2
} from "react-icons/fi";
import {FaUsers} from "react-icons/fa";
import {
  GiReceiveMoney,
  GiTakeMyMoney,
} from "react-icons/gi";

type ChildItem = {
  name: string;
  href: string;
};

type NavItem = {
  name: string;
  icon: any;
  children: ChildItem[];
};

export default function AdminSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const pathname = usePathname();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navItems: NavItem[] = [
  {
    name: "Dashboard",
    icon: FiHome,
    children: [{ name: "Overview", href: "/admin" }],
  },

  {
    name: "Members",
    icon: FaUsers,
    children: [
      { name: "All Members", href: "/admin/members" },
      { name: "Add Member", href: "/admin/members/add" },
    ],
  },

  {
    name: "Income",
    icon: GiReceiveMoney,
    children: [
      { name: "All Income", href: "/admin/income" },
      { name: "Add Income", href: "/admin/income/add" },
    ],
  },

  {
    name: "Expense",
    icon: GiTakeMyMoney,
    children: [
      { name: "All Expenses", href: "/admin/expense" },
      { name: "Expense Categories", href: "/admin/expense/categories" },
      { name: "Add Expense", href: "/admin/expense/add-expense" },
    ],
  },

  {
    name: "Reports",
    icon: FiBarChart2,
    children: [
      { name: "Monthly Report", href: "/admin/reports/monthly" },
      { name: "Member Contributions", href: "/admin/reports/members" },
    ],
  },

  {
    name: "Settings",
    icon: FiSettings,
    children: [
      { name: "Mosque Details", href: "/admin/settings/mosque" },
      { name: "Admin Profile", href: "/admin/settings/profile" },
    ],
  },
];


  // ✅ Auto-open dropdown when route active
  useEffect(() => {
    navItems.forEach((item) => {
      if (item.children.some((c) => c.href === pathname)) {
        setOpenDropdown(item.name);
      }
    });
  }, [pathname]);

  return (
  <aside
  className={`fixed top-0 left-0 h-screen w-72 z-40
  bg-gradient-to-b from-emerald-800 to-emerald-900
  transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
>


      <div className="flex h-full flex-col p-6">
        {/* Logo */}
        <div className="pb-4">
          <h2 className="text-xl font-bold tracking-wide text-white">
            🕌 AdvanceMosque
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isOpenDropdown = openDropdown === item.name;
            const isParentActive = item.children.some(
              (c) => c.href === pathname
            );

            return (
              <div key={item.name}>
                {/* Parent */}
                <button
                  onClick={() =>
                    setOpenDropdown(
                      isOpenDropdown ? null : item.name
                    )
                  }
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 transition ${
                    isParentActive
                      ? "bg-emerald-700 text-white"
                      : "text-emerald-100 hover:bg-emerald-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="text-lg" />
                    <span className="font-medium">
                      {item.name}
                    </span>
                  </div>
                  <FiChevronDown
                    className={`transition-transform duration-200 ${
                      isOpenDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Children */}
                {isOpenDropdown && (
                  <div className="mt-2 ml-6 space-y-1">
                    {item.children.map((child) => {
                      const active =
                        pathname === child.href;

                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          onClick={() => setIsOpen(false)}
                          className={`block rounded-md px-3 py-2 text-sm transition ${
                            active
                              ? "bg-emerald-600 text-white font-semibold"
                              : "text-emerald-300 hover:bg-emerald-800 hover:text-white "
                          }`}
                        >
                          {child.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        
       

        {/* Logout */}
        <div className="mt-2">
          <button  onClick={async () => {
      await fetch("/api/auth/logout", {
        method: "POST",
      });

      window.location.href = "/auth/login";
    }} className="flex w-full items-center cursor-pointer gap-3 rounded-lg px-3 py-2 text-emerald-200 transition shadow-sm hover:bg-red-600 hover:text-white">
            <FiLogOut />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
