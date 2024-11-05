import React from 'react';
import { IndicatorType, Timeframe } from '../../lib/types/strategy';

interface IndicatorSelectorProps {
  value: any;
  onChange: (value: any) => void;
  indicators: IndicatorType[];
  timeframes?: Timeframe[];
  isMain: boolean;
  hideTimeframe?: boolean;
}

export default function IndicatorSelector({
  value,
  onChange,
  indicators,
  timeframes = [],
  isMain,
  hideTimeframe = false
}: IndicatorSelectorProps) {
  const getDefaultParams = (type: IndicatorType) => {
    switch (type) {
      case 'EMA':
      case 'SMA':
        return { period: 14 };
      case 'RSI':
        return { period: 14 };
      case 'Stochastic':
        return { period: 14, smoothK: 3, smoothD: 3 };
      case 'BollingerBands':
        return { period: 20, deviation: 2 };
      case 'MACD':
        return { fastPeriod: 12, slowPeriod: 26, signalPeriod: 9 };
      case 'ATR':
        return { period: 14 };
      case 'SuperTrend':
        return { period: 10, multiplier: 3 };
      case 'ATRBands':
        return { period: 14, multiplier: 2 };
      case 'DonchianChannels':
        return { period: 20 };
      default:
        return {};
    }
  };

  const handleTypeChange = (type: IndicatorType) => {
    onChange({
      ...value,
      type,
      parameters: getDefaultParams(type)
    });
  };

  return (
    <div className="space-y-4">
      <div className={`grid ${hideTimeframe ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Indicator Type
          </label>
          <select
            value={value?.type}
            onChange={(e) => handleTypeChange(e.target.value as IndicatorType)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {indicators.map((indicator) => (
              <option key={indicator} value={indicator}>
                {indicator}
              </option>
            ))}
          </select>
        </div>

        {!hideTimeframe && timeframes.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeframe
            </label>
            <select
              value={value?.timeframe}
              onChange={(e) => onChange({ ...value, timeframe: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {timeframes.map((timeframe) => (
                <option key={timeframe} value={timeframe}>
                  {timeframe}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(value?.parameters || {}).map(([param, defaultValue]) => (
          <div key={param}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {param.charAt(0).toUpperCase() + param.slice(1)}
            </label>
            <input
              type="number"
              value={defaultValue}
              onChange={(e) => onChange({
                ...value,
                parameters: {
                  ...value.parameters,
                  [param]: parseFloat(e.target.value)
                }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}