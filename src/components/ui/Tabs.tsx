import React from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface TabsListProps {
  children: React.ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function Tabs({ value, onValueChange, children }: TabsProps) {
  return (
    <div className="w-full">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div className={`flex space-x-2 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: TabsTriggerProps & { value: string }) {
  return (
    <button
      onClick={() => {
        const tabs = document.querySelector('[role="tablist"]');
        tabs?.dispatchEvent(new CustomEvent('tabChange', { detail: value }));
      }}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
        value === (document.querySelector('[role="tablist"]')?.getAttribute('data-value') || '')
          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: TabsContentProps) {
  const isActive = value === (document.querySelector('[role="tablist"]')?.getAttribute('data-value') || '');
  
  if (!isActive) return null;
  
  return <div className="mt-4">{children}</div>;
}