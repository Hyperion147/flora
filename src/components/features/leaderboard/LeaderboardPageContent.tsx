"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { IsMobile } from "@/lib/isMobile";
import { LeaderboardCta } from "./LeaderboardCta";
import { LeaderboardHeader } from "./LeaderboardHeader";
import { LeaderboardTable } from "./LeaderboardTable";
import { TopRankers } from "./TopRankers";
import { LeaderboardUser } from "./types";

export default function LeaderboardPageContent() {
  const {
    data: leaderboard = [],
    isLoading: loading,
    error,
  } = useQuery<LeaderboardUser[]>({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await fetch("/api/leaderboard");
      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }
      return response.json();
    },
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to load leaderboard");
    }
  }, [error]);

  const mobileRankers = IsMobile();
  const visibleRankers = leaderboard.slice(0, mobileRankers ? 1 : 3);

  return (
    <main className="min-h-screen bg-background px-4 py-6 pb-24 pt-22 text-foreground sm:px-5 sm:py-8 sm:pt-24 md:px-10 md:pb-10 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <LeaderboardHeader />
        <TopRankers users={visibleRankers} />
        <LeaderboardTable leaderboard={leaderboard} loading={loading} />
        {!loading && leaderboard.length > 0 && <LeaderboardCta />}
      </div>
    </main>
  );
}
