import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData
} from 'chart.js';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, TrendingUp, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';
import { db } from '../lib/db';
import TrendAnalysis from './analysis/TrendAnalysis';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

function StatCard({ title, value, icon, trend, change }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        {trend && change && (
          <span className={`flex items-center ${
            trend === 'up' ? 'text-green-600' : 
            trend === 'down' ? 'text-red-600' : 
            'text-gray-600'
          }`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

export default function Analysis() {
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);

  const { data: strategies } = useQuery({
    queryKey: ['strategies'],
    queryFn: () => db.strategies.toArray()
  });

  const { data: backtestResults } = useQuery({
    queryKey: ['backtestResults', selectedStrategy],
    queryFn: () => selectedStrategy 
      ? db.backtestResults.where('strategyId').equals(selectedStrategy).toArray()
      : Promise.resolve([]),
    enabled: !!selectedStrategy
  });

  const chartData: ChartData<'line'> = {
    labels: backtestResults?.map(result => 
      format(result.created, 'MMM dd, yyyy')
    ) || [],
    datasets: [
      {
        label: 'Equity Curve',
        data: backtestResults?.map(result => 
          result.metrics.expectancy
        ) || [],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Strategy Performance Over Time'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Strategy Analysis</h1>
        <p className="text-gray-600">Analyze and compare your trading strategies</p>
      </div>

      {/* Strategy Selector */}
      <div className="mb-8">
        <select
          value={selectedStrategy || ''}
          onChange={(e) => setSelectedStrategy(Number(e.target.value) || null)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Strategy</option>
          {strategies?.map((strategy) => (
            <option key={strategy.id} value={strategy.id}>
              {strategy.name}
            </option>
          ))}
        </select>
      </div>

      {selectedStrategy && backtestResults && backtestResults.length > 0 && (
        <>
          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Win Rate"
              value={`${backtestResults[0].metrics.winRate.toFixed(2)}%`}
              icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
              trend="up"
              change="+2.5%"
            />
            <StatCard
              title="Profit Factor"
              value={backtestResults[0].metrics.profitFactor.toFixed(2)}
              icon={<ArrowUpRight className="w-6 h-6 text-green-600" />}
              trend="up"
              change="+0.3"
            />
            <StatCard
              title="Max Drawdown"
              value={`${backtestResults[0].metrics.maxDrawdown.toFixed(2)}%`}
              icon={<ArrowDownRight className="w-6 h-6 text-red-600" />}
              trend="down"
              change="-1.2%"
            />
            <StatCard
              title="Total Trades"
              value={backtestResults[0].metrics.totalTrades}
              icon={<BarChart3 className="w-6 h-6 text-purple-600" />}
            />
          </div>

          {/* Performance Chart */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <Line data={chartData} options={chartOptions} />
          </div>

          {/* Trend Analysis */}
          <div className="mb-8">
            <TrendAnalysis strategyId={selectedStrategy} />
          </div>

          {/* Trade List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Recent Trades</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exit</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {backtestResults[0].trades.map((trade, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {format(trade.entryDate, 'MMM dd, yyyy HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trade.type === 'LONG' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {trade.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{trade.entryPrice.toFixed(5)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{trade.exitPrice.toFixed(5)}</td>
                      <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                        trade.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {(!selectedStrategy || !backtestResults || backtestResults.length === 0) && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {!selectedStrategy 
              ? 'Select a strategy to view analysis'
              : 'No backtest results available for this strategy'}
          </p>
        </div>
      )}
    </div>
  );
}