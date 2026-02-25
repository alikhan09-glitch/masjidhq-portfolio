import SurahDemo from "../../modules/website/demo/SurahDemo";
import { FeaturesSection } from "../../modules/website/sections/features-section";
import { HeroSection } from "../../modules/website/sections/hero-section";

export default function Home() {
  return (
    <>
      <HeroSection />
      <SurahDemo />
      <FeaturesSection />
    </>
  );
}
