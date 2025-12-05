import { NextRequest, NextResponse } from 'next/server'
import { getCountryFromCookie } from '@/lib/country-utils'
import { getCountryConfig, getCountryPricing } from '@/lib/country-pricing'

/**
 * API endpoint to get user's country and pricing information
 * Useful for client-side components that need country info
 */
export async function GET(request: NextRequest) {
  try {
    const country = await getCountryFromCookie(request as any)
    const config = getCountryConfig(country)
    const pricing = getCountryPricing(country)

    if (!config) {
      return NextResponse.json({ error: 'Unsupported country' }, { status: 400 })
    }

    return NextResponse.json({
      country,
      config,
      pricing
    })
  } catch (error) {
    console.error('Error getting country info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

