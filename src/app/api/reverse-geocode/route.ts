import { NextResponse } from "next/server";
import { handleRouteError, jsonError } from "@/server/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = Number(searchParams.get("lat"));
    const lng = Number(searchParams.get("lng"));

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return jsonError("Invalid coordinates", 400);
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          "User-Agent": "Flora/1.0 reverse-geocoder",
        },
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed with ${response.status}`);
    }

    const data = await response.json();
    const address = data.address ?? {};
    const town =
      address.village ||
      address.town ||
      address.suburb ||
      address.neighbourhood ||
      "";
    const city =
      address.city ||
      address.district ||
      address.state_district ||
      address.county ||
      "";

    const addressLabel =
      town && city
        ? `${town}, ${city}`
        : city || town || data.display_name?.split(",")?.[0] || null;

    return NextResponse.json({ addressLabel });
  } catch (error) {
    return handleRouteError(error, "Error reverse geocoding location");
  }
}
