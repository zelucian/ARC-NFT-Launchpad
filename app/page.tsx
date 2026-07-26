import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedCollectionsSection } from "@/components/home/FeaturedCollectionsSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { FeaturesGridSection } from "@/components/home/FeaturesGridSection";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturedCollectionsSection />
      <HowItWorksSection />
      <FeaturesGridSection />
      <CTASection />
    </div>
  );
}
