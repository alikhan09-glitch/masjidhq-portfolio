"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface AdminLayoutShellProps {
  children: React.ReactNode;
  mosqueName?: string;
  adminName?: string;
  role?: string;
}

export default function AdminLayoutShell({
  children,
  mosqueName,
  adminName,
  role
}: AdminLayoutShellProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="h-screen grid grid-cols-[280px_1fr] bg-gray-100">

      {/* Sidebar */}
      <aside className="h-screen border-r bg-white">
        <AdminSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      </aside>

      {/* Right Section */}
      <div className="flex flex-col h-screen">

        {/* Header */}
        <header className="h-16 bg-white shadow flex items-center px-6">
          <AdminHeader
  setIsOpen={setIsOpen}
  mosqueName={mosqueName}
  adminName={adminName}
  role={role}
/>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 mt-2">
          {children}
        </main>

      </div>
    </div>
  );
}
