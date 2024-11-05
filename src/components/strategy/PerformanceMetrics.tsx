import React from 'react';
import { LineChart, BarChart3, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../../lib/db';

interface PerformanceMetricsProps {
  strategyId?: number;
}

export default function PerformanceMetrics({ strategyId }: PerformanceMetricsProps) {
  const { data: performance } = useQuery({
    queryKey: ['strategyPerformance', strategyId],
    queryFn: async () => {
      if (!strategyId) return null;
      const strategy = await db.strategies.get(strategyId);
      return strategy?.performance;
    },
    enabled: !!strategyId
  });

  if (!performance) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Strategy Performance</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <LineChart className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Profitability</h3>
          </div>
          <div className="space-y-2">
            <Metric label="Win Rate" value={`${performance.winRate.toFixed(2)}%`} />
            <Metric label="Profit Factor" value={performance.profitFactor.toFixed(2)} />
            <Metric label="Expectancy" value={`$${performance.expectancy.toFixed(2)}`} />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-green-600" />
            <h3 className="font-medium text-green-900">Risk Metrics</h3>
          </div>
          <div className="space-y-2">
            <Metric label="Sharpe Ratio" value={performance.sharpeRatio.toFixed(2)} />
            <Metric label="Max Drawdown" value={`${performance.maxDrawdown.toFixed(2)}%`} />
            <Metric label="Total Trades" value={performance.totalTrades} />
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h3 className="font-medium text-purple-900">Trade Analysis</h3>
          </div>
          <div className="space-y-2">
            <Metric label="Avg Win" value={`$${performance.averageWin.toFixed(2)}`} />
            <Metric label="Avg Loss" value={`$${performance.averageLoss.toFixed(2)}`} />
            <Metric
              label="Last Optimized"
              value={performance.lastOptimized
                ? new Date(performance.lastOptimized).toLocaleDateString()
                : 'Never'}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}