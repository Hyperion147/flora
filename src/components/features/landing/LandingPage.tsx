"use client";

import { useAuth } from "@/app/context/AuthContext";
import { FeaturesSection } from "./FeaturesSection";
import { FloraFooter } from "./FloraFooter";
import { HeroSection } from "./HeroSection";
import { ImpactSection } from "./ImpactSection";
import { StorySection } from "./StorySection";

export default function LandingPage() {
  const { user } = useAuth();
  const startHref = user ? "/dashboard" : "/login";

  return (
    <main className="flora-landing-page w-full overflow-hidden bg-background text-foreground">
      <HeroSection startHref={startHref} />
      <FeaturesSection />
      <ImpactSection />
      <StorySection startHref={startHref} />
      <FloraFooter />
    </main>
  );
}
