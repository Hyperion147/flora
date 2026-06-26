import type { Metadata } from "next";
import LandingPage from "@/components/features/landing/LandingPage";

export const metadata: Metadata = {
  title: "Discover, Track, and Celebrate Plants",
  description:
    "Explore the world of plants, track your discoveries, and connect with a global community of plant lovers using Flora.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <LandingPage />;
}
