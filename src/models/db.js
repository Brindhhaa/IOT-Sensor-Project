//this file sets up a connection between Node.js and a postgreSQL database
//when the browser starts, it should be ready to talk to a databse to read or write data

const {Pool} = require('pg'); //estabilishes the connection between PostgreSQL and Node.js
const dbConfig = require('../config/db.config'); //imports the config file and stores it as a dbConfig object


const pool = new Pool({ //sets a pool of connections using the database info imported from dbConig
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port
  });



  pool.on('connect', () => { //sets an event listener. when the pool successfully connects to the databse, print the message
    console.log('Connected to the PostgreSQL database');
  });
  
  pool.on('error', (err) => { //if something goes wrong when trying to connect, print an error and shut down the app
    console.error("Unexpected error on idle client", err);
    process.exit(-1); //stops the app with an error
  });

  module.exports = pool;

  