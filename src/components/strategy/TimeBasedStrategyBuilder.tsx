import React, { useState } from 'react';
import { Plus, X, Check, Save } from 'lucide-react';
import { TIME_RANGES } from '../../constants/timeRanges';
import IndicatorSelector from './IndicatorSelector';
import { IndicatorType, Timeframe, IndicatorConfig } from '../../lib/types/strategy';

interface StrategyConfig {
  name: string;
  description: string;
  timeRange: string;
  selectedTimeframes: Timeframe[];
  indicators: string[];
  mainIndicator?: IndicatorConfig;
  confirmationIndicators: IndicatorConfig[];
}

const INDICATORS: IndicatorType[] = [
  'EMA', 'SMA', 'RSI', 'Stochastic', 'BollingerBands',
  'MACD', 'ATR', 'SuperTrend', 'ATRBands', 'HeikinAshi',
  'DonchianChannels'
];

const ALL_TIMEFRAMES: Timeframe[] = [
  'D1', 'H12', 'H8', 'H6', 'H4', 'H2', 'H1', 'M30', 'M15', 'M10', 'M5', 'M3'
];

export default function TimeBasedStrategyBuilder() {
  const [selectedRange, setSelectedRange] = useState<string>('');
  const [config, setConfig] = useState<StrategyConfig>({
    name: '',
    description: '',
    timeRange: '',
    selectedTimeframes: [],
    indicators: [],
    confirmationIndicators: []
  });

  const handleRangeSelect = (rangeId: string) => {
    setSelectedRange(rangeId);
    const range = TIME_RANGES.find(r => r.id === rangeId);
    if (range) {
      setConfig({
        ...config,
        timeRange: rangeId,
        indicators: range.recommendedIndicators,
        selectedTimeframes: range.recommendedTimeframes as Timeframe[]
      });
    }
  };

  const handleSave = () => {
    console.log('Saving strategy:', config);
  };

  const toggleTimeframe = (timeframe: Timeframe) => {
    setConfig(prev => ({
      ...prev,
      selectedTimeframes: prev.selectedTimeframes.includes(timeframe)
        ? prev.selectedTimeframes.filter(t => t !== timeframe)
        : [...prev.selectedTimeframes, timeframe]
    }));
  };

  const addConfirmationIndicator = () => {
    if (config.confirmationIndicators.length < 4) {
      setConfig({
        ...config,
        confirmationIndicators: [
          ...config.confirmationIndicators,
          {
            id: crypto.randomUUID(),
            type: 'EMA',
            timeframe: config.selectedTimeframes[0],
            parameters: { period: 14 },
            isMain: false
          }
        ]
      });
    }
  };

  const removeConfirmationIndicator = (id: string) => {
    setConfig({
      ...config,
      confirmationIndicators: config.confirmationIndicators.filter(ind => ind.id !== id)
    });
  };

  const updateMainIndicator = (indicator: IndicatorConfig) => {
    setConfig({
      ...config,
      mainIndicator: {
        ...indicator,
        timeframe: config.selectedTimeframes[0],
        isMain: true
      }
    });
  };

  const updateConfirmationIndicator = (index: number, indicator: IndicatorConfig) => {
    const newConfirmationIndicators = [...config.confirmationIndicators];
    newConfirmationIndicators[index] = {
      ...indicator,
      timeframe: config.selectedTimeframes[0],
      isMain: false
    };
    setConfig({
      ...config,
      confirmationIndicators: newConfirmationIndicators
    });
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Time-Based Strategy Builder</h1>
      
      {/* Strategy Details */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Strategy Details</h2>
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strategy Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => setConfig({ ...config, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="My Trading Strategy"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your strategy..."
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Time Range Selection */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Time Range</h2>
            <div className="space-y-2">
              {TIME_RANGES.map((range) => (
                <button
                  key={range.id}
                  onClick={() => handleRangeSelect(range.id)}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedRange === range.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {selectedRange && (
          <>
            {/* Multi-Timeframe Selection */}
            <div className="lg:col-span-9">
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Timeframes</h2>
                <p className="text-sm text-gray-600 mb-4">Choose multiple timeframes for your cascading strategy</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {ALL_TIMEFRAMES.map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => toggleTimeframe(timeframe)}
                      className={`flex items-center justify-between px-4 py-2 rounded-lg border ${
                        config.selectedTimeframes.includes(timeframe)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span>{timeframe}</span>
                      {config.selectedTimeframes.includes(timeframe) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Indicator Configuration */}
              <div className="space-y-6">
                {/* Main Indicator */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold mb-4">Main Indicator</h2>
                  <IndicatorSelector
                    value={config.mainIndicator}
                    onChange={updateMainIndicator}
                    indicators={INDICATORS}
                    isMain={true}
                    hideTimeframe={true}
                  />
                </div>

                {/* Confirmation Indicators */}
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Confirmation Indicators</h2>
                    <button
                      onClick={addConfirmationIndicator}
                      disabled={config.confirmationIndicators.length >= 4}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                      Add Indicator
                    </button>
                  </div>

                  <div className="space-y-4">
                    {config.confirmationIndicators.map((indicator, index) => (
                      <div key={indicator.id} className="relative border border-gray-200 rounded-lg p-4">
                        <button
                          onClick={() => removeConfirmationIndicator(indicator.id)}
                          className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <IndicatorSelector
                          value={indicator}
                          onChange={(value) => updateConfirmationIndicator(index, value)}
                          indicators={INDICATORS}
                          isMain={false}
                          hideTimeframe={true}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4" />
                    Save Strategy
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}