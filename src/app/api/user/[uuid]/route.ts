import { NextResponse } from 'next/server';
import { createClient } from '@/app/supabase/server';

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  });
}

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  ctx: { params: Promise<{ uuid: string }> }
) {
  try {
    const params = await ctx.params;
    const supabase = await createClient();

    // Get the current authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Check if the requested user ID matches the authenticated user
    if (user.id !== params.uuid) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Return user data from auth
    const userData = {
      id: user.id,
      email: user.email || '',
      name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error('Error in user GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
