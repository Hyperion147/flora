import { NextResponse } from 'next/server';
import { createClient } from '@/app/supabase/server';
import { getSupabaseAdminClient } from '@/app/supabase/middleware';

export async function GET() {
  try {
    const supabase = await createClient();
    const admin = getSupabaseAdminClient();
    
    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total plants count
    const { count: totalPlants, error: plantsError } = await admin
      .from('plants')
      .select('*', { count: 'exact', head: true });

    if (plantsError) {
      console.error('Error fetching plants count:', plantsError);
      return NextResponse.json(
        { error: 'Failed to fetch plants count' },
        { status: 500 }
      );
    }

    // Get total users count by counting unique user_ids from plants table
    const { data: uniqueUsers, error: usersError } = await admin
      .from('plants')
      .select('user_id')
      .neq('user_id', null);
    
    if (usersError) {
      console.error('Error fetching unique users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch user count' },
        { status: 500 }
      );
    }
    
    const uniqueUserIds = new Set(uniqueUsers?.map(p => p.user_id) || []);
    const totalUsers = uniqueUserIds.size;

    // Get recent plants (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { count: recentPlants, error: recentError } = await admin
      .from('plants')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', sevenDaysAgo.toISOString());

    if (recentError) {
      console.error('Error fetching recent plants:', recentError);
    }

    return NextResponse.json({
      total_plants: totalPlants || 0,
      total_users: totalUsers,
      recent_plants: recentPlants || 0,
    });

  } catch (error) {
    console.error('Error in admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}