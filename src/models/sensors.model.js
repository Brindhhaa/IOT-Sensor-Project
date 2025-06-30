const pool = require('./db');

//defines the SQL query to send to the database
//makes a new table called sensor_data and adds all those fields
const createSensorDataTable = async () => {
    const query = `
        CREATE TABLE sensor_data (
            id SERIAL PRIMARY KEY,
            timestamp TIMESTAMPTZ DEFAULT NOW(),
            temperature NUMERIC,
            pressure NUMERIC,
            air_quality NUMERIC,
            light_intensity NUMERIC
        );
    `;
}; 

createSensorDataTable();

//asks the database to fetch the first 5 rows of data from the sensor_data query
const getAllSensorData = async () => {
    try {
      const result = await pool.query('SELECT * FROM sensor_data limit 5');
      return result.rows; //the array of data returned from the database
    } catch (err) {
      throw new Error(err);
    }
  };


//runs an SQL query that takes the id as the input and returns the row of data at that id
const getSensorDataById = async (id) => {
    try {
      const result = await pool.query('SELECT * FROM sensor_data WHERE id = $1', [id]);
      return result.rows[0];
    } catch (err) {
      throw new Error(err);
    }
  };

  //this function pulls out sensor data between 2 time points, based on how many hours ago you want to look.
  //returns rows where the timestamp is inside that time range
  const getSensorDataWithinRange = async (time) => {
    try {
      const querySpecificTimeRange = `
        SELECT *
        FROM sensor_data
        WHERE timestamp BETWEEN NOW() - INTERVAL '${time.timeEnd} hours' AND NOW() - INTERVAL '${time.timeStart} hours';
      `;
      const result = await pool.query(querySpecificTimeRange);
      return result.rows;
    } catch (err) {
      throw new Error(err);
    }
  };
  

//function to add a new row of sensor data into database
//after the row is inserted into the database, it returns this row
const createSensorData = async (data) => {
  const query = `
    INSERT INTO sensor_data (temperature, pressure, air_quality, light_intensity)
    VALUES ($1, $2, $3, $4) RETURNING *;
  `;
  const values = [data.temperature, data.pressure, data.airQuality, data.lightIntensity];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (err) {
    throw new Error(err);
  }
};

//given an ID, deletes the row of sensor data corresponding to that ID
const deleteSensorData = async (id) => {
    try {
      const query = 'DELETE FROM sensor_data WHERE id = $1 RETURNING *;';
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (err) {
      console.error('Error executing query', err.stack);
      throw new Error(err.message);
    }
  };
  

    //if any other file needs any of these five functions, they can just import this file
  module.exports = {
    getAllSensorData,
    getSensorDataById,
    getSensorDataWithinRange,
    createSensorData,
    deleteSensorData
  };
