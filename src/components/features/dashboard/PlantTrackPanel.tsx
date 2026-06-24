"use client";

import PlantForm from "@/app/components/forms/PlantForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Plus } from "lucide-react";

type PlantTrackPanelProps = {
  userId?: string;
  showPlantForm: boolean;
  onShowPlantForm: () => void;
  onCancelPlantForm: () => void;
};

export function PlantTrackPanel({
  userId,
  showPlantForm,
  onShowPlantForm,
  onCancelPlantForm,
}: PlantTrackPanelProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-xl font-black sm:text-2xl">
          <span className="grid size-10 place-items-center rounded-2xl bg-secondary text-primary">
            <Leaf className="h-5 w-5" />
          </span>
          Track a New Plant
        </h2>
        {!showPlantForm && (
          <Button onClick={onShowPlantForm} className="sm:hidden" size="sm">
            <Plus className="h-4 w-4" />
            Add Plant
          </Button>
        )}
      </div>

      {showPlantForm ? (
        <PlantForm
          userId={userId}
          onCancel={onCancelPlantForm}
          showCancelButton
        />
      ) : (
        <Card className="flora-glass-soft hidden sm:block">
          <CardContent className="p-6">
            <div className="mx-auto max-w-sm text-center">
              <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-secondary text-primary">
                <Plus className="h-8 w-8" />
              </div>
              <h3 className="font-black">Add Your First Plant</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                Start tracking your plants with photos, names, and locations.
              </p>
              <Button onClick={onShowPlantForm}>
                <Plus className="h-4 w-4" />
                Track a Plant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
