// Currency formatting utilities for Australian and global markets

export type Currency = 'USD' | 'AUD'

// Approximate exchange rate - update regularly or use an API
const AUD_TO_USD_RATE = 0.65

export function formatPrice(
  amount: number | string,
  currency: Currency = 'USD',
  locale: string = 'en-AU'
): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  if (isNaN(numericAmount)) {
    return 'Price unavailable'
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericAmount)
}

export function convertUSDtoAUD(usdAmount: number): number {
  return usdAmount / AUD_TO_USD_RATE
}

export function convertAUDtoUSD(audAmount: number): number {
  return audAmount * AUD_TO_USD_RATE
}

export function formatDualCurrency(usdAmount: number): string {
  const audAmount = convertUSDtoAUD(usdAmount)
  return `${formatPrice(usdAmount, 'USD', 'en-US')} / ${formatPrice(audAmount, 'AUD', 'en-AU')}`
}

// Detect user's preferred currency based on location (can be enhanced with geolocation)
export function getPreferredCurrency(): Currency {
  if (typeof window !== 'undefined') {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezone.includes('Australia')) {
      return 'AUD'
    }
  }
  return 'USD'
}
