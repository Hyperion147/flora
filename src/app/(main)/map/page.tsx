"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plant } from "@/lib/types";
import { PlantCity } from "@/app/components/PlantMap";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { MapPin, Leaf, Map } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const PlantMap = dynamic(() => import("@/app/components/PlantMap"), {
  loading: () => <Skeleton className="w-full h-[400px] sm:h-[500px]" />,
});

export default function MapPage() {
  const {
    data: plants = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["plants"],
    queryFn: async () => {
      const response = await fetch("/api/plants");
      if (!response.ok) {
        throw new Error("Failed to fetch plants");
      }
      return response.json();
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  useEffect(() => {
    if (error) {
      console.error("Error fetching plants:", error);
      toast.error("Failed to load plants");
    }
  }, [error]);

  const handleCardClick = (plant: Plant) => {
    setSelectedPlant(prev => (prev?.id === plant.id ? null : plant));
  };

  const displayedPlants = plants;

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 pt-20">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Plant Map</h1>
            <p className="text-muted-foreground">
              Explore all plants tracked in the app
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Card className="text-center">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-center mb-1">
                  <Leaf className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-lg sm:text-xl font-bold">
                  {displayedPlants.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Plants</p>
              </CardContent>
            </Card>
            <Card className="text-center sm:block hidden">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-center mb-1">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                <p className="text-lg sm:text-xl font-bold">
                  {displayedPlants.filter((p: Plant) => p.lat && p.lng).length}
                </p>
                <p className="text-xs text-muted-foreground">
                  Geotagged Plants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Card */}
      <Card className="mb-6 sm:mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5" />
            Interactive Plant Map
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <Skeleton className="w-full h-[400px] sm:h-[500px]" />
          ) : (
            <div className="relative">
              <PlantMap plants={displayedPlants} selectedPlant={selectedPlant} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Plants Section */}
      {!loading && displayedPlants.length > 0 && (
        <div className="space-y-4">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            id="recent-plants"
          >
            {displayedPlants.slice(0, 6).map((plant: Plant) => {
              const isSelected = selectedPlantId === plant.id;
              return (
                <Card
                  key={plant.id.toString()}
                  className={`hover:shadow-md transition-shadow cursor-pointer ${
                    isSelected
                      ? "ring-2 ring-emerald-500 shadow-lg bg-emerald-50"
                      : ""
                  }`}
                  onClick={() => handleCardClick(plant)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      {plant.image_url ? (
                        <img
                          src={plant.image_url}
                          alt={plant.name}
                          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <Leaf className="h-6 w-6 text-emerald-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {plant.name}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          by {plant.user_name}
                        </p>
                        {plant.lat && plant.lng && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {plant.lat.toFixed(3)}, {plant.lng.toFixed(3)}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(plant.created_at).toLocaleDateString()} at{" "}
                          {new Date(plant.created_at).toLocaleTimeString()}
                        </p>
                        <p className="text-xs text-emerald-600 font-medium mt-1">
                          <PlantCity lat={plant.lat} lng={plant.lng} />
                        </p>
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          PID: {plant.pid}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && displayedPlants.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No plants found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Be the first to add a plant to our global map!
            </p>
            <Button asChild>
              <a href="/dashboard">Add Your First Plant</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
