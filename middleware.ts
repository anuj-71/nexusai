import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServiceSupabaseClient } from '@/lib/supabase/server'

// Routes to protect: startup, investor, admin
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()
  const { pathname } = req.nextUrl

  // Allow public assets, API and auth pages
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Look for common Supabase session cookies
  const token = req.cookies.get('sb-access-token')?.value
    || req.cookies.get('sb:token')?.value
    || req.cookies.get('supabase-auth-token')?.value
    || req.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    // Not authenticated -> redirect to /auth with return url
    url.pathname = '/auth'
    url.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  try {
    const supabase = createServiceSupabaseClient()

    // Validate token and fetch user
    const { data: userData, error: userError } = await supabase.auth.getUser(token)
    if (userError || !userData?.user) {
      url.pathname = '/auth'
      url.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    const userId = userData.user.id

    // Fetch profile role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, onboarding_status')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      // If no profile, redirect to auth/onboarding
      url.pathname = '/auth'
      url.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(url)
    }

    const role = profile.role as string

    // Enforce role-based access
    if (pathname.startsWith('/startup') && role !== 'startup') {
      // Redirect investors to their dashboard
      url.pathname = role === 'investor' ? '/investor' : '/auth'
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/investor') && role !== 'investor') {
      url.pathname = role === 'startup' ? '/startup' : '/auth'
      return NextResponse.redirect(url)
    }

    if (pathname.startsWith('/admin') && role !== 'admin') {
      url.pathname = '/'
      return NextResponse.redirect(url)
    }

    // Attach role info as header for downstream (optional)
    const res = NextResponse.next()
    res.headers.set('x-user-id', userId)
    res.headers.set('x-user-role', role)
    return res
  } catch (e) {
    const errUrl = req.nextUrl.clone()
    errUrl.pathname = '/auth'
    errUrl.searchParams.set('redirect', req.nextUrl.pathname)
    return NextResponse.redirect(errUrl)
  }
}

export const config = {
  matcher: [
    '/startup/:path*',
    '/investor/:path*',
    '/admin/:path*',
  ],
}
