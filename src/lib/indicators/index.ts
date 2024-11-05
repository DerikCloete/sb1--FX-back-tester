import { Candle } from '../types/market';

export interface IndicatorParams {
  period?: number;
  multiplier?: number;
  deviation?: number;
  fastPeriod?: number;
  slowPeriod?: number;
  signalPeriod?: number;
}

export interface IndicatorResult {
  value: number | number[];
  signal?: number;
  upper?: number;
  lower?: number;
}

export const calculateEMA = (data: Candle[], period: number): number[] => {
  const k = 2 / (period + 1);
  const ema = new Array(data.length);
  let sum = 0;

  // Initialize SMA for first EMA value
  for (let i = 0; i < period; i++) {
    sum += data[i].close;
  }
  ema[period - 1] = sum / period;

  // Calculate EMA
  for (let i = period; i < data.length; i++) {
    ema[i] = data[i].close * k + ema[i - 1] * (1 - k);
  }

  return ema;
};

export const calculateRSI = (data: Candle[], period: number): number[] => {
  const rsi = new Array(data.length);
  let gains = 0;
  let losses = 0;

  // Calculate initial average gain and loss
  for (let i = 1; i <= period; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) gains += change;
    else losses -= change;
  }

  let avgGain = gains / period;
  let avgLoss = losses / period;
  rsi[period] = 100 - (100 / (1 + avgGain / avgLoss));

  // Calculate RSI
  for (let i = period + 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    let gain = 0;
    let loss = 0;

    if (change >= 0) gain = change;
    else loss = -change;

    avgGain = (avgGain * (period - 1) + gain) / period;
    avgLoss = (avgLoss * (period - 1) + loss) / period;

    rsi[i] = 100 - (100 / (1 + avgGain / avgLoss));
  }

  return rsi;
};

// Add other indicator calculations as needed...