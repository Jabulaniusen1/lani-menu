/**
 * Client-side and server-side utilities for country detection and pricing
 */

import { SupportedCountry, getCountryConfig, getCountryPricing, isSupportedCountry, getDefaultCountry, BillingPeriod } from './country-pricing'

/**
 * Get user's country from cookie (server-side)
 * Note: This function should be called from Server Components or API routes
 */
export async function getCountryFromCookie(request?: { cookies: { get: (name: string) => { value: string } | undefined } }): Promise<SupportedCountry> {
  try {
    if (request) {
      // For API routes and middleware
      const countryCookie = request.cookies.get('user_country')
      if (countryCookie?.value && isSupportedCountry(countryCookie.value)) {
        return countryCookie.value.toUpperCase() as SupportedCountry
      }
    } else {
      // For Server Components
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const countryCookie = cookieStore.get('user_country')
      
      if (countryCookie?.value && isSupportedCountry(countryCookie.value)) {
        return countryCookie.value.toUpperCase() as SupportedCountry
      }
    }
  } catch (error) {
    console.error('Error reading country cookie:', error)
  }
  
  return getDefaultCountry()
}

/**
 * Get user's country from cookie (client-side)
 */
export function getCountryFromCookieClient(): SupportedCountry {
  if (typeof document === 'undefined') {
    return getDefaultCountry()
  }

  const cookies = document.cookie.split(';')
  const countryCookie = cookies.find(cookie => 
    cookie.trim().startsWith('user_country=')
  )

  if (countryCookie) {
    const countryCode = countryCookie.split('=')[1]?.trim().toUpperCase()
    if (countryCode && isSupportedCountry(countryCode)) {
      return countryCode as SupportedCountry
    }
  }

  return getDefaultCountry()
}

/**
 * Get country and pricing info (server-side)
 */
export async function getCountryPricingInfo(period: BillingPeriod = 'monthly') {
  const country = await getCountryFromCookie()
  const config = getCountryConfig(country)
  const pricing = getCountryPricing(country, period)

  return {
    country,
    config: config!,
    pricing
  }
}

/**
 * Get country and pricing info (client-side)
 */
export function getCountryPricingInfoClient(period: BillingPeriod = 'monthly') {
  const country = getCountryFromCookieClient()
  const config = getCountryConfig(country)
  const pricing = getCountryPricing(country, period)

  return {
    country,
    config: config!,
    pricing
  }
}

