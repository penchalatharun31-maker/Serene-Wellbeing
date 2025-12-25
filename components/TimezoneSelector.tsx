import React from 'react';
import { getTimezonesByRegion, formatTimezone } from '../utils/timezone';

interface TimezoneSelectorProps {
  value: string;
  onChange: (timezone: string) => void;
  label?: string;
  className?: string;
}

export const TimezoneSelector: React.FC<TimezoneSelectorProps> = ({
  value,
  onChange,
  label = 'Timezone',
  className = '',
}) => {
  const timezonesByRegion = getTimezonesByRegion();

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
      >
        {Object.entries(timezonesByRegion).map(([region, timezones]) => (
          <optgroup key={region} label={region}>
            {timezones.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label} ({tz.offset})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        {formatTimezone(value)}
      </p>
    </div>
  );
};

interface TimezoneDisplayProps {
  timezone: string;
  showOffset?: boolean;
  className?: string;
}

export const TimezoneDisplay: React.FC<TimezoneDisplayProps> = ({
  timezone,
  showOffset = true,
  className = '',
}) => {
  return (
    <span className={className}>
      {showOffset ? formatTimezone(timezone) : timezone}
    </span>
  );
};
