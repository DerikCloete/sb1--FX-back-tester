import Dexie, { Table } from 'dexie';

interface MarketData {
  id?: number;
  timestamp: number;
  symbol: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Strategy {
  id?: number;
  name: string;
  description: string;
  indicators: IndicatorConfig[];
  parameters: Record<string, any>;
  created: Date;
  updated: Date;
}

interface BacktestResult {
  id?: number;
  strategyId: number;
  startDate: Date;
  endDate: Date;
  trades: Trade[];
  metrics: BacktestMetrics;
  created: Date;
}

interface Trade {
  id?: number;
  backtestId: number;
  entryDate: Date;
  exitDate: Date;
  symbol: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  exitPrice: number;
  quantity: number;
  pnl: number;
  pnlPercent: number;
}

interface BacktestMetrics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
}

interface IndicatorConfig {
  type: string;
  parameters: Record<string, any>;
}

export class ForexDatabase extends Dexie {
  marketData!: Table<MarketData>;
  strategies!: Table<Strategy>;
  backtestResults!: Table<BacktestResult>;
  trades!: Table<Trade>;

  constructor() {
    super('ForexDatabase');
    this.version(1).stores({
      marketData: '++id, symbol, timestamp',
      strategies: '++id, name, created, updated',
      backtestResults: '++id, strategyId, created',
      trades: '++id, backtestId, entryDate',
    });
  }
}

export const db = new ForexDatabase();