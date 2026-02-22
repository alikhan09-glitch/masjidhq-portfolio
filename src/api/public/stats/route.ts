import { NextResponse } from "next/server";

export async function GET() {
  const mosques = [
    {
      name: "Masjid Al Noor",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
      address: "Main Road, Mansarovar",
      isVerified: true,
      prayerTimings: {
        fajr: "5:30 AM",
        zuhr: "1:15 PM",
        asr: "4:45 PM",
        maghrib: "6:45 PM",
        isha: "8:00 PM",
      },
    },
    {
      name: "Jamia Masjid",
      city: "Delhi",
      state: "Delhi",
      country: "India",
      address: "Old City",
      isVerified: true,
      prayerTimings: {
        fajr: "5:15 AM",
        zuhr: "1:30 PM",
        asr: "4:30 PM",
        maghrib: "6:50 PM",
        isha: "8:10 PM",
      },
    },
  ];

  return NextResponse.json({
    stats: {
      totalMosques: 120,
      totalUsers: 5400,
      totalDonations: 8500000,
    },
    mosques,
  });
}