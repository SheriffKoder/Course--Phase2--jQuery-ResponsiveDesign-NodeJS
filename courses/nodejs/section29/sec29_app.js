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
//# npm install --save helmet //(29.0.2)


const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");   //(2)
const User = require("./models/user"); //(8)

const session = require("express-session"); //(2.6)
const csrf = require("csurf");  //(3.7)
const flash = require("connect-flash");   //(3.9)

//(29.0.2)
const helmet = require("helmet");


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


//(29.0.1)
//console.log(process.env.NODE_ENV);


const mongoDBStore = require("connect-mongodb-session")(session);

//(29.0.1)
//process object globally available in the node app
//env, object with all the environment variable this node process knows
const MongoDbUri = 
//"mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/shop";
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jgxkgch.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`; 
// mongoDB web app connect url //shop?retryWrites=true&w=majority

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


//(29.0.2)
app.use(helmet());


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
        //(29.0.1)
        // app.listen(3000);
        //if undefined use 3000, 
        //will fall to 300 in a local development if its not set by a hosting provider
        //most hosting providers will inject a PORT environment variable
        app.listen(process.env.PORT || 3000);

    })  
    .catch(err => {
        console.log("mongoose connect" + err)
    });



///////////////////////////////////////////////////////////////////
//section 29

/*
///////////////////////////////////////////////////////////////////
//(29.0.0)
//Deploying Node.js Applications

deploy projects to a hosing provider
security

in this course we built

1 server-side Rendered Views
Vanilla HTML, templating Engine

2 API's
REST and GraphQL

both types work the same
have the same Hosting Requirements

start a node server with node filename.js
and use a node framework (e.g Express)


//Preparing the Code for Production

# want to "use Environment Variables"
to avoid hard coding certain values in code
like api keys, port numbers, passwords into your code

# also make sure when using third-party services like stripe
that you "use the Production API keys"
and not the development testing keys

# "reduce error output details" as little as possible
to avoid exposing insights into our code
do not send sensitive info to users

in this course we used the default express handler middleware's
and the default errors and the custom errors
we made also do not contain any sensitive information
which are fine

remove data out of the errors when deploying the application
or preparing the application for deployment

# regarding the responses your application sends
"set secure response headers"
some headers do not hurt, prevents the client from doing certain things

> will be shown how to easily set these headers
and find out which headers they are
as a best practice

these are handled by the hosting provider:
# "Add asset compression"
in a typical node application
can serve some assets (js/css files)
and there adding compression can be a good idea
it can reduce response size, time
as the client has to download less
and most browsers are able to download compressed/zipped assets
and unzip them on the fly directly on the browser


# "configure logging"
so can be aware/stay-up-to-date of what is happening on your server
since we are not testing the servers but users now do


# "Use SSL/TLS"
encryption of data in transit
thus far we used Http server, so communication with the server
was not encrypted



///////////////////////////////////////////////////////////////////
//(29.0.1)

//using the injected environment variables
in package.json that will be used in the whole code files

we will be working with the shop application
built before the REST module

//what can we control in an environment variable
and what is an environment variable

a concept supported by nodejs
where we can pass certain configurations/values
into our node application from outside
we do not hard-code certain node values into our node code
instead the values will be injected when our node server starts

and that allows us to use different values in development
and production
and change the values in production without having
to deploy our entire code

> for example the MONGODB_URL
has some hard-coded values like the username, password, /shop

> the app.listen(portNumber)
we typically use any number above the 1000
in production we want our hosting provider to set this port
as it controls the port number

> the shop controller stripe key


any changes to be made here will require re-deploying the code
and if the code was shared, the information will be visible to others
thus want to use, Node Environment Variables


>> edit the MONGODB_URL in app.js
>> edit the port of server.listen in app.js
>> edit the stripe key in controllers > shop.js


// how we can pass these variables into node

>>create a nodemon.json in the application root folder
add in a json object
the username, password, default database
no host as it will be provided by the hosting provider
for stripe key go to stripe.com > developers > api keys > secret key


these are still the development values

we are using the variables in a nodemon file
when deploying will set the start in package.json to node app.js 

and in the hosting provider dashboard put the variables
or if no hosting, put in the script of "start" the variables


>> process.env.NODE_ENV
will be set by hosting providers to production

when set to production, will reduce the details for errors it throws
and optimize somethings for deployment


changing testing keys for production keys in stripe
in stripe developer api keys there is a button to switch key mode
that will require activation for the account and payment details


///////////////////////////////////////////////////////////////////
//(29.0.2)

//Setting secure response headers with helmet

helmet, third party package, secure node express applications

will add certain headers to the responses sent back
 
check the site for the headers used and why it protects you against it

# npm install --save helmet

and simply require and include it as a middleware in app.js
//app.user(helmet())
then it will run on all incoming requests
adjust the responses
and set its headers

when visiting the site on localhost 3000
can open the dev tools and  will find in networks > localhost > headers
headers set by helmet



///////////////////////////////////////////////////////////////////
//(29.0.3)
//compressing assets















*/











