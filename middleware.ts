import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { isSupportedCountry, getDefaultCountry, getCountryConfig } from "@/lib/country-pricing"

const COUNTRY_COOKIE_NAME = 'user_country'
const COUNTRY_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Detect country from request headers (Vercel Edge) or IP geolocation
 */
async function detectCountry(request: NextRequest): Promise<string> {
  // Check if country is already in cookie
  const existingCountry = request.cookies.get(COUNTRY_COOKIE_NAME)?.value
  if (existingCountry && isSupportedCountry(existingCountry)) {
    return existingCountry
  }

  // Try to get country from Vercel Edge headers (if deployed on Vercel)
  const vercelCountry = request.headers.get('x-vercel-ip-country')
  if (vercelCountry && isSupportedCountry(vercelCountry)) {
    return vercelCountry
  }

  // Try Cloudflare headers (if using Cloudflare)
  const cfCountry = request.headers.get('cf-ipcountry')
  if (cfCountry && isSupportedCountry(cfCountry)) {
    return cfCountry
  }

  // Fallback: Try to detect from IP using a free geolocation service
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown'
    
    if (ip !== 'unknown') {
      // Using ipapi.co free tier (1000 requests/day)
      const response = await fetch(`https://ipapi.co/${ip}/country_code/`, {
        headers: {
          'User-Agent': 'Lanimenu-Country-Detection'
        }
      })
      
      if (response.ok) {
        const countryCode = (await response.text()).trim().toUpperCase()
        if (isSupportedCountry(countryCode)) {
          return countryCode
        }
      }
    }
  } catch (error) {
    console.error('Error detecting country from IP:', error)
  }

  // Default fallback
  return getDefaultCountry()
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Detect and set country cookie
  const detectedCountry = await detectCountry(request)
  const countryCookie = request.cookies.get(COUNTRY_COOKIE_NAME)
  
  // Only set cookie if it doesn't exist or is different
  if (!countryCookie || countryCookie.value !== detectedCountry) {
    supabaseResponse.cookies.set(COUNTRY_COOKIE_NAME, detectedCountry, {
      maxAge: COUNTRY_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  }

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard") && !user) {
    return NextResponse.redirect(new URL("/sign-in", request.url))
  }

  // Redirect authenticated users away from auth pages
  if ((request.nextUrl.pathname === "/sign-in" || request.nextUrl.pathname === "/sign-up") && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
