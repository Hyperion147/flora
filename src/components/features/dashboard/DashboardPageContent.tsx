"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardLoading } from "./DashboardLoading";
import { PlantTrackPanel } from "./PlantTrackPanel";
import { UserPlantsPanel } from "./UserPlantsPanel";
import { DashboardPlant } from "./types";

export default function DashboardPageContent() {
  const { user, loading } = useAuth();
  const [showPlantForm, setShowPlantForm] = useState(false);

  const userData = user
    ? {
        id: user.id,
        email: user.email || "",
        name:
          user.user_metadata?.name ||
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "User",
        avatarUrl:
          user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      }
    : null;

  const { data: userPlants, isLoading: isPlantsLoading } = useQuery<
    DashboardPlant[]
  >({
    queryKey: ["userPlants", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const response = await fetch(`/api/plants?userId=${user.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }
      return response.json();
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  useEffect(() => {
    if (!loading && !user) {
      redirect("/login");
    }
  }, [user, loading]);

  if (loading) {
    return <DashboardLoading />;
  }

  const displayName =
    userData?.name || user?.user_metadata?.name || user?.email?.split("@")[0] || "Guest";

  return (
    <main className="min-h-screen bg-background px-4 pb-24 pt-22 text-foreground sm:px-5 sm:pt-24 md:px-10 md:pb-10 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader displayName={displayName} />

        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8">
          <PlantTrackPanel
            userId={user?.id}
            showPlantForm={showPlantForm}
            onShowPlantForm={() => setShowPlantForm(true)}
            onCancelPlantForm={() => setShowPlantForm(false)}
          />

          <UserPlantsPanel
            plants={userPlants}
            isLoading={isPlantsLoading}
            onAddPlant={() => setShowPlantForm(true)}
          />
        </div>
      </div>
    </main>
  );
}
