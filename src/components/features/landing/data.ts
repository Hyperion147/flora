import {
  BarChart3,
  BookOpen,
  Camera,
  Globe2,
  Map,
  MapPin,
  Search,
  Sprout,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";

export type FeaturePreviewKind =
  | "dashboard"
  | "form"
  | "map"
  | "search"
  | "leaderboard";

export type LandingFeature = {
  title: string;
  text: string;
  icon: LucideIcon;
  preview: FeaturePreviewKind;
};

export const featureCards: LandingFeature[] = [
  {
    title: "Dashboard",
    text: "A clean personal hub for your sightings, newest plants, and contribution progress.",
    icon: BarChart3,
    preview: "dashboard",
  },
  {
    title: "Plant Form",
    text: "Capture name, image, category, description, and live location without a heavy workflow.",
    icon: Camera,
    preview: "form",
  },
  {
    title: "Interactive Map",
    text: "Explore mapped discoveries from across the community with a simple visual layer.",
    icon: Map,
    preview: "map",
  },
  {
    title: "Search",
    text: "Find plants by name, contributor, description, location context, or unique PID.",
    icon: Search,
    preview: "search",
  },
  {
    title: "Leaderboard",
    text: "Make contribution visible and celebrate people who keep documenting plant life.",
    icon: Trophy,
    preview: "leaderboard",
  },
];

export const impactStats = [
  { value: "250K+", label: "Plants Tracked", icon: Sprout },
  { value: "10K+", label: "Active Users", icon: Users },
  { value: "180+", label: "Countries", icon: Globe2 },
  { value: "50K+", label: "Locations", icon: MapPin },
];

export const steps = [
  {
    title: "Create Account",
    text: "Sign in once and keep discoveries attached to your profile.",
    icon: Users,
  },
  {
    title: "Add Your Plant",
    text: "Log plant details with a photo and exact location.",
    icon: Sprout,
  },
  {
    title: "Explore & Discover",
    text: "Browse community entries on the map and through search.",
    icon: BookOpen,
  },
  {
    title: "Climb the Ranks",
    text: "Track more plants and rise on the contribution board.",
    icon: Trophy,
  },
];

