/**
 * Timezone Utility Functions
 * Frontend timezone detection and formatting
 */

// Common timezones (matching backend)
export const VALID_TIMEZONES = [
  // UTC
  'UTC',

  // Asia
  'Asia/Kolkata',
  'Asia/Dubai',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Asia/Hong_Kong',
  'Asia/Shanghai',
  'Asia/Bangkok',
  'Asia/Jakarta',
  'Asia/Manila',
  'Asia/Seoul',
  'Asia/Kuala_Lumpur',
  'Asia/Karachi',
  'Asia/Dhaka',
  'Asia/Riyadh',
  'Asia/Tehran',

  // Americas
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Toronto',
  'America/Vancouver',
  'America/Mexico_City',
  'America/Sao_Paulo',
  'America/Buenos_Aires',
  'America/Lima',
  'America/Bogota',
  'America/Santiago',

  // Europe
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Europe/Rome',
  'Europe/Madrid',
  'Europe/Amsterdam',
  'Europe/Brussels',
  'Europe/Vienna',
  'Europe/Stockholm',
  'Europe/Copenhagen',
  'Europe/Oslo',
  'Europe/Helsinki',
  'Europe/Warsaw',
  'Europe/Prague',
  'Europe/Budapest',
  'Europe/Athens',
  'Europe/Istanbul',
  'Europe/Moscow',

  // Oceania
  'Australia/Sydney',
  'Australia/Melbourne',
  'Australia/Brisbane',
  'Australia/Perth',
  'Pacific/Auckland',
  'Pacific/Fiji',

  // Africa
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'Africa/Nairobi',
  'Africa/Casablanca',
  'Africa/Algiers',
];

// Timezone display names
export const TIMEZONE_NAMES: Record<string, string> = {
  'UTC': 'Coordinated Universal Time',
  'Asia/Kolkata': 'India Standard Time',
  'Asia/Dubai': 'Gulf Standard Time',
  'Asia/Singapore': 'Singapore Time',
  'Asia/Tokyo': 'Japan Standard Time',
  'Asia/Hong_Kong': 'Hong Kong Time',
  'Asia/Shanghai': 'China Standard Time',
  'Asia/Bangkok': 'Indochina Time',
  'Asia/Jakarta': 'Western Indonesian Time',
  'Asia/Manila': 'Philippine Time',
  'Asia/Seoul': 'Korea Standard Time',
  'Asia/Kuala_Lumpur': 'Malaysia Time',
  'Asia/Karachi': 'Pakistan Standard Time',
  'Asia/Dhaka': 'Bangladesh Standard Time',
  'Asia/Riyadh': 'Arabia Standard Time',
  'Asia/Tehran': 'Iran Standard Time',
  'America/New_York': 'Eastern Time',
  'America/Chicago': 'Central Time',
  'America/Denver': 'Mountain Time',
  'America/Los_Angeles': 'Pacific Time',
  'America/Toronto': 'Eastern Time (Canada)',
  'America/Vancouver': 'Pacific Time (Canada)',
  'America/Mexico_City': 'Central Time (Mexico)',
  'America/Sao_Paulo': 'Brasilia Time',
  'America/Buenos_Aires': 'Argentina Time',
  'America/Lima': 'Peru Time',
  'America/Bogota': 'Colombia Time',
  'America/Santiago': 'Chile Time',
  'Europe/London': 'Greenwich Mean Time',
  'Europe/Paris': 'Central European Time',
  'Europe/Berlin': 'Central European Time',
  'Europe/Rome': 'Central European Time',
  'Europe/Madrid': 'Central European Time',
  'Europe/Amsterdam': 'Central European Time',
  'Europe/Brussels': 'Central European Time',
  'Europe/Vienna': 'Central European Time',
  'Europe/Stockholm': 'Central European Time',
  'Europe/Copenhagen': 'Central European Time',
  'Europe/Oslo': 'Central European Time',
  'Europe/Helsinki': 'Eastern European Time',
  'Europe/Warsaw': 'Central European Time',
  'Europe/Prague': 'Central European Time',
  'Europe/Budapest': 'Central European Time',
  'Europe/Athens': 'Eastern European Time',
  'Europe/Istanbul': 'Turkey Time',
  'Europe/Moscow': 'Moscow Standard Time',
  'Australia/Sydney': 'Australian Eastern Time',
  'Australia/Melbourne': 'Australian Eastern Time',
  'Australia/Brisbane': 'Australian Eastern Time',
  'Australia/Perth': 'Australian Western Time',
  'Pacific/Auckland': 'New Zealand Time',
  'Pacific/Fiji': 'Fiji Time',
  'Africa/Cairo': 'Eastern European Time',
  'Africa/Johannesburg': 'South Africa Standard Time',
  'Africa/Lagos': 'West Africa Time',
  'Africa/Nairobi': 'East Africa Time',
  'Africa/Casablanca': 'Western European Time',
  'Africa/Algiers': 'Central European Time',
};

/**
 * Validate timezone string
 */
export const isValidTimezone = (timezone: string): boolean => {
  if (!timezone) return false;

  // Check if it's in our valid list
  if (VALID_TIMEZONES.includes(timezone)) {
    return true;
  }

  // Also allow UTC offsets like UTC+05:30
  const utcOffsetPattern = /^UTC[+-]([0-9]{1,2}):?([0-9]{2})?$/;
  if (utcOffsetPattern.test(timezone)) {
    return true;
  }

  // Try to validate using Intl if available
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Get timezone offset in minutes
 */
export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
    const utcDate = new Date(now.toLocaleString('en-US', { timeZone: 'UTC' }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60);
  } catch (error) {
    return 0;
  }
};

/**
 * Format timezone with offset
 */
export const formatTimezone = (timezone: string): string => {
  const offset = getTimezoneOffset(timezone);
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';

  const offsetStr = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

  const name = TIMEZONE_NAMES[timezone];
  return name ? `${name} (${offsetStr})` : `${timezone} (${offsetStr})`;
};

/**
 * Get timezones grouped by region
 */
export const getTimezonesByRegion = (): Record<string, Array<{ value: string; label: string; offset: string }>> => {
  const regions = {
    'Asia': VALID_TIMEZONES.filter(tz => tz.startsWith('Asia/')),
    'Americas': VALID_TIMEZONES.filter(tz => tz.startsWith('America/')),
    'Europe': VALID_TIMEZONES.filter(tz => tz.startsWith('Europe/')),
    'Australia & Pacific': VALID_TIMEZONES.filter(tz => tz.startsWith('Australia/') || tz.startsWith('Pacific/')),
    'Africa': VALID_TIMEZONES.filter(tz => tz.startsWith('Africa/')),
    'UTC': ['UTC'],
  };

  const result: Record<string, Array<{ value: string; label: string; offset: string }>> = {};

  Object.entries(regions).forEach(([region, timezones]) => {
    result[region] = timezones.map(tz => {
      const offset = getTimezoneOffset(tz);
      const hours = Math.floor(Math.abs(offset) / 60);
      const minutes = Math.abs(offset) % 60;
      const sign = offset >= 0 ? '+' : '-';
      const offsetStr = `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

      return {
        value: tz,
        label: TIMEZONE_NAMES[tz] || tz,
        offset: offsetStr,
      };
    });
  });

  return result;
};

/**
 * Get user's browser timezone
 */
export const getBrowserTimezone = (): string => {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (isValidTimezone(timezone)) {
      return timezone;
    }
  } catch (error) {
    // Ignore timezone detection errors
  }

  // Default to UTC
  return 'UTC';
};

/**
 * Get default timezone from environment or browser
 */
export const getDefaultTimezone = (): string => {
  // Try to get from environment
  const envTimezone = import.meta.env.VITE_DEFAULT_TIMEZONE;
  if (envTimezone && isValidTimezone(envTimezone)) {
    return envTimezone;
  }

  // Use browser timezone
  return getBrowserTimezone();
};

/**
 * Format date in specific timezone
 */
export const formatDateInTimezone = (
  date: Date | string,
  timezone: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
    ...options,
  };

  return dateObj.toLocaleString('en-US', defaultOptions);
};

/**
 * Convert time from one timezone to another
 */
export const convertTimezone = (
  date: Date | string,
  fromTimezone: string,
  toTimezone: string
): Date => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Convert to UTC first
  const utcDate = new Date(
    dateObj.toLocaleString('en-US', { timeZone: 'UTC' })
  );

  // Then convert to target timezone
  return new Date(
    utcDate.toLocaleString('en-US', { timeZone: toTimezone })
  );
};
