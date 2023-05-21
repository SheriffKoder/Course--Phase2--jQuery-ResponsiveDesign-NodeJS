
const http = require('http');

const routes = require("./routes.js");

//execute the function stored in routes.js
//for incoming requests
//const server = http.createServer(routes);
const server = http.createServer(routes.handler); //export/import type2
console.log(routes.someKey);
//const server = http.createServer((req, res) => {

//});


server.listen(3000);
