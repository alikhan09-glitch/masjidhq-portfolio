"use client";


import { useEffect, useState } from "react";
import { FaMosque } from "react-icons/fa";
import {
  FiEdit2,
  FiCheckCircle,
  FiUser,
  FiShield,
  FiLock,
  FiHome,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";

/* ================= TYPES ================= */

type MosqueInfo = {
  name: string;
  code: string;
  city: string;
  state: string;
  type: string;
};

type AdminForm = {
  name: string;
  email?: string;
  mobile?: string;
  role: string;
  isActive: boolean;
  mosque: MosqueInfo;
};

export default function AdminProfilePage() {
  const [form, setForm] = useState<AdminForm | null>(null);
  const [editSection, setEditSection] = useState<
    "basic" | "password" | null
  >(null);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saving, setSaving] = useState(false);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch("/api/admin/settings/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setForm(data.data);
        }
      });
  }, []);

  const updateField = (key: keyof AdminForm, value: any) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  /* ================= SAVE SECTION ================= */

  const saveSection = async (section: "basic" | "password") => {
    if (!form) return;

    setSaving(true);

    try {
      let payload: any = {};

      if (section === "basic") {
        payload = {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
        };
      }

      if (section === "password") {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        payload = {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        };
      }

      await fetch("/api/admin/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setEditSection(null);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* ================= BASIC INFO ================= */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiUser />
              <h2 className="text-lg font-semibold">Admin Profile</h2>
            </div>

            <Button
              onClick={() => {
                if (editSection === "basic") {
                  saveSection("basic");
                } else {
                  setEditSection("basic");
                }
              }}
              className="flex items-center gap-2"
            >
              {editSection === "basic" ? (
                <>
                  <FiCheckCircle size={14} /> Update
                </>
              ) : (
                <>
                  <FiEdit2 size={14} /> Edit
                </>
              )}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <label className="text-gray-500 text-xs">Name</label>
              {editSection === "basic" ? (
                <input
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              ) : (
                <p className="font-semibold mt-1">{form.name}</p>
              )}
            </div>

            <div>
              <label className="text-gray-500 text-xs">Email</label>
              {editSection === "basic" ? (
                <input
                  value={form.email || ""}
                  onChange={(e) => updateField("email", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              ) : (
                <p className="font-semibold mt-1">{form.email || "-"}</p>
              )}
            </div>

            <div>
              <label className="text-gray-500 text-xs">Mobile</label>
              {editSection === "basic" ? (
                <input
                  value={form.mobile || ""}
                  onChange={(e) => updateField("mobile", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
                />
              ) : (
                <p className="font-semibold mt-1">{form.mobile || "-"}</p>
              )}
            </div>

            <div>
              <label className="text-gray-500 text-xs">Role</label>
              <p className="font-semibold mt-1 capitalize">
                {form.role}
              </p>
            </div>
          </div>
        </div>

        {/* ================= PASSWORD ================= */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <FiLock />
      <h2 className="text-lg font-semibold">Security</h2>
    </div>

    <Button
      onClick={() => {
        if (editSection === "password") {
          saveSection("password");
        } else {
          setEditSection("password");
        }
      }}
      className="flex items-center gap-2"
    >
      {editSection === "password" ? (
        <>
          <FiCheckCircle size={14} /> Update
        </>
      ) : (
        <>
          <FiShield size={14} /> Change Password
        </>
      )}
    </Button>
  </div>

  {/* VIEW MODE */}
  {editSection !== "password" && (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between text-sm">
        <div>
          <p className="text-gray-500 text-xs">Password</p>
          <p className="font-semibold tracking-widest mt-1">
            ••••••••
          </p>
        </div>
        <span className="text-xs text-gray-400">
          Last updated securely
        </span>
      </div>
    </div>
  )}

  {/* EDIT MODE */}
  {editSection === "password" && (
    <div className="grid md:grid-cols-3 gap-4">
      <input
        type="password"
        placeholder="Current Password"
        value={passwordData.currentPassword}
        onChange={(e) =>
          setPasswordData({
            ...passwordData,
            currentPassword: e.target.value,
          })
        }
        className="border rounded-lg px-3 py-2"
      />

      <input
        type="password"
        placeholder="New Password"
        value={passwordData.newPassword}
        onChange={(e) =>
          setPasswordData({
            ...passwordData,
            newPassword: e.target.value,
          })
        }
        className="border rounded-lg px-3 py-2"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        value={passwordData.confirmPassword}
        onChange={(e) =>
          setPasswordData({
            ...passwordData,
            confirmPassword: e.target.value,
          })
        }
        className="border rounded-lg px-3 py-2"
      />
    </div>
  )}
</div>

        {/* ================= LINKED MOSQUE ================= */}

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <FaMosque />
            <h2 className="text-lg font-semibold">Linked Mosque</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Mosque Name</p>
              <p className="font-semibold">{form.mosque?.name}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Code</p>
              <p className="font-semibold">{form.mosque?.code}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Location</p>
              <p className="font-semibold">
                {form.mosque?.city}, {form.mosque?.state}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs">Type</p>
              <p className="font-semibold capitalize">
                {form.mosque?.type}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}