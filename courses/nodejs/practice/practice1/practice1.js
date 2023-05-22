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



/////////////////////////////////////////////////////////////////////////////////////////////
//////how nodejs works
we write the server in js code and run the server
listen for incoming requests

route/handle requests and do tasks with it
communicating with a database that runs on a separate database server
reached from your backend

return data/response to the user based on the request using node-core-modules
response can be html/json/xml/files/dynamic-content-html


requests and responses have descriptive headers
req/res are done through protocols like (standardized way of communicating/rules)
that defines how a valid request looks like and how data should be transferred between the browser/server
protocols understood by the browser/server, 
//hyper text transfer protocol
//hyper text transfer protocol secure (ssl encryption turned on, encrypt transmitted data)



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
//require("fs").writeFileSync("practice1_output.txt", "this is the output for practice1 ex3");

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
const http = require("http");



//createServer takes a function that will run on each incoming request to the server
//createServer returns a server

//req: request, res: response
//req: request object created by nodejs, data of incoming request 
//request happened by user visiting the host address
//req.url, req.method, req.headers are the items of interest in the request

//

let htmlCode = `<html>
                    <head>
                        <title>myPage</title>
                    </head>
                    <body>
                        <h1>Hello myPage</h1>
                        <p>this is a NodeJS page</p>
                    </body>
                </html>`;



const server = http.createServer((req, res) => {

    console.log(req.url, req.method, req.headers);

    //res.setHeader("header", "header-key-value");
    //Content-Type; default header
    //text/html; set header key to html - will write in html format
    res.setHeader("Content-Type", "text/html");
    //write data in the response can write between '' or a variable
    res.write(htmlCode);
    //after end, cannot write any more below it
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




