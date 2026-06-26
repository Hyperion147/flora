import type { Metadata } from "next";
import MapPageContent from "@/components/features/map/MapPageContent";

export const metadata: Metadata = {
  title: "Plant Map",
  description:
    "Browse geotagged plant discoveries across the world with Flora's interactive plant map.",
  alternates: {
    canonical: "/map",
  },
};

export default function MapPage() {
  return <MapPageContent />;
}
