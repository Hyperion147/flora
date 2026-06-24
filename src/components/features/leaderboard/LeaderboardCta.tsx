import { Button } from "@/components/ui/button";
import { Map, Sprout } from "lucide-react";
import Link from "next/link";

export function LeaderboardCta() {
  return (
    <section className="mt-8 text-center">
      <p className="mb-4 text-sm text-muted-foreground">
        Want to climb the leaderboard? Start tracking more plants.
      </p>
      <div className="flex flex-row justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard">
            <Sprout className="h-4 w-4" />
            Track a Plant
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/map">
            <Map className="h-4 w-4" />
            View Map
          </Link>
        </Button>
      </div>
    </section>
  );
}

