/*
code that allows us to connect to the SQL database
and give us back a connection object which allows us to run queries




*/

/*
//vanilla mySQL connecting to workbench db

//import mySQL package and store it in a const
//const { rejects } = require("assert");
const mysql = require("mysql2");

//two ways of connecting with a sql database
//1) setup 1 connection which we can then use to run queries
    //and we should always close the connection once we are done with a query
    //downside is needing to re-exeucte the connection for every new query
    //creating connections all the time quickly becomes in-efficient in code and db performance

// better way is to create a connection pool

//want a "pool of connections" not a single connection
//which allows us to always reach out to it "whenever we have a query to run"
//and then we get a new connection from the pool which "manages multiple connections"
//so we can run multiple queries "simultaneously"
//because each query needs its own connection
//once its done the connection will be available again into the pool
//and be available for a new query
//and the pool can then be finished when our application shuts down

//pass in a js object with some information about our database engine/host
//we are connecting to
const pool = mysql.createPool({

    //define a host (server ip address or a name)
    //username, by default is root (given to us during the configuration process)
    //define the exact database name, because it gives us access to a db server
        //but this server typically has multiple databases
        //here our databases are our schemas in the program
    //our password
    host: "localhost", 
    user: "root",
    database: "node-complete",
    password: "Blackvulture_92"


});

//this will create a pool, now can export this
//promise will allow us to use promises when working with these connections
//handling async tasks/data instead of callbacks
//promises allow us to write code in a bit more structured way

//we do not have many nested callbacks
//instead we can use promise chains

//now we can import from the db js file to get access to that pool
//and to the connections in there
module.exports = pool.promise();
*/


//////////////////////////////////////////////////////////////////////////////////////////
//Sequelize

////use SQL to connect to db / setup a connection pool 
//it will use the same syntax above behind the scenes

const Sequelize = require("sequelize");
//schema, root, password
//dialect makes sure we connect to mysql database, for using the correct syntax
//host, by default it is set to localhost but we will set it here
const sequelize = new Sequelize("node-complete", "root", "Blackvulture_92", {
    dialect: "mysql", 
    host: "localhost" 
});


module.exports = sequelize;