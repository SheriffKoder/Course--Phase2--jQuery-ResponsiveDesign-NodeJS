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
//section 26

/*
///////////////////////////////////////////////////////////////////
//(26.0.0)
//async and await

the difference in REST API's is how you handle response/request data
and sending json data

applicable to any node application
async await
new js feature

allows "async" requests (requests that take time and come back later)
to be written in a "synchronous way"

however it will look like sync but it still not behave like it


>> if we went to the feed controller
Post.find in getPosts is async

how to identify async operations
> when using promises
where countDocuments return a promise
or a promise like object

where .then defines a function
that executes when the parent operation is finished

js will move to the next code block and leave then
till its parent is finishes its process 

.then is code snippets that should run in the future

callbacks are another way to use async operations
instead of then
but they rely on un-ordered nesting
which will produce an un-readable code

so promises is preferred as it runs one then block after another
and it is very readable
still will be more readable with async and await



///////////////////////////////////////////////////////////////////
//(26.0.1)

//using async await
//transforming our first code snippet from promise chain
to async await getPosts controller in feed.js

>> append the "async" keyword in-front of the function
in-front of the function parameters

so basically
you "await" any async code to be stored in a variable
then this variable can be used in another line

without having to use .then(returned) do something with the returned

//regarding .catch
wrap the async code in try {} (as it is written as sync)
and then catch (err) {}

still can use next(); as we used it before
because behind the scenes it still gets converted to then as used before


///////////////////////////////////////////////////////////////////
//(26.0.2)
//top level await

starting with node v14.3

can use the await keyword also outside the async function
feature called "top-level-await"


///////////////////////////////////////////////////////////////////
//(26.0.3)

//convert all controllers promise then chains to async/await


basically
before the middleware parameters put "async"

put await in front of any line that returns
if it will return a usable variable, store it in a variable

wrap all async code in try
and catch wrapped in catch

async/await can only be used on promise chains (then/catch)
not callbacks like in fs.unlink err

///////////////////////////////////////////////////////////////////
//wrap up
mongoose operations like countDocuments, find()
does not return a real promise
but a promise like object
and you can use on them async/await
even though they are not a real promise

you can get back a real promise
by chaining .exec() after the mongoose operation

but in the bcrypt hash uses a real promise


the js code behavior does not change with using await/async
over then/catch
it is the same behind the scenes (there will be then blocks)

it is up to you to choose a syntax of the two






*/




///////////////////////////////////////////////////////////////////
//section 27

/*
///////////////////////////////////////////////////////////////////
//(27.0.0)
//WebSockets


how the typical node application work like (classic/rest)
using the http method

Client (browser/mobile)
send a request from the client
wait for the server
server has routes to handle the requests
once done in the server (reached the db), send back a response to the client

Server(node application)

1. request
2. response

PULL information from the client
TELL information to the server


//now what if something happens on the server and want to actively inform the client
ex. in a chat, user A sends a message to server and receives a response
but user B does not send a request to the server asking for the message

a PUSH way about informing user B about the message


use webSockets instead of http


webSockets build on http, established by http
they use an http "handshake"
to update the http protocol to a websocket protocol
websocket protocol talks about how data is exchanged
this protocol you do not have to manage actively
the browser and the server communicate through a protocol
and the used protocol defines how communication can happen
with http its request response
with web sockets it is push data from the server to the client
still also send data from the client to the server
can use both methods in the same app


client
^
| (Push Data)
server


///////////////////////////////////////////////////////////////////

there is a broad variety of methods to use

google node express webSockets
will find many articles and packages to use

one of the most popular is "socket.io"
which uses webSockets and gives a lot of convenience around that protocol
to make it easy to setup a websocket channel between a client and a server
and to use that channel

//can learn more in the official docs

here we will learn how to add it to a project
and setup some basic communication

there are other packages that gives some more Raw approach
with less convenience features
socket.io do many things behind the scenes



///////////////////////////////////////////////////////////////////
//(27.0.1) setup socket.io for the server

using socket.io
we have to add it to both the server and the client
node and react app

# npm install --save socket.io

//setup the socket.io connections
>> go to the API > app.js 

as we setup our routes in the app.js
we can also setup the socket.io channels

as socket.io channel uses a different protocol WebSockets
it will not interfere with the normal http requests
which are sent by default by the browser

> when establishing the server in .connect

>> setup socket.io to build upon the server connection of an http protocol
which when used will wait for new connections, whenever a new client connects

we now have a waiting socket connection waiting for clients




///////////////////////////////////////////////////////////////////
//(27.0.2)

go to the FE, quit the dev server
install the socket.io for the client

# npm install --save socket.io-client

>> import the socket.io-client
which exposes a function to connect

>> use in the component did mount
openSocket("http://localhost:8080");

now when connecting the backend, frontend(to 8080)
the API console will output

411-417
///////////////////////////////////////////////////////////////////
//(27.0.3)
//using socket.io in real time

//if we created a post with user A
that we can instantly see it with user B


on the FE, want to react to a new post being created
then want to render it in the client instantly


>> add a new function addPost to the FE before loadPosts
we want to call "addPost" whenever we create a new post on some other client


///////////////////////////////////////////////////////////////////
//(27.0.4)
//a created post from user A appears on user b
so in the API createPost controller
will reuse the current socket.io connection to
inform all the connected clients about the new post

for that idea, we need to share the connection
setup in app.js

>> create a new file, socket.js in API root
which we can connect to the socket.io through it
in any file
starting with app.js

>> then use the getIO function in the API feed > createPost controller
which will return the io
which we can then run methods on 
like .on in app.js
.emit will send a message to all connected users
.broadcast will send to all the users except the one from which the request was sent


> now we defined a message that can be sent from the server
to all users,

>> now we need to adjust the FE to receive the message
below openSocket("URL") in the componentDidMount in feed.js

>> by removing some "if else" block 
we can see the added message on the second user without reloading

open the browser
open an incognito browser
create a different user (B)
create a post with user (A)


///////////////////////////////////////////////////////////////////
//(27.0.5)
//to get the username on the post displayed through the FE

populate(creator) in getPost
add to the socket data in createPost
creator: id, name



///////////////////////////////////////////////////////////////////
//(27.0.6)
//updating posts on all connected clients

we are also updating/deleting posts

>> go to updatePost controller in feed.js

> we want to store a socket event once done updating
> go to where find the post and populate it with creator data

populate:
will take the creator id stored in the post object
reach out to the users database/collection
fetch the data for that specific user
and add it here in our post


>> go to the FE
to establish code to update our post
after the addPost function, add a new function updatePost

!! now when we edit a post
it is changed on both clients in the same time



///////////////////////////////////////////////////////////////////
//(27.0.7)

//sorting posts
//making latest post appear first

>> in feed.js getPosts controller
add to Post.find() sort



417-423
///////////////////////////////////////////////////////////////////
//(27.0.8)

//deleting posts on all connected clients to socket.io

>> feed.js controller > deletePost

want to emit a socket.io before deleting, before sending a response


>> on the FE, will simply reload the page
go to delete post handler and comment out


!! now when a user deletes a post
the posts reloads on the other user's page


///////////////////////////////////////////////////////////////////
//wrap up on section 27

pushing data from the web server to a connected client
this is allowed by the WebSocket protocol
which socket.io makes them used easier

we have normal requests
and WebSocket requests












*/




















