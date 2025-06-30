module.exports = { //"export" thsi info so other files in the project can use it
    user: "postgres",
    host: "localhost",
    database: "home",
    password: "1995",
    port: 5432,
};
//basically just storing variables inside an object so that they can be resued in other files


//in other files, you can use this information to actually connect to the database
//when this file is imported, this object is provided to the file

