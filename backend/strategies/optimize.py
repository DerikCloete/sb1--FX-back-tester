import sys
import json
import optuna
import vectorbt as vbt
import pandas as pd
import numpy as np

def objective(trial, data, strategy_type, timeframe):
    # Define parameter space based on strategy type
    params = {}
    
    if strategy_type == 'EMA':
        params = {
            'fast_period': trial.suggest_int('fast_period', 5, 50),
            'slow_period': trial.suggest_int('slow_period', 20, 200)
        }
    elif strategy_type == 'RSI':
        params = {
            'period': trial.suggest_int('period', 5, 30),
            'upper': trial.suggest_int('upper', 65, 85),
            'lower': trial.suggest_int('lower', 15, 35)
        }
    # Add more strategy types as needed
    
    # Run backtest with parameters
    pf = vbt.Portfolio.from_signals(
        close=data['close'],
        entries=generate_signals(data, strategy_type, params),
        exits=generate_exits(data, strategy_type, params),
        init_cash=100000,
        freq=timeframe
    )
    
    # Return negative Sharpe ratio for minimization
    return -pf.sharpe_ratio

def optimize_strategy(config):
    data = pd.DataFrame(config['data'])
    data.index = pd.to_datetime(data['timestamp'])
    
    study = optuna.create_study(direction='minimize')
    study.optimize(
        lambda trial: objective(
            trial,
            data,
            config['strategy_type'],
            config['timeframe']
        ),
        n_trials=config['n_trials']
    )
    
    return json.dumps({
        'best_params': study.best_params,
        'best_value': -study.best_value  # Convert back to positive Sharpe ratio
    })

if __name__ == '__main__':
    config = json.loads(sys.argv[1])
    result = optimize_strategy(config)
    print(result)