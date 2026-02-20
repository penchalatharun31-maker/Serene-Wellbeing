import React from 'react';
import { getCurrenciesByRegion, formatCurrency } from '../utils/currency';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  label?: string;
  className?: string;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onChange,
  label = 'Currency',
  className = '',
}) => {
  const currenciesByRegion = getCurrenciesByRegion();

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
        {Object.entries(currenciesByRegion).map(([region, currencies]) => (
          <optgroup key={region} label={region}>
            {currencies.map((currency) => (
              <option key={currency.code} value={currency.code}>
                {currency.symbol} {currency.code} - {currency.name}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
      <p className="mt-1 text-xs text-gray-500">
        Selected: {formatCurrency(100, value)}
      </p>
    </div>
  );
};

interface CurrencyDisplayProps {
  amount: number;
  currency: string;
  className?: string;
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency,
  className = '',
}) => {
  return (
    <span className={className}>
      {formatCurrency(amount, currency)}
    </span>
  );
};
