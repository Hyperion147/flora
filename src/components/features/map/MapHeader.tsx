import { Card, CardContent } from "@/components/ui/card";
import { Leaf, MapPin } from "lucide-react";
import { Plant } from "@/lib/types";
import type { ReactNode } from "react";

export function MapHeader({ plants }: { plants: Plant[] }) {
  const geotaggedCount = plants.filter((plant) => plant.lat && plant.lng).length;

  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Global Discoveries
          </p>
          <h1 className="mt-2 font-serif text-3xl font-black tracking-tight sm:text-4xl">
            Plant Map
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore all plants tracked in the app.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <MapStatCard
            icon={<Leaf className="h-4 w-4" />}
            value={plants.length}
            label="Total Plants"
          />
          <MapStatCard
            icon={<MapPin className="h-4 w-4" />}
            value={geotaggedCount}
            label="Geotagged"
          />
        </div>
      </div>
    </header>
  );
}

function MapStatCard({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <Card className="flora-glass-soft text-center">
      <CardContent className="p-3 sm:p-4">
        <div className="mx-auto mb-1 grid size-8 place-items-center rounded-full bg-secondary text-primary">
          {icon}
        </div>
        <p className="text-lg font-black sm:text-xl">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );
}
