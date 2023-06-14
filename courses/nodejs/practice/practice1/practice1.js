/* //this is a recap/practice for sections 1,2,3




//similar to nodejs, python flask, php larvel, asp.net, ruby


/////////////////////////////////////////////////////////////////////////////////////////////
Javascript runs on Google's V8 engine to run on the browser
engine: compile to machine code using c++
//weakly typed language, no explicit type assignment, data types can be switched dynamically
//object oriented language, data can be organized in logical objects, primitive and reference types
//versatile language, runs in a browser and on a pc/server, broad variety of tasks




/////////////////////////////////////////////////////////////////////////////////////////////
NodeJS (javascript runtime) 
"allows to use js to make servers, so a webapp can be made in one language
allows js to run on devices/servers other than the browser
and is never exposed to the public

so we can do using nodejs the following with js code
- access the file system read/write
- connect to "databases"
- do "authentication" outside of the browser (safer)
- do input "validation", as servers are sheltered from user manipulation
- "business logic" (handle requests/files)
- utility scripts, build tools, etc.


/////////////////////////////////////////////////////////////////////////////////////////////
//////what is the process from the client side
//user/client (browser)
//enters url
//Domain lookup on DNS name to ip address of the server requested
//the browser then sends a request to the given ip address of the server

//and handling requests is what we are doing here

/////////////////////////////////////////////////////////////////////////////////////////////
//////how nodejs works
we write the server in js code and run the server
    (1) start script
    (2) enter an event loop as long as there are event listeners registered internally like createServer
    (3) listen for incoming requests

//nodejs keeps tack of its open event listeners
//by a counter reference "refs" that increments 
//by one for every new event listener that is registered
//or future work it has to do
//and reduce by 1 for every event listener it does not need anymore/finished


route/handle requests and do tasks with it
communicating with a database that runs on a separate database server
reached from your backend

return data/response to the user based on the request using node-core-modules
response can be html/json/xml/files/dynamic-content-html
    (4) process.exit(); // optional if want to exit after handling request


requests and responses have descriptive headers
req/res are done through protocols like (standardized way of communicating/rules)
that defines how a valid request looks like and how data should be transferred between the browser/server
protocols understood by the browser/server, 
//hyper text transfer protocol
//hyper text transfer protocol secure (ssl encryption turned on, encrypt transmitted data)

the event loop 
- manages the code
- helps when there are many incoming requests, it is fast, multi-threading (multi-task)
- keeps the server always ready


//setHeader: content-type, location
//req.on: data, end
//nodejs adds/handles async to an internal event listener 
//and run their callback functions without blocking other code from executing



/////////////////////////////////////////////////////////////////////////////////////////////
//modules
core-modules: http, https, fs, path, os

//http; server launch, send requests (also to another server or two way communicating servers)
//https; launch a ssl encoded server
//fs; file system
//path; path to files on any operating systems
//os; a package that helps with os relevant info etc.



/////////////////////////////////////////////////////////////////////////////////////////////






















*/
/////////////////////////////////////////////////////////////////////////////////////////////
//ways of using nodejs

//////(REPL method), no saving, # node
//////EX1:
//download and install nodejs from their website
// node -v to check on njs version
//# node , will get into interactive mode then you can write js code in the terminal



//////(Executing method), file saving, # node file.js
//////EX2:
//write a js code in the .js file and execute # node filename.js in the terminal
//console.log("Hello from Node.js");


//////EX3: 
//use file system core module to output a string to a desired file
//require("node-module").moduleMethod("file", "string");

//output a normal string using file-system module

////require("fs").writeFileSync("practice1_output.txt", "this is the output for practice1 ex3");

//output js code, must use toString
//let myFunction = new Date().getFullYear();
//let myFunction_inStringFormat = myFunction.toString();
//require("fs").writeFileSync("practice1_output.txt", `We are in ${myFunction_inStringFormat}`);
// # node practice1.js




/////////////////////////////////////////////////////////////////////////////////////////////
//////http module


//const somefile = require("./fileName.js"); 
//if the fileName is the same a core module the core module will be used
//local files start with "./"
//const http = require("http");
//const fs = require("fs");


//createServer takes a function that will run on each incoming request to the server
//createServer returns a server

//req: request, res: response
//req: request object created by nodejs, data of incoming request 
//request happened by user visiting the host address
//req.url, req.method, req.headers are the items of interest in the request
//req.headers : host/accept file type, http version
//req.url on localhost3000 is "/"
//req.method GET on incoming request

//can access the request's details from chrome developer tools
//>network > refresh page > local host > content-type html etc.

//GET: when you click a link or enter a url
//POST: has to be created by you by such a form, also other js ways available
//casing does not matter


//
/*

let htmlCode = `<html>
                    <head>
                        <title>myPage</title>
                    </head>
                    <body>
                        <h1>Hello myPage</h1>
                        <p>this is a NodeJS page</p>

                        <form action="/message" method="POST">
                            <label for="html"> Enter Message </label>
                            <input id="html" type="text" name="messageName">
                            <button type="submit"> Send </button>
                        </form>

                    </body>
                </html>`;

//form action, url where the generated request should be sent to
//form method, use to POST a request to server
//input name-attr, to make it accessible via that name-attr
//button type submit, will send a new request, automatically targeting the host it is running og

//form will send a POST request to /message
//form will detect any inputs with name-attr, to put that name-attr in the request

let htmlCode2 = `<html>
                    <head>
                        <title>Message Page</title>
                    </head>
                    <body>
                        <h1>Message Page</h1>
                    </body>
                </html>`;



const server = http.createServer((req, res) => {

    //////Handling the Request and its header
    //console.log("Url : " + req.url);
    //console.log("method: " + req.method);
    //console.log(req.headers);
    //console.log("user's operating system is : " + req.headers["user-agent"]);


    //////setting a Response based on the Request-Url
    //giving the "/" page some content
    const url = req.url;
    const method = req.method;
    if( url === "/") {
        //res.setHeader("header", "header-key-value");
        //Content-Type; default header
        //text/html; set header key to html - will write in html format
        res.setHeader("Content-Type", "text/html");
        //write data in the response can write between '' or a variable
        res.write(htmlCode);
        //after end, cannot write any more below it
        //adding return to it, will cause to exit from createServer's function
        //and not execute the code below if
        //return re.end();
        //should return if there is other res.write to be executed below
        return res.end();
    }

    
    //as we will be redirected to "/message" from the form we want something to happen there
    //take all received data-chunks from the request(button click)
    //on receive end, output the combined data
    if( url === "/message" && method === "POST") {

        //the below event functions will be registered internally
        //in njs event emitter registry
        //and not run right away
        //then goes to code after the if?

        //Streams & Buffers
        //incoming data is sent as a stream of data, read by node in chunks/multiple parts
        //till fully parsed, so can work with the received chunks until all received
        //helps when writing data to the hard drive as data coming in

        //a buffer is used to work with chunks, hold multiple chunks and work with them, 
        //before they are released once its done


        ////receive input(chunk) and output to a txt file
        //the (on-method) allows to listen to events like (data-event, end-event)
        //takes two arguments
            //(1) (data-event) will be fired whenever a new chunk is ready to be read
                //with the help of the buffer
            //(2) a function should be executed on event fire
                //will store in requestBody, an empty array, 
                //const can be pushed as push changes the object behind the object not the object itself
                //data passes chunk-data in non-string form

        const requestDataBody = [];

        req.on("data", (chunk) => {
            requestDataBody.push(chunk);
        });


        
        //end event, once finished parsing the incoming request data
        //store the data, output the data

        //end request is an Async function will not execute immediately
        //it gets registered and code below it continues
        //so any code code depended on the parsedBody should be moved inside, like writeFile
        //NodeJS will add an "internal event listener" for the end-event
        //which will be trigged when nodejs finishes parsing the request and call its function
        //and this function will not then block other code from executing

        //Buffer; a global object in NodeJS, a bus containing our data and waits to be used
            //concatenate to the Buffer the requestDataBody - and convert to string
            //to string because we will enter text, other file types, other ways
            //take the part of the message after = sign, returns an array of the two splits, take the 2nd[1]
            //the buffer will keep concatenating incoming data and we will take the received part?

        //finished taking the data, file write
        return req.on("end", () => {
            const parsedBody = Buffer.concat(requestDataBody).toString();
            console.log(parsedBody);    //parsedBody is now messageName=hi
            const message = parsedBody.split("=")[1];
            console.log(message);

            //writeFileSync will block code execution on heavier writes, bec its a sync code
                //and other requests will not be handled until this file operation is done
            //writeFile is higher performance because it never stops/blocks the code or server
            //writeFile takes a 3rd argument, function to be executed on completion once its done,
                // receives an error, null if no error, or can handle that error, or success response
            //so this callBack function executes once writing data is done working with the file
            //switch to 302 (redirection), set header location (default header accepted by browser)
            //to "/" page and end file writing after

            //finished file write, 
            fs.writeFile("message.txt", message, (err) => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();

                //or these two lines //
                //res.writeHead(302, {"Location", "/"});
                //return res.end();

                //now will have in dev tools network
                //message url of status 302 "redirected"
                //and message.txt file created


            });
        });
    }


        res.setHeader("Content-Type", "text/html");
        res.write(htmlCode2);
        res.end();

    



    //can write this is want the server to quit after a request received
    //but we need the server running and listen for incoming requests
    //process.exit();


});


//server.listen(port,host-name);
//port; not written in production will be 80 by default, 3000 is safe to use
//host-name, localhost the default used if left empty
server.listen(3000);
// # node app.js
//open localhost:3000 in the browser

*/


const http = require("http");
const fs = require("fs");

let htmlCode = `<html>
                    <head>
                        <title>myPage</title>
                    </head>
                    <body>
                        <h1>Hello myPage</h1>
                        <p>this is a NodeJS page</p>

                        <form action="/message" method="POST">
                            <label for="html"> Enter Message </label>
                            <input id="html" type="text" name="messageName">
                            <button type="submit"> Send </button>
                        </form>

                    </body>
                </html>`;

let htmlCode2 = `<html>
                    <head>
                        <title>Message Page</title>
                    </head>
                    <body>
                        <h1>Message Page</h1>
                    </body>
                </html>`;


const server = http.createServer((req, res) => {


    const url = req.url;
    const method = req.method;

    if( url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write(htmlCode);
        return res.end();
    }


    if( url === "/message" && method === "POST") {
        const requestDataBody = [];
        req.on("data", (chunk) => {
            requestDataBody.push(chunk);
        });

        return req.on("end", () => {
            const parsedBody = Buffer.concat(requestDataBody).toString();
            const message = parsedBody.split("=")[1];

            fs.writeFile("message.txt", message, (err) => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            });
        });
    }


    //default
    res.setHeader("Content-Type", "text/html");
    res.write(htmlCode2);
    res.end();

});

server.listen(3000);


//////Import Export
////routes.js
//declare the req/res function using a constant
//export.exportedFunction = constantFunction;

////app.js
// const exportedFile = require(./routes.js)
// createServer(exportedFile.exportedFunction);

//the exported files are locked, not accessible from outside
//cannot change it but can read from outside









//Nodejs uses only one JS thread (single process), but it handles multiple requests

////handling fast finishing callbacks
//event loop; 
//starts with the server, keeps the nodejs process running
//responds to requests, 
//aware /handle event callbacks with some order

//(1) checks if there are any "timer with callbacks" it should execute
//(2) checks for other callbacks, disk I/O, network (code blocking operations)
//if many outstanding callbacks, loop operation continues, callback operations postponed to the next iteration
//(3) poll phase; checks for times if not, new I/O events (finis immediately or defer as a pending callBack)
//(4) check phase; setImmediate callBacks will execute immediately after any open callBacks have been executed
//(5) close callBacks; execute all 'close' event callBacks
//(6) exit the js program after there are no event handlers registered internally
        //exit using code or executing a file that did not listen to/on a web server

//createServer, listen events are never really finished by default
//thus we always have at least one reference
//thus we never exit of a normal node webserver program



//////handling long time taking operations
//worker pool; manages these
//runs on different threads
//detached from the code/request/event-loop
//connects to the event loop once the worker is done
//then it will trigger the callback for the readfile operation
//and this will end up in the event loop and the appropriate callBack will be executed



////as a security
//each function is only exposed to itself and not accessible
//by the other functions
//so by default we have this separation by how js works



//////Wrap up
//program lifecycle and event loop
//node.js runs non-blocking js code and uses
//an event driven code event loop for running your logic
//a node program exits as soon as there is no more work to do
//the createServer() event never finishes by default

//asynchronous code as shown in all the callbacks
//js code is non-blocking

//avoid double responses

//node.js and core modules, built in functionalities, imported using the require syntax
//have to be imported in each file used

//node module system
//import via require, for custom files/modules/third-party modules
//exports




