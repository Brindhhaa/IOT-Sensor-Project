# IOT-Sensor-Project

# 🌐 IoT Home Sensor & Automation Dashboard

This project is a full-stack Internet of Things (IoT) system for **monitoring  environmental conditions** (temperature, pressure, air quality, and light) and **remotely controlling devices** like fans or lights within the EV Concept car. It features real-time data streaming, persistent storage, and interactive dashboards built on a modern web stack.

---

## Tech Stack

- **Hardware**: ESP32 / Arduino + sensors (DHT, MQ135, LDR, etc.)
- **Protocols**: MQTT for lightweight messaging
- **Backend**: Node.js + Express + Socket.IO + PostgreSQL
- **Frontend**: EJS templates + Plotly.js + W3.CSS

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

---

## Project Structure


├── src/
│ ├── models/ # Database queries (PostgreSQL)
│ ├── services/ # Logic layer between DB and routes
│ ├── controllers/ # Express request handlers
│ └── routes/ # REST API routes
├── public/
│ ├── graph.html # Live dashboard (Plotly + switches)
│ └── detail.ejs # EJS-rendered history table
├── index.js # Main server file (MQTT + HTTP + WebSockets)
├── db.config.js # DB connection settings
├── db.js # DB connection pool setup
└── .ino file (Arduino) # Firmware for sensor device



---

## How It Works

### Sensor Device (Arduino/ESP32)
- Reads 4 sensor values every few seconds
- Sends them as comma-separated strings to MQTT topic `home/sensors/data`

### Node.js Server
- Listens to MQTT topic
- Buffers incoming messages and averages every 5
- Saves averaged data to PostgreSQL
- Emits live updates to connected web clients using Socket.IO

### Web Clients
- **`/graph`**: Displays live plots and toggle switches
- **`/detail`**: Displays saved sensor data and allows searching by time

---

## Database Schema

```sql
CREATE TABLE sensor_data (
  id SERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  temperature NUMERIC,
  pressure NUMERIC,
  air_quality NUMERIC,
  light_intensity NUMERIC
);
