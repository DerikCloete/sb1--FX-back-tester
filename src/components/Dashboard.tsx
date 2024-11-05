import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, ArrowUpRight, ArrowDownRight, Timer } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

function StatCard({ icon, title, value, trend, change }: StatCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        {trend && change && (
          <span className={`flex items-center ${getTrendColor()}`}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'} {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-600 text-sm">{title}</h3>
      <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
    </div>
  );
}

interface ActionButtonProps {
  label: string;
  description: string;
  onClick: () => void;
}

function ActionButton({ label, description, onClick }: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
    >
      <span className="text-lg font-semibold text-gray-900">{label}</span>
      <span className="text-sm text-gray-600 mt-1">{description}</span>
    </button>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Trading Dashboard</h1>
        <p className="text-gray-600">Monitor your strategy performance and market analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<LineChart className="w-6 h-6 text-green-600" />}
          title="Win Rate"
          value="65.4%"
          trend="up"
          change="2.1%"
        />
        <StatCard
          icon={<ArrowUpRight className="w-6 h-6 text-blue-600" />}
          title="Profit Factor"
          value="1.85"
          trend="up"
          change="0.12"
        />
        <StatCard
          icon={<ArrowDownRight className="w-6 h-6 text-red-600" />}
          title="Max Drawdown"
          value="12.3%"
          trend="down"
          change="1.5%"
        />
        <StatCard
          icon={<Timer className="w-6 h-6 text-purple-600" />}
          title="Avg Trade Time"
          value="4h 23m"
          trend="neutral"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            label="Import Data"
            description="Upload historical forex data"
            onClick={() => navigate('/import')}
          />
          <ActionButton
            label="Classic Strategy"
            description="Build a standard trading strategy"
            onClick={() => navigate('/classic-strategy')}
          />
          <ActionButton
            label="Time-based Strategy"
            description="Create a time-optimized strategy"
            onClick={() => navigate('/time-strategy')}
          />
        </div>
      </div>
    </div>
  );
}