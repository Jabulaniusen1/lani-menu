/**
 * Country-based pricing configuration
 * Maps countries to their currencies and pricing tiers
 */

export type SupportedCountry = 'KE' | 'NG' | 'ZA' | 'GH' | 'EG' | 'UG'

export interface CountryConfig {
  code: SupportedCountry
  name: string
  currency: string
  currencySymbol: string
  flag: string
}

export type BillingPeriod = 'monthly' | 'yearly'

export interface PricingTier {
  free: number
  pro: number
  business: number
}

export interface PricingWithPeriod {
  monthly: PricingTier
  yearly: PricingTier
}

export const COUNTRY_CONFIG: Record<SupportedCountry, CountryConfig> = {
  KE: {
    code: 'KE',
    name: 'Kenya',
    currency: 'KES',
    currencySymbol: 'KSh',
    flag: '🇰🇪'
  },
  NG: {
    code: 'NG',
    name: 'Nigeria',
    currency: 'NGN',
    currencySymbol: '₦',
    flag: '🇳🇬'
  },
  ZA: {
    code: 'ZA',
    name: 'South Africa',
    currency: 'ZAR',
    currencySymbol: 'R',
    flag: '🇿🇦'
  },
  GH: {
    code: 'GH',
    name: 'Ghana',
    currency: 'GHS',
    currencySymbol: '₵',
    flag: '🇬🇭'
  },
  EG: {
    code: 'EG',
    name: 'Egypt',
    currency: 'EGP',
    currencySymbol: 'E£',
    flag: '🇪🇬'
  },
  UG: {
    code: 'UG',
    name: 'Uganda',
    currency: 'UGX',
    currencySymbol: 'USh',
    flag: '🇺🇬'
  }
}

/**
 * Pricing tiers in base currency (USD) for conversion
 * Monthly pricing: Pro $6/month, Business $15/month
 * Yearly pricing: 2 months free (16.67% discount)
 */
const BASE_PRICING_MONTHLY: PricingTier = {
  free: 0,
  pro: 6, // $6/month
  business: 15 // $15/month
}

const BASE_PRICING_YEARLY: PricingTier = {
  free: 0,
  pro: 60, // $6/month × 10 months = $60/year (2 months free, 16.67% discount)
  business: 150 // $15/month × 10 months = $150/year (2 months free, 16.67% discount)
}

const BASE_PRICING: PricingWithPeriod = {
  monthly: BASE_PRICING_MONTHLY,
  yearly: BASE_PRICING_YEARLY
}

/**
 * Exchange rates (approximate, should be updated regularly)
 * These are rough estimates - in production, use a real-time exchange rate API
 */
const EXCHANGE_RATES: Record<SupportedCountry, number> = {
  KE: 130, // 1 USD = ~130 KES
  NG: 1500, // 1 USD = ~1500 NGN
  ZA: 18, // 1 USD = ~18 ZAR
  GH: 12, // 1 USD = ~12 GHS
  EG: 50, // 1 USD = ~50 EGP
  UG: 3700 // 1 USD = ~3700 UGX
}

/**
 * Get pricing for a specific country and billing period
 */
export function getCountryPricing(countryCode: SupportedCountry, period: BillingPeriod = 'monthly'): PricingTier {
  const rate = EXCHANGE_RATES[countryCode]
  const basePricing = BASE_PRICING[period]
  
  return {
    free: basePricing.free,
    pro: Math.round(basePricing.pro * rate),
    business: Math.round(basePricing.business * rate)
  }
}

/**
 * Get all pricing (monthly and yearly) for a specific country
 */
export function getCountryPricingAll(countryCode: SupportedCountry): PricingWithPeriod {
  const rate = EXCHANGE_RATES[countryCode]
  
  return {
    monthly: {
      free: 0,
      pro: Math.round(BASE_PRICING.monthly.pro * rate),
      business: Math.round(BASE_PRICING.monthly.business * rate)
    },
    yearly: {
      free: 0,
      pro: Math.round(BASE_PRICING.yearly.pro * rate),
      business: Math.round(BASE_PRICING.yearly.business * rate)
    }
  }
}

/**
 * Calculate discount percentage for yearly billing
 */
export function getYearlyDiscount(): number {
  const monthlyTotal = BASE_PRICING_MONTHLY.pro * 12
  const yearlyPrice = BASE_PRICING_YEARLY.pro
  const discount = ((monthlyTotal - yearlyPrice) / monthlyTotal) * 100
  return Math.round(discount)
}

/**
 * Get country configuration
 */
export function getCountryConfig(countryCode: string): CountryConfig | null {
  const code = countryCode.toUpperCase() as SupportedCountry
  return COUNTRY_CONFIG[code] || null
}

/**
 * Get default country (Nigeria as fallback)
 */
export function getDefaultCountry(): SupportedCountry {
  return 'NG'
}

/**
 * Check if a country is supported
 */
export function isSupportedCountry(countryCode: string): countryCode is SupportedCountry {
  return countryCode.toUpperCase() in COUNTRY_CONFIG
}

/**
 * Format price with currency symbol
 */
export function formatPrice(amount: number, currency: string, locale: string = 'en'): string {
  if (amount === 0) return 'Free'
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  } catch (error) {
    // Fallback formatting
    const config = Object.values(COUNTRY_CONFIG).find(c => c.currency === currency)
    if (config) {
      return `${config.currencySymbol}${amount.toLocaleString()}`
    }
    return `${currency} ${amount.toLocaleString()}`
  }
}

