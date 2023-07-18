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
//Section 24

//......
/*

//359-363+
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(24.0.0)


you already learned a lot about nodejs and how to build applications with it
and the express framework that builds up on nodejs

rendering of templates with ejs
other kind of node application will build as a node developer

> what are REST APIs

> why use/build them instead of the classic node/express applications
that we built thus far when we rendered views

> will learn what the Core REST Concepts & Principles are

> will build a REST API


Rest API's solves some problems
////////////////
1) that not every frontend (UI) uses/requires HTML Pages

twitter for example
is built with java for android
swift objective c for ios
and use a rich suite of pre-built UI widgets

you use UI libraries provided by apple, google etc.
to build your user interfaces in the respective IDE's
of these programming languages
like android studio for android development

you build these user interfaces totally decoupled from your user server
you do not want html code, because you cannot render it there

the phones app do not use html (maybe the browsers)
but they build the interface with the tools
given to them by apple or google

then you only need the data to fill these user interfaces with life


////////////////
2) Single page web apps
e.g Udemy course player

all the page parts re-render without the page reloading/refreshed
the reason for that is the page is rendered
through browser side javascript
and this js code can manipulate the dom (the rendered html code)

the way modern applications work
is that you fetch one initial html page
that does not have a lot of html content
but does load all these js script files
then these js scripts reach out to some backend RESTful API
"to only fetch the data it needs to work with
to then re-render the user interface"

when clicking on something, a script related to that area
reaches out to the backend and gives back the opened ui items

giving a mobile app like feeling
the data is exchanged behind the scenes
all the user interface rendering is done with browser side js

React, angular, view which are popular browser side js frameworks
that can be used to build such user interfaces

////////////////
//(3) Service API's
e.g google maps api

maybe working on a classic node application like we did
but you also have certain Service APIs
that you might want to use

you might not want google maps to send you some html codes
you might be interested in some coordinates etc.
thus you are interested in the data


all these three cases share that
the frontend UI is decoupled from the backend
or from a certain backend logic like google maps

we only exchange the data because we do not want any user interface/html
we build the ui/html on our own
we just have a backend that needs to serve us data
that is the core idea of building REST APIs

////////////////
that is the core idea of building REST APIs
because there we need a different kind of response

REST: Representational State Transfer
this means
we Transfer Data Instead of User Interfaces

and we leave it to the client or the front end
be that a mobile app or a single page application
to do with that data whatever it wants to do

and thus far on this course we rendered the html page on the server
that did not only include the data but also the user interface

this is ok for many applications, but for some applications
you might want/need to build De-coupled frontend
and then REST API is the solution

Note: only the response and the request data changes
not the general server-side logic

all the logic we did before like validation etc. will stay the same
when building REST APIs

because often REST APIs and
traditional apps (when you render the view on the server)
are seen as two totally different things, they are not
they only differ in the response and the kind of data you expect
but they do not differ on what happens on the server
beside the fact that you do not render the view there

thus far will only tune our data handling and the response
over the previous way of coding


///////////////////////////////////////////////////////////////////

a big picture how REST APIs work

Client
(mobile app, single page web app, traditional app)

 VData^               VData^                 VData^

(       App Backend API         ) ( Service API )
Server


between the client and the server we exchange data (not UI)


app backend API we build for these apps, and can use the same api 
for multiple clients so we can build both a webApp and a mobile app
they will use the same API and data 
but will present it differently by their UI,

a traditional app will just need a service api
we may want to build a service API to sell our service
like a stock application that we might not even know
is able to query data from and we just sell access to the API


in which format do we exchange that data ?
html, plain text, xml, json, other formats too

html, <p> Node.js </p>
sent to and rendered by the browser
contains data + structure (elements/css)
contains user interface and define how it should look like
# difficult to parse if only need the data


plain text, Node.js
contains only data
we make no UI Assumptions
# difficult to parse, as no clear data structure

XML, <name> Node.js </name>
which looks like html (html is a kind of xml)
allows you to use any tags
allows to transfer data
able to make no ui assumptions, as it is not parsable by the browser
# good thing: machine readable, can define structured, but xml-parser is needed
because traversing though an XML tree is challenging
so the code will have more data (for parsing) than the data needed

JSON, {"title": "Node.js"}
just the data
makes no UI assumptions
#good: machine readable, concise than xml, can easily be converted to js
a huge plus when working with node.js on the server and js on the browser (as it can be used there)

> json is the winner data format if want to just transfer data

///////////////////////////////////////////////////////////////////
//understanding routing and http methods

how do we communicate between client and server

how a client send a request to the server ?
on a traditional site, we sent a request by adding a link in the page
or with a form with a button where we define action and a method

in REST we still send a request with a combination of http method/verb
and a path on the server
so we will still use/define a path on the server side routing
where we wait for incoming requests
and we define certain http methods to handle for these paths
so not all requests can reach all paths

these requests would be sent from the client browser
through async javascript, with the fetch API or with AJAX
and on mobile apps we also have special clients

in the end we send normal requests that do not expect any html response
and we send a combination of http method and paths
this is how we communicate with the server

these requests are called API Endpoints
POST /post, GET /posts, GET /post/:postId
a combination with an http method like post/get
and the respective path

these endpoints we define on our REST API
and we define the logic on the server when a request reaches
such an endpoint

client
(sends request to the server)
V V V
server
(server-side logic, database access etc.)


Http Methods (verbs) we will work with when building a REST API
there are more methods than just get/post
when working with the browser only
and not with js and the browser but just forms and links
then we only have get and post available
these are the two methods the browser/html-element relatively knows
 
when using async requests through js
or when building mobile apps etc. and using their respective http clients
you have access to more http methods

GET: get a resource from the server
POST: post as resource on the server (create or append resource)
PUT: put a resource onto the server (create or overwrite a resource)
PATCH: update parts of an resource on the server
DELETE: delete a resource on the server
OPTIONS: sent automatically on the browser to find out if the next request
    trying to do (e.g delete) if that is actually allowed
    determine whether follow-up request is allowed

note: in theory what happens on the code
is not defined by the method used by that code
you can delete something on the server even though you used POST

you will want to restrict it yourself and implement the API that follow the methods
but you do not have to, but it is a good practice, to know what to expect


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//conclusion to part 1
modern web applications do have a client side UI(phones) or single html page 
that only needs data from the server (no html) to re-render information, 
this data can work on any given UI, data in json format as it can 
contain data and can be converter to js, 

---- 

requests are sent as a combination (http method + server path) 
called API Endpoints, through routing as usual, 
this is done from the client side with script files (async code fetch/ajax), 
so we will define the logic on the server how it acts when receives a specific request, 

async requests can use more http verbs which only give perspective of 
the logic will be used
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////





363-369
///////////////////////////////////////////////////////////////////
//(24.0.1)

Core principles for REST APIs

1) Uniform Interface
clearly defined API endpoints 
with clearly defined request + response data structure

your API should be predictable
and if open to the public should be well documented
> people should know what data your API expect
> which data your API sends back
> which endpoints do the API have

the thing that happens when a request reaches an endpoint
should not change over time
should be predictable and clearly defined


2) Stateless interactions
will be very important when using authentication

when building a REST API, the server and client are totally separated
they do not store any connection/common history
no session will be used or stored therefore
because every incoming request will be treated as no prior request
was sent, the server has a look at every request on its own
every request is handled separately

there is a strong decoupling between the client and the server
REST APIs do not care who will use it

> each time we setup an endpoint we have to make sure it works independent
from prior requests

and a typical problem here is authentication
and we will solve this in the course

less important principles
3.a) Cashable principle
on the REST API you could send back some headers
that tells the client how long the response is valid
so that the client can cache the response

3.b) Client-Serve r separation
client is not concerned with persistent data storage

3.c) Layered System
as a client we send a request to an API
we cant rely on that server immediately handling the request
the server could forward/send the request to another server
ultimately we only care about the data we get back
we should follow the structure that was defined by the API

3.d) Code on Demand
the REST API could also
for some endpoints transfer executable code to the client
but not used too often



*/
//......

//# npm init
//# npm install --save express      //s24
//# npm install --save-dev nodemon  //s24
//# npm install --save body-parser  //s24: to parse incoming requests body


const express = require("express");         //(24.0.2)
const app = express();                      //(24.0.2)
const bodyParser = require("body-parser");   //(24.0.3)



const feedRoutes = require("./routes/feed.js"); //(24.0.2)

//(24.0.3)
//will define the body-parser in another way than the used before
//as we are using json for interactions and not form data
//we used urlEncoded for used by enctype=x-www-form-url-encoded by forms
//will use the json method
//to parse incoming json data
//so we are able to extract it on the body (req.body) in controllers
app.use(bodyParser.json()); //enctype of application/json


//(24.0.2)
//will forward any incoming request to feedRoutes
//only incoming requests that start with "/feed"
app.use("/feed",feedRoutes);






//(24.0.2)
//listen to port 8080, will use 3000 for something else later
app.listen(8080);




/*
//Coding
///////////////////////////////////////////////////////////////////
//(24.0.2) Basic setup for REST API

>> create an empty folder with the .gitignore
run 
# npm init

we will use express frame work for node
however there are also REST frameworks

# npm install --save express
# npm install --save-dev nodemon
# npm install --save body-parser

>> add a routes folder and add feed.js
> import express and store its router, export router
will have folders like before but will not have views anymore
because we will just exchange data

let us say we are building a simple social network block like application
and we have some feed routes (news feed, create new messages, show existing messages)

> set a get router to /post


>> add a controllers folder with feed.js
export a getPosts middleware 
and import that export into the feed.js route


>> in app.js import the router
> app.use the router with /feed filter



///////////////////////////////////////////////////////////////////
//(24.0.3)
the response ? and how can we send a request to the set up route


>> inside the getPosts controller want to return some data
we will not use res.render() again here
instead we will return a res.json for a json response

>> open the url in the browser 
http://localhost:8080/feed/posts

in the dev tools if you check network  will find the response headers/response(body)
in the headers will find the content-type set to json automatically

//we will build a user interface
that will use the url behind the scenes
and render a good looking ui automatically with the data we send

//but first we will check how we can test the REST API
even without using the url into the browser

>> define a post route
to add new posts
add createPost to the feed controller


>> import the body-parser in app.js as it is used in the controller
> set the body parser to use json

!! but how can we test our code without using forms ? 
(as we are using json and not urlEncoded enctype x-www-..)
will use an API development tool named "Postman"

>> access postman website
create new http collection
where you can select a response to send (POST)
enter the url http://localhost:8080/feed/post

you will find the "Body" tab enabled
as post requests can hold a body, get requests cant

select in the "Body" raw, and json
now write data in json format
as we used title and content in the post controller createPost
{
    "title": "Second Post",
    "content": "this is my second post"
}

you can also see the headers on the response in postman
these were set automatically by express

//we will work with a real front end so can have beautiful to look at
and see that in a real app
but Postman is a tool will be used alot when working with REST APIs





*/






