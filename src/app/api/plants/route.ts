export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";
import { getSupabaseAdminClient } from "@/app/supabase/admin";
import { requireAuthenticatedUser } from "@/server/auth";
import { HttpError } from "@/server/errors";
import { handleRouteError, jsonError } from "@/server/http";
import {
  createPlant,
  deletePlant,
  listPlants,
} from "@/server/plants/repository";
import {
  formatValidationError,
  normalizeSearchQuery,
  parseCreatePlantFormData,
  parseOptionalUuid,
} from "@/server/plants/validation";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = normalizeSearchQuery(searchParams.get("q"));
    const userIdResult = parseOptionalUuid(searchParams.get("userId"));

    if (!userIdResult.success) {
      return jsonError("Invalid userId", 400, "Expected a UUID");
    }

    const supabase = await createClient();
    const plants = await listPlants(supabase, {
      query,
      userId: userIdResult.data,
    });

    return NextResponse.json(plants);
  } catch (error) {
    return handleRouteError(error, "Error fetching plants");
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);
    const formData = await request.formData();
    const parsed = parseCreatePlantFormData(formData);

    if (!parsed.success) {
      return jsonError(
        "Invalid plant data",
        400,
        formatValidationError(parsed.error),
      );
    }

    const admin = getSupabaseAdminClient();
    const plant = await createPlant(admin, user, parsed.data);

    return NextResponse.json(plant, { status: 201 });
  } catch (error) {
    return handleRouteError(error, "Error creating plant");
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);
    const { searchParams } = new URL(request.url);
    const plantId = searchParams.get("id");

    if (!plantId) {
      throw new HttpError("Missing plant id", 400);
    }

    const result = await deletePlant(supabase, user, plantId);
    return NextResponse.json(result);
  } catch (error) {
    return handleRouteError(error, "Error deleting plant");
  }
}

