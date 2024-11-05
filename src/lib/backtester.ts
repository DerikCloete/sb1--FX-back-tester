import { db } from './db';
import Decimal from 'decimal.js';

export interface BacktestConfig {
  strategyId: number;
  symbol: string;
  startDate: Date;
  endDate: Date;
  initialBalance: number;
  positionSize: number;
}

export interface BacktestResult {
  trades: Trade[];
  metrics: BacktestMetrics;
}

export async function runBacktest(config: BacktestConfig): Promise<BacktestResult> {
  // Fetch market data for the specified period
  const marketData = await db.marketData
    .where('timestamp')
    .between(config.startDate.getTime(), config.endDate.getTime())
    .toArray();

  if (marketData.length === 0) {
    throw new Error('No market data available for the specified period');
  }

  // Fetch strategy configuration
  const strategy = await db.strategies.get(config.strategyId);
  if (!strategy) {
    throw new Error('Strategy not found');
  }

  const trades: Trade[] = [];
  let balance = new Decimal(config.initialBalance);
  let maxBalance = balance;
  let drawdown = new Decimal(0);
  
  // Run the backtest
  for (let i = 0; i < marketData.length; i++) {
    const candle = marketData[i];
    const position = calculatePosition(candle, strategy, marketData.slice(0, i + 1));
    
    if (position) {
      const trade = executeTrade(position, candle, config.positionSize, balance);
      if (trade) {
        trades.push(trade);
        balance = balance.plus(trade.pnl);
        maxBalance = Decimal.max(maxBalance, balance);
        drawdown = Decimal.max(drawdown, maxBalance.minus(balance).div(maxBalance).mul(100));
      }
    }
  }

  // Calculate metrics
  const metrics = calculateMetrics(trades, config.initialBalance, drawdown.toNumber());

  return {
    trades,
    metrics,
  };
}

function calculatePosition(
  currentCandle: any,
  strategy: any,
  historicalData: any[]
): 'LONG' | 'SHORT' | null {
  // Implement strategy logic here
  // This is a placeholder for the actual strategy implementation
  return null;
}

function executeTrade(
  position: 'LONG' | 'SHORT',
  candle: any,
  positionSize: number,
  balance: Decimal
): Trade | null {
  // Implement trade execution logic here
  // This is a placeholder for the actual trade execution
  return null;
}

function calculateMetrics(
  trades: Trade[],
  initialBalance: number,
  maxDrawdown: number
): BacktestMetrics {
  const winningTrades = trades.filter(t => t.pnl > 0);
  const losingTrades = trades.filter(t => t.pnl < 0);

  const totalPnl = trades.reduce((sum, t) => sum.plus(t.pnl), new Decimal(0));
  const grossProfit = winningTrades.reduce((sum, t) => sum.plus(t.pnl), new Decimal(0));
  const grossLoss = losingTrades.reduce((sum, t) => sum.plus(t.pnl), new Decimal(0));

  return {
    totalTrades: trades.length,
    winRate: trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0,
    profitFactor: grossLoss.isZero() ? 0 : grossProfit.div(grossLoss.abs()).toNumber(),
    sharpeRatio: calculateSharpeRatio(trades),
    maxDrawdown,
    averageWin: winningTrades.length > 0
      ? grossProfit.div(winningTrades.length).toNumber()
      : 0,
    averageLoss: losingTrades.length > 0
      ? grossLoss.div(losingTrades.length).toNumber()
      : 0,
    expectancy: trades.length > 0
      ? totalPnl.div(trades.length).toNumber()
      : 0,
  };
}

function calculateSharpeRatio(trades: Trade[]): number {
  if (trades.length < 2) return 0;

  const returns = trades.map(t => t.pnlPercent);
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);

  return stdDev === 0 ? 0 : (avgReturn / stdDev) * Math.sqrt(252); // Annualized
}