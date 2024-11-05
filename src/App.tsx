import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Activity, BarChart3, Settings, Upload, Clock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import DataImport from './components/DataImport';
import ClassicStrategyBuilder from './components/strategy/ClassicStrategyBuilder';
import TimeBasedStrategyBuilder from './components/strategy/TimeBasedStrategyBuilder';
import Analysis from './components/Analysis';
import Sidebar from './components/Sidebar';

const queryClient = new QueryClient();

function App() {
  const menuItems = [
    { icon: <Activity className="w-6 h-6" />, label: 'Dashboard', path: '/' },
    { icon: <Upload className="w-6 h-6" />, label: 'Data Import', path: '/import' },
    { icon: <Settings className="w-6 h-6" />, label: 'Classic Strategy', path: '/classic-strategy' },
    { icon: <Clock className="w-6 h-6" />, label: 'Time-based Strategy', path: '/time-strategy' },
    { icon: <BarChart3 className="w-6 h-6" />, label: 'Analysis', path: '/analysis' },
  ];

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50">
          <Sidebar menuItems={menuItems} />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/import" element={<DataImport />} />
              <Route path="/classic-strategy" element={<ClassicStrategyBuilder />} />
              <Route path="/time-strategy" element={<TimeBasedStrategyBuilder />} />
              <Route path="/analysis" element={<Analysis />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;