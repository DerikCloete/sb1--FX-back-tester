import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { db } from '../../lib/db';
import { Timeframe, IndicatorType } from '../../lib/types/strategy';

interface TrendAnalysisProps {
  strategyId: number;
}

interface TrendSignal {
  timestamp: Date;
  direction: 'up' | 'down';
  openPrice: number;
  nextOpenPrice?: number;
  success: boolean;
  pnl: number;
}

interface IndicatorPerformance {
  timeframe: Timeframe;
  indicator: IndicatorType;
  signals: TrendSignal[];
  successRate: number;
  avgPnl: number;
  totalSignals: number;
}

export default function TrendAnalysis({ strategyId }: TrendAnalysisProps) {
  const { data: performance } = useQuery({
    queryKey: ['trendAnalysis', strategyId],
    queryFn: async () => {
      const strategy = await db.strategies.get(strategyId);
      const results = await db.backtestResults
        .where('strategyId')
        .equals(strategyId)
        .toArray();

      if (!strategy || !results.length) return null;

      // Group signals by timeframe and indicator
      const performanceByTimeframe: IndicatorPerformance[] = [];

      // Process each indicator's signals
      const processIndicator = (
        timeframe: Timeframe,
        indicator: IndicatorType,
        signals: TrendSignal[]
      ) => {
        const successfulSignals = signals.filter(s => s.success);
        const totalPnl = signals.reduce((sum, s) => sum + s.pnl, 0);

        return {
          timeframe,
          indicator,
          signals,
          successRate: (successfulSignals.length / signals.length) * 100,
          avgPnl: totalPnl / signals.length,
          totalSignals: signals.length
        };
      };

      // Process main indicator
      if (strategy.mainIndicator) {
        performanceByTimeframe.push(
          processIndicator(
            strategy.mainIndicator.timeframe,
            strategy.mainIndicator.type,
            results[0].trades.map(trade => ({
              timestamp: trade.entryDate,
              direction: trade.type === 'LONG' ? 'up' : 'down',
              openPrice: trade.entryPrice,
              nextOpenPrice: trade.exitPrice,
              success: trade.pnl > 0,
              pnl: trade.pnl
            }))
          )
        );
      }

      // Process confirmation indicators
      strategy.confirmationIndicators?.forEach(indicator => {
        performanceByTimeframe.push(
          processIndicator(
            indicator.timeframe,
            indicator.type,
            results[0].trades.map(trade => ({
              timestamp: trade.entryDate,
              direction: trade.type === 'LONG' ? 'up' : 'down',
              openPrice: trade.entryPrice,
              nextOpenPrice: trade.exitPrice,
              success: trade.pnl > 0,
              pnl: trade.pnl
            }))
          )
        );
      });

      return performanceByTimeframe;
    }
  });

  if (!performance) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Trend Indicator Analysis</h2>

      <div className="space-y-6">
        {performance.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium">{item.indicator}</h3>
                <p className="text-sm text-gray-600">Timeframe: {item.timeframe}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Success Rate: {item.successRate.toFixed(2)}%</p>
                <p className="text-sm text-gray-600">Avg. PnL: ${item.avgPnl.toFixed(2)}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Time</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Direction</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Open Price</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Next Open</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Result</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">PnL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {item.signals.slice(0, 5).map((signal, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-sm">
                        {format(signal.timestamp, 'MMM dd, HH:mm')}
                      </td>
                      <td className="px-4 py-2">
                        {signal.direction === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-red-600" />
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm">{signal.openPrice.toFixed(5)}</td>
                      <td className="px-4 py-2 text-sm">{signal.nextOpenPrice?.toFixed(5)}</td>
                      <td className="px-4 py-2">
                        <span className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full ${
                          signal.success
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {signal.success ? 'Success' : 'Failed'}
                        </span>
                      </td>
                      <td className={`px-4 py-2 text-sm ${
                        signal.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {signal.pnl >= 0 ? '+' : ''}{signal.pnl.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {item.signals.length > 5 && (
              <div className="mt-2 text-center">
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  Show More Signals
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}