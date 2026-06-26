import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Check if environment variables are available
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const pathname = request.nextUrl.pathname
    const isProtectedRoute = !pathname.startsWith('/login') &&
      !pathname.startsWith('/auth') &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/map') &&
      !pathname.startsWith('/_next') &&
      pathname !== '/'

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables in middleware')
      if (isProtectedRoute) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
      return NextResponse.next()
    }

    let supabaseResponse = NextResponse.next({
      request,
    })

    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value }) => {
                request.cookies.set(name, value)
              })
              supabaseResponse = NextResponse.next({
                request,
              })
              cookiesToSet.forEach(({ name, value, options }) => {
                supabaseResponse.cookies.set(name, value, options)
              })
            } catch (error) {
              console.error('Error setting cookies in middleware:', error)
            }
          },
        },
      }
    )

    // Get user with error handling
    let user = null
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Auth error in middleware:', error)
      } else {
        user = data.user
      }
    } catch (error) {
      console.error('Exception in auth.getUser():', error)
    }

    // Only redirect if we're sure the user is not authenticated
    // and they're trying to access a protected route
    if (!user && isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error('Middleware error:', error)
    const pathname = request.nextUrl.pathname
    const isProtectedRoute = !pathname.startsWith('/login') &&
      !pathname.startsWith('/auth') &&
      !pathname.startsWith('/api') &&
      !pathname.startsWith('/map') &&
      !pathname.startsWith('/_next') &&
      pathname !== '/'

    if (isProtectedRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (handled separately)
     * - static assets
     */
    '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|woff|woff2|ttf|eot)$).*)',
  ],
}
