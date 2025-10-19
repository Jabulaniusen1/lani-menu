// Comprehensive currency data for Africa, Asia, and major global currencies
export interface Currency {
  code: string
  name: string
  symbol: string
  region: 'Africa' | 'Asia' | 'Global'
  flag?: string
}

export const CURRENCIES: Currency[] = [
  // Global Major Currencies
  { code: 'USD', name: 'US Dollar', symbol: '$', region: 'Global', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', symbol: '€', region: 'Global', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', symbol: '£', region: 'Global', flag: '🇬🇧' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥', region: 'Global', flag: '🇯🇵' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', region: 'Global', flag: '🇨🇦' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', region: 'Global', flag: '🇦🇺' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', region: 'Global', flag: '🇨🇭' },

  // African Currencies
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', region: 'Africa', flag: '🇳🇬' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', region: 'Africa', flag: '🇿🇦' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', region: 'Africa', flag: '🇪🇬' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', region: 'Africa', flag: '🇰🇪' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', region: 'Africa', flag: '🇬🇭' },
  { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD', region: 'Africa', flag: '🇲🇦' },
  { code: 'TND', name: 'Tunisian Dinar', symbol: 'TND', region: 'Africa', flag: '🇹🇳' },
  { code: 'DZD', name: 'Algerian Dinar', symbol: 'DZD', region: 'Africa', flag: '🇩🇿' },
  { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br', region: 'Africa', flag: '🇪🇹' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', region: 'Africa', flag: '🇺🇬' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', region: 'Africa', flag: '🇹🇿' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'RF', region: 'Africa', flag: '🇷🇼' },
  { code: 'BIF', name: 'Burundian Franc', symbol: 'FBu', region: 'Africa', flag: '🇧🇮' },
  { code: 'XOF', name: 'West African CFA Franc', symbol: 'CFA', region: 'Africa', flag: '🌍' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', region: 'Africa', flag: '🌍' },
  { code: 'AOA', name: 'Angolan Kwanza', symbol: 'Kz', region: 'Africa', flag: '🇦🇴' },
  { code: 'MZN', name: 'Mozambican Metical', symbol: 'MT', region: 'Africa', flag: '🇲🇿' },
  { code: 'BWP', name: 'Botswana Pula', symbol: 'P', region: 'Africa', flag: '🇧🇼' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', region: 'Africa', flag: '🇿🇲' },
  { code: 'MWK', name: 'Malawian Kwacha', symbol: 'MK', region: 'Africa', flag: '🇲🇼' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', region: 'Africa', flag: '🇸🇱' },
  { code: 'GMD', name: 'Gambian Dalasi', symbol: 'D', region: 'Africa', flag: '🇬🇲' },
  { code: 'LRD', name: 'Liberian Dollar', symbol: 'L$', region: 'Africa', flag: '🇱🇷' },
  { code: 'CDF', name: 'Congolese Franc', symbol: 'FC', region: 'Africa', flag: '🇨🇩' },
  { code: 'CVE', name: 'Cape Verdean Escudo', symbol: '$', region: 'Africa', flag: '🇨🇻' },
  { code: 'STN', name: 'São Tomé and Príncipe Dobra', symbol: 'Db', region: 'Africa', flag: '🇸🇹' },
  { code: 'SZL', name: 'Swazi Lilangeni', symbol: 'L', region: 'Africa', flag: '🇸🇿' },
  { code: 'LSL', name: 'Lesotho Loti', symbol: 'L', region: 'Africa', flag: '🇱🇸' },
  { code: 'NAD', name: 'Namibian Dollar', symbol: 'N$', region: 'Africa', flag: '🇳🇦' },
  { code: 'SCR', name: 'Seychellois Rupee', symbol: '₨', region: 'Africa', flag: '🇸🇨' },
  { code: 'MUR', name: 'Mauritian Rupee', symbol: '₨', region: 'Africa', flag: '🇲🇺' },
  { code: 'KMF', name: 'Comorian Franc', symbol: 'CF', region: 'Africa', flag: '🇰🇲' },
  { code: 'DJF', name: 'Djiboutian Franc', symbol: 'Fdj', region: 'Africa', flag: '🇩🇯' },
  { code: 'SOS', name: 'Somali Shilling', symbol: 'S', region: 'Africa', flag: '🇸🇴' },
  { code: 'ERN', name: 'Eritrean Nakfa', symbol: 'Nfk', region: 'Africa', flag: '🇪🇷' },
  { code: 'LYD', name: 'Libyan Dinar', symbol: 'LD', region: 'Africa', flag: '🇱🇾' },
  { code: 'SDG', name: 'Sudanese Pound', symbol: 'SDG', region: 'Africa', flag: '🇸🇩' },
  { code: 'SSP', name: 'South Sudanese Pound', symbol: 'SSP', region: 'Africa', flag: '🇸🇸' },

  // Asian Currencies
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', region: 'Asia', flag: '🇨🇳' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', region: 'Asia', flag: '🇮🇳' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩', region: 'Asia', flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', region: 'Asia', flag: '🇸🇬' },
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', region: 'Asia', flag: '🇭🇰' },
  { code: 'TWD', name: 'Taiwan Dollar', symbol: 'NT$', region: 'Asia', flag: '🇹🇼' },
  { code: 'THB', name: 'Thai Baht', symbol: '฿', region: 'Asia', flag: '🇹🇭' },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', region: 'Asia', flag: '🇲🇾' },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', region: 'Asia', flag: '🇮🇩' },
  { code: 'PHP', name: 'Philippine Peso', symbol: '₱', region: 'Asia', flag: '🇵🇭' },
  { code: 'VND', name: 'Vietnamese Dong', symbol: '₫', region: 'Asia', flag: '🇻🇳' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', region: 'Asia', flag: '🇵🇰' },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', region: 'Asia', flag: '🇧🇩' },
  { code: 'LKR', name: 'Sri Lankan Rupee', symbol: '₨', region: 'Asia', flag: '🇱🇰' },
  { code: 'NPR', name: 'Nepalese Rupee', symbol: '₨', region: 'Asia', flag: '🇳🇵' },
  { code: 'BTN', name: 'Bhutanese Ngultrum', symbol: 'Nu', region: 'Asia', flag: '🇧🇹' },
  { code: 'AFN', name: 'Afghan Afghani', symbol: '؋', region: 'Asia', flag: '🇦🇫' },
  { code: 'KZT', name: 'Kazakhstani Tenge', symbol: '₸', region: 'Asia', flag: '🇰🇿' },
  { code: 'UZS', name: 'Uzbekistani Som', symbol: 'So\'m', region: 'Asia', flag: '🇺🇿' },
  { code: 'KGS', name: 'Kyrgyzstani Som', symbol: 'с', region: 'Asia', flag: '🇰🇬' },
  { code: 'TJS', name: 'Tajikistani Somoni', symbol: 'SM', region: 'Asia', flag: '🇹🇯' },
  { code: 'TMT', name: 'Turkmenistani Manat', symbol: 'T', region: 'Asia', flag: '🇹🇲' },
  { code: 'MNT', name: 'Mongolian Tugrik', symbol: '₮', region: 'Asia', flag: '🇲🇳' },
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K', region: 'Asia', flag: '🇲🇲' },
  { code: 'LAK', name: 'Lao Kip', symbol: '₭', region: 'Asia', flag: '🇱🇦' },
  { code: 'KHR', name: 'Cambodian Riel', symbol: '៛', region: 'Asia', flag: '🇰🇭' },
  { code: 'BND', name: 'Brunei Dollar', symbol: 'B$', region: 'Asia', flag: '🇧🇳' },
  { code: 'MOP', name: 'Macanese Pataca', symbol: 'MOP$', region: 'Asia', flag: '🇲🇴' },
  { code: 'ILS', name: 'Israeli Shekel', symbol: '₪', region: 'Asia', flag: '🇮🇱' },
  { code: 'JOD', name: 'Jordanian Dinar', symbol: 'JD', region: 'Asia', flag: '🇯🇴' },
  { code: 'LBP', name: 'Lebanese Pound', symbol: 'L£', region: 'Asia', flag: '🇱🇧' },
  { code: 'SYP', name: 'Syrian Pound', symbol: '£S', region: 'Asia', flag: '🇸🇾' },
  { code: 'IQD', name: 'Iraqi Dinar', symbol: 'ع.د', region: 'Asia', flag: '🇮🇶' },
  { code: 'IRR', name: 'Iranian Rial', symbol: '﷼', region: 'Asia', flag: '🇮🇷' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', region: 'Asia', flag: '🇦🇪' },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', region: 'Asia', flag: '🇸🇦' },
  { code: 'QAR', name: 'Qatari Riyal', symbol: '﷼', region: 'Asia', flag: '🇶🇦' },
  { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'د.ك', region: 'Asia', flag: '🇰🇼' },
  { code: 'BHD', name: 'Bahraini Dinar', symbol: 'د.ب', region: 'Asia', flag: '🇧🇭' },
  { code: 'OMR', name: 'Omani Rial', symbol: '﷼', region: 'Asia', flag: '🇴🇲' },
  { code: 'YER', name: 'Yemeni Rial', symbol: '﷼', region: 'Asia', flag: '🇾🇪' },
  { code: 'AMD', name: 'Armenian Dram', symbol: '֏', region: 'Asia', flag: '🇦🇲' },
  { code: 'AZN', name: 'Azerbaijani Manat', symbol: '₼', region: 'Asia', flag: '🇦🇿' },
  { code: 'GEL', name: 'Georgian Lari', symbol: '₾', region: 'Asia', flag: '🇬🇪' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', region: 'Asia', flag: '🇹🇷' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽', region: 'Asia', flag: '🇷🇺' },
]

export function searchCurrencies(query: string): Currency[] {
  if (!query.trim()) return CURRENCIES
  
  const lowercaseQuery = query.toLowerCase()
  return CURRENCIES.filter(currency => 
    currency.code.toLowerCase().includes(lowercaseQuery) ||
    currency.name.toLowerCase().includes(lowercaseQuery) ||
    currency.symbol.toLowerCase().includes(lowercaseQuery) ||
    currency.region.toLowerCase().includes(lowercaseQuery)
  )
}

export function getCurrencyByCode(code: string): Currency | undefined {
  return CURRENCIES.find(currency => currency.code === code)
}

export function formatPrice(price: number, currencyCode: string): string {
  const currency = getCurrencyByCode(currencyCode)
  if (!currency) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  
  // For currencies like JPY that don't use decimal places
  if (currency.code === 'JPY' || currency.code === 'KRW' || currency.code === 'VND') {
    return `${currency.symbol}${Math.round(price).toLocaleString('en-US')}`
  }
  
  return `${currency.symbol}${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Format number with commas for input display (e.g., 1000 -> "1,000")
export function formatNumberWithCommas(value: string): string {
  // Remove any existing commas and non-numeric characters except decimal point
  const cleanValue = value.replace(/[^\d.]/g, '')
  
  // Split by decimal point
  const parts = cleanValue.split('.')
  const integerPart = parts[0]
  const decimalPart = parts[1]
  
  // Add commas to integer part
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  
  // Rejoin with decimal part if it exists
  return decimalPart !== undefined ? `${formattedInteger}.${decimalPart}` : formattedInteger
}

// Parse comma-formatted string back to number (e.g., "1,000" -> 1000)
export function parseCommaFormattedNumber(value: string): number {
  // Remove commas and parse as float
  const cleanValue = value.replace(/,/g, '')
  return parseFloat(cleanValue) || 0
}
