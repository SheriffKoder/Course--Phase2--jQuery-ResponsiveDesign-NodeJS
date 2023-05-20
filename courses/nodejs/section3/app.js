
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

//can put a path to a local file starting with './path.js'
// no ./ will use the global module even if there is a local one
const http = require('http'); 

//has two arguments
//a request: incoming message
//a response object

//nodejs gives us an object that represents the incoming request
//and allows us to read data from that request
//and gives us an object(response)
//which allows us to return a response to who ever sent the request

//function rqListener(req, res) {
//}

//http.createServer(rqListener);
//createServer takes a request listener as an argument
//a function that will execute on each incoming request
//define such a function
//execute the rqListener on every incoming request reaching the server

//if a request happens, this function will be executed
//createServer method returns a server
//to be stored in a new variable or constant



/*
const server = http.createServer((req, res) => {

    ////request
    //req; request object nodejs generated for us
    //with all the data of the incoming request on the host
    //console.log(req);
    
    //take only the needed parts of the request/req object
    console.log(req.url, req.method, req.headers);

    ////response
    res.setHeader('Content-Type', 'text/html');
    //Content-Type default header that the browser knows and understands
    //2nd argument, value to this header key, set to html
    
    //write some data to the response
    res.write('<html>');
    res.write('<head><title>Page1</title></head>');
    res.write('<body><h1> Hi </h1> </body>');
    res.write('</html>');

    //after setting all the headers and response body we call end
    res.end();
    //cannot write anymore
    //nodejs will send the response to the client


    //loop until a request happens then exit
    //process.exit();
});
*/


//starts a process where nodejs not immediately exit our script
//keep the script running to listen for incoming requests

//listen takes arguments
//1st port on which want to listen
//in production will not fill this out 
//and will take the default of port 80
//3000 port is a safe one to use
//2nd host name, localhost for a local machine by default

//#//server.listen(3000);

// # node app.js
//open localhost:3000 in the browser
//the console.log(req); will output in the terminal


//now you did setup a server





/////////////////////////////////////////////////////////////
//Node.js Program Lifecycle


//node app.js > start script 
    //> pase code, register variables and function
        //>event loop (keep on running as long as there are
                    //event listeners registered like createServer)
                        //process.exit();
//all the code is managed by the event loop
//of course we want the server to be always running (looping)

//event loop helps when there are many incoming requests
//so the server will always be ready
//it is quite fast at handling requests
//and has a multi-threading system (in case many requests same time)



//in the request object look for the headers:
//host, accept: file type
//http version

//important now req.url, req.method, req.headers

//url became /
//method GET
//headers...

//GET is the default method used if you just enter
//a url into a browser


/////////////////////////////////////////////////////////////
//sending responses

//developer tools > network > refresh page > localhost
//> headers(content-type) and response(written html)


//Http headers
/*
*/


const server = http.createServer((req, res) => {

    //console.log(req.url, req.method, req.headers);
    const url = req.url;
    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');

        return res.end();
        //to return from this anonymous function
        //and not continue to the code below
        //because we cannot continue executing after res.end()
        //the if statement will also exit out of this function
    }

    //form action, a url where the generated request should be sent to
    //a button type submit in a form element
    //will send a new request
    //this will automatically target the host it is running on
    //local host 3000  in our case here
    //define the http method that should be used
    //here we are not entering a url so will use the POST request

    //the form will send a POST request to /message
    //the form will also look into the form
    //detect any inputs or related elements like select
    //and if we give that input a name
    //it will put that name into the request we put into our server
    //so any input can be accessible via the assigned name

    //GET: when you click a link or enter a url
    //POST: has to be created by you by such a form, also other js ways available


    
    //this code will run because the form will switch to
    // /message, which is not in the if statement
    res.setHeader('Content-Type', 'text/html');
    
    res.write('<html>');
    res.write('<head><title>Page1</title></head>');
    res.write('<body><h1> Hi </h1> </body>');
    res.write('</html>');

    res.end();

});


server.listen(3000);


//for /nothing
//load a page where user enter some date then store in a 
//file once it is sent

//parse the url, store into a new constant
//accessing the request url

//send a response of html
//gives the user input form and a button to send a new request in return
//and that would not be a get request
