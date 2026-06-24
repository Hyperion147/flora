"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Map } from "lucide-react";
import { Plant } from "@/lib/types";

const PlantMap = dynamic(() => import("@/app/components/PlantMap"), {
  loading: () => <Skeleton className="h-[400px] w-full sm:h-[500px]" />,
  ssr: false,
});

export function MapCanvasCard({
  plants,
  loading,
  selectedPlant,
}: {
  plants: Plant[];
  loading: boolean;
  selectedPlant: Plant | null;
}) {
  return (
    <Card className="flora-glass-soft mb-6 overflow-hidden sm:mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-2xl bg-secondary text-primary">
            <Map className="h-5 w-5" />
          </span>
          Interactive Plant Map
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <Skeleton className="h-[400px] w-full sm:h-[500px]" />
        ) : (
          <PlantMap plants={plants} selectedPlant={selectedPlant} />
        )}
      </CardContent>
    </Card>
  );
}

