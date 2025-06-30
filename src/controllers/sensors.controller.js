const sensorService = require('../services/sensors.service');

//this function runs when someone sends a POST request to create sensor data
//the req.body contains the data the user submitted (temp, pressure, etc.)
exports.createSensorData = async (req, res) => {
    try {
      const sensor_data = await sensorService.createSensorData(req.body);
      res.status(200).json(sensor_data); //if data is successfully inserted into database, a JSON response with HTTP status 200 (success) is sent
    } catch (error) {
      res.status(500).json({ message: error.message }); //if data fails to be inserted into database, a JSON response with HTTP status 500 (failure) is sent
    }
  
  };


  //this function runs when someone sends a GET request to return first 5 rows of sensor data
  exports.getAllSensorData = async (req, res) => {
    try {
      const sensors_data = await sensorService.getAllSensorData();
      res.status(200).json(sensors_data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //this function handles a POST request with a time range in the body. it returns sensor data collected within that range
  exports.getSensorDataWithinRange = async (req, res) => {
    try {
      const sensors_data = await sensorService.getSensorDataWithinRange(req.body);
      res.status(200).json(sensors_data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  
  exports.getSensorDataById = async (req, res) => {
    try {
      const sensor_data = await sensorService.getSensorDataById(req.params.id);
      if (!sensor_data) {
        return res.status(404).json({ message: 'Sensor data not found' });
      }
      res.status(200).json(sensor_data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



exports.deleteSensorData = async (req, res) => {
    try {
      const sensor_data = await sensorService.deleteSensorData(req.params.id);
      res.status(200).json(sensor_data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

