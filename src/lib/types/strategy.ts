export type Timeframe = 'D1' | 'H12' | 'H8' | 'H6' | 'H4' | 'H2' | 'H1' | 'M30' | 'M15' | 'M10' | 'M5' | 'M3';

export type IndicatorType =
  | 'EMA'
  | 'SMA'
  | 'RSI'
  | 'Stochastic'
  | 'BollingerBands'
  | 'MACD'
  | 'ATR'
  | 'SuperTrend'
  | 'ATRBands'
  | 'HeikinAshi'
  | 'DonchianChannels';

export interface IndicatorConfig {
  id: string;
  type: IndicatorType;
  timeframe: Timeframe;
  parameters: Record<string, number>;
  isMain: boolean;
}

export interface Strategy {
  id?: number;
  name: string;
  description: string;
  mainIndicator: IndicatorConfig;
  confirmationIndicators: IndicatorConfig[];
  entryConditions: StrategyCondition[];
  exitConditions: StrategyCondition[];
  created: Date;
  updated: Date;
  performance?: StrategyPerformance;
}

export interface StrategyCondition {
  id: string;
  indicatorId: string;
  operator: 'CROSSES_ABOVE' | 'CROSSES_BELOW' | 'GREATER_THAN' | 'LESS_THAN' | 'EQUALS';
  value: number | string;
  compareIndicatorId?: string;
}

export interface StrategyPerformance {
  winRate: number;
  profitFactor: number;
  sharpeRatio: number;
  maxDrawdown: number;
  totalTrades: number;
  averageWin: number;
  averageLoss: number;
  expectancy: number;
  lastOptimized?: Date;
  bestParameters?: Record<string, number>;
}