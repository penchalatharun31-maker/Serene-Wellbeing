/**
 * Payment Utility Functions
 * Currency validation, amount validation, and currency conversion
 */

// Razorpay supported currencies
export const SUPPORTED_CURRENCIES = [
  'INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'MYR', 'THB',
  'CHF', 'HKD', 'NZD', 'SEK', 'DKK', 'NOK', 'PLN', 'CZK', 'HUF', 'ILS',
  'JPY', 'KRW', 'PHP', 'ZAR', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN',
  'VND', 'IDR', 'BDT', 'PKR', 'LKR', 'NPR', 'MMK', 'KHR', 'LAK', 'KWD',
  'BHD', 'OMR', 'QAR', 'SAR', 'JOD', 'TND', 'MAD', 'EGP', 'NGN', 'KES'
];

// Minimum amounts per currency (in smallest unit - paise/cents)
export const MIN_AMOUNTS: Record<string, number> = {
  INR: 100,      // ₹1.00
  USD: 50,       // $0.50
  EUR: 50,       // €0.50
  GBP: 30,       // £0.30
  AUD: 50,       // A$0.50
  CAD: 50,       // C$0.50
  SGD: 50,       // S$0.50
  AED: 200,      // د.إ2.00
  MYR: 200,      // RM2.00
  THB: 1000,     // ฿10.00
  JPY: 50,       // ¥50
  KRW: 500,      // ₩500
  // Add more as needed
};

// Maximum amount (to prevent fraud)
export const MAX_AMOUNT = 10000000; // 100,000 in main currency units

/**
 * Validate if currency is supported by Razorpay
 */
export const isValidCurrency = (currency: string): boolean => {
  return SUPPORTED_CURRENCIES.includes(currency.toUpperCase());
};

/**
 * Get currency multiplier for converting to smallest unit
 */
export const getCurrencyMultiplier = (currency: string): number => {
  const zeroCurrencies = ['JPY', 'KRW', 'CLP', 'VND', 'IDR']; // No decimal places
  const threeCurrencies = ['BHD', 'KWD', 'OMR', 'TND', 'JOD']; // 3 decimal places

  const currencyUpper = currency.toUpperCase();

  if (zeroCurrencies.includes(currencyUpper)) {
    return 1;
  } else if (threeCurrencies.includes(currencyUpper)) {
    return 1000;
  }
  return 100; // Default: paise/cents
};

/**
 * Validate payment amount based on currency
 */
export const validateAmount = (amount: number, currency: string): {
  isValid: boolean;
  error?: string;
} => {
  const currencyUpper = currency.toUpperCase();
  const multiplier = getCurrencyMultiplier(currencyUpper);
  const amountInSmallestUnit = Math.round(amount * multiplier);

  // Check minimum amount
  const minAmount = MIN_AMOUNTS[currencyUpper] || MIN_AMOUNTS['INR'];
  if (amountInSmallestUnit < minAmount) {
    const minAmountDisplay = (minAmount / multiplier).toFixed(2);
    return {
      isValid: false,
      error: `Amount must be at least ${minAmountDisplay} ${currencyUpper}`
    };
  }

  // Check maximum amount
  if (amountInSmallestUnit > MAX_AMOUNT * multiplier) {
    const maxAmountDisplay = (MAX_AMOUNT * multiplier / multiplier).toLocaleString();
    return {
      isValid: false,
      error: `Amount cannot exceed ${maxAmountDisplay} ${currencyUpper}`
    };
  }

  return { isValid: true };
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  const symbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$',
    AED: 'د.إ',
    MYR: 'RM',
    THB: '฿',
    JPY: '¥',
    KRW: '₩',
    CHF: 'CHF',
    HKD: 'HK$',
    NZD: 'NZ$',
  };
  return symbols[currency.toUpperCase()] || currency.toUpperCase();
};

/**
 * Format amount with currency
 */
export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  const multiplier = getCurrencyMultiplier(currency);
  const decimals = multiplier === 1 ? 0 : (multiplier === 1000 ? 3 : 2);

  return `${symbol}${amount.toFixed(decimals)}`;
};
