import type { Metadata } from "next";
import DashboardPageContent from "@/components/features/dashboard/DashboardPageContent";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your tracked plants and personal discoveries in Flora.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
  return <DashboardPageContent />;
}
