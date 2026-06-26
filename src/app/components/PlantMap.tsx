"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Plant } from "@/lib/types";

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

const DefaultIcon: L.Icon = L.icon({
  iconUrl: "/marker.png",
  iconRetinaUrl: "/marker.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface PlantMapProps {
  plants?: Plant[];
  selectedPlant?: Plant | null;
  onSelectPlant?: (plant: Plant) => void;
}

const dummyPlants: Plant[] = [
  {
    id: "dummy-1",
    pid: "1",
    name: "Neem Tree",
    user_name: "Admin",
    description: "A healthy neem sapling",
    lat: 29.396,
    lng: 76.97,
    image_url: "",
    created_at: new Date().toISOString(),
    user_id: "admin",
    updated_at: new Date().toISOString(),
  },
  {
    id: "dummy-2",
    pid: "2",
    name: "Peepal Tree",
    user_name: "Admin",
    description: "Sacred fig tree near the park",
    lat: 29.38,
    lng: 76.95,
    image_url: "",
    created_at: new Date().toISOString(),
    user_id: "admin",
    updated_at: new Date().toISOString(),
  },
];

async function getCityFromCoords(lat: number, lng: number): Promise<string> {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
  );
  const data = await response.json();
  return data.address.state || "Unknown Location";
}

export function PlantCity({ lat, lng }: { lat: number; lng: number }) {
  const [city, setCity] = useState("");

  useEffect(() => {
    getCityFromCoords(lat, lng).then(setCity);
  }, [lat, lng]);

  return <span className="text-xs font-semibold text-primary">{city}</span>;
}

export default function PlantMap({
  plants = [],
  selectedPlant = null,
  onSelectPlant,
}: PlantMapProps) {
  const items = plants.length ? plants : dummyPlants;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerLayerRef = useRef<L.LayerGroup | null>(null);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: [INDIA_CENTER.lat, INDIA_CENTER.lng],
      zoom: 4,
      scrollWheelZoom: true,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    markerLayerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      markerRefs.current.clear();
      markerLayerRef.current?.clearLayers();
      markerLayerRef.current = null;
      map.remove();
      mapRef.current = null;
      container.replaceChildren();
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const markerLayer = markerLayerRef.current;
    if (!map || !markerLayer) return;

    markerLayer.clearLayers();
    markerRefs.current.clear();

    items.forEach((plant) => {
      const marker = L.marker([plant.lat, plant.lng], {
        icon: DefaultIcon,
      });

      marker.bindPopup(createPopupHtml(plant));

      marker.on("click", () => {
        onSelectPlant?.(plant);
      });

      marker.addTo(markerLayer);
      markerRefs.current.set(String(plant.id), marker);
    });
  }, [items, onSelectPlant]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlant?.lat || !selectedPlant?.lng) return;

    map.setView([selectedPlant.lat, selectedPlant.lng], 13, {
      animate: true,
    });

    const marker = markerRefs.current.get(String(selectedPlant.id));
    marker?.openPopup();
  }, [selectedPlant]);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="h-[500px] w-full rounded-xl sm:rounded-xl"
        style={{ padding: 0 }}
      />
    </div>
  );
}

function createPopupHtml(plant: Plant) {
  const createdAt = new Date(plant.created_at);
  const safeName = escapeHtml(plant.name);
  const safeDescription = plant.description ? escapeHtml(plant.description) : "";
  const safeUserName = escapeHtml(plant.user_name);
  const safePid = escapeHtml(plant.pid);
  const safeImageUrl = plant.image_url ? escapeAttribute(plant.image_url) : "";

  return `
    <div style="display:flex;flex-direction:column;gap:8px;max-width:300px">
      <h3 style="font-weight:700;margin:0">${safeName}</h3>
      ${
        safeImageUrl
          ? `<img src="${safeImageUrl}" alt="${escapeAttribute(
              plant.name,
            )}" style="width:100%;height:128px;object-fit:cover;border-radius:8px" />`
          : ""
      }
      ${safeDescription ? `<p style="font-size:14px;margin:0">${safeDescription}</p>` : ""}
      <p style="font-size:12px;color:#6b7280;margin:0">Tracked by ${safeUserName}</p>
      <p style="font-size:12px;color:#6b7280;margin:0">${createdAt.toLocaleDateString()} at ${createdAt.toLocaleTimeString()}</p>
      <p style="font-size:12px;font-family:monospace;font-weight:600;margin:0">PID: ${safePid}</p>
    </div>
  `;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}
