import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Flora",
    short_name: "Flora",
    description:
      "Discover, track, map, and celebrate plants around the world with Flora.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f6f1",
    theme_color: "#2d7d4f",
    icons: [
      {
        src: "/favicon/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/favicon/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
