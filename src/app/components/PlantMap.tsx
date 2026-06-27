"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import { Plant } from "@/lib/types";

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

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
      const isSelected = selectedPlant?.id === plant.id;
      const marker = L.marker([plant.lat, plant.lng], {
        icon: createPlantMarkerIcon(plant, isSelected),
      });

      marker.on("click", () => {
        onSelectPlant?.(plant);
      });

      marker.addTo(markerLayer);
      markerRefs.current.set(String(plant.id), marker);
    });
  }, [items, onSelectPlant, selectedPlant]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlant?.lat || !selectedPlant?.lng) return;

    map.setView([selectedPlant.lat, selectedPlant.lng], 13, {
      animate: true,
    });
  }, [selectedPlant]);

  return (
    <div className="relative h-fit">
      <div
        ref={containerRef}
        className="h-155 w-full rounded-xl sm:rounded-xl"
        style={{ padding: 0 }}
      />
    </div>
  );
}

function createPlantMarkerIcon(plant: Plant, selected: boolean) {
  const imageUrl = plant.image_url ? escapeAttribute(plant.image_url) : null;
  const safeName = escapeAttribute(plant.name);
  const badgeContent = imageUrl
    ? `<img src="${imageUrl}" alt="${safeName}" style="width:100%;height:100%;object-fit:cover;display:block;" />`
    : `<span style="display:grid;place-items:center;width:100%;height:100%;font-size:12px;font-weight:800;color:${selected ? "#ffffff" : "#166534"};background:${selected ? "linear-gradient(135deg,#16a34a,#166534)" : "linear-gradient(135deg,#dcfce7,#bbf7d0)"};">${escapeHtml(initials(plant.name))}</span>`;

  return L.divIcon({
    className: "flora-map-marker",
    html: `
      <div style="position:relative;width:${selected ? 44 : 38}px;height:${selected ? 56 : 48}px;transform:translate(-50%,-100%);">
        ${
          selected
            ? '<span style="position:absolute;left:50%;top:20px;width:58px;height:58px;border-radius:9999px;background:rgba(22,163,74,0.18);transform:translate(-50%,-50%);"></span>'
            : ""
        }
        <div style="position:absolute;left:50%;top:0;width:${selected ? 40 : 34}px;height:${selected ? 40 : 34}px;border-radius:9999px;padding:3px;background:${selected ? "linear-gradient(135deg,#166534,#16a34a)" : "#ffffff"};box-shadow:${selected ? "0 14px 30px rgba(22,101,52,0.32)" : "0 10px 20px rgba(15,23,42,0.16)"};transform:translateX(-50%);border:${selected ? "2px solid rgba(255,255,255,0.95)" : "1px solid rgba(22,101,52,0.14)"};overflow:hidden;">
          <span style="display:block;width:100%;height:100%;border-radius:9999px;overflow:hidden;background:#f0fdf4;">${badgeContent}</span>
        </div>
        <div style="position:absolute;left:50%;bottom:2px;width:${selected ? 18 : 16}px;height:${selected ? 18 : 16}px;background:${selected ? "#166534" : "#16a34a"};transform:translateX(-50%) rotate(45deg);border-radius:4px;box-shadow:0 8px 18px rgba(22,101,52,0.26);"></div>
      </div>
    `,
    iconSize: selected ? [44, 56] : [38, 48],
    iconAnchor: selected ? [22, 56] : [19, 48],
    popupAnchor: [0, -46],
  });
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

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}
