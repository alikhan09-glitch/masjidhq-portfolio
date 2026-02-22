"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiMenu,
  FiLogOut,
  FiUser,
  FiEdit,
  FiHome,
} from "react-icons/fi";
import { Button } from "../ui/button";

interface AdminHeaderProps {
  setIsOpen: (v: boolean) => void;
  mosqueName?: string;
  adminName?: string;
  role?: string;
}

export default function AdminHeader({
  setIsOpen,
  mosqueName,
  adminName = "Admin",
  role = "Manager",
}: AdminHeaderProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ===== Close on outside click ===== */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== Auto Page Title ===== */
  const pageTitle = useMemo(() => {
    if (pathname.includes("dashboard")) return "Dashboard";
     if (pathname.includes("members")) return "Members";
    if (pathname.includes("income")) return "Income";
     if (pathname.includes("expense")) return "Expense";
     if (pathname.includes("settings")) return "Settings";
    return "Dashboard";
  }, [pathname]);

  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between w-full h-16 bg-white">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="text-2xl md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <FiMenu />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-gray-800">
            <span className="text-emerald-600 font-bold">
              {mosqueName}
            </span>
            <span className="text-gray-400"> | {pageTitle}</span>
          </h1>
          <span className="text-xs text-gray-400">
            {today}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center gap-2 rounded-full p-2 hover:bg-gray-100 transition"
        >
          <FiUser className="text-lg cursor-pointer" />
        </button>

        {/* PROFESSIONAL DROPDOWN */}
        {openDropdown && (
          <div className="absolute right-0 top-14 w-72 bg-white z-10 rounded-2xl shadow-xl border border-gray-100 p-4 animate-in fade-in zoom-in-95">

            {/* Admin Info */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 px-2 rounded-full bg-emerald-100  text-emerald-600 font-bold text-lg">
                {adminName?.charAt(0).toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {adminName}
                </p>
                <p className="text-xs text-gray-500">
                  {role}
                </p>
              </div>
            </div>

            {/* Mosque Info */}
            <div className="mb-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-xs text-red-600 mb-1">
                Mosque
              </p>
              <p className="text-sm font-medium text-gray-200">
                {mosqueName}
              </p>
            </div>

            {/* Edit Buttons */}
            <div className="space-y-2">

              <button
                onClick={() => {
                  window.location.href =
                    "/admin/profile";
                }}
                className="flex items-center gap-3 cursor-pointer shadow hover:shadow-md w-full text-sm px-3 py-2 rounded-lg transition"
              >
                <FiEdit />
                Edit Profile
              </button>

              <button
                onClick={() => {
                  window.location.href =
                    "/admin/mosque-profile";
                }}
                className="flex items-center gap-3 cursor-pointer shadow hover:shadow-md w-full text-sm px-3 py-2 rounded-lg transition"
              >
                <FiHome />
                Edit Mosque Details
              </button>

              <button
                onClick={async () => {
                  await fetch("/api/auth/logout", {
                    method: "POST",
                  });
                  window.location.href =
                    "/auth/login";
                }}
                className="flex items-center cursor-pointer shadow hover:shadow-md gap-3 w-full text-sm px-3 py-2 rounded-lg text-red-600 transition"
              >
                <FiLogOut />
                Logout
              </button>

            </div>
          </div>
        )}
      </div>
    </header>
  );
}
