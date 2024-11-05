# Forex Backtesting System

A comprehensive forex trading backtesting system with multi-timeframe analysis, strategy optimization, and machine learning capabilities.

## Features

### 1. Data Management
- CSV and JSON data import support
- Historical forex data validation
- Multi-timeframe data processing
- Real-time data visualization

### 2. Strategy Building
#### Classic Strategy Builder
- Main indicator + up to 4 confirmation indicators
- Customizable parameters for each indicator
- Entry and exit condition configuration
- Performance metrics tracking

#### Time-based Strategy Builder
- Time-range specific strategies
- Multi-timeframe cascade approach
- Optimized indicator combinations
- Pre-configured timeframe recommendations

### 3. Technical Indicators
- Exponential Moving Averages (EMA)
- Simple Moving Averages (SMA)
- Relative Strength Index (RSI)
- Stochastic Oscillator
- Bollinger Bands
- Moving Average Convergence Divergence (MACD)
- Average True Range (ATR)
- SuperTrend
- ATR Bands
- Heikin-Ashi Candles
- Donchian Channels

### 4. Analysis Tools
- Strategy performance metrics
- Trade statistics
- Trend analysis by timeframe
- Pattern recognition using TensorFlow
- Parameter optimization with Optuna
- VectorBT-powered backtesting

## Prerequisites

### Frontend
- Node.js (v18 or higher)
- npm or yarn

### Backend
- Python 3.8 or higher
- pip (Python package manager)

### Required Python Libraries
```
# Core Data Processing
numpy==1.26.4
pandas==2.2.0
scikit-learn==1.4.0

# Backtesting and Optimization
vectorbt==0.25.4
optuna==3.5.0
ta-lib==0.4.28

# Machine Learning
tensorflow==2.15.0
keras==2.15.0

# Data Visualization
matplotlib==3.8.2
seaborn==0.13.2
plotly==5.18.0

# Statistical Analysis
statsmodels==0.14.1
scipy==1.12.0

# Financial Libraries
yfinance==0.2.36
pandas-ta==0.3.14b
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd forex-backtester
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

## Configuration

1. Backend Setup:
```bash
# Start the backend server
cd backend
node server.js
```

2. Frontend Development:
```bash
# Start the development server
npm run dev
```

## Usage

### 1. Data Import
1. Navigate to the "Data Import" section
2. Upload your historical forex data (CSV/JSON)
3. Configure dataset name and description
4. Validate and save your data

### 2. Strategy Building

#### Classic Strategy
1. Select main indicator
2. Add confirmation indicators (up to 4)
3. Configure parameters
4. Set entry/exit conditions
5. Save strategy

#### Time-based Strategy
1. Select time range
2. Choose timeframes
3. Configure indicators
4. Set strategy parameters
5. Save configuration

### 3. Backtesting
1. Select strategy
2. Choose date range
3. Set initial balance
4. Run backtest
5. View results and metrics

### 4. Analysis
1. Review performance metrics
2. Analyze trend indicators
3. Compare strategies
4. Optimize parameters
5. Export reports

## Architecture

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- Chart.js for visualization
- React Query for data management
- React Hook Form for forms

### Backend
- Node.js with Express
- Python for analysis
- WebSocket for real-time updates
- SQLite for data storage

### Analysis Tools
- VectorBT for backtesting
- Optuna for optimization
- TensorFlow for pattern recognition

## Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
```

## Performance Considerations

- Use appropriate timeframes for your strategy
- Consider data size when importing
- Optimize indicator parameters
- Monitor system resources during backtesting

## Troubleshooting

### Common Issues

1. Data Import Errors
   - Verify CSV/JSON format
   - Check date formats
   - Ensure all required fields are present

2. Backtesting Performance
   - Reduce data size
   - Optimize indicator combinations
   - Check system resources

3. Strategy Optimization
   - Adjust parameter ranges
   - Increase optimization trials
   - Monitor convergence

### Python Library Installation Issues

1. TA-Lib Installation:
   - Windows: Download binary from https://www.lfd.uci.edu/~gohlke/pythonlibs/#ta-lib
   - Linux: `sudo apt-get install ta-lib`
   - macOS: `brew install ta-lib`

2. TensorFlow Setup:
   - For GPU support, ensure CUDA and cuDNN are properly installed
   - Consider using `tensorflow-gpu` for better performance

3. VectorBT Configuration:
   - Ensure NumPy and Pandas versions are compatible
   - Configure memory limits for large datasets

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.