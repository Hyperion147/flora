import type { Metadata } from "next";
import SearchPageContent from "@/components/features/search/SearchPageContent";

export const metadata: Metadata = {
  title: "Search Plants",
  description:
    "Search Flora by plant name, PID, contributor, and discovery details to find plants faster.",
  alternates: {
    canonical: "/search",
  },
};

export default function SearchPage() {
  return <SearchPageContent />;
}
