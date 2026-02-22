import { HeroSection } from "@/modules/website/sections/hero-section";
import { FeaturesSection } from "@/modules/website/sections/features-section";
import SurahDemo from "@/modules/website/demo/SurahDemo";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SurahDemo />
      <FeaturesSection />
    </>
  );
}
