
/////////////////////////////////////////////////////////////
////////////////////////////////

//core modules (modules shipped with node js)
//http, https, fs, path, os
//there are also external modules

//http, launch a server, 
//send requests (njs app can send requests to another server)
//can have multiple servers communication with each other
//for example send a request to google maps api 
//to send coordinates and get back the address

//https, launch a ssl encoded server

//fs, file system

//path to files on any operating systems

//os package that helps with os relevant info etc.


////////////////////////////////
//using the http module
//core but not available globally

//import it

//can put a path to a local file starting with `./path.js`
// no ./ will use the global module even if there is a local one
const http = require('http'); 

//has two arguments
//a request: incoming message
//response object

//nodejs gives us an object that represents the incoming request
//and allows us to read data from that request
//and gives us an object(response)
//which allows us to return a response to who ever sent the request

//function rqListener(req, res) {
//}

//http.createServer(rqListener);
//CS takes a request listener as an argument
//a function that will execute on each incoming request
//define such a function
//execute the rqListener on every incoming request reaching the server

//if a request happens, execute this function
//createServer method returns a server
//to be stored in a new variable or constant

const server = http.createServer((req, res) => {
    console.log(req);
});


//starts a process where nodejs not immediately exit our script
//keep the script running to listen for incoming requests

//listen takes arguments
//1st port on which want to listen
//in production will not fill this out 
//and will take the default of port 80
//3000 port is a safe one to use
//2nd host name, localhost for a local machine
server.listen(3000);

// # node app.js
//open localhost:3000 in the browser
//the console.log(req); will output in the terminal


//now you did setup a server


/////////////////////////////////////////////////////////////
