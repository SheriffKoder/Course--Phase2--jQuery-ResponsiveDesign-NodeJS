
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
//const http = require('http'); 

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
    //but we want the server not to exit
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

/*

const http = require('http'); 


const server = http.createServer((req, res) => {

    //console.log(req.url, req.method, req.headers);
    //form with action directing to /message and method POST
    //that is activated on the button of type submit
    //that will send a new request
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

    //form action, a url where 
    //the generated request should be sent to
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

*/

//for /nothing
//load a page where user enter some date then store in a 
//file once it is sent

//parse the url, store into a new constant
//accessing the request url

//send a response of html
//gives the user input form and a button to send a new request in return
//and that would not be a get request



/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//Day3
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//page redirection
//file creating with the user input provided




const http = require('http');
const fs = require("fs");   //

const server = http.createServer((req, res) => {

    const url = req.url;
    const method = req.method;  //

    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }


    //enter this state only if in /message with method post
    if (url === "/message" && method === "POST") {   //
        //the below functions will be registered internally
        //in njs event emitter registry
        //and not run right away
        //then goes to line 358


        //receive input(chunk) and output to a txt file
        //on method, allows us to listen to certain events
        //listen to the data event
        //the data event will be fired
        //whenever a new chunk is ready to be read
        //with the help of the buffer
        //2nd parameter, function should be executed
        //for every data event or data piece
        //the request body should be an empty array
        //push a new element onto the body
        //we cannot change a const,
        //but with push we are changing the object behind
        //that data element, not the object itself
        const requestBody = [];
        req.on("data", (chunk)=>{
            console.log(chunk);
            requestBody.push(chunk);
        });

        //end event listener
        //fired once finished parsing the incoming request / request data
        //Buffer object available globally by NJS
        //create a buffer and add all the chunks to it
        //now its like the bus is waiting
        //toString to convert it to a string
        //as we know we will enter a text here
        //different input types different ways to use the buffer
        return req.on("end", ()=>{
            const parsedBody = Buffer.concat(requestBody).toString();
            //console.log(parsedBody);
            //take the element and split it on the equal sign
            //then take the element on the index 1
            //the second element in the resulting array 
            //the element on the right of the equal sign
            const message = parsedBody.split("=")[1];

            
            //fs.writeFileSync("message.txt", message); //
            //writeFileSync will pause/block code execution
            //until this file is created
            //syncronous code
            //in a huge file blocking will cause
            //the remaining code not run and 
            //other requests not be handled
            //until this file operation is done

            //so use writeFile
            //which take a third argument
            //a function that should be executed
            //once its done
            //receives error, will be null if no error
            //if there is, can handle it
            //by returning a error response or success response
            fs.writeFile("message.txt", message, (err) => {
                //this response only be sent
                //if done working with the file
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            }); //
            //this is why nodejs is high performance
            //because it never stops/blocks the code or server

        });
        //the above function does not execute immediately
        //it get registered and the code below continues
        //so any code dependent on the parsed data
        //should be moved above like writefile
        //async function
        //nodejs adds an event listener internally
        //for the end event of the request
        //which will be triggered when nodejs
        //finishes parsing the request 
        //and then call the arrow function for you once its done
        //nodejs internal registers of events
        //and listeners to these events
        //and an arrow function like this is such a listener
        //while AF is executing, njs will not pause the other
        //code from executing
        //the AF is a callback


        //now you will se in terminal
        //the chunks
        //the form-key of the input named message
        //of our data value (key value pair)


        //creating a file
        //fs.writeFileSync("message.txt", "Dummy text"); //




        //////write meta information for page redirection
        //to stay on the / page
        //302 stands for "redirection"
        //js object with some headers we want to set
        //"Location", default header accepted by the browser
        //set the location to /
        //stop after

        //res.writeHead(302, {}); or these two lines
        //res.statusCode = 302;
        //res.setHeader("Location", "/");
        //return res.end();
    }

        //now will have in networkDev
        //message url of status 302 "redirected"
        //and message.txt file created

        res.setHeader('Content-Type', 'text/html'); //358
        res.write('<html>');
        res.write('<head><title>Page1</title></head>');
        res.write('<body><h1> Hi </h1> </body>');
        res.write('</html>');
        res.end();


});


server.listen(3000);


//we want to return the user to "/"
//and store the use input message in a file

//the incoming data is sent as a stream of data
//Streams & buffers
//example incoming request
//the request is read by Node in chucks/multiple parts
//till fully parsed
//so we can work on request received chunks until all received
//that helps when writing data to the hard drive, while the data is coming in

//a buffer is used to work with chunks
//hold multiple chunks and work with them
//before they are released once its done


//the order of execution of the code
//not necessarily in the order of writing


////////////////////////////////////////////////////
////////////////////////////////////////////////////

//just for understanding
//how nodejs works with long taking tasks 
//like large files

//nodejs uses only one js thread
//a single process on the os
//how then it handles multiple requests ?

//the event loop automatically starts with nodejs
//when our program starts
//this is responsible for handling event callbacks
//responding to requests, aware of these callbacks
//the arrow functions inside the events remember

//the event loop will only handle callbacks
//that contains fast finishing code

//long time taking operations are managed by worker pool
//which is also managed by nodejs automatically
//all the heavy lifting
//runs on different threads
//really detached from our code, request, event loop
//connection to the event loop is once the worker is done
//then it will trigger the callback for the readfile operation
//this will then end up in the event loop
//there nodejs will execute the appropriate callback


//event loop
//keeps the nodejs process running,
//handles all the callbacks with some order

//1) in the beginning of any operation
//checks if there are any timer with callbacks it should execute

//2) next step checks for other callbacks
//for example, write/read file callbacks
// I/O from disk, network, (code blocking operations)

//if there are many outstanding callbacks,
//it will continue its loop operation
//and postpone these callback operations to the next iteration

//3) next step, poll phase
//looks for new i/o events and execute their code immediately if possible
//if not possible it will defer the execution as a pending callback
//also will check if there are any timer callbacks
//due to be executed, if then will jump to that timer phase
//and execute them right away

//4) next, setImmediate callbacks
//in check phase
//a bit like setTimeout or setInterval
//will execute immediately but always only after 
//any open callbacks have been executed

//5) close callbacks
//execute all 'close' event callbacks

//6) might exit the whole js program
//but only if there are no event handlers registered
//nodejs keeps tack of its open event listeners
//by a counter reference "refs" that increments 
//by one for every new event listener that is registered
//or future work it has to do
//and reduce by 1 for every event listener it does not need anymore/finished

//createServer, listen events are never really finished by default
//thus we always have at least one reference
//thus we never exit of a normal node webserver program

//we can call the exit function as coded above
//or execute a file that did not listen to/on a web server


//as a security
//each function is only exposed to itself and not accessible
//by the other functions
//so by default we have this separation by how js works



//make a new file to include the routing logic
//logic checking the url etc.
//to export the functionality and import to an app file


//////Wrap up

//how the web works
// client > request > server > response > client (browser) / display

//program lifecycle and event loop
//node.js runs non-blocking js code and uses
//an event driven code event loop for running your logic
//a node program exits as soon as there is no more work to do
//the createServer() event never finishes by default

//asynchronous code as shown in all the callbacks
//js code is non-blocking
//use callbacks and events => order changes

//requests and responses
//parse request data in chunks (streams and buffers)
//avoid double responses

//node.js and core modules
//built in functionalities
//imported using the require syntax
//have to be imported in each file used

//node module system
//import via require, for custom files/modules/third-party modules
//exports