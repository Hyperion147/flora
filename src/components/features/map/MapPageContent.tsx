"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plant } from "@/lib/types";
import { MapCanvasCard } from "./MapCanvasCard";
import { MapEmptyState } from "./MapEmptyState";
import { MapHeader } from "./MapHeader";
import { RecentPlantsGrid } from "./RecentPlantsGrid";

export default function MapPageContent() {
  const {
    data: plants = [],
    isLoading: loading,
    error,
  } = useQuery<Plant[]>({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetch("/api/plants");
      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  useEffect(() => {
    if (error) {
      console.error("Error fetching plants:", error);
      toast.error("Failed to load plants");
    }
  }, [error]);

  const handleCardClick = (plant: Plant) => {
    setSelectedPlant((prev) => (prev?.id === plant.id ? null : plant));
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 pt-24 text-foreground md:px-20">
      <div className="mx-auto max-w-7xl">
        <MapHeader plants={plants} />
        <MapCanvasCard
          plants={plants}
          loading={loading}
          selectedPlant={selectedPlant}
        />

        {!loading && plants.length > 0 && (
          <RecentPlantsGrid
            plants={plants}
            selectedPlant={selectedPlant}
            onSelectPlant={handleCardClick}
          />
        )}

        {!loading && plants.length === 0 && <MapEmptyState />}
      </div>
    </main>
  );
}

