"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup, TileLayer, MapContainer } from "react-leaflet";

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
    position: [29.3909, 76.9635] as [number, number],
  },
  {
    name: "Peepal Tree",
    location: "Model Town, Panipat",
    pid: "FLR-1025",
    position: [29.3817, 76.9771] as [number, number],
  },
  {
    name: "Aloe Vera",
    location: "Huda Sector 12",
    pid: "FLR-1026",
    position: [29.4012, 76.9497] as [number, number],
  },
];

export default function LandingMiniMap() {
  return (
    <div className="landing-mini-map h-[300px] overflow-hidden rounded-sm">
      <MapContainer
        center={[29.3909, 76.9635]}
        zoom={13}
        minZoom={11}
        maxZoom={17}
        zoomControl
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {samplePlants.map((plant) => (
          <Marker
            key={plant.pid}
            icon={plantIcon}
            position={plant.position}
          >
            <Popup>
              <div className="space-y-1">
                <p className="text-sm font-bold">{plant.name}</p>
                <p className="text-xs text-muted-foreground">{plant.location}</p>
                <p className="font-mono text-xs font-semibold text-primary">
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
