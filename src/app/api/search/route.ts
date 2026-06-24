import { NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";
import { handleRouteError } from "@/server/http";
import { searchPlants } from "@/server/plants/repository";
import { normalizeSearchQuery } from "@/server/plants/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = normalizeSearchQuery(searchParams.get("q"));

    if (!query) {
      return NextResponse.json([]);
    }

    const supabase = await createClient();
    const plants = await searchPlants(supabase, query);

    return NextResponse.json(plants);
  } catch (error) {
    return handleRouteError(error, "Error searching plants");
  }
}

