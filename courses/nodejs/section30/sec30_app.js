///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs

//# nom install --save express-session  //s14: use sessions
//# npm install --save connect-mongodb-session //s14: store session in MDB
//# npm install --save bcryptjs  //s15: password hashing
//# npm install --save csurf    //s15: protecting against CSRF
//# npm install --save connect-flash    //s15:3.9 wrong credentials 
//# npm install --save nodemailer nodemailer-sendgrid-transport //s16 3.11 sending emails
//sendGrid/Mailchimp etc need to be sorted out yet
//# npm install --save express-validator //s18 validating inputs //s18 18.0.1
//# npm install --save multer //s20: parse incoming files (upload)
//# npm install --save pdfkit //s20.2 generate pdf files
//# npm install --save strp //s23 using strp


//# npm init
//# npm install --save express      //s24
//# npm install --save-dev nodemon  //s24
//# npm install --save body-parser  //s24: to parse incoming requests body
//# npm install --save express-validator //s25.0.4
//# npm install --save mongoose      //s25.0.5
//# npm install --save multer       //(25.2.0) to upload images
//# npm install --save bcryptjs     //(25.2.6) encrypt passwords
//# npm install --save jsonwebtoken //(25.2.8)
//# npm install --save socket.io    //(27.0.1)

//# npm install --save-dev mocha chai //(30.0.1) testing
//# npm install --save-dev sinon    //(30.0.3) testing with mocking 3rd party methods in our code



const express = require("express");         //(24.0.2)
const app = express();                      //(24.0.2)
const bodyParser = require("body-parser");  //(24.0.3)
const mongoose = require("mongoose")        //(25.0.5)
const path = require("path")                //(25.0.7) to import static images
const multer = require("multer");           //(25.2.0) uploading files

const feedRoutes = require("./routes/feed.js"); //(24.0.2)
const authRoutes = require("./routes/auth.js"); //(25.2.5)

require("dotenv").config(); //(29.0.1)


//(25.2.0) uploading files
const fileStorage = multer.diskStorage({
    //where the file should be stored
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    //how the file should be named
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + "-" + file.originalname)
    }
});


//(25.2.0) uploading files
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg"
    ) {
        //no error, return true
        cb(null, true)
    } else {
        //no error, return false
        cb(null, false)

    }
}



//(24.0.4)
//solve the browser CORS Error
//before we forward the request to the routes
//add headers to any response
app.use((req, res, next) => {
    //we can add a header to the response
    //with setHeader
    //even though the response will not be sent from here yet
    //set it to all the domains that will access our server
    //allow access from any client with "*" or lock it down to specific domains
    //and separate them with commas
    //allow specific origins to access our data
    res.setHeader("Access-Control-Allow-Origin", "*");
    //allow these origins to use specific http methods you want to be used
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    //headers the clients might set on their requests
    //this allows on the frontend to set content type in the fetch config
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});


//(24.0.3)
//will define the body-parser in another way than the used before
//as we are using json for interactions and not form data
//we used urlEncoded for used by enctype=x-www-form-url-encoded by forms
//will use the json method
//to parse incoming json data
//so we are able to extract it on the body (req.body) in controllers
app.use(bodyParser.json()); //enctype of application/json


//(25.2.0) uploading files, register multer
//use the configs we defined, 
//tell multer we will fetch a single file in a field named image in the incoming request
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));



//(25.0.7) serving static images
//any request that goes into /images
app.use("/images", express.static(path.join(__dirname, "images")));




//(24.0.2)
//will forward any incoming request to feedRoutes
//only incoming requests that start with "/feed"
//filtering mechanism
app.use("/feed",feedRoutes);
app.use("/auth",authRoutes); //(25.2.5)


//(25.0.8)
//error handling middleware
//this will exe whenever an error is throw/next
app.use((error, req, res, next) => {
    //console any error reached
    console.log(error);
    //status code a custom method defined in the controller
    //having code of 422 or 500
    //give a default of 500 (server-error)
    const status = error.statusCode || 500;
    //exists by default, hold the message passed in the controller validation error handling
    const message = error.message;
    const data = error.data; //(25.2.5)

    res.status(status).json({message: message, data: data})
})


//connect to the messages database by amending /messages
const mongoDB_URI = "";
//(25.0.5)
mongoose.connect(process.env.MONGO_URI_MESSAGES_API)
.then((result) => {
    //the listen returns a new node server
    const server = app.listen(8080);
    //(27.0.1)
    //what is extracted exposes a function
    //which requires our created server as an argument
    //this sets up socket.io
    //we use the http server to establish our websocket connection
    //this gives us a websocket.io object
    //that uses the http protocol as a basis
    //which setups all the webSocket stuff behind the scene for us
    /*
    const io = require('socket.io')(server, {
    //     //avoid browser's CORS error on new socket.io version
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    */

    //(27.0.4)
    //will use the configuration through the socket.js file instead of direct
    const io = require("./socket.js").init(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }

    });
    // //use io to define a couple of event listeners
    // //to wait for new connections, whenever a new client connects to us
    // //we get the client/connection-between-server-client (socket)
    // //this function will be executed for every new client that connects
    // //not only one time, but as often as required
    io.on("connection", (socket) => {
        console.log("Client connected");
    })
})
.catch((err) => {
    console.log(err);
})

//(24.0.2)
//listen to port 8080, will use 3000 for something else later
//app.listen(8080);



///////////////////////////////////////////////////////////////////
//section 30

/*
///////////////////////////////////////////////////////////////////
//(30.0.0)
//Testing node applications

//will return to the snapshot of our code
in REST API when just finished Async/await

automated code tests, 
where we write code to test our code
not just send requests to test the responses (manual testing)

////What is testing ?

//manual testing
pro: can interact with the app like users do
con: easy to forget to test something, can test some parts
or introduce code edits that can make bugs in other parts of code
you cannot be aware of
it is hard to test every possible feature or combination of steps
after every change made

//automated testing:
we write code that tests our code
we define steps that should be executed
we define certain scenarios that are tested
and we run these tests on every change made whenever we want

we can even put them in our deployment process
and run them before the app gets deployed

pro: can cover all core features
define all possible scenarios want to test
and run automatically after every code change
and make sure we do not introduce breaking changes

cons: if wrote a wrong test, can test for the wrong scenarios
so it is only the tests that you define and it is hard
to test the user interface and not see what the users see

so it is a combination between the two ways to use


////Why testing ?
automatically test everything we define
after every code adjustment

so it is easy to detect breaking changes
even in the places you didn't expect to break after latest change

ensure we have predictable and clearly defined testing steps

we can rely on the scenario always being the same
and not forget testing steps

//////Testing tools & setup

tools to run the tests (ex. Mocha)
not only executes your code, but gives an output
if test passed or test failed

assert results (ex. Chai)
to validate the test outcome
define certain conditions that have to be met
find out if certain scenarios succeeded
there are alternatives like jest

Managing Side effects / working with external dependencies
certain complex scenarios
will use Sinon
to create Stubs or mocks


///////////////////////////////////////////////////////////////////
//(30.0.1)
//Setup and writing first test


//will return to the snapshot of our code
in REST API when just finished Async/await section27 directory

because that is nice to test and dive into testing
testing different kinds of node applications like GQL
all have their own specialties and complexities

will learn the core concepts
for node application testing


setup the testing environment with mocha and chai

//google for mocha js to find mochajs.org
to learn more

# npm install --save-dev mocha chai

>> go to the package.json
add to scripts
"test": "mocha" and remove the old default syntax

>> now can run in the console "npm test"
but we still have no test files

mocha by default looks for a folder named "test"

>> create test folder in project directory
to hold the testing code
>> create .js test file, any name

mocha is responsible for running the test and it function
where we will check for a success condition with the help of Chai


>> # npm test
will look for the test folder
and run all tests that are defined in that test folder

✔ should add numbers correctly
✔ should not be equal to 6 

tests run standalone, totally de-attached from our application

you should not have the actual code in your tests with js
but we import code and inject arguments to see the result

think about testing as trying different scenarios
not trying to build the framework 



///////////////////////////////////////////////////////////////////
//(30.0.2)

//testing the Auth middleware

>> create auth-middleware.js in the test folder

>> import the auth middleware

>> test parts of code using "it"(mocha) and "expect"(chai)
>> combine all tests of this middleware in a "describe"(mocha)

describe outputs the tests in a list format with header and items

//not test external dependencies
you should not test, whether the verify function works correctly
because the verify is not a function owned by you
it is the job of the package authors to test their code and make sure
it works correctly

we only want to test if our code behaves correctly


///////////////////////////////////////////////////////////////////
//(30.0.3)

//mocking third party returned values


when we have a third party dependency and want to 
use a random value instead of its returned value
we can use mocks or Stubs
where we can replace the "verify" method with a simpler method

//manual method
>> import the jwt in the auth-middleware test file
and store in the method want to mock a function that returns 
a value as if it is supposed to return it


however this method has a downside
as if this test2(gives a token) was put before the test1 that (checks for a token)
test1 would have a token and not test correctly
as the verify method was Globally replaced/overwritten

//automated method
so instead of manually Stub or Mock methods
it is good to restore the original method setup

# npm install --save-dev sinon

>> require in the test file
> create a stub for jwt.verify
> restore jwt.verify after expect


with sinon stubs can:
replace built-in methods with empty methods
define what they should return, use that returned value
find out whether they have been called
replace external methods, restore them once you are done


///////////////////////////////////////////////////////////////////
//(30.1.0)

//testing controllers

for the feed controller we have routes
that need to be authenticated


we do reach the functions in the controllers
through our routes which are defined in the routes folder
where we send requests to in the end
these are the API endpoints we are exposing

we are doing unit testing
for the signup, login functions

we are not testing the routes whether we can send a request to login
and can execute the login function in the auth controller
because the entire forwarding of the request or execution
that is all handled by express
so we do not need to test this flow

can test if it behaves correctly if no email is set for example
or if already have a user with that email

but now we have a new thing
where we interact with the database
through the models (ex. User) to find

//so how can we test the database operations:
we have two strategies

1) stub/mock parts that actually rely on DB access
mock User.findOne which returns a result we can test on
and see if our code behaves correctly in login for example
! how code behaves when findOne throws an error (having trouble interacting with the DB)
! how code behaves if we do not have a user with that email address
both two scenarios should throw an error eventually

with status codes depending on the case 401 or 500


472
///////////////////////////////////////////////////////////////////
//(30.1.1)

//testing an async code in 

>> create test > auth-controller.js


where we define a test
stubbing findOne
creating a dummy req as its needed in the controller part we are testing

call the login method which will return (as we put in its code)
undefined or an error which will be wrapped in a promise

in this promise, can expect the promise's result to be
err with status code or not


//however the "it" will not wait for the async code to finish and return
use the "done" function in the it function arguments


///////////////////////////////////////////////////////////////////
//(30.1.2)

//setting up a testing database

however it is a valid setup to have a dedicated testing database
the downside that the tests will run a bit longer 
the upside that will have a valid testing environment

>> create a test in test > auth-controller.js

> make a connection to a test-messages database (will be created on use)
> create a dummy user and save to this database
> create a dummy req and res constants with data replicating the status line code
> which executes on success
> expect and use done
> delete the created user from DB, close the DB connection, use done



//can give the test a longer timeout period
by adding to test: "mocha --timeout 5000" in package.json



//476
///////////////////////////////////////////////////////////////////
//(30.1.3)

//lifecycle hooks by mocha
to have a cleaner setup
to not mix many codes in our test cases

inside describe, we have extra functions we can call
that actually runs before tests or after (each)

for example we do not want to create a user before every test
but initially when our test run starts

use before
and once its done
it will then start running the test cases

>> put the initialization code in "before"
>> put the clean-up code in "after"


before, before all test case
beforeEach, runs before every "it" function call
    useful if want to reset something or initialization before every test case

after, after all test case
afterEach, runs after every "it" function call
    useful if want to do some cleanup work needs to be done after each test case


///////////////////////////////////////////////////////////////////
//(30.1.3)

//testing code that requires authentication


//test createPost in feed.js controller
relies on the is-auth middleware

needs on the user being authenticated

access req.userId part of the request object
as it is added in the is-auth middleware folder
which is the first middleware in routing
that stores a jwt decodedToken.userId in the req.userId

want to test the createPost controller and not the full flow
fake that, pass in a request object that has this user id

and make sure we do create a post successfully
and validate that this post was added to the users post array
by user.posts.push(post)

>> create a new file feed-controller.js

copy the code from the auth-controller test file
we need the same imports, before and after
but will work on the "it" 

///////////////////////////////////////////////////////////////////
//wrap-up

learned to use mocha and chai 
to write tests and expectations

can test async code
can test with databases and stubs (if have external dependencies)

always ask yourself
are you testing something
you are responsible for with your code

can divide a complex function/controller
into parts to test, which makes testing easier and not stab too much

how to test sessions or cookies ?
you can search that online

testing is about trying stuff out
gathering experience, diving into discussions with other developers
and that will make it easier over time

and the official docs of chai and mocha can help
with defining tests, grouping tests, 

and can find several third party packages that can make 
testing things like sessions or promises even easier
and write leaner code than what we wrote here

*/


///////////////////////////////////////////////////////////////////
//section 31

/*
481
///////////////////////////////////////////////////////////////////
//npm as a build tool
//(31.0.0)

node and npm the package manager we get when installing node js
can also be used as a build tool
as a tool that runs utility scripts on the computer
and can help build any (mostly js) project FE or BE

when we install node js we get 
- node.js 
    - execute js code
    - interact with files*

- npm (node package manager) 
    - to download new packages or defined dependencies
    - run our code/scripts
    - create and share packages *

npm is a CLI command line interface 
used from the terminal

//
we can have a code with an Isolated functionality" from other code
we can put it in a package with npm help to share it internally or externally

create and share packages, through the npm repo
which is a cloud service
where you can host packages you created

//
can visit npmjs.com and search for packages

npm install express@specific-version-number

packages also have their internal dependencies of dependencies

can learn more about npm commands, creating/managing packages
on the site docs

#npm help
get instructions about the available commands you may run

#npm install --help or npm install -h
get instructions about a specific command
how to run this command
what options we have to add additional flags



//running scripts
getting stated > using npm > scripts

that is related to the package.json file
when you put a project under control of npm
which is done through the
# npm init 

in this json
not only define certain dependencies
but can add and run scripts

# npm run scriptName

or as in react
scripts > start > "react-scripts start"
where react-scripts is a dependency package/code we want to run

we will use node js to be able to run on our machine 
and not being limited to spinning up a web server

dependencies in the json file sometimes have a "^" before the version number
like "express": "^4.18.2",

~ : Approximately equivalent to version, i.e., only accept new patch versions
^ : Compatible with version, i.e., accept new minor and patch versions
none: must match version exactly
> : must be greater than version
> =
<
< =
1.2.X : 1.2.0, 1.2.1, etc., but not 1.3.0
* : matches any version
latest: obtains latest release


///////////////////////////////////////////////////////////////////
//npm as a build tool
//(31.0.0)

until now node js was used to
- spin a webserver and write code that runs on the server side

but theoretically you can run any js code with node js
and specifically you can interact with your local file system read/write

//file-system
parse (read) file
manipulate content
output new file

/////////////////////////////////
//Build tools to optimize code
mostly in FE development
for example the react app still uses package.json
and uses npm to install packages
these packages are holding code that runs on the browser

react code is not natively supported by all browsers (old ones)
is separated, and combined by a package
but then transformed into another code by a "build tool"
for development with start
and production with build

merges all the code and transform into a format can run on all browsers
that is also minified and optimized

optimized to be shorter and not use modern js features
const copy = (arr) => 
{
    return [...arr];
}

//becomes

var a = function (b) 
{ return b.slice() }

on the server the code sits there and it runs
on the browser the code has to be downloaded
so want to keep it as small as possible 
to start the app as quickly as possible

this is possible using npm and node
to transform the code to such qualities
/////////////////////////////////


///////////////////////////////////////////////////////////////////
//
//using npm in build process

we can install packages that run on the browser for the FE too

npm use:
we install the packages with npm
and start the scripts that uses these packages with npm

now npm work is over
and node js takes over from here

in the package folder
the code in the bin folder will be executed with node js

this code will be executed on your machine
which also uses other dependencies and file-system files
before the code gets deployed to the server

other dependencies like webpack
which orchestrate your build workflow, compile your different files
(your source code) parse them, pull all code together, rewrite code in supported syntax
these methods are done with packages behind the scenes which are used by npm
and then the code in these packages is executed through node js
unlock next gen features and handle them correctly using other tools
like babel



we can tell we are using node js there
by seeing the different import/export syntax from ES's
const webpack = require ("webpack");
instead of 
import { file }

so in the end
you can use node js to execute any js code
which also uses node js features
which can also run utility scripts 3rd party or own
takes our source code
transform it as defined by the packages we use
because we do not want to write all that build coding on our own

*/



















