"use strict";
// # tsc --init                         //(33.1.0)
// # npm install --save express         //(33.1.0)
// # npm install --save body-parser     //(33.1.0)
// # npm install --save-dev @types/express //(33.1.1)
// # npm install --save-dev @types/body-parser //(33.2.1)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//const express = require("express");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
//(33.2.0) import the default export of the todos.ts file
const todos_1 = __importDefault(require("./routes/todos"));
//(33.2.1)
const body_parser_1 = __importDefault(require("body-parser"));
//(33.2.1) register the bodyParser
app.use(body_parser_1.default.json());
//(33.2.0)
app.use(todos_1.default);
//listen has the handle argument with type any
app.listen(3000);
//the dis folder holds our finished node app
//as stated in //(33.3.1)
/*
///////////////////////////////////////////////////////////////////
//(33.1.0)

using TS in a simple node.js app


>> create a new empty folder
open it in vs code and run
>> # tsc --init

//turn it to a new npm controlled project
//where we can then install dependencies
>> npm init


//will create a basic node.js API with typescript

>> # npm install --save express
>> # npm install --save body-parser


>> change the extension of app.js to app.ts

506-DENOXX
///////////////////////////////////////////////////////////////////
//(33.1.1)

now TS red-line require
as require, is only available when running this code with node

TS does not know where we want to run this code
so to fix that

// # npm install --save-dev @types/node

this package provides typescript translations for js features
and can use node.js syntax in our code with it installed

if checked the node_modules > @types > node
there are .ts files that tell TS how to translate these
node.js code to TS code so it can be converted to js
so then can translate core-modules to ts




but still we do not have this extra support from the IDE of "auto-completion"
which also ensures that we cannot pass in invalid data


//we can make TS aware of the express package
as we made it aware of the node here before


// # npm install --save-dev @types/express


still the auto-completion will not work on node
because TS is used to run on the browser
and the default import syntax of node js will not work
or not expected by TS

we can change this expectation in the TS config file
>> add "moduleResolution": "node" below "module": "commonjs"


//change the import syntax in app.ts
using the ES module import syntax (without changing anything in the .json file like before)
will be transformed in the .js file to require as we want
because we are using the type/express

now we can get auto-completion (i.e extra IDE support)


we will also later be able to omit the file extension

!! there is a difference between the file we write .ts
and the file will be available in the server .js










*/
/*
///////////////////////////////////////////////////////////////////
//(33.2.0)

// writing typescript express.js code


>> create a routes folder
>> add to the folder todos.ts

and setup the router file


///////////////////////////////////////////////////////////////////
//(33.2.1)

//access the request body.text


//define how a todo should look like

>> create a models folder
>> define and export a Todo interface
>> import into the routes folder
>> use the interface #1, #2


>> define in the router, a .post router
that will get the text from the request
>> import the body parser in app.js

the IDE and TS are able to understand the body-parser package
this gives us auto-completion
but for further package support we can install its @types
however we do not need that for this project

# npm install --save-dev @types/body-parser

>> now we can use the req.body


//you can add validation like we did in previous projects
//it is the same code, but will have to install the
//@types package for the validation library


///////////////////////////////////////////////////////////////////
//(33.2.2)

//a route for replacing a todo, deleting a todo
>> add in todos.ts router
router.put("/todo/:todoId", (req, res, next) => {



//add a delete route in the todos.ts



///////////////////////////////////////////////////////////////////
//(33.2.2)


//to test the entire API we first need to compile it
//and we need to compile all the TS files in this project
# tsc

//we can only execute .js code with node not TS
# node app.js

////in the postman program
// GET localhost:3000/         //we have no todo's yet, empty array

// POST localhost:3000/todo
Body, raw, JSON

{
    "text": "My first Todo!"
}

will get back a response 201 with the todo that was created
and the new todos array


// PUT localhost:3000/todo/the-previous-created-todo-id-date-format

{
    "text": "Updated todo!"
}


// DELETE localhost:3000/todo/the-previous-created-todo-id-date-format




///////////////////////////////////////////////////////////////////
//(33.3.0)

//extra TS features we can utilize
//enable auto-correction for body and params preceding keywords


auto completion for body in the req.body.
TS does not understand what will be in the body of the incoming request

and the same in params in req.params.

because body and params are of type "any"

and if put .texts instead of .text
the IDE will not warn about this mistake

>> so we can convince TS that the req.body is of a certain type
> in the function
> or as a general type in the file
> and use in post and put for example

to get this extra type safety and avoid typos

you can define multiple aliases for bodies and params
if you have different routes for different bodies and params



///////////////////////////////////////////////////////////////////
//(33.3.1)

//moving to a better project structure

you can create controller folders and move the routes
middlewares there

you should not work or edit the .js files
all your work should be in the .ts files

thus want to make sure that the compiled files
end up in a different place

>> in tsconfig.json
comment in the "outDir"
and change path to ./dist

this will create a new dist sub-folder
and all our compiled files will end up in that folder

>> now running # tsc
will find we get the same files we got before
but in the tsc
with the same file structure as the project directory
but with only .js files


//the dis folder holds our finished node app

////maybe also can have a separate folder for the source code

>> add src folder
>> move the models folder, routes folder, app.ts file
into the src folder
>> in tsconfig.json
change the rootDir path to ./src
//to make it clear that this folder contains our TS code

now # tsc
translates code from "src" folder to "dist" folder











*/ 
