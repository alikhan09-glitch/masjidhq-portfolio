"use client";

import { useEffect, useState } from "react";
import { FaMosque, FaCalendarAlt, FaDonate, FaUsers } from "react-icons/fa";

type Stats = {
  totalMosques: number;
  totalDonations: number;
  totalUsers: number;
};

export function FeaturesSection() {
  const [stats, setStats] = useState<Stats>({
    totalMosques: 0,
    totalDonations: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/public/stats");
        const data = await res.json();
        setStats(data.stats);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    }
    fetchStats();
  }, []);

  const features = [
    {
      title: "Prayer Management",
      description: "Manage daily prayer timings with smart automation.",
      icon: <FaMosque />,
    },
    {
      title: "Event Scheduling",
      description: "Organize Jummah, Eid & special events professionally.",
      icon: <FaCalendarAlt />,
    },
    {
      title: "Donation Tracking",
      description: "Track income, donors & receipts securely.",
      icon: <FaDonate />,
    },
  ];

  return (
    <section className="relative py-28 bg-gradient-to-b from-white via-emerald-50 to-white overflow-hidden">
      <div className="container mx-auto px-6">

        {/* ================= PREMIUM STATS ================= */}
        <div className="grid gap-8 md:grid-cols-3 mb-24">

          {/* Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-10 text-center hover:-translate-y-2 transition duration-300">

              <FaMosque className="mx-auto text-emerald-600 text-4xl mb-6" />

              <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                {stats.totalMosques.toLocaleString()}
              </h3>

              <p className="text-gray-500 mt-3 text-sm tracking-wide uppercase">
                Mosques Registered
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-10 text-center hover:-translate-y-2 transition duration-300">

              <FaDonate className="mx-auto text-emerald-600 text-4xl mb-6" />

              <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                ₹ {stats.totalDonations.toLocaleString()}
              </h3>

              <p className="text-gray-500 mt-3 text-sm tracking-wide uppercase">
                Total Donations
              </p>
            </div>
          </div>

          {/* Card */}
          <div className="relative group">
            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl rounded-2xl p-10 text-center hover:-translate-y-2 transition duration-300">

              <FaUsers className="mx-auto text-emerald-600 text-4xl mb-6" />

              <h3 className="text-4xl font-bold text-gray-900 tracking-tight">
                {stats.totalUsers.toLocaleString()}
              </h3>

              <p className="text-gray-500 mt-3 text-sm tracking-wide uppercase">
                Active Members
              </p>
            </div>
          </div>

        </div>

        {/* ================= FEATURES HEADER ================= */}
        <div className="text-center mb-16">
          <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm">
            Platform Features
          </span>

          <h2 className="text-4xl font-bold text-gray-900 mt-4 tracking-tight">
            Powerful Tools for Modern Mosques
          </h2>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
            Everything you need to digitally manage prayer timings, donations,
            events and members — all in one secure platform.
          </p>
        </div>

        {/* ================= PREMIUM FEATURE CARDS ================= */}
        <div className="grid gap-10 md:grid-cols-3">

          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl p-10 shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 text-2xl mb-6 group-hover:bg-emerald-600 group-hover:text-white transition duration-300">
                {feature.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              <div className="absolute bottom-0 left-0 h-1 w-0 bg-emerald-600 group-hover:w-full transition-all duration-500 rounded-b-2xl" />
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}