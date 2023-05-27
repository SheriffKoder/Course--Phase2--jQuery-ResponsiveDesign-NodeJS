/*

//practice
//new project
//npm project, install express.js

//the incoming request through two middleware functions
//that log something to the console

//return a response in the 2nd mw function
//then handle requests to / and /users, each has only one handler/midleware
//that does something with it, e.g send dummy response

# npm init      //will ask for json configs
add scripts to json to start code with

# npm install nodemon --save-dev
change start script to nodemon filename.js

# npm install --save express


# npm start //runs the code

*/

/*
const http = require("http");
const express = require("express");
const app = express();

app.use((req,res,next) => {
    console.log("Middleware 1");
    next();
});

app.use((req,res,next) => {
    console.log("Middleware 2");
    res.send("Hello Middleware");
});

app.listen(3000);

//////////////////////////////////
*/

const http = require("http");
const express = require("express");
const app = express();

//let name = "not set";

app.use("/middleware1", (req,res,next) => {
    console.log("<h1>Middleware 1 page </h1>");
    res.send("Middleware 1");

    name = "myname";    //undeclared variable is = global
    //next();   //removed to not allow the request to continue
});

app.use("/middleware2", (req,res,next) => {
    console.log("Middleware 2");
    console.log(name);
    res.send("<h1>Middleware 2 page</h1>");
});

app.use("/", (req,res,next) => {
    res.send("<h1> Hello Middleware, please visit /middleware1 or /middleware2 </h1>");
});

app.listen(3000);
