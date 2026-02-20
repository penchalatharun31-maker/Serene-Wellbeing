/**
 * Currency Utility Functions
 * Frontend currency formatting and validation
 */

// Supported currencies (matching backend)
export const SUPPORTED_CURRENCIES = [
  'INR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SGD', 'AED', 'MYR', 'THB',
  'CHF', 'HKD', 'NZD', 'SEK', 'DKK', 'NOK', 'PLN', 'CZK', 'HUF', 'ILS',
  'JPY', 'KRW', 'PHP', 'ZAR', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN',
  'VND', 'IDR', 'RUB', 'TRY', 'SAR', 'QAR', 'OMR', 'KWD', 'BHD', 'EGP',
  'PKR', 'BDT', 'LKR', 'NPR', 'MMK', 'TWD', 'CNY',
];

// Currency symbols mapping
export const CURRENCY_SYMBOLS: Record<string, string> = {
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
  CHF: 'CHF',
  HKD: 'HK$',
  NZD: 'NZ$',
  SEK: 'kr',
  DKK: 'kr',
  NOK: 'kr',
  PLN: 'zł',
  CZK: 'Kč',
  HUF: 'Ft',
  ILS: '₪',
  JPY: '¥',
  KRW: '₩',
  PHP: '₱',
  ZAR: 'R',
  BRL: 'R$',
  MXN: 'MX$',
  ARS: 'AR$',
  CLP: 'CLP$',
  COP: 'COL$',
  PEN: 'S/',
  VND: '₫',
  IDR: 'Rp',
  RUB: '₽',
  TRY: '₺',
  SAR: '﷼',
  QAR: 'ر.ق',
  OMR: 'ر.ع.',
  KWD: 'د.ك',
  BHD: 'د.ب',
  EGP: 'E£',
  PKR: '₨',
  BDT: '৳',
  LKR: 'Rs',
  NPR: 'रू',
  MMK: 'K',
  TWD: 'NT$',
  CNY: '¥',
};

// Currency names
export const CURRENCY_NAMES: Record<string, string> = {
  INR: 'Indian Rupee',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  AUD: 'Australian Dollar',
  CAD: 'Canadian Dollar',
  SGD: 'Singapore Dollar',
  AED: 'UAE Dirham',
  MYR: 'Malaysian Ringgit',
  THB: 'Thai Baht',
  CHF: 'Swiss Franc',
  HKD: 'Hong Kong Dollar',
  NZD: 'New Zealand Dollar',
  SEK: 'Swedish Krona',
  DKK: 'Danish Krone',
  NOK: 'Norwegian Krone',
  PLN: 'Polish Zloty',
  CZK: 'Czech Koruna',
  HUF: 'Hungarian Forint',
  ILS: 'Israeli Shekel',
  JPY: 'Japanese Yen',
  KRW: 'South Korean Won',
  PHP: 'Philippine Peso',
  ZAR: 'South African Rand',
  BRL: 'Brazilian Real',
  MXN: 'Mexican Peso',
  ARS: 'Argentine Peso',
  CLP: 'Chilean Peso',
  COP: 'Colombian Peso',
  PEN: 'Peruvian Sol',
  VND: 'Vietnamese Dong',
  IDR: 'Indonesian Rupiah',
  RUB: 'Russian Ruble',
  TRY: 'Turkish Lira',
  SAR: 'Saudi Riyal',
  QAR: 'Qatari Riyal',
  OMR: 'Omani Rial',
  KWD: 'Kuwaiti Dinar',
  BHD: 'Bahraini Dinar',
  EGP: 'Egyptian Pound',
  PKR: 'Pakistani Rupee',
  BDT: 'Bangladeshi Taka',
  LKR: 'Sri Lankan Rupee',
  NPR: 'Nepalese Rupee',
  MMK: 'Myanmar Kyat',
  TWD: 'Taiwan Dollar',
  CNY: 'Chinese Yuan',
};

/**
 * Format currency amount with symbol
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'INR',
  includeSymbol: boolean = true
): string => {
  const currencyUpper = currency.toUpperCase();
  const symbol = CURRENCY_SYMBOLS[currencyUpper] || currencyUpper;

  // Determine decimal places based on currency
  const zeroCurrencies = ['JPY', 'KRW', 'CLP', 'VND', 'IDR'];
  const decimals = zeroCurrencies.includes(currencyUpper) ? 0 : 2;

  const formattedAmount = amount.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return includeSymbol ? `${symbol} ${formattedAmount}` : formattedAmount;
};

/**
 * Get currency symbol
 */
export const getCurrencySymbol = (currency: string): string => {
  return CURRENCY_SYMBOLS[currency.toUpperCase()] || currency.toUpperCase();
};

/**
 * Get currency name
 */
export const getCurrencyName = (currency: string): string => {
  return CURRENCY_NAMES[currency.toUpperCase()] || currency.toUpperCase();
};

/**
 * Validate currency code
 */
export const isValidCurrency = (currency: string): boolean => {
  return SUPPORTED_CURRENCIES.includes(currency.toUpperCase());
};

/**
 * Group currencies by region
 */
export const getCurrenciesByRegion = (): Record<string, Array<{ code: string; name: string; symbol: string }>> => {
  return {
    'Asia': [
      { code: 'INR', name: CURRENCY_NAMES.INR, symbol: CURRENCY_SYMBOLS.INR },
      { code: 'SGD', name: CURRENCY_NAMES.SGD, symbol: CURRENCY_SYMBOLS.SGD },
      { code: 'AED', name: CURRENCY_NAMES.AED, symbol: CURRENCY_SYMBOLS.AED },
      { code: 'MYR', name: CURRENCY_NAMES.MYR, symbol: CURRENCY_SYMBOLS.MYR },
      { code: 'THB', name: CURRENCY_NAMES.THB, symbol: CURRENCY_SYMBOLS.THB },
      { code: 'JPY', name: CURRENCY_NAMES.JPY, symbol: CURRENCY_SYMBOLS.JPY },
      { code: 'KRW', name: CURRENCY_NAMES.KRW, symbol: CURRENCY_SYMBOLS.KRW },
      { code: 'PHP', name: CURRENCY_NAMES.PHP, symbol: CURRENCY_SYMBOLS.PHP },
      { code: 'HKD', name: CURRENCY_NAMES.HKD, symbol: CURRENCY_SYMBOLS.HKD },
      { code: 'CNY', name: CURRENCY_NAMES.CNY, symbol: CURRENCY_SYMBOLS.CNY },
      { code: 'TWD', name: CURRENCY_NAMES.TWD, symbol: CURRENCY_SYMBOLS.TWD },
      { code: 'VND', name: CURRENCY_NAMES.VND, symbol: CURRENCY_SYMBOLS.VND },
      { code: 'IDR', name: CURRENCY_NAMES.IDR, symbol: CURRENCY_SYMBOLS.IDR },
      { code: 'SAR', name: CURRENCY_NAMES.SAR, symbol: CURRENCY_SYMBOLS.SAR },
      { code: 'QAR', name: CURRENCY_NAMES.QAR, symbol: CURRENCY_SYMBOLS.QAR },
      { code: 'OMR', name: CURRENCY_NAMES.OMR, symbol: CURRENCY_SYMBOLS.OMR },
      { code: 'KWD', name: CURRENCY_NAMES.KWD, symbol: CURRENCY_SYMBOLS.KWD },
      { code: 'BHD', name: CURRENCY_NAMES.BHD, symbol: CURRENCY_SYMBOLS.BHD },
      { code: 'PKR', name: CURRENCY_NAMES.PKR, symbol: CURRENCY_SYMBOLS.PKR },
      { code: 'BDT', name: CURRENCY_NAMES.BDT, symbol: CURRENCY_SYMBOLS.BDT },
      { code: 'LKR', name: CURRENCY_NAMES.LKR, symbol: CURRENCY_SYMBOLS.LKR },
      { code: 'NPR', name: CURRENCY_NAMES.NPR, symbol: CURRENCY_SYMBOLS.NPR },
      { code: 'MMK', name: CURRENCY_NAMES.MMK, symbol: CURRENCY_SYMBOLS.MMK },
    ],
    'Americas': [
      { code: 'USD', name: CURRENCY_NAMES.USD, symbol: CURRENCY_SYMBOLS.USD },
      { code: 'CAD', name: CURRENCY_NAMES.CAD, symbol: CURRENCY_SYMBOLS.CAD },
      { code: 'BRL', name: CURRENCY_NAMES.BRL, symbol: CURRENCY_SYMBOLS.BRL },
      { code: 'MXN', name: CURRENCY_NAMES.MXN, symbol: CURRENCY_SYMBOLS.MXN },
      { code: 'ARS', name: CURRENCY_NAMES.ARS, symbol: CURRENCY_SYMBOLS.ARS },
      { code: 'CLP', name: CURRENCY_NAMES.CLP, symbol: CURRENCY_SYMBOLS.CLP },
      { code: 'COP', name: CURRENCY_NAMES.COP, symbol: CURRENCY_SYMBOLS.COP },
      { code: 'PEN', name: CURRENCY_NAMES.PEN, symbol: CURRENCY_SYMBOLS.PEN },
    ],
    'Europe': [
      { code: 'EUR', name: CURRENCY_NAMES.EUR, symbol: CURRENCY_SYMBOLS.EUR },
      { code: 'GBP', name: CURRENCY_NAMES.GBP, symbol: CURRENCY_SYMBOLS.GBP },
      { code: 'CHF', name: CURRENCY_NAMES.CHF, symbol: CURRENCY_SYMBOLS.CHF },
      { code: 'SEK', name: CURRENCY_NAMES.SEK, symbol: CURRENCY_SYMBOLS.SEK },
      { code: 'DKK', name: CURRENCY_NAMES.DKK, symbol: CURRENCY_SYMBOLS.DKK },
      { code: 'NOK', name: CURRENCY_NAMES.NOK, symbol: CURRENCY_SYMBOLS.NOK },
      { code: 'PLN', name: CURRENCY_NAMES.PLN, symbol: CURRENCY_SYMBOLS.PLN },
      { code: 'CZK', name: CURRENCY_NAMES.CZK, symbol: CURRENCY_SYMBOLS.CZK },
      { code: 'HUF', name: CURRENCY_NAMES.HUF, symbol: CURRENCY_SYMBOLS.HUF },
      { code: 'RUB', name: CURRENCY_NAMES.RUB, symbol: CURRENCY_SYMBOLS.RUB },
      { code: 'TRY', name: CURRENCY_NAMES.TRY, symbol: CURRENCY_SYMBOLS.TRY },
    ],
    'Oceania': [
      { code: 'AUD', name: CURRENCY_NAMES.AUD, symbol: CURRENCY_SYMBOLS.AUD },
      { code: 'NZD', name: CURRENCY_NAMES.NZD, symbol: CURRENCY_SYMBOLS.NZD },
    ],
    'Middle East & Africa': [
      { code: 'ZAR', name: CURRENCY_NAMES.ZAR, symbol: CURRENCY_SYMBOLS.ZAR },
      { code: 'ILS', name: CURRENCY_NAMES.ILS, symbol: CURRENCY_SYMBOLS.ILS },
      { code: 'EGP', name: CURRENCY_NAMES.EGP, symbol: CURRENCY_SYMBOLS.EGP },
    ],
  };
};

/**
 * Get default currency from environment or browser locale
 */
export const getDefaultCurrency = (): string => {
  // Try to get from environment
  const envCurrency = import.meta.env.VITE_DEFAULT_CURRENCY;
  if (envCurrency && isValidCurrency(envCurrency)) {
    return envCurrency.toUpperCase();
  }

  // Try to detect from browser locale
  try {
    const locale = navigator.language;
    const currencyMap: Record<string, string> = {
      'en-US': 'USD',
      'en-GB': 'GBP',
      'en-AU': 'AUD',
      'en-CA': 'CAD',
      'en-IN': 'INR',
      'en-SG': 'SGD',
      'zh-CN': 'CNY',
      'zh-TW': 'TWD',
      'ja-JP': 'JPY',
      'ko-KR': 'KRW',
      'th-TH': 'THB',
      'vi-VN': 'VND',
      'id-ID': 'IDR',
      'ms-MY': 'MYR',
      'fil-PH': 'PHP',
    };

    const detectedCurrency = currencyMap[locale];
    if (detectedCurrency) {
      return detectedCurrency;
    }
  } catch (error) {
    // Ignore locale detection errors
  }

  // Default to INR
  return 'INR';
};
