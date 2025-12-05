# Country-Based Pricing System

This document explains how the automatic country-based pricing system works in the Lanimenu application.

## Overview

The system automatically detects a user's country from their IP address, stores it in a cookie, and uses it to:
1. Display prices in the user's local currency
2. Charge the correct amount when processing Paystack payments
3. Show country-specific information in the UI

## Supported Countries

The following countries are currently supported:

| Country | Code | Currency | Cities |
|---------|------|----------|--------|
| 🇰🇪 Kenya | KE | KES | Nairobi, Mombasa |
| 🇳🇬 Nigeria | NG | NGN | Lagos, Abuja |
| 🇿🇦 South Africa | ZA | ZAR | Cape Town, Johannesburg |
| 🇬🇭 Ghana | GH | GHS | Accra, Kumasi |
| 🇪🇬 Egypt | EG | EGP | Cairo, Alexandria |
| 🇺🇬 Uganda | UG | UGX | Kampala, Entebbe |

## How It Works

### 1. Country Detection (Middleware)

The `middleware.ts` file detects the user's country using the following methods (in order of priority):

1. **Existing Cookie**: If a country cookie already exists, it uses that
2. **Vercel Edge Headers**: If deployed on Vercel, uses `x-vercel-ip-country` header
3. **Cloudflare Headers**: If using Cloudflare, uses `cf-ipcountry` header
4. **IP Geolocation**: Falls back to IP-based geolocation using ipapi.co
5. **Default**: Falls back to Nigeria (NG) if detection fails

The detected country is stored in a cookie named `user_country` with a 1-year expiration.

### 2. Pricing Configuration

Pricing is configured in `lib/country-pricing.ts`:

- **Base Prices**: Defined in USD equivalent
- **Exchange Rates**: Approximate rates for conversion
- **Country Configs**: Currency, symbol, cities, and flag for each country

### 3. Payment Processing

When a user initiates a payment:

1. The `/api/payments/initialize` route reads the country from the cookie
2. Calculates the correct price based on the country's exchange rate
3. Initializes Paystack payment with the correct currency and amount
4. Stores payment metadata including country information

### 4. UI Display

Pricing components automatically:

1. Read the country from the cookie (client-side)
2. Calculate and display prices in the local currency
3. Show country flag and name
4. Format prices according to local conventions

## Updating Exchange Rates

Exchange rates are approximate and should be updated regularly for accuracy. To update:

1. Open `lib/country-pricing.ts`
2. Update the `EXCHANGE_RATES` object with current rates
3. Consider using a real-time exchange rate API in production

Example:
```typescript
const EXCHANGE_RATES: Record<SupportedCountry, number> = {
  KE: 130,   // Update with current KES/USD rate
  NG: 1500,  // Update with current NGN/USD rate
  // ... etc
}
```

## Adding New Countries

To add support for a new country:

1. **Update `lib/country-pricing.ts`**:
   - Add country code to `SupportedCountry` type
   - Add country config to `COUNTRY_CONFIG`
   - Add exchange rate to `EXCHANGE_RATES`

2. **Update Paystack Configuration**:
   - Ensure Paystack supports the country's currency
   - Configure Paystack for the new country

3. **Test**:
   - Test country detection
   - Test pricing display
   - Test payment processing

## API Endpoints

### GET `/api/country`

Returns the user's country and pricing information.

**Response:**
```json
{
  "country": "NG",
  "config": {
    "code": "NG",
    "name": "Nigeria",
    "currency": "NGN",
    "currencySymbol": "₦",
    "cities": ["Lagos", "Abuja"],
    "flag": "🇳🇬"
  },
  "pricing": {
    "free": 0,
    "pro": 22500,
    "business": 60000
  }
}
```

## Components

### PaymentButton

The `PaymentButton` component automatically:
- Detects country from cookie
- Calculates country-specific pricing
- Displays prices in local currency
- Shows country flag and name

### Usage

```tsx
<PaymentButton
  planId="pro"
  planName="Pro Plan"
  features={[...]}
  limitations={[...]}
  isPopular={true}
/>
```

The component will automatically use country-based pricing - you don't need to pass `price` or `currency` props.

## Utilities

### Client-Side

```typescript
import { getCountryPricingInfoClient } from '@/lib/country-utils'

const { country, config, pricing } = getCountryPricingInfoClient()
```

### Server-Side

```typescript
import { getCountryPricingInfo } from '@/lib/country-utils'

const { country, config, pricing } = await getCountryPricingInfo()
```

## Testing

To test country-based pricing:

1. **Local Development**: 
   - Use a VPN to change your IP location
   - Clear cookies and refresh to trigger country detection
   - Or manually set the `user_country` cookie in browser dev tools

2. **Production**:
   - Deploy to Vercel (automatic country detection)
   - Test from different countries
   - Verify prices display correctly

## Notes

- Exchange rates are approximate and should be updated regularly
- The system falls back to Nigeria (NG) if country detection fails
- Country cookie persists for 1 year
- All prices are calculated in real-time based on exchange rates
- Paystack handles currency conversion and payment processing

