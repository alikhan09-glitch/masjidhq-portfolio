import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaArrowRight, FaShieldAlt } from "react-icons/fa";



export function HeroSection() {
  return (
    <section className="relative py-28 bg-gradient-to-b from-emerald-50 to-white">
      <div className="container mx-auto px-6 text-center max-w-5xl">
        
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1 text-sm font-medium text-emerald-700">
          <FaShieldAlt size={16} />
          Trusted Digital Mosque Platform
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900">
          Empower Your Mosque with
          <span className="block text-emerald-600">
            AdvanceMosque
          </span>
        </h1>

        {/* Description */}
        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
          Manage prayer schedules, donations, announcements and events —
          all from one powerful, modern dashboard.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/admin">
            <Button
              size="md"
              variant="gradient"
              rightIcon={<FaArrowRight size={18} />}
            >
              Go to Admin Panel
            </Button>
          </Link>

          <Button
            size="md"
            variant="outline"
          >
            Explore Features
          </Button>
        </div>
      </div>
    </section>
  );
}
