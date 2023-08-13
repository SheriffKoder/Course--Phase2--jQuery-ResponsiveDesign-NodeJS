

//download and install Deno on your machine
// # curl -fsSL https://deno.land/x/install/install.sh | sh


//(34.0.1)
/*
let message: string;

message = "Hi there!";

console.log(message);
*/



//(34.0.2)
/*
const text = "this is a test - and it should be stored in a file!";

//a globally available feature in deno
//helps convert text to bytes
const encoder = new TextEncoder();
const data = encoder.encode(text);

//path/filename, data to be written byte array
//as deno supports modern js, we can use a promise on writeFile instead of a callback
Deno.writeFile("message.txt", data)
.then(() => {
    console.log("wrote to file");
})
.catch(() => {

})
*/





/*
//(34.1.1)

//this will import a function from this remote file
//we do not have to use npm to install this
//also not built into deno
//spin up a http server
import { serve } from "https://deno.land/std@0.198.0/http/server.ts";

*/
/*
//pass in an object with configuration
//the port we want to listen to
//returns a server which we can store in a constant
//const server = serve({port: 3000});


//async iterables //for await of (js syntax)
//server is an async iterable
//which means it is like an infinite array full or promises
//the server generates new promises we can await
//and a new promise which we can resolve is generated for every incoming request
//for the req object is generated for every incoming request, we got a respond method
//which wants an object, where we can specify a body

//deno outside of the box supports top level await
//await is not wrapped into an "async" type function
//this is also supported in modern versions of node.js

//when code is executed
//deno reaches the import server, downloads that file and its dependencies
//downloads those files to our local machine, caches them locally
//so when run this script again it does not have to re-download them
//to speed up execution time and not exhaust all bandwidth

//error: Uncaught TypeError: server is not async iterable
for await (const req of server) {
    //!! we execute this code for every incoming request
    req.respond({body: "Hello World \n"});
}
*/
/*
const handler = (request: Request): Response => {
    const body = "Hello World \n";
    return new Response(body, {status: 200});
};

const port = 3000;

await serve(handler, {port});


//granting network permissions
// # deno run --allow-net app.ts
*/



//(34.2.0)
import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

//ctx, context, summarizes the request/response objects into one
app.use((ctx) => {
  ctx.response.body = "Hello World! (from Oak)";
});

await app.listen({ port: 8000 });

// deno run --allow-net app.ts















/*
///////////////////////////////////////////////////////////////////
//Deno introduction

an alternative to node
created by the inventor of node
still written with js, but there are differences

how it is similar to node ?
how to transfer node knowledge to deno ?
is there an advantage to using deno over normal node ?


DENO;
a javascript runtime based on Chrome's V8 js engine (just like node)
allows to run javascript outside of the browser (just like node)

1) but not just a js runtime, but js and ts runtime
can execute uncompiled ts code, it has a build in TS compiler

but node executable is only able to execute js code
TS code needs to be compiled to js code on node apps

2) Deno supports URL imports out of the box
and modern js features are embraced (e.g Promises)

url imports are different from how you manage dependencies in node projects

3) Deno is "secure by default" and requires
explicit execution permissions


////Why Deno ?
Deno is an attempt to make node better

Deno, 
JS + Typescript support
modern JS features
URL imports
script permissions

Node.js
only JS support
modern JS features [missing]
custom module system
no script permissions
= but it is established, has active ecosystem, used by thousands of big companies
= has a huge base of maintainers and is production-proven

but you might not need all Deno enhancements

///////////////////////////////////////////////////////////////////
//Deno setup

go to url "deno.land"

will find all possible ways of installing deno

for mac will use Using Shell (macOS and Linux):
>> # curl -fsSL https://deno.land/x/install/install.sh | sh

this will download/install deno
Deno was installed successfully to /Users/sheriffkoder/.deno/bin/deno


>> Manually add the directory to your $HOME/.zshrc (or similar)
export DENO_INSTALL="/Users/sheriffkoder/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"

> can view hidden files on mac by
CMD + SHIFT + .

> if do not have the file, can create it yourself

>> close the terminal/console
>> run # Deno, will get you to the interactive mode


" on windows just paste the command in powershell then run 'deno' "


///////////////////////////////////////////////////////////////////
//(34.0.1)
//Deno use

>> create a new folder
>> create file "app.ts"


>> # deno run app.ts
if ran the same code again
will find out it will skip compiling
because it caches compiled code
and will reuse the already compiled code


now we will discover if deno has core-modules like node
like the fs, path etc.
and promise based api versions available for some of these core-modules

however with deno there is something similar
called the namespace API
 
these can be called on a deno object
Deno.moduleName

the "fetch" is available here but not available in node
for sending http requests

the core philosophy for deno is to be as compatible as possible
that means that any code that could run out of the browser
is also supported in deno

can think of the type of these APIs as:
(what you can do in the browser)
- 
(features that only make sense in the browser)
+ 
(features that can't be used inside of the browser e.g writeFile)


///////////////////////////////////////////////////////////////////
//(34.0.2)
//using the runtime api


want to store some text in a file

trying to access an api 
Deno.
is not understood by the IDE

to fix that**
go to view > extensions > search for Deno > install+enable
this will bring deno support for vscode
switch back to view > explorer


>> use the TextEncoder deno constructor object 
to convert the strings to bytes

>> use the writeFile deno API that takes outputFile, byteDate

>> use a .then to confirm the process



///////////////////////////////////////////////////////////////////
//(34.0.3)

//Deno's security model

on running the code
the console will ask to give permission to write a file
this is a key feature in deno

when we write a script with deno
this script does not have all possible permissions
read/write files, sending/listening to network requests

why? because for example on node
your code can do anything, can also delete all files on your system
and nothing can stop it from doing that

and sometimes you do not want a file to do certain things

thus, you have to trust the code
have to set the appropriate permissions
by setting some security specific flags

>> change the running code form
# deno run app.ts
to
# deno run --allow-write app.ts

--allow-write   (write to any file)
--allow-read
--allow-write=message.txt,message2.txt (write to these files only)


///////////////////////////////////////////////////////////////////
//(34.0.4)

//repeating the same code in 34.0.3 with node

>> go to app.js

when using the "require" will get an IDE warning
to fix this we will have to disable Deno extension

differences
when using writeFile, data can be just a string
does not return a promise, pass in a callBack (code that executes when it completes)

or use .promises to turn it to a promise based method

# node app.js
node by default has permissions to run any code
even from sources you do not know


the main difference is TS which is built into deno
and the permissions



//524-532 (16)
///////////////////////////////////////////////////////////////////
//(34.1.0)

//How code and features are being organized

kinds of libraries:

1) the core-APIs or namespaces can be explored in the Docs
- stable and maintained by core team
- no installations, or imports are required to use those features
- only a small set of low-level core functionalities


2) we also have the "Standard Library"
- modules that are maintained by the Deno team
- unstable and maintained by core team
- i.e some things/features could still change
- which have to be imported into your files in order to use them
- can be found on Deno.land > standard libraries
- are build on the core APIs and do certain things "easier" to use


3) 3rd party libraries
- maintained by community
- stability and maturity differs
- need to be imported into scripts to be used
- can be found on Deno.land > third party libraries
- are build on the core APIs and do certain things "easier" to use

*/
/*

///////////////////////////////////////////////////////////////////
//(34.1.1)

//using the standard library

//http library
to spin up a web server
on it's page there is a dummy code explaining how to use it


you can see the imports are from an "https://deno.." url
this is not supported in the default node

where we point at another server to import that file
the idea is not to download a file and store it locally
but to import any js or ts file from any server
and start using these exported features in your files

///////////////////////////////////////////////////////////////////
//(34.1.2)
//create a node equivalent to the code from 34.1.1


the differences of node from Deno
- we import from a module not a URL
- how we process request
- how we create a server and not listen automatically
- we run the code with node app.js without any permission setting


///////////////////////////////////////////////////////////////////
//(34.2.0)
//using a framework for Deno "Oak"

just as we used express for node to avoid writing complex code
we can use a framework for Deno to avoid such thing

a framework to take care of the heavy lifting
and focus on our core business logic

which kind of web apps we want to build
- APIs
- Server-side Rendered Views

both can be built with Deno


for Deno we have the Oak framework
a middleware-focused Deno framework for building web applications
it is a third party module



inspired by "Koa" a framework for node.js
which is not far away from express, but does some things differently
inspired by express

there are frameworks for Deno to use express but these are still not mature

with Deno
we do not have a package.json file (package management file)
or a tool like npm to manage dependencies
because we have the URL imports, not have to install packages


>> copy the code from the "Oak" third party page on Deno.land



///////////////////////////////////////////////////////////////////
//(34.2.1)


we can import with Deno remote URLs as well as 
local files

// import something from './my_file.ts';

also:
To get better auto-completion in the IDE, 
execute your code once and let Deno download + cache those remote files locally. 
Thereafter, you should get better autocompletion

If you ever want to force Deno to re-fetch the remote files 
(i.e. to clear the local cache), 
you can do so by executing your script with the --reload flag 
(e.g. deno run --reload my_file.ts)

If you want to lock in a certain version for a remote file, 
import { serve } from 'https://deno.land/std@0.51.0/http/server.ts';



///////////////////////////////////////////////////////////////////
//(34.3.0)

//Building a very basic node REST API
//with Node.js then transfer it to Deno

>> create new sub folders "node", "deno"

>> create in the node folder
file app.js - where we will build our node API
routes folder

>> cd into the node folder
and run #npm init
to create a package.json file

> also install express and body parser
# npm install --save express body-parser

>> write basic API app in the app.js/todos.js(router)


>> cd back into the node folder
>> execute the app.js file

>> test the API with Postman

//GET localhost:3000/todos
{
    "todos: []"
}

//create a new todo
//POST localhost:3000/todos , body, raw, json
{
   "text": "A new todo!" 
}


//copy the new todo ID (date format)
//PUT localhost:3000/todos/ID, body, raw, json
{
    "text": "Updated todo text"
}

//delete
//DELETE localhost:3000/todos/ID
//not need to send any data, just send the request


///////////////////////////////////////////////////////////////////
//(34.3.1)

//building the same API with Deno and Oak

>> add in the deno folder app.ts file
> also add a routes folder with todos.ts

copy the code from the main folder's app.ts

//now want to handle the requests in the routes file
>> import the Oak router in todos.ts router
so we have a router and can use different http methods on it put, push etc.

>> use the router in app.ts

>> in the router file
- define a TS interface for how the todo's should look like
- look for how the response is created
- extracting the body in Post/Put is a little bit different
- same logic as in the node middleware's
- handling a next() middleware in app.ts


///////////////////////////////////////////////////////////////////
//(34.4.0)

//comparison

there are some small differences
mainly in the philosophy (permission, modern js embracement,  )

Deno: 
supports TS and JS
- based on modern JS features like promises
- support URL imports
- execution permissions (--allow-read , net) etc
- very new, will have bugs, no big ecosystem*

Node
- supports only JS although custom TS compiler is possible
- uses older JS in some of its core modules
- brings its own modules system
- no execution permissions


when deciding what to use
it comes down to which features matter to you
or what style do you prefer

use deno for side-projects for now
learning node will never be wrong
transforming to Deno can be easier then














*/


