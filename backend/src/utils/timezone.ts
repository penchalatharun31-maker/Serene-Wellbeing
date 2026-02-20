/**
 * Timezone Utility Functions
 * Timezone validation and conversion
 */

// Common timezones (subset - full list would be too long)
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
  return `${timezone} (${offsetStr})`;
};

/**
 * Get common timezones grouped by region
 */
export const getTimezonesByRegion = (): Record<string, string[]> => {
  return {
    'Asia': VALID_TIMEZONES.filter(tz => tz.startsWith('Asia/')),
    'Americas': VALID_TIMEZONES.filter(tz => tz.startsWith('America/')),
    'Europe': VALID_TIMEZONES.filter(tz => tz.startsWith('Europe/')),
    'Australia & Pacific': VALID_TIMEZONES.filter(tz => tz.startsWith('Australia/') || tz.startsWith('Pacific/')),
    'Africa': VALID_TIMEZONES.filter(tz => tz.startsWith('Africa/')),
    'UTC': ['UTC'],
  };
};
