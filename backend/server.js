import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { PythonShell } from 'python-shell';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// WebSocket server for real-time updates
const wss = new WebSocketServer({ port: 3001 });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
});

// Route to run backtesting with VectorBT
app.post('/api/backtest', async (req, res) => {
  try {
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: join(__dirname, 'strategies'),
      args: [JSON.stringify(req.body)]
    };

    PythonShell.run('backtest.py', options).then(results => {
      res.json(JSON.parse(results[0]));
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to optimize strategy parameters with Optuna
app.post('/api/optimize', async (req, res) => {
  try {
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: join(__dirname, 'strategies'),
      args: [JSON.stringify(req.body)]
    };

    PythonShell.run('optimize.py', options).then(results => {
      res.json(JSON.parse(results[0]));
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route for TensorFlow-based pattern recognition
app.post('/api/analyze-patterns', async (req, res) => {
  try {
    const options = {
      mode: 'text',
      pythonPath: 'python3',
      pythonOptions: ['-u'],
      scriptPath: join(__dirname, 'ml'),
      args: [JSON.stringify(req.body)]
    };

    PythonShell.run('pattern_recognition.py', options).then(results => {
      res.json(JSON.parse(results[0]));
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});