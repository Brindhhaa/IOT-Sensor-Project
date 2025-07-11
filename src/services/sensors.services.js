//The controller (this file) decides what to do when an API request comes in. 
// It receives the request, talks to the model, handles errors, and sends a response.

//import the sensors.model
const sensorModel = require('../models/sensors.model');


//this function can be exported
//this function calls the getAllSensorData from sensors.model 
exports.getAllSensorData = async () => {
    try {
        return await sensorModel.getAllSensorData();
    } catch(err){
        throw new Error(err);
    }
};

//this function calls the getSensorDataByID from sensors.model
exports.getSensorDataById = async (id) => {
    try {
      return await sensorModel.getSensorDataById(id);
    } catch(err){
      throw new Error(err);
    }
  };

  exports.getSensorDataWithinRange = async (time) => {
    try {
      return await sensorModel.getSensorDataWithinRange(time);
    } catch(err){
      throw new Error(err);
    }
  };

  
  exports.createSensorData = async (data) => {
    try {
      return await sensorModel.createSensorData(data);
    } catch(err){
      throw new Error(err);
    }
  };
  
  
  exports.deleteSensorData = async (id) => {
    try {
      return await sensorModel.deleteSensorData(id);
    } catch (err) {
      throw new Error(err);
    }
  };




