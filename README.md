# IOT-Sensor-Project

## 🌐 IoT Home Sensor & Automation Dashboard

This project is a full-stack Internet of Things (IoT) system for **monitoring environmental conditions** (temperature, pressure, air quality, and light) and **remotely controlling devices** like fans or lights within the EV Concept car. It features real-time data streaming, persistent storage, AI-based anomaly detection, and interactive dashboards built on a modern web stack.

---

## Tech Stack

- **Hardware**: ESP32 / Arduino + sensors (DHT, MQ135, LDR, etc.)
- **Protocols**: MQTT for lightweight messaging
- **Backend**: Node.js + Express + Socket.IO + PostgreSQL
- **Frontend**: EJS templates + Plotly.js + W3.CSS
- **AI/ML**: Python + TensorFlow (LSTM) + psycopg2 (PostgreSQL access)

---

## Features

### Real-Time Sensor Dashboard
- Live sensor data via MQTT and Socket.IO
- Interactive graphs using Plotly.js
- Live toggle switches for sensor/device control

### Historical Sensor Viewer
- Browse saved data in a searchable table
- Query readings by custom time ranges

### Two-Way Communication
- Sensor device **publishes readings** via MQTT
- Web UI **sends control commands** back to the device via MQTT

### 🔍 AI-Based Anomaly Detection (NEW)
- Python-based TensorFlow model trained on historical sensor data
- Predicts anomalies in temperature, pressure, air quality, and light
- Real-time predictions pushed to the dashboard via Socket.IO
- Uses LSTM (Long Short-Term Memory) neural networks for time-series modeling

---

## Project Structure

```
├── src/
│   ├── models/          # PostgreSQL query files
│   ├── services/        # Logic layer for business rules
│   ├── controllers/     # Express request handlers
│   └── routes/          # REST API endpoints
├── public/
│   ├── graph.html       # Real-time dashboard (Plotly + switches)
│   └── detail.ejs       # Searchable table of historical sensor data
├── index.js             # Main Node.js server (MQTT, WebSocket, HTTP)
├── db.config.js         # PostgreSQL config
├── db.js                # Database pool setup
├── .ino file            # Arduino/ESP32 sensor firmware
└── predict_and_store.py # Python script for AI-based anomaly prediction (NEW)
```

---

## How It Works

### Sensor Device (Arduino/ESP32)
- Collects readings from four sensors: temperature, pressure, air quality, and light.
- Publishes raw sensor values every 5 seconds to the MQTT topic `home/sensors/data`.

### Node.js Server
- Subscribes to MQTT and parses incoming data.
- Buffers messages and averages values every 5 samples.
- Saves each averaged set to PostgreSQL (`sensor_data` table).
- Emits data live via Socket.IO to all connected web clients.

---

### ⚙️ AI-Based Anomaly Detection Pipeline

#### Python Script: `predict_and_store.py`
- Runs **periodically (every 5 seconds)** in the background (via cron job or systemd timer).
- Connects to the PostgreSQL database and **fetches the last 20 sensor readings**.
- Data is reshaped into a 3D tensor `[1, 20, 4]` for LSTM input (20 time steps, 4 features).
- A pre-trained **LSTM model** (`my_model.h5`) is loaded using TensorFlow.
- The model predicts an **anomaly score** between 0 and 1.
- If the score exceeds a defined threshold (e.g., 0.85), the event is labeled `"anomaly"`.
- The score and label are **written to a separate `predictions` table** in PostgreSQL.

#### `predictions` Table Schema:
```sql
CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  prediction FLOAT,
  label TEXT
);
```

---

### 🛰️ Node.js Real-Time Prediction Delivery

- Every 5 seconds, the Node.js server queries the latest entry from the `predictions` table.
- The most recent prediction and label (e.g., `0.91`, `"anomaly"`) are **emitted to the front-end dashboard** via Socket.IO.
- The web dashboard dynamically displays:
  - The latest prediction score
  - Anomaly status (`Normal` / `Anomaly`)
  - Timestamp of the prediction

#### Web Client Sample Integration:
```js
socket.on('prediction', function (data) {
  document.getElementById('prediction-box').innerText = 
    `Anomaly Score: ${data.prediction} | Status: ${data.label} | Time: ${data.timestamp}`;
});
```

---

## 🧠 ML Model Details

- **Model Type**: LSTM (Long Short-Term Memory)
- **Input Shape**: 20 time steps × 4 sensor features
- **Training Data**: Historical records from `sensor_data` table
- **Accuracy**: ~92% classification accuracy on validation set
- **Inference Performance**:
  - Latency: <40ms on standard CPU
  - Memory: ~60KB model size (could be optimized for embedded later)
- **Frameworks Used**: TensorFlow 2.x, NumPy, psycopg2 (PostgreSQL client)

---

## 🚀 Future Work

- Enable on-device inference with **TensorFlow Lite Micro** (ESP32)
- Visual anomaly overlay on Plotly graphs
- Add REST API endpoint for model retraining and evaluation
- Implement hybrid prediction using classification + forecasting
