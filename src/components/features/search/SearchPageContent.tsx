import PlantSearch from "@/app/components/PlantSearch";
import { SearchHeader } from "./SearchHeader";
import { SearchTips } from "./SearchTips";

export default function SearchPageContent() {
  return (
    <main className="min-h-screen bg-background px-4 py-8 pt-24 text-foreground md:px-20">
      <div className="mx-auto max-w-7xl">
        <SearchHeader />
        <PlantSearch />
        <SearchTips />
      </div>
    </main>
  );
}

