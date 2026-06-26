import type { Metadata } from "next";
import LeaderboardPageContent from "@/components/features/leaderboard/LeaderboardPageContent";

export const metadata: Metadata = {
  title: "Leaderboard",
  description:
    "See the top Flora contributors documenting plant discoveries around the world.",
  alternates: {
    canonical: "/leaderboard",
  },
};

export default function LeaderboardPage() {
  return <LeaderboardPageContent />;
}
