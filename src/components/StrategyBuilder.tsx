import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/Tabs';
import ClassicStrategyBuilder from './strategy/ClassicStrategyBuilder';
import TimeBasedStrategyBuilder from './strategy/TimeBasedStrategyBuilder';

export default function StrategyBuilder() {
  const [activeTab, setActiveTab] = useState('classic');

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Strategy Builder</h1>
        <p className="text-gray-600">Create and configure your trading strategy</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="classic">Classic Strategy Builder</TabsTrigger>
          <TabsTrigger value="time-based">Time-based Strategy Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="classic">
          <ClassicStrategyBuilder />
        </TabsContent>

        <TabsContent value="time-based">
          <TimeBasedStrategyBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}