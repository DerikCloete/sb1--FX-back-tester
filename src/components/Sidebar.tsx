import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Coins } from 'lucide-react';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
}

export default function Sidebar({ menuItems }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="flex items-center gap-2 p-6 border-b border-gray-200">
        <Coins className="w-8 h-8 text-blue-600" />
        <span className="text-xl font-bold text-gray-800">ForexTester</span>
      </div>
      <nav className="p-4">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center w-full gap-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}