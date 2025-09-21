"use client";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    useMap,
    useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useState } from "react";
import { Plant } from "@/lib/types";

const INDIA_CENTER = { lat: 20.5937, lng: 78.9629 };
const INDIA_BOUNDS = {
    north: 37.6,
    south: 8.4,
    east: 97.25,
    west: 68.7,
};

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
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const data = await response.json();
    return (
        data.address.city ||
        data.address.town ||
        data.address.village ||
        data.address.state_district ||
        data.address.state ||
        "Unknown Location"
    );
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

export default function PlantMap({ plants = [] }: PlantMapProps) {
    const items = plants.length ? plants : dummyPlants;
    const indiaPlants = useMemo(
        () =>
            items.filter(
                (plant) =>
                    plant.lat >= INDIA_BOUNDS.south &&
                    plant.lat <= INDIA_BOUNDS.north &&
                    plant.lng >= INDIA_BOUNDS.west &&
                    plant.lng <= INDIA_BOUNDS.east
            ),
        [items]
    );

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

                {indiaPlants.map((plant) => (
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
                                            e.currentTarget.style.display =
                                                "none";
                                        }}
                                    />
                                )}
                                {plant.description && (
                                    <p className="text-sm">
                                        {plant.description}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                    Tracked by {plant.user_name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(
                                        plant.created_at
                                    ).toLocaleDateString()}{" "}
                                    at{" "}
                                    {new Date(
                                        plant.created_at
                                    ).toLocaleTimeString()}
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
