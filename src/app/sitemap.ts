import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://flora.example.com"
).replace(/\/+$/, "");

const PUBLIC_ROUTES = [
  {
    path: "/",
    changeFrequency: "weekly" as const,
    priority: 1,
  },
  {
    path: "/map",
    changeFrequency: "daily" as const,
    priority: 0.9,
  },
  {
    path: "/search",
    changeFrequency: "weekly" as const,
    priority: 0.8,
  },
  {
    path: "/leaderboard",
    changeFrequency: "daily" as const,
    priority: 0.7,
  },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return PUBLIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
