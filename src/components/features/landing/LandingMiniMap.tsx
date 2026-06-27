"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef } from "react";

const plantIcon = L.icon({
  iconUrl: "/marker.png",
  iconRetinaUrl: "/marker.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const samplePlants = [
  {
    name: "Neem Tree",
    location: "Panipat, Haryana",
    pid: "FLR-1024",
    position: [29.3909, 76.9635] as L.LatLngExpression,
  },
  {
    name: "Peepal Tree",
    location: "Model Town, Panipat",
    pid: "FLR-1025",
    position: [29.3817, 76.9771] as L.LatLngExpression,
  },
  {
    name: "Aloe Vera",
    location: "Huda Sector 12",
    pid: "FLR-1026",
    position: [29.4012, 76.9497] as L.LatLngExpression,
  },
];

export default function LandingMiniMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const map = L.map(container, {
      center: [29.3909, 76.9635],
      zoom: 13,
      minZoom: 11,
      maxZoom: 17,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    samplePlants.forEach((plant) => {
      L.marker(plant.position, { icon: plantIcon })
        .bindPopup(
          `<div>
            <p style="font-weight:700;margin:0 0 4px">${plant.name}</p>
            <p style="font-size:12px;margin:0 0 4px;color:#647067">${plant.location}</p>
            <p style="font-size:12px;font-family:monospace;font-weight:700;margin:0">PID: ${plant.pid}</p>
          </div>`,
        )
        .addTo(map);
    });

    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      container.replaceChildren();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="landing-mini-map h-[400px] overflow-hidden rounded-sm"
    />
  );
}
