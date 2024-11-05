import sys
import json
import vectorbt as vbt
import pandas as pd
import numpy as np
from datetime import datetime

def run_backtest(config):
    # Parse strategy configuration
    data = pd.DataFrame(config['data'])
    data.index = pd.to_datetime(data['timestamp'])
    
    # Initialize VectorBT Portfolio
    pf = vbt.Portfolio.from_signals(
        close=data['close'],
        entries=config['entries'],
        exits=config['exits'],
        init_cash=config['initial_balance'],
        fees=config['fees'],
        freq=config['timeframe']
    )
    
    # Calculate metrics
    metrics = {
        'total_return': float(pf.total_return),
        'sharpe_ratio': float(pf.sharpe_ratio),
        'sortino_ratio': float(pf.sortino_ratio),
        'max_drawdown': float(pf.max_drawdown),
        'win_rate': float(pf.win_rate),
        'profit_factor': float(pf.profit_factor)
    }
    
    return json.dumps({
        'metrics': metrics,
        'trades': pf.trades.records_readable
    })

if __name__ == '__main__':
    config = json.loads(sys.argv[1])
    result = run_backtest(config)
    print(result)