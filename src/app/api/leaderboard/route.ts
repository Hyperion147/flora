import { NextResponse } from "next/server";
import { createClient } from "@/app/supabase/server";
import { handleRouteError } from "@/server/http";
import { getLeaderboard } from "@/server/plants/repository";

export async function GET() {
  try {
    const supabase = await createClient();
    const leaderboard = await getLeaderboard(supabase);

    return NextResponse.json(leaderboard);
  } catch (error) {
    return handleRouteError(error, "Error fetching leaderboard");
  }
}
