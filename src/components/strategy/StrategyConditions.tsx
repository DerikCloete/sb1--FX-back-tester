import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Strategy, IndicatorConfig } from '../../lib/types/strategy';

interface StrategyConditionsProps {
  control: Control<Strategy>;
  indicators: IndicatorConfig[];
}

export default function StrategyConditions({ control, indicators }: StrategyConditionsProps) {
  const operators = [
    { value: 'CROSSES_ABOVE', label: 'Crosses Above' },
    { value: 'CROSSES_BELOW', label: 'Crosses Below' },
    { value: 'GREATER_THAN', label: 'Greater Than' },
    { value: 'LESS_THAN', label: 'Less Than' },
    { value: 'EQUALS', label: 'Equals' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Entry Conditions</h3>
        <Controller
          name="entryConditions"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="space-y-4">
              {field.value?.map((condition, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <select
                    value={condition.indicatorId}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = {
                        ...condition,
                        indicatorId: e.target.value,
                      };
                      field.onChange(newValue);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {indicators.map((indicator) => (
                      <option key={indicator.id} value={indicator.id}>
                        {indicator.type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = {
                        ...condition,
                        operator: e.target.value,
                      };
                      field.onChange(newValue);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={condition.value}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = {
                        ...condition,
                        value: parseFloat(e.target.value),
                      };
                      field.onChange(newValue);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Value"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  field.onChange([
                    ...field.value,
                    {
                      id: crypto.randomUUID(),
                      indicatorId: indicators[0]?.id || '',
                      operator: 'CROSSES_ABOVE',
                      value: 0,
                    },
                  ]);
                }}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Condition
              </button>
            </div>
          )}
        />
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-4">Exit Conditions</h3>
        <Controller
          name="exitConditions"
          control={control}
          defaultValue={[]}
          render={({ field }) => (
            <div className="space-y-4">
              {field.value?.map((condition, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <select
                    value={condition.indicatorId}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = {
                        ...condition,
                        indicatorId: e.target.value,
                      };
                      field.onChange(newValue);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {indicators.map((indicator) => (
                      <option key={indicator.id} value={indicator.id}>
                        {indicator.type}
                      </option>
                    ))}
                  </select>
                  <select
                    value={condition.operator}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = {
                        ...condition,
                        operator: e.target.value,
                      };
                      field.onChange(newValue);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {operators.map((op) => (
                      <option key={op.value} value={op.value}>
                        {op.label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={condition.value}
                    onChange={(e) => {
                      const newValue = [...field.value];
                      newValue[index] = {
                        ...condition,
                        value: parseFloat(e.target.value),
                      };
                      field.onChange(newValue);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Value"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  field.onChange([
                    ...field.value,
                    {
                      id: crypto.randomUUID(),
                      indicatorId: indicators[0]?.id || '',
                      operator: 'CROSSES_BELOW',
                      value: 0,
                    },
                  ]);
                }}
                className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
              >
                + Add Condition
              </button>
            </div>
          )}
        />
      </div>
    </div>
  );
}