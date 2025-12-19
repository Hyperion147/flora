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

    // Get plants data for the last 8 weeks
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56); // 8 weeks

    const { data: plants, error: plantsError } = await admin
      .from('plants')
      .select('created_at')
      .gte('created_at', eightWeeksAgo.toISOString())
      .order('created_at', { ascending: true });

    if (plantsError) {
      console.error('Error fetching plants for chart:', plantsError);
      return NextResponse.json(
        { error: 'Failed to fetch chart data' },
        { status: 500 }
      );
    }

    // Group plants by week
    const weeklyData: { [key: string]: number } = {};
    
    // Initialize weeks
    for (let i = 7; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      weeklyData[weekKey] = 0;
    }

    // Count plants per week
    plants?.forEach(plant => {
      const plantDate = new Date(plant.created_at);
      const weekStart = new Date(plantDate.setDate(plantDate.getDate() - plantDate.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (weeklyData.hasOwnProperty(weekKey)) {
        weeklyData[weekKey]++;
      }
    });

    // Convert to chart format
    const chartData = Object.entries(weeklyData).map(([week, plants]) => ({
      week: new Date(week).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      plants
    }));

    return NextResponse.json(chartData);

  } catch (error) {
    console.error('Error in admin chart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}