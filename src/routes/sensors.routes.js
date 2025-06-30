const express = require('express'); //importing express.js library. express is the tool that helps you build a server and define routes that respond to HTTP requests
const router = express.Router();

//import controller file with all get and set functions
const sensorController = require('../controllers/sensors.controller');

//defines a POST route to "/". if someone sends a POST request to the given route, it runs createSensorData function
router.post('/', sensorController.createSensorData);

//defines a GET route to "/". If someone sends a GET request to the given route, it will run getAllSensorData function
router.get('/', sensorController.getAllSensorData);


//defines a POST route to "/search". if someone makes a POST request to this route it will run the getSensordataWithinRange function
router.post('/search', sensorController.getSensorDataWithinRange);

//defines a dynamic route to "/id". if someone makes a GET request to this route, it will run the getSensorDataById function
router.get('/:id', sensorController.getSensorDataById);

//defines a DELETE route to "/id". if someone sends a DELETE request to this  route it will run the deleteSensorData function
router.delete('/:id', sensorController.deleteSensorData);


module.exports = router;
const sensorRoutes = require('./routes/sensors.route');
app.use('/api/sensors', sensorRoutes);
