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

//# npm install --save-dev mocha chai //(30.0.1)


const express = require("express");         //(24.0.2)
const app = express();                      //(24.0.2)
const bodyParser = require("body-parser");  //(24.0.3)
const mongoose = require("mongoose")        //(25.0.5)
const path = require("path")                //(25.0.7) to import static images
const multer = require("multer");           //(25.2.0) uploading files

const feedRoutes = require("./routes/feed.js"); //(24.0.2)
const authRoutes = require("./routes/auth.js"); //(25.2.5)


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
const mongoDB_URI = "mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/messages?retryWrites=true&w=majority";
//(25.0.5)
mongoose.connect(mongoDB_URI)
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

manual testing
pro: can interact with the app like users do
con: easy to forget to test something, can test some parts
or introduce code edits that can make bugs in other parts of code
you cannot be aware of
it is hard to test every possible feature or combination of steps
after every change made

automated testing:
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
in REST API when just finished Async/await

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




///////////////////////////////////////////////////////////////////
//(30.0.2)

//testing the Auth middleware

>> create auth-middleware.js in the test folder

>> import the auth middleware














*/




















