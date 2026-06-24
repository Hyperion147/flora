import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import Link from "next/link";

export function MapEmptyState() {
  return (
    <Card className="flora-glass-soft">
      <CardContent className="p-8 text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-muted text-muted-foreground">
          <MapPin className="h-8 w-8" />
        </div>
        <h3 className="font-black">No plants found</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Be the first to add a plant to our global map.
        </p>
        <Button asChild>
          <Link href="/dashboard">Add Your First Plant</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

