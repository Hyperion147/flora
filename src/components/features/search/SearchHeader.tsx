import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Search, Users } from "lucide-react";

const searchStats = [
  { label: "Plants", value: "5", icon: Search },
  { label: "Users", value: "3", icon: Users },
  { label: "Locations", value: "5", icon: MapPin },
];

export function SearchHeader() {
  return (
    <header className="mb-6 sm:mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">
            Discover
          </p>
          <h1 className="mt-2 font-serif text-3xl font-black tracking-tight sm:text-4xl">
            Search Plants
          </h1>
          <p className="mt-2 text-muted-foreground">
            Find plants by name, PID, or user.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {searchStats.map(({ label, value, icon: Icon }) => (
            <Card key={label} className="flora-glass-soft text-center">
              <CardContent className="p-3 sm:p-4">
                <div className="mx-auto mb-1 grid size-8 place-items-center rounded-full bg-secondary text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-lg font-black sm:text-xl">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </header>
  );
}

