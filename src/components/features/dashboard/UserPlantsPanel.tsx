import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Leaf, Plus, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { DashboardPlant } from "./types";

type UserPlantsPanelProps = {
  plants?: DashboardPlant[];
  isLoading: boolean;
  onAddPlant: () => void;
};

export function UserPlantsPanel({
  plants,
  isLoading,
  onAddPlant,
}: UserPlantsPanelProps) {
  const hasPlants = plants && plants.length > 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
          <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-primary">
            <User className="h-5 w-5" />
          </span>
          Your Plants
        </h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/map">View All</Link>
        </Button>
      </div>

      {isLoading ? (
        <PlantListSkeleton />
      ) : hasPlants ? (
        <div className="space-y-4">
          {plants.slice(0, 4).map((plant) => (
            <PlantSummaryCard key={plant.id} plant={plant} />
          ))}
          {plants.length > 4 && (
            <Button asChild variant="outline" size="sm" className="mt-2 w-full">
              <Link href="/map">View All Plants</Link>
            </Button>
          )}
        </div>
      ) : (
        <EmptyPlantsCard onAddPlant={onAddPlant} />
      )}
    </section>
  );
}

function PlantListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <Card key={index} className="flora-glass-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function PlantSummaryCard({ plant }: { plant: DashboardPlant }) {
  const createdAt = new Date(plant.created_at);

  return (
    <Card className="flora-glass-soft transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {plant.image_url ? (
            <Image
              src={plant.image_url}
              alt={plant.name}
              width={64}
              height={64}
              className="h-12 w-12 flex-shrink-0 rounded-lg object-cover sm:h-16 sm:w-16"
            />
          ) : (
            <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-lg bg-secondary text-primary sm:h-16 sm:w-16">
              <Leaf className="h-6 w-6" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-black sm:text-base">
              {plant.name}
            </h3>
            {plant.description && (
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {plant.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {createdAt.toLocaleDateString()} at{" "}
                {createdAt.toLocaleTimeString()}
              </span>
            </div>
            <p className="mt-2 inline-flex rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
              PID: {plant.pid}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyPlantsCard({ onAddPlant }: { onAddPlant: () => void }) {
  return (
    <Card className="flora-glass-soft">
      <CardContent className="p-6 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-muted text-muted-foreground">
          <Leaf className="h-8 w-8" />
        </div>
        <h3 className="font-black">No Plants Yet</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          You haven&apos;t tracked any plants yet. Start by adding your first
          plant.
        </p>
        <Button onClick={onAddPlant}>
          <Plus className="h-4 w-4" />
          Add Your First Plant
        </Button>
      </CardContent>
    </Card>
  );
}

