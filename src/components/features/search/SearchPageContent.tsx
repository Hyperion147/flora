import PlantSearch from "@/app/components/PlantSearch";
import { SearchHeader } from "./SearchHeader";
import { SearchTips } from "./SearchTips";

export default function SearchPageContent() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 pb-24 pt-22 text-foreground sm:px-5 sm:py-8 sm:pt-24 md:px-10 md:pb-10 xl:px-20">
      <div className="mx-auto max-w-7xl">
        <SearchHeader />
        <PlantSearch />
        <SearchTips />
      </div>
    </main>
  );
}
