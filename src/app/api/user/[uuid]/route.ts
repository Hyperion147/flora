import { NextResponse } from 'next/server';
import { createClient } from '@/app/supabase/server';
import { requireAuthenticatedUser } from '@/server/auth';
import { handleRouteError, jsonError } from '@/server/http';

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  ctx: { params: Promise<{ uuid: string }> }
) {
  try {
    const params = await ctx.params;
    const supabase = await createClient();
    const user = await requireAuthenticatedUser(supabase);

    // Check if the requested user ID matches the authenticated user
    if (user.id !== params.uuid) {
      return jsonError('Unauthorized', 403);
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
    return handleRouteError(error, 'Error fetching user');
  }
}
