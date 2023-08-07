
//const express = require('express');
import express from "express"; //(32.0.1)
const app = express();


//default node js import method
//const resHandler = require("./response-handler");

//(32.0.1) ES import method 1
//can give the import a custom name
//import resHandler from "./response-handler.js"; 

//(32.0.1) ES import method 2
//will have to use the same name as defined in the export in the other file
import {resHandler} from "./response-handler.js"; 



app.get('/', resHandler);

app.listen(3000);


///////////////////////////////////////////////////////////////////
//section 32

/*


///////////////////////////////////////////////////////////////////
//Modern javascript code practices


over the years node js and javascript code evolved

node js was created at a time where we did not have the same js features we have now
and thus node js is missing some features or do not use all those latest features

node js support modern js features

we will discover two features that landed in node js that are interesting

ES modules; a different way of importing and exporting files
Promises in Core APIs like the file-system api node ships with
    those are traditionally callback based
    and we can use promises for those

as it is used mainly in modern FE applications
can be used in the BE code to have a universal way of import/export

also parts of it were experimental at the time the course started


///////////////////////////////////////////////////////////////////

//what are "ES Modules" ? (optional)

a concept coming from the browser side js code
there we can import and export files 
a feature was not available before for the browsers

export const doSomething = () => { ... };
to
import { doSomething } from "my-file";

official node js documentation for ES Modules to learn about it



///////////////////////////////////////////////////////////////////
//(32.0.1)
//working with ES modules and node

a simple express middleware
that reads an html file and sends

when 
#node app.js
visit localhost3000 will see the html rendered on the screen

>> create a new file "response-handler.js"

whatever you learn here will also be used for browser side js code

//to start using this method, we first have to 

//enable it
>> add to the json 
  "type": "module",


//use it
1) change file ext from .js to .mjs
2) keep files ext as .js, but in the package.json 
make sure that the type property is set to module
this way you must use this import/export syntax everywhere
and have to add .js to the imported "file" names

and we have two methods or ways of writing the export/import
the external packages (express, fs) use method 1 by default, 
  so we use method 1 only on them
.



///////////////////////////////////////////////////////////////////
//(32.0.2)

//using globals
//build the __dirname variable


with the modern ES Syntax
__dirname, __filename will not work like before
because there is not global syntaxes
 
on the official docs the solution exists

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



///////////////////////////////////////////////////////////////////
//(32.0.3)

//Promises in Core APIs
//using promises with the core modules instead of callbacks


as you can see in node js and its core APIs 
are callback based
as seen in 
fs.readfile("html.html", "utf8", (err,data) => {
    //callback
})


now a lot of core APIs built in node now have Promise support

checking on the fs file-system documentation of methods
we can see that there is an fs Promises API
and all the fs features are available in a Promise based version

for example 
filehandle.writeFile(data, options)
which actually embraces promises

to use that we have to import the module in a different way
import fs from "fs";
to 
import fs from "fs/promises";

if using the default node import syntax
const fs = require("fs").promises;

we use promise chaining to escape from callback hell


*/

