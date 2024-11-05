export interface TimeRange {
  id: string;
  label: string;
  minDays: number;
  maxDays: number;
  recommendedTimeframes: string[];
  recommendedIndicators: string[];
}

export const TIME_RANGES: TimeRange[] = [
  {
    id: 'long_term',
    label: 'More than 20 days',
    minDays: 20,
    maxDays: Infinity,
    recommendedTimeframes: ['D1', 'H12', 'H8'],
    recommendedIndicators: ['EMA', 'SMA', 'SuperTrend', 'ATR Bands']
  },
  {
    id: 'medium_term_1',
    label: '10-20 days',
    minDays: 10,
    maxDays: 20,
    recommendedTimeframes: ['H12', 'H8', 'H6', 'H4'],
    recommendedIndicators: ['MACD', 'RSI', 'Bollinger Bands']
  },
  {
    id: 'medium_term_2',
    label: '7-10 days',
    minDays: 7,
    maxDays: 10,
    recommendedTimeframes: ['H8', 'H6', 'H4', 'H2'],
    recommendedIndicators: ['Stochastic', 'RSI', 'ATR']
  },
  {
    id: 'short_term_1',
    label: '5-7 days',
    minDays: 5,
    maxDays: 7,
    recommendedTimeframes: ['H6', 'H4', 'H2', 'H1'],
    recommendedIndicators: ['EMA', 'Bollinger Bands', 'RSI']
  },
  {
    id: 'short_term_2',
    label: '3-5 days',
    minDays: 3,
    maxDays: 5,
    recommendedTimeframes: ['H4', 'H2', 'H1', 'M30'],
    recommendedIndicators: ['MACD', 'Stochastic', 'ATR']
  },
  {
    id: 'very_short_1',
    label: '2-3 days',
    minDays: 2,
    maxDays: 3,
    recommendedTimeframes: ['H2', 'H1', 'M30', 'M15'],
    recommendedIndicators: ['RSI', 'EMA', 'Donchian Channels']
  },
  {
    id: 'very_short_2',
    label: '1-2 days',
    minDays: 1,
    maxDays: 2,
    recommendedTimeframes: ['H1', 'M30', 'M15', 'M10'],
    recommendedIndicators: ['Heikin-Ashi', 'ATR', 'SuperTrend']
  },
  {
    id: 'intraday_1',
    label: '12-24 hours',
    minDays: 0.5,
    maxDays: 1,
    recommendedTimeframes: ['M30', 'M15', 'M10', 'M5'],
    recommendedIndicators: ['RSI', 'Bollinger Bands', 'MACD']
  },
  {
    id: 'intraday_2',
    label: '8-12 hours',
    minDays: 0.33,
    maxDays: 0.5,
    recommendedTimeframes: ['M15', 'M10', 'M5', 'M3'],
    recommendedIndicators: ['EMA', 'Stochastic', 'ATR']
  },
  {
    id: 'intraday_3',
    label: '4-8 hours',
    minDays: 0.17,
    maxDays: 0.33,
    recommendedTimeframes: ['M10', 'M5', 'M3'],
    recommendedIndicators: ['RSI', 'MACD', 'Bollinger Bands']
  },
  {
    id: 'intraday_4',
    label: '1-4 hours',
    minDays: 0.04,
    maxDays: 0.17,
    recommendedTimeframes: ['M5', 'M3'],
    recommendedIndicators: ['EMA', 'RSI', 'ATR']
  }
];