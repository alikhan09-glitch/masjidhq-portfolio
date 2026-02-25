"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FaMosque } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import {
  FiEdit2,
  FiMapPin,
  FiHome,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { TbUserStar } from "react-icons/tb";

/* ================= TYPES ================= */

type PrayerTimings = {
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jummah: string;
};

type Imam = {
  name: string;
  phone: string;
};

type MosqueForm = {
  name: string;
  code: string;
  type: string;

  address?: string;
  city?: string;
  state?: string;
  pinCode?: string;

  totalFloors?: number;
  totalCapacity?: number;
  washroomCount?: number;

  prayerTimings: PrayerTimings;
  currentImam: Imam;

  isVerified: boolean;
  isActive: boolean;
};

export default function MosqueProfilePage() {
  const [form, setForm] = useState<MosqueForm | null>(null);
  const [editSection, setEditSection] = useState<
    "basic" | "address" | "structure" | "prayer" | "imam" | null
  >(null);

  const [saving, setSaving] = useState(false);

  /* ================= FETCH + NORMALIZE ================= */

  useEffect(() => {
    fetch("/api/admin/settings/mosque")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const mosque = data.data;

          setForm({
            ...mosque,

            /* 🔥 Ensure numbers stay numbers */
            totalFloors: mosque.totalFloors ?? undefined,
            totalCapacity: mosque.totalCapacity ?? undefined,
            washroomCount: mosque.washroomCount ?? undefined,

            /* 🔥 Always full prayer object */
            prayerTimings: {
              fajr: "",
              zuhr: "",
              asr: "",
              maghrib: "",
              isha: "",
              jummah: "",
              ...mosque.prayerTimings,
            },

            /* 🔥 Imam safe object */
            currentImam: {
              name: "",
              phone: "",
              ...mosque.currentImam,
            },
          });
        }
      });
  }, []);

  /* ================= UPDATE BASIC FIELD ================= */

  const updateField = <K extends keyof MosqueForm>(
    key: K,
    value: MosqueForm[K],
  ) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  /* ================= UPDATE PRAYER ================= */

  const updatePrayer = (key: keyof PrayerTimings, value: string) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            prayerTimings: {
              ...prev.prayerTimings,
              [key]: value,
            },
          }
        : prev,
    );
  };

  const prayerList: (keyof PrayerTimings)[] = [
    "fajr",
    "zuhr",
    "asr",
    "maghrib",
    "isha",
    "jummah",
  ];

  /* ================= UPDATE IMAM ================= */

  const updateImam = (key: keyof Imam, value: string) => {
    setForm((prev) =>
      prev
        ? {
            ...prev,
            currentImam: {
              ...prev.currentImam,
              [key]: value,
            },
          }
        : prev,
    );
  };

  /* ================= SAVE ================= */

  /* ================= SECTION SAVE ================= */

  const saveSection = async (
    section: "basic" | "address" | "structure" | "prayer" | "imam",
  ) => {
    if (!form) return;

    setSaving(true);

    try {
      let payload: Partial<MosqueForm> = {};

      switch (section) {
        case "basic":
          payload = {
            name: form.name,
            type: form.type,
            isActive: form.isActive,
            isVerified: form.isVerified,
          };
          break;

        case "address":
          payload = {
            address: form.address,
            city: form.city,
            state: form.state,
            pinCode: form.pinCode,
          };
          break;

        case "structure":
          payload = {
            totalFloors: form.totalFloors,
            totalCapacity: form.totalCapacity,
            washroomCount: form.washroomCount,
          };
          break;

        case "prayer":
          payload = {
            prayerTimings: form.prayerTimings,
          };
          break;

        case "imam":
          payload = {
            currentImam: form.currentImam,
          };
          break;
      }

      await fetch("/api/admin/settings/mosque", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setEditSection(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div className="p-10">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}

        <div className="bg-white shadow-sm rounded-2xl p-8 ">
          <div className="space-y-6">
            <div className="text-gray-500 text-sm py-2 px-4 shadow rounded-2xl flex items-center gap-2 border border-gray-200">
              MCode:
              {form.code ? (
                <span className="font-bold text-gray-700 text-sm">
                  {form.code}
                </span>
              ) : (
                <span className="px-2 py-0.5 text-xs rounded-full bg-yellow-100 text-yellow-700">
                  Not Generated
                </span>
              )}
            </div>

              {/* Header Row */}
            <div className="flex items-center justify-between relative bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">

              <div className="flex flex-wrap items-center gap-4">
                {/* Name */}
                <div className="flex items-center gap-3">
                  {editSection === "basic" ? (
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => updateField("name", e.target.value)}
                      className="text-3xl font-bold bg-transparent border-b-2 border-gray-300 focus:border-gray-800 focus:outline-none transition"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
                      {form.name}
                    </h1>
                  )}
                </div>

                {/* Type Badge */}
                {editSection === "basic" ? (
                  <select
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value as any)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    <option value="masjid">Masjid</option>
                    <option value="madarsa">Madarsa</option>
                    <option value="masjid-madarsa">Masjid-Madarsa</option>
                  </select>
                ) : (
                  <span className="px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 text-gray-700 uppercase tracking-wide">
                    {form.type}
                  </span>
                )}

                {/* Active Badge */}
                {editSection === "basic" ? (
                  <select
                    value={form.isActive ? "true" : "false"}
                    onChange={(e) =>
                      updateField("isActive", e.target.value === "true")
                    }
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                ) : (
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full ${
                      form.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {form.isActive ? "Active" : "Inactive"}
                  </span>
                )}

                {/* Verification Badge */}
                {editSection === "basic" ? (
                  <select
                    value={form.isVerified ? "true" : "false"}
                    onChange={(e) =>
                      updateField("isVerified", e.target.value === "true")
                    }
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-gray-300 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    <option value="true">Verified</option>
                    <option value="false">Pending</option>
                  </select>
                ) : (
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-2 ${
                      form.isVerified
                        ? "bg-blue-100 text-blue-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {form.isVerified ? (
                      <>
                        <FiCheckCircle size={14} />
                        Verified
                      </>
                    ) : (
                      <>
                        <FiAlertCircle size={14} />
                        Pending
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Edit Button */}
              <div className="">
                <Button
                  onClick={() => {
                    if (editSection === "basic") {
                      saveSection("basic");
                    } else {
                      setEditSection("basic");
                    }
                  }}
                 className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm`}
                >
                  {editSection === "basic" ? (
                    <>
                      <FiCheckCircle size={14} />
                      Update
                    </>
                  ) : (
                    <>
                      <FiEdit2 size={14} />
                      Edit
                    </>
                  )}
                </Button>
              </div>
            </div>
            {/* Address Section */}
            <div className="">
              <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
                {/* Accent Border */}
                <div className="h-full w-full bg-gray-800 rounded-l-2xl" />

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm p-2">
                    <FiMapPin className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      Mosque Address
                    </h3>
                    <p className="text-sm text-gray-500">
                      Location details of the mosque
                    </p>
                  </div>
                </div>

                {editSection === "address" ? (
                  <div className="space-y-5">
                    {/* Street */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Address
                      </label>
                      <input
                        value={form.address || ""}
                        onChange={(e) => updateField("address", e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none  transition"
                        placeholder="Enter street address"
                      />
                    </div>

                    {/* City & State */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          value={form.city || ""}
                          onChange={(e) => updateField("city", e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none  transition"
                          placeholder="Enter city"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          value={form.state || ""}
                          onChange={(e) => updateField("state", e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none  transition"
                          placeholder="Enter state"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PINCode
                        </label>
                        <input
                          value={form.pinCode || ""}
                          onChange={(e) =>
                            updateField("pinCode", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none  transition"
                          placeholder="Enter Pin Code"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-inner ">
                    {form.address || form.city || form.state || form.pinCode ? (
                      <div className="space-y-2">
                        <p className="text-base font-medium text-gray-800 p-2 shadow rounded-md">
                          {form.address}
                        </p>
                        <div className="flex items-center justify-start py-2 gap-3 text-sm text-gray-600">
                          <span className="p-2 shadow rounded-md">
                            {form.city}
                          </span>{" "}
                          <span className="p-2 shadow rounded-md">
                            {form.state}
                          </span>{" "}
                          <span className="p-2 shadow rounded-md">
                            {form.pinCode}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No address information added yet.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => {
                if (editSection === "address") {
                  saveSection("address");
                } else {
                  setEditSection("address");
                }
              }}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm`}
            >
              {editSection === "address" ? (
                <>
                  <FiCheckCircle size={15} />
                  Update
                </>
              ) : (
                <>
                  <FiEdit2 size={15} />
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>

        {/* ================= GRID ================= */}

        <div className="grid lg:grid-cols-1 gap-2">
          {/* ================= PRAYER TIMINGS ================= */}

          <div className="bg-white shadow-sm rounded-2xl p-8 mt-8">
            <div className="space-y-6">
              {/* Header Row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm p-2">
                  <FiClock className="text-xl" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Prayer Timings
                  </h3>
                  <p className="text-sm text-gray-500">
                    Daily congregation prayer schedule
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-inner">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {prayerList.map((key) => (
                    <div key={key} className="space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        {key}
                      </p>

                      {editSection === "prayer" ? (
                        <input
                          type="time"
                          value={form?.prayerTimings?.[key] ?? ""}
                          onChange={(e) => updatePrayer(key, e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
                        />
                      ) : (
                        <div className="bg-white px-3 py-2 rounded-lg shadow-sm text-sm font-semibold text-gray-900">
                          {form?.prayerTimings?.[key] || "--:--"}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Edit / Update Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => {
                  if (editSection === "prayer") {
                    saveSection("prayer");
                  } else {
                    setEditSection("prayer");
                  }
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm`}
              >
                {editSection === "prayer" ? (
                  <>
                    <FiCheckCircle size={15} />
                    Update
                  </>
                ) : (
                  <>
                    <FiEdit2 size={15} />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ================= STRUCTURE ================= */}

          <div className="bg-white shadow-sm rounded-2xl p-8 mt-8">
            <div className="space-y-6">
              {/* Header Row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm p-2">
                  <FaMosque className="text-xl" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Mosque Structure Details
                  </h3>
                  <p className="text-sm text-gray-500">
                    Building capacity and infrastructure information
                  </p>
                </div>
              </div>

              {/* Content */}
              {editSection === "structure" ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Floors
                    </label>
                    <input
                      type="number"
                      value={form.totalFloors ?? ""}
                      onChange={(e) =>
                        updateField(
                          "totalFloors",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition"
                      placeholder="Enter floors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capacity
                    </label>
                    <input
                      value={form.totalCapacity || ""}
                      onChange={(e) =>
                        updateField(
                          "totalCapacity",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition"
                      placeholder="Enter capacity"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Washrooms
                    </label>
                    <input
                      value={form.washroomCount || ""}
                      onChange={(e) =>
                        updateField(
                          "washroomCount",
                          e.target.value === ""
                            ? undefined
                            : Number(e.target.value),
                        )
                      }
                      className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition"
                      placeholder="Enter washroom count"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500">Floors</p>
                      <p className="font-semibold text-gray-900">
                        {form.totalFloors || "-"}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500">Capacity</p>
                      <p className="font-semibold text-gray-900">
                        {form.totalCapacity || "-"}
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500">Washrooms</p>
                      <p className="font-semibold text-gray-900">
                        {form.washroomCount || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Edit / Update Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => {
                  if (editSection === "structure") {
                    saveSection("structure");
                  } else {
                    setEditSection("structure");
                  }
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm`}
              >
                {editSection === "structure" ? (
                  <>
                    <FiCheckCircle size={15} />
                    Update
                  </>
                ) : (
                  <>
                    <FiEdit2 size={15} />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ================= CURRENT IMAM ================= */}

          <div className="bg-white shadow-sm rounded-2xl p-8 mt-8">
            <div className="space-y-6">
              {/* Header Row */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-full shadow-sm p-2">
                  <TbUserStar className="text-xl" />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    Current Imam
                  </h3>
                  <p className="text-sm text-gray-500">
                    Assigned mosque imam details
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="">
                {editSection === "imam" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Imam Name
                      </label>
                      <input
                        type="text"
                        value={form.currentImam?.name ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateField("currentImam", {
                            ...form.currentImam,
                            name: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
                        placeholder="Enter imam name"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-600">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={form.currentImam?.phone ?? ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateField("currentImam", {
                            ...form.currentImam,
                            phone: e.target.value,
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        Name
                      </p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {form.currentImam?.name || "-"}
                      </p>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-500 text-xs uppercase tracking-wide">
                        Phone
                      </p>
                      <p className="font-semibold text-gray-900 mt-1">
                        {form.currentImam?.phone || "-"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Edit / Update Button */}
            <div className="mt-6 flex justify-end">
              <Button
                onClick={() => {
                  if (editSection === "imam") {
                    saveSection("imam");
                  } else {
                    setEditSection("imam");
                  }
                }}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 shadow-sm`}
              >
                {editSection === "imam" ? (
                  <>
                    <FiCheckCircle size={15} />
                    Update
                  </>
                ) : (
                  <>
                    <FiEdit2 size={15} />
                    Edit
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* {editSection && (
          <div className="mt-8 text-right">
            <Button
              onClick={save}
              className="bg-emerald-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-emerald-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )} */}
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function Card({
  title,
  icon,
  children,
  editing,
  onEdit,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  editing: boolean;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold flex items-center justify-center gap-2">
          {icon} {title}
        </h2>
        {!editing && (
          <Button onClick={onEdit} className="text-xs flex items-center gap-1">
            <FiEdit2 size={12} />
            Edit
          </Button>
        )}
      </div>
      {children}
    </div>
  );
}

function StatItem({ label, value }: { label: string; value?: number }) {
  return (
    <div className="text-sm">
      <p className="text-gray-500 text-xs">{label}</p>
      <p className="font-semibold">{value ?? 0}</p>
    </div>
  );
}
