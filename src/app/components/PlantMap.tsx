"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";
import { Plant } from "@/lib/types";

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };

// Fix default icon issues in Leaflet when using bundlers
const DefaultIcon: L.Icon = L.icon({
  iconUrl: "/marker.png",
  iconRetinaUrl: "/marker.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface PlantMapProps {
  plants?: Plant[];
  selectedPlant?: Plant | null;
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

function MapCenterUpdater({
  selectedPlant,
}: {
  selectedPlant: Plant | null | undefined;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlant && selectedPlant.lat && selectedPlant.lng) {
      map.setView([selectedPlant.lat, selectedPlant.lng], 13, {
        animate: true,
      });
    }
  }, [selectedPlant, map]);

  return null;
}

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

  return (
    <span className="text-xs text-emerald-600 font-medium">📍 {city}</span>
  );
}

export default function PlantMap({
  plants = [],
  selectedPlant = null,
}: PlantMapProps) {
  const items = plants.length ? plants : dummyPlants;

  return (
    <div className="relative px-4">
      <MapContainer
        center={[INDIA_CENTER.lat, INDIA_CENTER.lng]}
        zoom={4}
        style={{
          height: "500px",
          width: "100%",
          borderRadius: "0.5rem",
          padding: "0 0px",
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapCenterUpdater selectedPlant={selectedPlant} />

        {items.map((plant) => (
          <Marker key={plant.id} position={[plant.lat, plant.lng]}>
            <Popup>
              <div className="space-y-2">
                <h3 className="font-bold">{plant.name}</h3>
                {plant.image_url && (
                  <img
                    src={plant.image_url}
                    alt={plant.name}
                    className="w-full h-32 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}
                {plant.description && (
                  <p className="text-sm">{plant.description}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Tracked by {plant.user_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(plant.created_at).toLocaleDateString()} at{" "}
                  {new Date(plant.created_at).toLocaleTimeString()}
                </p>
                <PlantCity lat={plant.lat} lng={plant.lng} />
                <p className="text-xs text-blue-600 font-semibold">
                  PID: {plant.pid}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
