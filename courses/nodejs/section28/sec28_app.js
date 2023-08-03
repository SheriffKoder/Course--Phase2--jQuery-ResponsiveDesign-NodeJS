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
//# npm install --force --save validator        //(28.0.5)
//# npm install --save cors //(28.1.0) 


const express = require("express");         //(24.0.2)
const app = express();                      //(24.0.2)
const bodyParser = require("body-parser");  //(24.0.3)
const mongoose = require("mongoose")        //(25.0.5)
const path = require("path")                //(25.0.7) to import static images
const multer = require("multer");           //(25.2.0) uploading files
//const fs = require("fs");                   //(28.1.8) //-(28.1.11)
const {clearImage} = require("./util/file"); //(28.1.11)


const {graphqlHTTP} = require("express-graphql"); //(28.0.2) setup GraphQL
const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolvers");

const cors = require("cors");   //(28.1.0) 
//const feedRoutes = require("./routes/feed.js"); //(24.0.2) //-(28.0.1)
//const authRoutes = require("./routes/auth.js"); //(25.2.5) //-(28.0.1)

//(28.1.2) 
const auth = require("./middleware/Auth");




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
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, DELETE");
    //headers the clients might set on their requests
    //this allows on the frontend to set content type in the fetch config
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    //(28.1.0) 
    if (res.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    next();
});

//(28.1.0) 
app.use(cors());


//(28.1.2) 
//this middleware will run on every request
//that reaches the GQL endpoint 
//but will not deny the request if there is no token
//the only thing it will do, set isAuth to false
//and then i can decide in the resolver want to continue or not
//loaded before post-image to be used there
app.use(auth);


//(28.1.8) 
//adding images
//we are using multer, which take our multipart form data request
//extracts a file and stores it in the images folder
//multer populates the file object with information about this file
app.put("/post-image", (req, res, next) => {

    if(!req.isAuth) {
        throw new Error("Not authenticated")
    }

    if (!req.file) {
        return res.status(200).json({message: "No file provided"});
        //can set an error code if want
    }

    //if got here, we have a new image
    //so then will delete the old image
    //check for the existence of a body field named oldPath
    //means an oldPath is passed with the incoming request
    if (req.body.oldPath) {
        clearImage(req.body.oldPath);
    }

    //path where multer stored the image
    //the path we can then use in the front end
    return res.status(201).json({message: "File stored.", filePath: req.file.path});



});



//added here so all the other middleware's do apply
//(28.0.2)
//can change /graphql, but it is common to use
//not limit to app.post right now
//the extracted graphqlHttp requires 2 things
//the schema file, resolver file
app.use("/graphql", graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,                  //(28.0.4)
    customFormatErrorFn(err) {              //(28.0.6)
        //original error will be set by express graphql
        //when it detects an error thrown in your code
        //either by you or a third party package
        //if it is a technical error, missing email syntax
        //then it will not have original error?
        if (!err.originalError) {
            return err;
        }
        //if i have originalError, then i can extract
        //useful information from it, that i can add
        //in other places, like in the resolver
        //stored some values in the error thrown in the resolver
        //get these values here to create custom error format
        const data = err.originalError.data;
        const message = err.message || "An error occurred";
        const code = err.originalError.code || 500;
        //with all that pulled out can return my own error object
        return { message: message, status: code, data: data };

    }

}));









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

//(25.2.2)
//(28.1.8) 
//want to trigger the clearImage function
//whenever uploaded a new image
//-(28.1.11)
/*
const clearImage = (filePath) => {
   
    //up one folder as we are in the controllers folder now
    filePath = path.join(__dirname, "..", filePath)
    //unlink removes the file
    fs.unlink(filePath, err => console.log(err));

}
*/


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

//fetching a query
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
//> edit/delete/put

>> clear the FE feed.js from socket.io, addPost updatePost

>> FE App.js signupHandler make sure
we reach one of our mutations

>> in the graphql schema.js define a createUser schema

>> work on the resolver
import the db user, define the createUser query as a function 
that takes user input/req, to find/save user in db 
and return user info

>> delete the posts/users collection in the db
it will be available again once entered data

///////////////////////////////////////////////////////////////////
//(28.0.4)

////now we will test the mutation
with a simpler approach than postman

go to app.js where use graphql
add graphiql: true
which gives a special tool
to use the 8080/graphql in the browser
this will send a GET request
will give you a screen to play with the graphQL api


mutation {
    createUser(userInput: {
        email: "test@test.com", 
        name: "max", 
        password: "tester"})
    //the returns
    _id
    email
}

press play,
user will be created in the db

GQL browser result:
{
  "data": {
    "createUser": {
      "_id": "64c085ede36c761ac30c5c2f",
      "email": "test3@test.com"
    }
  }
}



///////////////////////////////////////////////////////////////////
//(28.0.5)

//add input validation/error messages to GQL before using the FE

before storing in the database (mutation)
we have to make sure that the information we put is valid

with graphql it is not possible to add express-validator
as we have only one route/end-point
which is the app.use in the app.js
and we do not want to validate all requests
in exactly the same way

solution is to move validation into the resolvers

# npm install --force --save validator

//this is the package that express-validator use behind 
the scenes, we can use it directly from now

>> import the validator package in the resolver file
> add validation for email, password
if there are errors, create and throw a new error

!! now sending the mutation object with
a missing syntax will result in an error response

{
  "errors": [
    {
      "message": "invalid input",
      "locations": [
        {
          "line": 33,
          "column": 5
        }
      ],
      "path": [
        "createUser"
      ]
    }
  ],
  "data": null
}


///////////////////////////////////////////////////////////////////
//(28.0.6)

//handling errors in GraphQL

you cant set your own status code
//but we could add more information to the errors we return

to do that
>> got to the app.js file and add the config option
formatError
and this is a method that receives the error detected by GQL
and allows to return own format
or keep the default format with just return err;

>> go to the resolver
//stored some values in the error thrown in the resolver

>> get these values in the app.js customFormatErrorFn config to create custom error format


!! now can adjust the error received in GQL browser


///////////////////////////////////////////////////////////////////
//(28.1.0) 

//working with the FE

//working on the sign-up
>> go to FE App.js signupHandler
adjust the url to /graphql, method to post

add a constant of a mutation object like used above
and fill fields with user data (taken from the FE code)
use it in body stringify

move the status error to the .then res data
check for errors

now we can open the FE and sign up a user
check for existence

> however this is a CORS error
solution
>> npm install --save cors
> and in the app.js app.use(cors());

any time face an error check the network in dev tools

sometimes express-graphql declines any request that is not a POST
so the option request is denied

>> add sendStatus(200) to the cors middleware in API app.js

!! now we can sign up a new user or get a 500 error if exists



///////////////////////////////////////////////////////////////////
//(28.1.1) 

//authenticating users

//adding a login query and resolver in the API

>> will add a query in schema for authentication
"RootQuery" which returns a data when someone sends a query to login

>> in resolvers define the login function
to return a token generated when email/password are ok
containing both
and also return the userId
both as defined in the query



//wire the API authentication tokens with the FE

>> go to loginHandler in app.js
define graphqlQuery that fills/returns from the login API schema
adjust the url, and stringify
place errors in 2nd .then

sending to the server through the GQL API
where want to get the token and userId
login(email: "email@test.com", password: "tester") {
    token
    userId
}

returns the token and userId

by exposing the returned object from the API through the browser
you can know how to reach a certain property to fetch in the FE

! now can login with a user


//430-436(436-442)
///////////////////////////////////////////////////////////////////
//(28.1.2) 


//now want to work on the get/edit posts
and work with the token to restrict certain end-points


//add posts without a real image
posts with just title content, dummy image url, attached user


>> in the GQL schema add new mutation "createPost"
and set a type for the input

>> go to the resolvers, create new function createPost()
validate inputs, create/save a post with these inputs
return the createdPost, post id, createdAt, updatedAt

defined a schema (input mapping and return mapping)
defined a resolver (what to do with input and what to return)
send in GQL a mutation object

mutation {
    createPost(postInput: {
        title: "Tests", 
        content: "Tests", 
        imageUrl: "some url"}) {
    _id
    title
    }
}



///////////////////////////////////////////////////////////////////
//(28.1.3) 


//the basic createPost is in place
now want to validate the token and extract the user from it

//make sure we send a token in a header in our incoming request


>> rename the middleware > isAuth to Auth
in there not throw errors but store false/true
in req.isAuth

>> in app.js import the Auth.js
>> add app.use(auth) before GQL app.use/end-point

>> in the resolvers
in createPost, check if no req.isAuth
if so, create/throw an error with status code

>> before we create the post, we can get the user from the db
because we do store the userId in the request
req.userId = decodedToken.userId;
> User.findById, if no user throw error
> create the new Post with creator: user
> push to user.posts the createdPost


check for user if authenticated (logged in)
connect created posts to user(owner)


///////////////////////////////////////////////////////////////////
//(28.1.4) 

//work on the front end to send a request
to the end point so we can see the user authentication/post connection

>> FE feed.js file finishEditHandler

want to reach the graphql endpoint and create a new user

create graphqlQuery
with the mutation object we used above in GQL browser

edit the fetch url, method, body to JSON.stringify(graphqlQuery),
content-type

//the returned keys same as const post below
//in creator only interested in the name as it is a complex schema
let graphqlQuery = {
    query: `
    mutation {
        createPost(postInput: {
            title: "${postData.title}", 
            content: "${postData.content}", 
            imageUrl: "some url"}) {
        _id
        title
        content
        imageUrl
        creator {
        name
        }
        createdAt
        }
    }          
    `
};

433
///////////////////////////////////////////////////////////////////
//(28.1.5) 

//extract all the data on the front-end

when consoling the resData
will get the data object of the post created
then can use it to track and map needed properties
to put in the post const


//load posts on webpage

>> add a "posts" query in schema
and input PostData that takes posts and totalPosts

getting posts is a normal query (not mutation)
so add it in the RootQuery

>> add a resolver
if authenticated, find posts count, find posts
return posts and count
but the returned posts will be a mapped object
with converted/overwritten properties

>> test on the GQL browser

//interested in the posts in id, title, content
query {
    posts{
        posts {
            _id
            title
            content
        }
        totalPosts
    }
}

will send back not authenticated because not sending a token

///////////////////////////////////////////////////////////////////
//(28.1.6) 
//work on the front-end, add token, render posts

>> FE, feed.js, loadPosts

what we do in the FE is

1) add const graphqlQuery
like the one used in GQL browser
but can also select the specific needed properties of a complex schema here in the FE
like in posts, creator name

2) set fetch
url, method, headers { authorization, content-type},
body json.stringify(graphqlQuery)

now we can view posts on the main page
!!! check the max FE code feed.js to avoid this error


//add code to add a new post immediately
FE > feed.js > finishEditHandler after const post
in this.setState


///////////////////////////////////////////////////////////////////
//(28.1.7) 


//adding pagination in the API

//we want to add pagination through the post query
>> add to the RootQuery > post some arguments
// page: Int

>> retrieve the page argument with destructuring in the posts resolver

>> add skip and limit in find() to page/perPage


//adding pagination in the FE

>> go to loadPosts
add to the posts in query the page argument

>> to not allow adding a post appear as a third post
"because we defined 2 posts per page"
add updatedPosts.pop();
before updatedPosts.unshift
to remove one element and ad the new one at the beginning

bug fix: adding a new post not make next button appear unless refresh
finishEditHandler > after creating new post then this.setState

we do need to make sure we do increase, 
the amount of total posts
which will be the old totalPosts + 1
after let updatedPosts = 
let updatedTotalPosts = prevState.totalPosts;

in the else
updatedTotalPosts++;

in return add
totalPosts: updatedTotalPosts




*//*
///////////////////////////////////////////////////////////////////
//(28.1.8) 


//uploading data

until now GQL works with json data only
one of the cleanest solution is to use a classic end point
like the rest end point where you send your image to
then let that endpoint
store the image and return the path for the image
and then send another request with that path to image/data
to the graphql endpoint


>> in app.js add app.put();

>> add the clearImage function we made in controllers feed.js
to app.js at the bottom
> import the fs module

//we can use this REST API end point
//this shows can use REST and GQL concepts together


//working on the FE
feed.js > finishEditHandler

    formData.append('image', postData.image);
    if (this.state.editPost) {
      formData.append("oldPath", this.state.editPost.imagePath);
    }

    also add to const post 
    imagePath: resData.data.createPost.imageUrl

    also add

    //method PUT as stated in the API app.put
    //authorization headers
    fetch("http://localhost:8080/post-image", {
      method: "PUT",
      headers: {
        Authorization: 'Bearer ' + this.props.token,
      },
      body: formData
    }).then(res => res.json())
    .then(fileResData => {
      //filePath as returned in the API app.put
      const imageUrl = fileResData.filePath;



    and add imageUrl to loadPosts query




///////////////////////////////////////////////////////////////////
//(28.1.9)

//click view post and see the post's details

>> to the API Schema, add to post(id: ID!) to RootQuery

>> add a resolver that takes the query input and return what is needed

>> wire that on the FE
> singlePost/SinglePost.js
adjust the fetch url in componentDidMount
add method, header > content type
add graphqlQuery for the setState data

> move error to 2nd .then

!! type rootQuery > posts can be accessed in FE
using resData(FE .then returned).data.post(the returned).xxx


>> watch out for syntax errors


work on edit and delete posts, user status




///////////////////////////////////////////////////////////////////
//(28.1.10)

//edit a post

>> go to schema RootMutation > updatePost()

>> add updatePost to the resolvers
authenticate, find, check, validate input, over write, save, return

>> to to the FE, feed.js finishEditHandler
below the graphqlQuery
> if this.state.editPost add new data to the graphqlQuery
and set the const post to update post
by accessing data[value] which will have value of create/edit depending


///////////////////////////////////////////////////////////////////
//(28.1.11)

//deleting a post

>> go to schema RootMutation > deletePost()
which returns a boolean indicating whether that succeeded or not

>> add deletePost to the resolvers

>> add in the root directory util > file.js
where we will store the clearImage function
and also use in app.js, so will remove the fs module also from app.js

check on authentication, user ownership, post found
then can remove the photo from the folder using clearImage with imageUrl
and remove the post from the database

remove the post from the user model by its id using pull

!! can add try catch to all of these resolvers
to catch errors but did not do it here to keep the code simple



>> work on the FE
feed.js > deletePostHandler

add the graphqlQuery
edit the url, method, add body: json.stringify(graphqlQuery)
put the right error code in the right place

443-449
///////////////////////////////////////////////////////////////////
//(28.1.12)

//view user status and delete it

>> in schema add a 
query for getting the status (user)
and mutation updateStatus

>> in resolvers add user to fetch user data

>> then in the FE 
feed.js componentDidMount 
> add graphqlQuery, method, content type, body
put error in right place

>> in resolvers add updateStatus

>> in the FE go to status updateHandler


///////////////////////////////////////////////////////////////////
//(28.1.12)

//a better more elegant way of using variables instead of ${}
in the GQL queries defined in the FE

will give the defined queries in FE a name
it will not let it behave differently
but will help in error messages

    const graphqlQuery = {
      query: `
        {
          posts(page: ${page}) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `
    };

//to use the "query" and not just {
//add custom name FetchPosts, define which variables this query will use
//with type (GQL type)
//this is GQL syntax that will be parsed on the server
//add a second parameter named variables
    const graphqlQuery = {
      query: `
        query FetchPosts($pageVariable: Int) {
          posts(page: $pageVariable) {
            posts {
              _id
              title
              content
              imageUrl
              creator {
                name
              }
              createdAt
            }
            totalPosts
          }
        }
      `,
      variables: {
        pageVariable: page
      }
    };


    const graphqlQuery = {
      query: `
        mutation UpdateUserStatus($userStatus: String){
          updateStatus(status: $userStatus ) {
            status
          }
        }
      `,
      variables: {
        userStatus: this.state.status
      }
    }

    add the required ! if defined in the schema that way

    updateExistingPost
    the image url not set when not add a new image
    which can lead to an error
    set
    const imageUrl = fileResData.filePath || "undefined";

///////////////////////////////////////////////////////////////////
//wrap up

GraphQl Core Concepts

Stateless, client-independent API
Higher flexibility than REST APIs offer
due to custom query language that is exposed to the client

can be used to exchange and manage data
- Queries (GET), Mutation (POST, PUT, PATCH, DELETE)
- Subscriptions (not covered in the course)

all GraphQL requests are directed to ONE endpoint
(POST /graphql)
and use the graphqlQuery to describe the query/mutation
want to execute from the back-end

the server parses the incoming query expression
typically done by third-party packages
and calls the appropriate resolvers

GraphQL gives you higher flexibility
by exposing a full query language to the client

GraphQL/REST are not limited to React.js applications
can be implemented with ANY framework
and ANY server side language 

so REST can be preferred in static data requirement cases
e.g file upload, scenarios where you need the same data all the time










*/