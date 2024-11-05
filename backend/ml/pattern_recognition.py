import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.preprocessing import MinMaxScaler

def prepare_data(data, sequence_length):
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(data)
    
    X, y = [], []
    for i in range(len(scaled_data) - sequence_length):
        X.append(scaled_data[i:(i + sequence_length)])
        y.append(scaled_data[i + sequence_length])
    
    return np.array(X), np.array(y), scaler

def build_model(sequence_length, n_features):
    model = models.Sequential([
        layers.LSTM(50, return_sequences=True, input_shape=(sequence_length, n_features)),
        layers.LSTM(50, return_sequences=False),
        layers.Dense(25),
        layers.Dense(n_features)
    ])
    
    model.compile(optimizer='adam', loss='mse')
    return model

def analyze_patterns(config):
    # Prepare data
    data = pd.DataFrame(config['data'])
    sequence_length = config.get('sequence_length', 60)
    
    # Prepare features
    features = data[['open', 'high', 'low', 'close', 'volume']].values
    X, y, scaler = prepare_data(features, sequence_length)
    
    # Split data
    split = int(len(X) * 0.8)
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]
    
    # Build and train model
    model = build_model(sequence_length, features.shape[1])
    model.fit(
        X_train, y_train,
        epochs=config.get('epochs', 50),
        batch_size=config.get('batch_size', 32),
        validation_split=0.1,
        verbose=0
    )
    
    # Make predictions
    predictions = model.predict(X_test)
    predictions = scaler.inverse_transform(predictions)
    
    return json.dumps({
        'predictions': predictions.tolist(),
        'metrics': {
            'mse': float(np.mean((predictions - scaler.inverse_transform(y_test)) ** 2)),
            'mae': float(np.mean(np.abs(predictions - scaler.inverse_transform(y_test))))
        }
    })

if __name__ == '__main__':
    config = json.loads(sys.argv[1])
    result = analyze_patterns(config)
    print(result)