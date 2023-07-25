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

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////


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
//# npm install --save graphql express-graphql //(28.0.1)

const express = require("express");         //(24.0.2)
const app = express();                      //(24.0.2)
const bodyParser = require("body-parser");  //(24.0.3)
const mongoose = require("mongoose")        //(25.0.5)
const path = require("path")                //(25.0.7) to import static images
const multer = require("multer");           //(25.2.0) uploading files

const {graphqlHTTP} = require("express-graphql"); //(28.0.2) setup GraphQL
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

//const feedRoutes = require("./routes/feed.js"); //(24.0.2) //-(28.0.1)
//const authRoutes = require("./routes/auth.js"); //(25.2.5) //-(28.0.1)


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


//added here so all the other middleware's do apply
//(28.0.2)
//can change /graphql, but it is common to use
//not limit to app.post right now
//the extracted graphqlHttp requires 2 things
//the schema file, resolver file
app.use("/graphql", graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver
}));



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
//app.use("/feed",feedRoutes); //-(28.0.1)
//app.use("/auth",authRoutes); //(25.2.5) //-(28.0.1)


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
    app.listen(8080);
    //the listen returns a new node server
    //const server = app.listen(8080); //-(28.0.1)
    //(27.0.1)
    //what is extracted exposes a function
    //which requires our created server as an argument
    //this sets up socket.io
    //we use the http server to establish our websocket connection
    //this gives us a websocket.io object
    //that uses the http protocol as a basis
    //which setups all the webSocket stuff behind the scene for us
    /*
    //-(28.0.1)
    const io = require('socket.io')(server, {
    //     //avoid browser's CORS error on new socket.io version
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }
    });
    */

    //(27.0.4) //-(28.0.1)
    //will use the configuration through the socket.js file instead of direct
    /*
    const io = require("./socket.js").init(server, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"]
        }

    });
    */
    // //use io to define a couple of event listeners
    // //to wait for new connections, whenever a new client connects to us
    // //we get the client/connection-between-server-client (socket)
    // //this function will be executed for every new client that connects
    // //not only one time, but as often as required
    /*
    io.on("connection", (socket) => {
        console.log("Client connected");
    })
    */
})
.catch((err) => {
    console.log(err);
})

//(24.0.2)
//listen to port 8080, will use 3000 for something else later
//app.listen(8080);




///////////////////////////////////////////////////////////////////
//section 28

/*
///////////////////////////////////////////////////////////////////
//(28.0.0)
//GraphQL

alternative building a RESTful APIs
used in the same scenarios

provides significant advantages over REST APIs
in certain scenarios

what GraphQL is
how it compares to REST APIs
how to use GraphQL
and take our existing project
and turn it into a GraphQL API


///////////////////////////////
what is GraphQL

well a REST API is a
stateless, client-independent API for exchanging data
a server will be used to exchange data
not render views, not store sessions or care about the client
we only get requests, parse the data, return responses with "json "data

problem:
what if we only need one property from the json data
when we fetch a post from the REST API

solution 1:
you can use the same end-point all the time
and then parse or filter data on the front end
but then you are sending un-necessary data over the wire
which is an issue especially when working with mobile devices

solution 2:
but the "solution" is to create more end-points that return the 
different types of data for example sending a GET request 
to /post-slim to only return title and id

the problem is you will have a lot of end points
and will have to update them continuously
and will have an un flexible solution

if the front-end engineers need more data on a new page
they will ask you to give them an end point that returns that data
they are stuck in their front-end development until you edit this

and on the backend, will continuously have to add new end points
to cater for needs of your front-end engineers

solution 3: 
use query parameters, 
accept query parameters on your existing end-points
like /post?data=slim
but you will always be having to add it in order for the FE-eng
to continue and will always have this dependency
between front-end and back-end
> the problem here is that 
the API becomes hard to understand
because it might not be clear, which query parameter can i set
which values can i set on these query parameters

solution 4:
but the ideal solution for apps
where you often have different data requirements
on different pages
is to use GraphQL
there you do not have the problems described before
because will have a rich query language that you use
in your front end to send it to the back end
which is parsed on the backend
and retrieves just the data you need
almost like a database query language (like SQL, mongoDB)
but for the front-end which you put into the request
you send to the backend



How does GraphQL Work ?

GraphQL API
stateless, client-independent API for exchanging data
"with higher query flexibility"

==Client==
in graphQL you only send one kind of request to the server
that is a POST to /graphql
one single end-point where send http requests to
even for getting data

for a POST request
can add a request body which contains the query expression
to define the data that should be returned
graphQL uses its own query language
which is put into the request body



==Server==
(server side logic and to interact with the db with files etc.)


>> A GraphQL Query

{
    query {
            user {
                name
                age
            }
    }
}

Operation types: (query)
query, for getting data
mutation, for editing, deleting or inserting data
subscription, for setting real time data subscriptions using webSockets

endpoints/commands (user)
define as a developer on your backend the available end-points

Requested Fields (name age)
so in once place, can get the user with just the name
and on another place can get name age and email


query is equivalent to Retrieve data "GET"
Mutation is equivalent to Manipulate Data "POST" "PUT", "PATCH", "DELETE"
Subscription > setting up realtime connection via WebSockets


>> to sum up

the GraphQL approach can be used with any programming language

client sends a request to
the single GraphQL end-point on the server

where on the server we set definitions for
query, mutation, subscription

in these definitions we use "Type definitions"
because GraphQL uses a Typed query language
(you define the type of data you work with)
the types of data you return on a query and so on

these queries are connected to resolvers
which contain the server-side logic

compared to a REST API
definitions would be like Routes
and resolvers would be like Controllers


>> to sum up 2

it is a normal Node (+Express) Server
we have ONE Single endpoint, typically /graphql

you only use POST requests (post for getting data? here yes)
because you can put the query expression into the request body

and you have resolvers on the server-side
that analyzes request body then do something with your data
based on the query expression you had in that body

and we will use third party packages for that parsing


///////////////////////////////////////////////////////////////////
//(28.0.1)
//Understanding the setup and writing our first query


>> get rid of the socket.io file
>> remove the routes, as we will have no more routes,
    we will use GraphQL endpoints instead
>> return server app.listen to normal as no socket.io
>> remove the routes folder

# npm install --save graphql express-graphql

graphql
required for defining our schema for the GraphQL service
definition of queries, mutations etc.

express-graphql
installs a simple server that will do the parsing of incoming requests
and so on

if want to learn more about GraphQL checkout GraphQL.org
there is also apollo-server but it hides many things behind the scenes











*/


/*
///////////////////////////////////////////////////////////////////
//(28.0.2)
//using GraphQL

//setting the schema and resolver

>> create a new folder "GraphQL" in the project
where we put GQL related code

>> add schema.js file to that folder
where we define queries, mutations and types we work with

>> add a resolvers.js file
where will define the logic that is then executed
for incoming queries


>> go to the schema.js

setup a valid schema and resolver for the schema
now need to expose it to the public

that can be done with the express-graphql package


//importing GQL into the app.js
>> import the express-graphql package, schema, resolvers
>> app.use the package to locate the schema and resolvers

start server

>> using postman
send a post request to http://localhost:8080/grapql
raw / application JSON

send a js object with a query key 
query is not an operation type
but something the express-graphql will look for
//define want to get text and views fields from the hello resolver
//which in fact uses the TestData

{
    query: "{hello {text views} }"
}


!! this way we do not filter the data on the front end
it gets filtered on the server


///////////////////////////////////////////////////////////////////
//(28.0.3)

//importing a graphql mutation schema












*/