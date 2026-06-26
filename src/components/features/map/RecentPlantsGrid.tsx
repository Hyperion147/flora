"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import { Plant } from "@/lib/types";

const PlantCity = dynamic(
  () => import("@/app/components/PlantMap").then((mod) => mod.PlantCity),
  { ssr: false },
);

export function RecentPlantsGrid({
  plants,
  selectedPlant,
  onSelectPlant,
}: {
  plants: Plant[];
  selectedPlant: Plant | null;
  onSelectPlant: (plant: Plant) => void;
}) {
  if (!plants.length) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plants.slice(0, 6).map((plant) => {
          const isSelected = selectedPlant?.id === plant.id;

          return (
            <Card
              key={plant.id.toString()}
              className={`flora-glass-soft cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-md ${
                isSelected ? "ring-2 ring-primary shadow-lg" : ""
              }`}
              onClick={() => onSelectPlant(plant)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {plant.image_url ? (
                    <Image
                      src={plant.image_url}
                      alt={plant.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 flex-shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-secondary text-primary">
                      <Leaf className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-black">
                      {plant.name}
                    </h3>
                    <p className="truncate text-xs text-muted-foreground">
                      by {plant.user_name}
                    </p>
                    {plant.lat && plant.lng && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {plant.lat.toFixed(3)}, {plant.lng.toFixed(3)}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(plant.created_at).toLocaleDateString()} at{" "}
                      {new Date(plant.created_at).toLocaleTimeString()}
                    </p>
                    {plant.lat && plant.lng && (
                      <p className="mt-1 text-xs font-semibold text-primary">
                        <PlantCity lat={plant.lat} lng={plant.lng} />
                      </p>
                    )}
                    <p className="mt-1 font-mono text-xs font-semibold text-accent-foreground">
                      PID: {plant.pid}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

