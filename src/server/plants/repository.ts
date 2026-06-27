import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { CreatePlantInput } from "./validation";
import type { LeaderboardRow, PlantRow } from "./mappers";
import { HttpError } from "../errors";
import { getUserDisplayName } from "../auth";
import { logger } from "../logger";
import { mapLeaderboardRows, mapPlantRow, mapPlantRows } from "./mappers";
import { getNextPlantPid, isUniqueViolation } from "./pid";
import { deleteUploadedPlantImage, uploadPlantImage } from "./storage";
import {
  escapeIlikePattern,
  mergePlantRows,
  sortPlantsByRelevance,
} from "./search";

type ListPlantsOptions = {
  query?: string;
  userId?: string | null;
};

export async function listPlants(
  supabase: SupabaseClient,
  options: ListPlantsOptions = {},
) {
  if (options.query) {
    return searchPlants(supabase, options.query);
  }

  let query = supabase.from("plants").select("*");

  if (options.userId) {
    query = query.eq("user_id", options.userId);
  }

  const { data, error } = await query.order("created_at", {
    ascending: false,
  });

  if (error) {
    throw new HttpError("Failed to fetch plants", 500, error.message);
  }

  return mapPlantRows((data || []) as PlantRow[]);
}

export async function searchPlants(
  supabase: SupabaseClient,
  rawQuery: string,
  limit = 50,
) {
  const query = rawQuery.trim();
  if (!query) return [];

  const pattern = `%${escapeIlikePattern(query)}%`;
  const searchQueries = [
    supabase.from("plants").select("*").ilike("name", pattern).limit(limit),
    supabase
      .from("plants")
      .select("*")
      .ilike("description", pattern)
      .limit(limit),
    supabase
      .from("plants")
      .select("*")
      .ilike("user_name", pattern)
      .limit(limit),
  ];

  if (/^\d+$/.test(query)) {
    searchQueries.unshift(
      supabase.from("plants").select("*").eq("pid", query).limit(limit),
    );
  } else {
    searchQueries.unshift(
      supabase.from("plants").select("*").ilike("pid", pattern).limit(limit),
    );
  }

  const results = await Promise.all(searchQueries);
  const failed = results.find((result) => result.error);

  if (failed?.error) {
    throw new HttpError("Failed to search plants", 500, failed.error.message);
  }

  const rows = mergePlantRows(
    results.flatMap((result) => (result.data || []) as PlantRow[]),
  );

  return sortPlantsByRelevance(mapPlantRows(rows), query).slice(
    0,
    limit,
  );
}

export async function createPlant(
  admin: SupabaseClient,
  user: User,
  input: CreatePlantInput,
) {
  const uploadedImage = await uploadPlantImage(admin, user.id, input.image);
  const userName = getUserDisplayName(user);
  const userAvatarUrl =
    user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  try {
    let lastError: unknown = null;

    for (let attempt = 0; attempt < 3; attempt++) {
      const pid = await getNextPlantPid(admin);
      const { data, error } = await admin
        .from("plants")
        .insert({
          name: input.name,
          description: input.description,
          category: input.category,
          user_id: user.id,
          user_name: userName,
          lat: input.lat,
          lng: input.lng,
          image_url: uploadedImage.publicUrl,
          user_avatar_url: userAvatarUrl,
          pid,
        })
        .select()
        .single();

      if (!error && data) {
        return mapPlantRow({
          ...(data as PlantRow),
          user_avatar_url: userAvatarUrl,
        });
      }

      lastError = error;
      if (!isUniqueViolation(error)) {
        break;
      }

      logger.warn("PID collision detected; retrying plant insert", {
        attempt: attempt + 1,
      });
    }

    throw new HttpError(
      "Failed to save plant",
      500,
      lastError instanceof Error ? lastError.message : lastError,
    );
  } catch (error) {
    await deleteUploadedPlantImage(admin, uploadedImage);
    throw error;
  }
}

export async function deletePlant(
  supabase: SupabaseClient,
  user: User,
  plantId: string,
) {
  const { data: plant, error: fetchError } = await supabase
    .from("plants")
    .select("id,user_id")
    .eq("id", plantId)
    .single();

  if (fetchError || !plant) {
    throw new HttpError("Plant not found", 404);
  }

  if ((plant as { user_id: string }).user_id !== user.id) {
    throw new HttpError("Not authorized to delete this plant", 403);
  }

  const { error } = await supabase
    .from("plants")
    .delete()
    .eq("id", plantId)
    .eq("user_id", user.id);

  if (error) {
    throw new HttpError("Failed to delete plant", 500, error.message);
  }

  return { success: true };
}

export async function getLeaderboard(supabase: SupabaseClient, limit = 50) {
  const safeLimit = Math.min(Math.max(Math.trunc(limit), 1), 100);
  const { data, error } = await supabase.rpc("plant_leaderboard", {
    p_limit: safeLimit,
  });

  if (!error && data) {
    return mapLeaderboardRows(data as LeaderboardRow[]);
  }

  logger.warn("Leaderboard RPC unavailable; falling back to row aggregation", {
    code: error?.code,
    message: error?.message,
  });

  const { data: plants, error: fetchError } = await supabase
    .from("plants")
    .select("user_id,user_name,user_avatar_url");

  if (fetchError) {
    throw new HttpError("Failed to fetch leaderboard", 500, fetchError.message);
  }

  const leaderboard = new Map<string, LeaderboardRow>();

  for (const plant of (plants || []) as Array<{
    user_id?: string;
    user_name?: string;
    user_avatar_url?: string | null;
  }>) {
    if (!plant.user_id || !plant.user_name) continue;

    const existing = leaderboard.get(plant.user_id);
    if (existing) {
      existing.plant_count = Number(existing.plant_count) + 1;
      existing.avatar_url = existing.avatar_url || plant.user_avatar_url || null;
    } else {
      leaderboard.set(plant.user_id, {
        user_id: plant.user_id,
        user_name: plant.user_name,
        plant_count: 1,
        avatar_url: plant.user_avatar_url || null,
      });
    }
  }

  return mapLeaderboardRows(Array.from(leaderboard.values()))
    .sort((a, b) => b.plant_count - a.plant_count)
    .slice(0, safeLimit);
}
