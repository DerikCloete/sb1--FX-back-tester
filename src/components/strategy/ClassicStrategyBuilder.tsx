import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Plus, X, Save } from 'lucide-react';
import { Strategy, IndicatorType, Timeframe, IndicatorConfig } from '../../lib/types/strategy';
import IndicatorSelector from './IndicatorSelector';
import StrategyConditions from './StrategyConditions';
import PerformanceMetrics from './PerformanceMetrics';

const TIMEFRAMES: Timeframe[] = ['D1', 'H12', 'H8', 'H6', 'H4', 'H2', 'H1', 'M30', 'M15', 'M10', 'M5', 'M3'];

const INDICATORS: IndicatorType[] = [
  'EMA', 'SMA', 'RSI', 'Stochastic', 'BollingerBands',
  'MACD', 'ATR', 'SuperTrend', 'ATRBands', 'HeikinAshi',
  'DonchianChannels'
];

export default function ClassicStrategyBuilder() {
  const [strategyId, setStrategyId] = useState<number | undefined>();
  const [confirmationIndicators, setConfirmationIndicators] = useState<IndicatorConfig[]>([]);
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<Strategy>();

  const mainIndicator = watch('mainIndicator');

  const addConfirmationIndicator = () => {
    if (confirmationIndicators.length < 4) {
      setConfirmationIndicators([
        ...confirmationIndicators,
        {
          id: crypto.randomUUID(),
          type: 'EMA',
          timeframe: 'H4',
          parameters: {},
          isMain: false
        }
      ]);
    }
  };

  const removeConfirmationIndicator = (id: string) => {
    setConfirmationIndicators(confirmationIndicators.filter(ind => ind.id !== id));
  };

  const onSubmit = async (data: Strategy) => {
    console.log(data);
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Left Column - Strategy Configuration */}
      <div className="col-span-12 lg:col-span-8 space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Strategy Details</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Strategy Name
              </label>
              <input
                {...register('name', { required: 'Strategy name is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="My Trading Strategy"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                {...register('description')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe your strategy..."
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Main Indicator</h2>
          <Controller
            name="mainIndicator"
            control={control}
            rules={{ required: 'Main indicator is required' }}
            render={({ field }) => (
              <IndicatorSelector
                value={field.value}
                onChange={field.onChange}
                indicators={INDICATORS}
                timeframes={TIMEFRAMES}
                isMain={true}
              />
            )}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Confirmation Indicators</h2>
            <button
              type="button"
              onClick={addConfirmationIndicator}
              disabled={confirmationIndicators.length >= 4}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-50"
            >
              <Plus className="w-4 h-4" />
              Add Indicator
            </button>
          </div>

          <div className="space-y-4">
            {confirmationIndicators.map((indicator, index) => (
              <div key={indicator.id} className="relative border border-gray-200 rounded-lg p-4">
                <button
                  type="button"
                  onClick={() => removeConfirmationIndicator(indicator.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <Controller
                  name={`confirmationIndicators.${index}`}
                  control={control}
                  render={({ field }) => (
                    <IndicatorSelector
                      value={field.value}
                      onChange={field.onChange}
                      indicators={INDICATORS}
                      timeframes={TIMEFRAMES}
                      isMain={false}
                    />
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Entry & Exit Conditions</h2>
          <StrategyConditions
            control={control}
            indicators={mainIndicator ? [...confirmationIndicators, mainIndicator] : confirmationIndicators}
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Save className="w-4 h-4" />
            Save Strategy
          </button>
        </div>
      </div>

      {/* Right Column - Performance Metrics */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="sticky top-6">
          <PerformanceMetrics strategyId={strategyId} />
        </div>
      </div>
    </div>
  );
}