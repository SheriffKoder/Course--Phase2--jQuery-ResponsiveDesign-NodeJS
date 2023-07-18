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



const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");   //(2)
const User = require("./models/user"); //(8)

const session = require("express-session"); //(2.6)
const csrf = require("csurf");  //(3.7)
const flash = require("connect-flash");   //(3.9)




const multer = require("multer"); //(20.0.1)
//diskStorage is a storage engine which can use with multer
//can pass a js object to configure
//destination and filename are two functions
//multer will call on incoming file
//these functions then control how these files are handled
//regarding the place where you store it and naming
const fileStorage = multer.diskStorage({
    //receives the request/file objects, callback exe once done setting the destination
    destination: (req, file, cb) => {
        //null, error message to throw to inform multer 
        //that something is wrong with the incoming file
        //and it should not store it
        //but if that is null, then tells multer it is ok to store it
        //images, the directory you do want to store the file in
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        //null, we are fine store it please
        //file name we want to use

        //file can be viewed in the postAddProduct
        //it is an object with properties like name etc
        //we will concat filename(hash string) with original name
        //to make sure files with the same name do not overwrite
        //filename will not be generated as when we use  diskStorage
        //so will use current date, snapshot of current date, ensures uniqueness
        //if you need more uniqueness, can use a third party package
        //that gives a truly unique hash
        cb(null, new Date().toISOString() + "-" + file.originalname);
    }
});


//(20.0.2)
const fileFilter = (req, file, cb) => {
    //again, mimetype is a property of the image consoled 
    //in the controller req received inputs
    if (
        file.mimetype === "image/jpeg" || 
        file.mimetype === "image/jpg"  || 
        file.mimetype === "image/png"
    ) {
        //true if want to accept that file
        cb(null, true);
    } else {
        //false if want not to accept that file
        //multer will not store anything and the console in controller will be undefined
        cb(null, false);
    }

};



const mongoDBStore = require("connect-mongodb-session")(session);
const MongoDbUri = "mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/shop"; // mongoDB web app connect url //shop?retryWrites=true&w=majority
const store = new mongoDBStore({
    uri: MongoDbUri,
    //define a collection where your sessions will be stored
    collection: "sessions"
    //can also add when it should expire - and that can be cleaned automatically by mongoDB

});

//to use the req.body.fieldName, will be passed to the app.use's
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

//(20.0.1)
//single method as we will use one file
//define the input name that will hold the file (as ejs)
//{dest}, when add file, instead of buffering the file to memory
//multer turn the buffer to binary data
//and store it in this path "images" folder
//{storage} gives more configuration than the {dest}
//app.use(multer({dest: "images"}).single("image"));
//app.use(multer({storage: fileStorage}).single("image"));
//(20.0.2)
//we defined a fileFilter function above
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));




//(3.7)
//executing the imported csrf as a function
//object to configure some things
//for example want to store the secret that is used for hashing your tokens
//the default settings should work fine, can dive into the official docs of the package to learn more
//const holds a middleware
const csrfProtection = csrf();

//(3.9)
//flash needs to be initialized, after the session
app.use(flash());


//(2.6)
//session core configurations
//pass a js object where we configure the session setup
//secret; for signing the hash secretly storing the id in the cookie
    //in production should be a long string value
//resave; the session will not be saved on every request that is done
    //on every response that is sent, only if something is changed in the session
    //will improve performance
//saveUninitialized; no session will be saved for a request
    //that does not need to be saved, bec nothing was changed about it
//can configure the session cookie for maxAge, expires
//can add cookie related configuration ,cookie {..}
//this middleware automatically sets/reads a cookie for the application
app.use(session(
    {
        secret: "my secret", 
        resave: false, 
        saveUninitialized: false,
        //(2.8)
        store: store

    }
));

//(3.7)
//csrfProtection is enabled but need to add something to our views to use it
//for any non get requests (post etc.)
//this package will look for the existence of a csrf token in your views/request body
//to make sure such a token is there, make sure we have it available in our views
//to do that we have to pass data into our view
//go to the controllers
app.use(csrfProtection);





app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images"))); //(20.0.5)



app.set("view engine", "ejs");
app.set("views", "views");

const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth.js");


//(3.8)
//after the middleware that extracts our user
//but before our routes
////for every request that will be executed
//these two fields will be set for the views that are rendered
app.use((req, res, next) => {
    //a special feature/field provided by express js
    //locals allows to set local variables that are passed 
    //into the views which are rendered
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    //call next so we are able to continue
    next();
});

//this middleware execute first then next to the next app.uses
app.use((req, res, next) => {
    
    //this is the way of reaching the error handling middleware
    //as this part of code is (synchronous)
    //throw new Error("Dummy");

    //write a clever code what will succeed
    //by avoiding to find session.user if there is no session
    //to allow the middleware below to only run if there is a session.user
    if (!req.session.user) {
        return next();
    }

    //User.findById("64a6f2a6c017acc261356a8c")
    //User is a mongoose model with method findById
    User.findById(req.session.user._id) //(2.10)
        .then(user => {

            //this is to test the return next in the catch
            //throw new Error("Dummy");

            //clever code to avoid any possible errors
            //if cant find the user to continue 
            //and not store undefined in the user object
            if (!user) {
                return next();
            }

            //req.user = user;
            //create a new user in order to be able to call its methods 
            //mongoDB //(10)
            //req.user = new User(user.name, user.email, user.cart, user._id);

            //mongoose //(8)
            //user here is a full mongoose model, can call methods on the req.user object
            //req.user = user;

            //(2.10)
            //session/mongoose
            //use our session data to load a real user
            //mongoose user model
            //to allow all mongoose methods to work again
            //user that only lives for that request
            //retrieves data from the session
            req.user = user;

            next();

        })
        //this catch will not fire if not found the user with this id
        //it will fire if there is a technical issues, db down, 
        //user/app do not have sufficient permissions to use this action
        .catch(err => {
            //console.log(err);
            //(19.0.2)
            //console.log is not really useful
            //if we have a technical issue, we throw a real error
            //express js gives us a way of taking care of such errors
            //throwing an error has an advantage
            //we can also use next(); to continue
            //without request user being sent
            //if you throw errors in async (then/catch)
            //you will not reach the error handling middleware
            //to to make this throw work and go to the error middleware
            //throw an error before the .then (sync) part of code
            //throw new Error(err); < this does not work here
            //as this part is a async
            //use this
            return next(new Error(err).httpStatusCode=500); //(19.0.3)

        })
    
});





//app.use(adminJsRoutes.routes); //replaced code
//app.use(adminJsRoutes); //replaced code
app.use(shopJsRoutes);

////filtering mechanism
//not put /admin/.. in the routes links but put in the navigation/form etc.
app.use("/admin", adminJsRoutes);
app.use(authRoutes);




//used the __dirname directly here because we are in a root file
/*
app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {myTitle: "404 Page", path: "404"});
});
*/
const errorController = require("./controllers/errorController.js");

//(19.0.2)
//render this in case of get, not when any route fails
app.get("/500", errorController.get500);

//catch all middleware
//not a technical error object
app.use(errorController.get404);

//(19.0.3)
//error handling middleware
//express is smart enough to detect that this is a special kind of middleware
//as it has an extra error argument
//and will move to it right away when we call next with an error object passed to it
//like in the addProduct controller
app.use((error, req, res, next) => {
    //res.redirect("/500");
     /*
    we can also not redirect
    and res.render() a page
    res.status(error.httpStatusCode).render(...)
    so we can use the httpStatusCode sent with 
    the error object in the controller middleware's returned
    or return some JSON data (will do later in the code)
     */
    //this is the app crashing error consoled
    if (error) {
        console.log(error);
    }
    res.status(500).render("500", {
        myTitle: "500 Page", 
        path: "/500",
                //isAuthenticated: req.isLoggedIn
        isAuthenticated: req.session.isLoggedIn //(2.9)

    });

})


//connect to the node server once connected to the database
/*
mongoConnect(() => {

    app.listen(3000);
});
*/

//(2)
//enter the mongoDB connect url
//make sure to enter mongodb.net/shop for the shop database
mongoose.connect(MongoDbUri)
    .then(result => {

        //always gives back the first user it finds
        //(8)
        /*
        User.findOne().then((user) => {
            //if user is undefined/not set - create a new user
            if (!user) {
                //(8)
                const user = new User({  
                    name: "max",
                    email: "max@test.com",
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        
        });
        */
        app.listen(3000);
    })  
    .catch(err => {
        console.log("mongoose connect" + err)
    });



///////////////////////////////////////////////////////////////////
//Section 24

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






///////////////////////////////////////////////////////////////////
//







conclusion ?


*/






