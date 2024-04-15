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

//# npm install --save helmet compression  //libraries in the deploying section29
//# npm install --save  morgan //makes logging request data simple

///////////////////////////////////////////////////////////////////////////////////////
// Application imports 1

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");   //(2)
const User = require("./models/user"); //(8)

const session = require("express-session"); //(2.6)
const csrf = require("csurf");  //(3.7)
const flash = require("connect-flash");   //(3.9)


// 29.0
require("dotenv").config();
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const fs = require("fs");   //morgan will use it

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: "a"});


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Use multer before accessing other middlewares*
// if there is an image file on the request, will store it

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

///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Application imports 2
const mongoDBStore = require("connect-mongodb-session")(session);
const MongoDbUri = 
`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.jgxkgch.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`; // mongoDB web app connect url //shop?retryWrites=true&w=majority
const store = new mongoDBStore({
    uri: MongoDbUri,
    //define a collection where your sessions will be stored
    collection: "sessions"
    //can also add when it should expire - and that can be cleaned automatically by mongoDB

});



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Libraries Middlewares

///////////////////////////////////////////////////////////////////////////////////////
// bodyParser accepts incoming form field data to be used in the controllers on the "req"
// to use the req.body.fieldName, will be passed to the app.use's
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));


///////////////////////////////////////////////////////////////////////////////////////
//(20.0.1)
// Use multer before accessing other middlewares*
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

// sets secure special headers in the response
app.use(helmet());
// makes front-end files like css, javascript assets a bit smaller  - can be already provided by hosting providers
app.use(compression());

// log requests into this file accessLogStream - can be already provided by hosting providers
app.use(morgan('combined', {stream: accessLogStream}));


///////////////////////////////////////////////////////////////////////////////////////
// flash is used to store some text in response to controller operations
// and these text messages can be forwarded to the front-end as a value to display error messages
//(3.9)
//flash needs to be initialized, after the session
app.use(flash());

///////////////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////////////
//(3.7)
//executing the imported csrf as a function
//object to configure some things
//for example want to store the secret that is used for hashing your tokens
//the default settings should work fine, can dive into the official docs of the package to learn more
//const holds a middleware
const csrfProtection = csrf();

//(3.7)
//csrfProtection is enabled but need to add something to our views to use it
//for any non get requests (post etc.)
//this package will look for the existence of a csrf token in your views/request body
//to make sure such a token is there, make sure we have it available in our views
//to do that we have to pass data into our view
//go to the controllers
app.use(csrfProtection);



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Basic Middlewares

// allow the use of these folder by users/frontend etc
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images"))); //(20.0.5)


// define the templating engine's type
// and the folder containing the frontend code using it
app.set("view engine", "ejs");
app.set("views", "views");

// define the application's route files
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
    //to allow the middleware below to only run if there is a session.user**
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



///////////////////////////////////////////////////////////////////////////////////////
// after we pass authentication, we can use/visit the routes for shop, authentication, admin
// that forwards to controllers that displays front-end to the user and handles data

//app.use(adminJsRoutes.routes); //replaced code
//app.use(adminJsRoutes); //replaced code
app.use(shopJsRoutes);

////filtering mechanism
//not put /admin/.. in the routes links but put in the navigation/form etc.
app.use("/admin", adminJsRoutes);
app.use(authRoutes);


///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
// Error handling Middlewares

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



///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////
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
        app.listen(process.env.PORT || 3000);
    })  
    .catch(err => {
        console.log("mongoose connect" + err)
    });



///////////////////////////////////////////////////////////////////
//Section 22

/*

//344-350
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(22.0.0)

//Async js requests

the request we used until now
was a request that is sent from the browser
submit a form, entered a url, clicked a link

and the response was always a redirect
or a new html page

but sometimes you have some requests
that will only happen behind the scenes
that means you may not need to send an html page
but to only "exchange some data" with the server for example

what Async js requests are
why we would use them 
how we would use them


Client (Browser)
(to) request || (from) response (html)
Server (Node App)


sometimes there are tasks where you "do not want to reload a page"
just for example to delete an item

in modern web applications
the portion that happens behind the scenes
grows since we can do a lot with js in the browser
where we never need to fetch a new html page
but we constantly change the existing page
as this is faster than loading a new one
~ this will be covered in the restful api module


the idea behind async requests:
you do send a request but that "request"
typically contains just "some data"
in a special "format" named "JSON"
and that data is sent to the server
to a certain url or a route
accepted by the server
the server do whatever want to do with that
then we return a response
that "response" is also returned behind the scenes
so it is not a new html page that needs to be rendered
it is instead just some data in that "JSON" format typically

and that is how a client server can communicate
through client side js and the server side logic
without reloading/re-building the page
or exchanging a new html page

and that allows you to "do some work behind the scenes
without interrupting the user flow and reloading the page"



///////////////////////////////////////////////////////////////////
//(22.0.1)

for example, in admin.js controller postDeleteProduct

after the deleting logic, we redirect

once we are done with deleting
the server will respond with some json data or a success message
once we get that message in our browser
we can delete the item from the DOM

this can be done with client side js and server side help

the logic in our server wont change too much
but the way we expose our route changes a little bit
and we will have to add some logic to our client side


!! ejs script to admin.js, function that finds elements and access their value

>> create in the public/js folder, admin.js
this will be js code that will not run on the server
but will run on the client (the browser)

>> this file will be imported into the products.ejs
<script src="/js/admin.js"></script>
/js right away as the public folder is served statically (like the css)
this script will execute on the products ejs file
and placed at the bottom of the file
to make sure the whole dom is rendered and parsed
by the time we execute the js code

> want to react/listen on a click on the delete button
> the button should not be of type submit, but of type button
> actually we will remove the form, 
because its job was to send a request through the browser
with the x-www-form-encoded-data
> and gather the inputs from ejs manually (productId, csrfToken)


>> add to the js/admin.js
console.log 
and add to the ejs button onclick attribute to this function


still running the node file-name in vscode,
> now when we click on delete in the browser, the browser console
will display clicked (and wont delete the product yet as we disabled the form)

> passing (this) to the deleteProduct will refer to the button

>> using btn.parentNode.querySelector("[name=productId]").value
we can access the dom element's value


///////////////////////////////////////////////////////////////////
//The JSON Format

just like a js object 
but with two important differences
1) all the keys have to be wrapped in ""
2) key values can be nested objects and arrays

{
    "name": "your name",
    "age": 29,
    "active": true
    courses: ["node-js", "react"],
    profile: { "joined: 2017-05-21", "courses": 2}
}



///////////////////////////////////////////////////////////////////
//(22.0.2)

to continue we need a route on the backend
to which we can send our js request

>> go to routes admin.js
change the route verb from router.post to router.delete
change the postDeleteProduct to deleteProduct
keep the isAuth 

>> in the admin.js controller
change the postDeleteProduct controller to deleteProduct
change req.body to req.params
same logic
will change the response returned
> we will not return a response with a redirect
> will return a response with json data


>> want to send a request to the router from inside our public js/admin.js
we will use the fetch method supported by the browser
we will not send json as we still did not user a json parser in app.js

!! the fetch will send to the browser an http request
of url and data, which will then be taken to the router
which will activate the controller of it
where i sent the prodId in the params and csrf in data?

## now i can press delete and see the response in the console
and when refresh the product will be deleted

note: delete did not work on products with images of url not file


//352-358
///////////////////////////////////////////////////////////////////
//(22.0.3) Removing the product from the dom without refresh

manipulating the dom

the result in the admin.js script
was a cryptic body with a readable stream

>> the controller then/catch result in json
will send to the script a json result
in the script's then json the result
.then display the output of the result.json
which is the (controller then/catch result in json)


>> in admin.js script
access the button parent (the product's container)
with btn.closest

then when displaying the json result
btnParent.parent.remove(btnParent)
let the btn parent access its parent and delete the child (btn parent "itself") 

!! now when the product is deleted, it is also deleted from the dom


//you can send data to your backend
with the help of these async requests
and how you can include data
and how you can handle that on the backend

*/


///////////////////////////////////////////////////////////////////
//Section 23

/*

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(23.0.0) //Payment

//Adding Payments

before the
REST API is a whole new way of interacting with the client
lets work on the payment functionality

we will add a simple checkout page
will collect some card data from the user
do the purchase, charge the card
and store the order as we did before

we will use a third party provider, S.T.R.I.P.E




//how payments work

collect payment method (card)
verify payment method (correct data, expiry, number)
charge payment method
manage payments
process order in our app (store in a database)

the first 4 processes are complex
from a legal and technical sides
this is why we typically outsource them (even very big companies outsource this)


//how strp work

Client(Browser)     ->   collect card data
                                v
                        send to 3rd party strp servers (not owned by us)
                        to validate that input
token               <-   strp will return a token once it is valid
(which includes the card data)
(and the confirmation that it is correct)
(then we send that token to our server)
|                              ^
V                              |
Server (Node App)       (create payment data with the help of strp)
(our code charge this payment method)



so we send a charge object, we send that to strp
with that token and with our price included
and strp will do the actual charging/managing
we will get a response once it is done
then we can cont. with our code and store this in the db 


///////////////////////////////////////////////////////////////////
//(23.0.1) //Adding a checkout page


>> go to the views/shop/checkout.ejs
want to go there when we click "Order now" in the cart
create an empty body boilerplate like the cart.js

>> need to create a route in shop.js to reach the page
>> change the order now button in cart.ejs to href to /checkout

>> shop.js controller, getCheckout copy code from getCart
and also send totalSum of cost
by looping over the products array and adding to total quantity*price


..in the getCheckout will have the possibility to create an order

now we can click order now and be directed to the checkout page
which displays the cart products and total price for all


///////////////////////////////////////////////////////////////////
//(23.0.2) //connecting to strp


//go to their website
//they have good documentation
//create account
//verify email

in the developers tab will find the api keys you need to add strp
there is a test key button
>> make a name, click new business at top left

>> grow your online business with payments > read the docs
this will take us to the strp documentation
https://strp.com/docs/payments
there you can learn about all the different ways of collecting payments

on the docs page > web tab > integrate strp js tab
however new site is
strp.com/docs/payment/quickstart
at (3) copy
    <script src="https://js.strp.com/v3/"></script>
    and the provided test api key
    const strp = strp("......");


>> in the checkout.ejs
create a div
place that script tag and a button

> and in another script tag 
place the api key
on button click use strp.redirectToCheckout
which asks for sessionId in its passed object
now we want the session

>> go to the shop.js controller 
to prepare a strp session to send to the ejs
install strp # npm install --save strp
"import" with secret key

> in the getCheckout .then 
return the "stripe".checkout.sessions.create({config})
and place the render in another then which receives the session

> do the session config
payment method, mapped items into a array of objects, urls for success/cancel

>> create routes for success/cancel urls

> cancel will use getOrder controller
>> create getCheckoutSuccess in shop.js controller
which is the same as postOrder

!! now we can click order now and get redirected to strp payment page
enter dummy data with card 4242 .. and date in the future


///////////////////////////////////////////////////////////////////
//(23.0.3) //strp code fixes

//there is an issue
if we added a product
and entered in the browser the url
/checkout/success
the cart gets empty and an order is placed without paying for it

solution: use strp webhooks

in the home of strp site can see the order details
and what products where ordered and the customer's info
there is charges strp take for each transaction
you can compare that to the orders you see in the database,

and on large scale applications it can be hard to compare all orders
as stated on the strp docs of one-time-payments
that you should not rely on the success_url alone
as users could directly access the success_url without paying
or users can not reach the success_url in case closed page before redirecting

instead as "After the payment" page
you have to fulfill a payment
make sure that strp tell you when a payment happened
instead of a url telling you
using "fulfilling purchases with webhooks"
where strp sends a request to a url of your choice
which you have to manage in your application with routing/controlling
and that then tells you that the order succeeded
because stripe sends you that request behind the scenes
a request validated by stripe not easy to fake
but it requires a website hosted on the internet

///////////////////////////////////////////////////////////////////



























*/