import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/app/supabase/admin";
import { handleRouteError } from "@/server/http";
import { getLeaderboard } from "@/server/plants/repository";

export async function GET() {
  try {
    const admin = getSupabaseAdminClient();
    const leaderboard = await getLeaderboard(admin);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return handleRouteError(error, "Error fetching leaderboard");
  }
}

