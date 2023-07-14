///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs

//# nom install --save express-session  //s14: use sessions
//# npm install --save connect-mongodb-session //s14: store session in MDB
//# npm install --save bcryptjs  //s15: password hashing
//# npm install --save csurf    //s15: protecting against CSRF
//# npm install --save connect-flash    //s15:3.9 wrong credentials 
//#npm install --save nodemailer nodemailer-sendgrid-transport //s16 3.11 sending emails
//sendGrid/Mailchimp etc need to be sorted out yet
//# npm install --save express-validator //s18 validating inputs //s18 18.0.1

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

const mongoose = require("mongoose");   //(2)
const User = require("./models/user"); //(8)

const session = require("express-session"); //(2.6)
const csrf = require("csurf");  //(3.7)
const flash = require("connect-flash");   //(3.9)


const mongoDBStore = require("connect-mongodb-session")(session);
const MongoDbUri = "mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/shop"; // mongoDB web app connect url //shop?retryWrites=true&w=majority
const store = new mongoDBStore({
    uri: MongoDbUri,
    //define a collection where your sessions will be stored
    collection: "sessions"
    //can also add when it should expire - and that can be cleaned automatically by mongoDB

});

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



app.set("view engine", "ejs");
app.set("views", "views");

const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");
const authRoutes = require("./routes/auth.js");

//this middleware execute first then next to the next app.uses
app.use((req, res, next) => {
    
    //to allow the middleware below to only run if there is a session.user
    if (!req.session.user) {
        return next();
    }
    //User.findById("64a6f2a6c017acc261356a8c")
    //User is a mongoose model with method findById
    User.findById(req.session.user._id) //(2.10)
        .then(user => {
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
        .catch(err => {
            console.log(err);
        })
    
});


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
app.use(errorController.get404);


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
///////////////////////////////////////////////////////////////////
/*

Section 18

//290-300
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(18.0.0)

Forms, User Input and Validation

Why Validating is important
How to Validate

the bigger your application is
the more data you would need from users at some time

User
v
<form> a request with the form data is sent
V
Validation
V
<Node Code>
V
Database / File


you can also configure the form with a get request

we will add validation as an extra step right in the start of the node code
when we handle the request on the server
definitely before we store it in a database

this validation can then succeed to allow the data 
to be stored in the db or a file or handled by the rest of the node code

or we reject the input and thus return information to the user
prompting the user to correct the error

//we can validate on the client side (optional)
with the help with javascript
that watches the input for key events
or the user typing and checks while the user is filling the form
and then display the error, js can change the dom at runtime
before anything is sent to the server

however the user can see/change/disable that code
so it is not a secure solution but it can improve the user experience

//we can validate on the server side (required)
to filter out invalid values
this code cant be seen / changed / disabled by the user
to store correct data
or return a helpful error message
and never reload the page, but always keep the data the user
already inserted

mongoDB has built in validation (optional) MDB course




///////////////////////////////////////////////////////////////////
//(18.0.1)

- the email address is a valid email address
with an @ and domain
- the password is at least 6 characters long
- the confirm password matched the other password
- can also validate urls when adding a product

to use validation, we will use a third party package
for more info about it check the documentation

# npm install --save express-validator

you will want to validate on the post or non get routes
because you want to validate whenever the user sends data

will start with the postSignup route in auth.js route
- the email address is a valid email address
    with an @ and domain
- the password is at least 6 characters long
- the confirm password matched the other password

> in auth.js route import
express-validator/check
const {check} = require("express-validator")
which is a sub package
which includes all the validation logic you want to add
and de-structure into check
which is a function returns a middleware
pass the ejs email into it and use the .isEmail to check on it

we destruct to get specific things"

> in the auth.js controller
import
const {validationResult} = require("express-validator");
to gather all the errors
//had to remove the /check fom the require as stated in the docs


> in the postSignup controller in auth.js
const errors = validationResult(req);
and render with the flash the error



///////////////////////////////////////////////////////////////////
//(18.0.2)
//to edit the error message
> in the postSignup route in auth.js
has to be done in the middleware after the check in the route
router.post('/signup', check("email").isEmail("Please enter a valid email") ,authController.postSignup);


///////////////////////////////////////////////////////////////////
//(18.0.2)

> in the postSignup route in auth.js
express-validator is a set of express.js middleware
that wraps validator.js validator 
which is another package that was implicitly installed with express validator

and on the validator.js docs can find all the validator methods
like isEmail, what they do and how you can configure them
//you can also add your own validator


//294-300
///////////////////////////////////////////////////////////////////
//(18.0.3)


want to make sure that the password is at least 5 chars long
> in the postSignup route in auth.js
add an extension to the route middleware


///////////////////////////////////////////////////////////////////
//(18.0.4)
checking for passwords equality

in the signup view, name=confirmPassword
> in the postSignup route in auth.js
add an extension to the route middleware


///////////////////////////////////////////////////////////////////
//(18.0.5) Adding async Validation

removed the user.findOne{email: email} 
from the controller postSignup in auth.js

added it to the custom method on email
in the auth.js router postSignup
to return a promise that has a reject message
to be caught by the custom method

we can rely on the user not exist already
inside of the auth.js postSignup controller
because i do check for its existence ahead of time
in the auth.js route with the validation middleware


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(18.0.6)

add validation the same way we did before
to the login route
and make sure this email address is an email
and the password is a valid password

add validation to postLogin

> edit the postLogin route
> go to the postLogin controller
and add validationResult(req) to gather all the errors passed from the route


check for input errors during validation
check for logical errors in the controller




///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(18.1.0) keeping the wrong credentials in the form

working on the user experience
to prevent inputs from being lost and keep them
when a user submits wrong credentials during validation


postSignUp controller
where we return a page when wrong data is entered
to return it with the already put in input
in an oldInput object with these values to use in the ejs
also add the oldInput object to the getSignup to avoid undefined errors


299-305
///////////////////////////////////////////////////////////////////
//(18.1.1) give the user input and invalid border


you have to use the information which you are getting
to pass it to your view
and then render something different based on that information

>> allow the postSignUp/getSignUp controller
to pass validationErrors to the render
the get will be an empty array and the post will be errors.array();

>> go to the ejs and will change the styling of inputs
based on the existence of errors

> add to the input
class="<%= validationErrors.find(e => e.path === 'email') ? 'invalid' : '' %>"
find looks in arrays
if not found will return undefined or null
if found then set class to invalid

> add the class to the css

note: all the boxes will be red on wrong signup
unlike the flash error which is displayed for the first wrong only

///////////////////////////////////////////////////////////////////
//keeping credentials and adding validation css for the login page

>> postLogin controller
add the oldInput, empty validationErrors to the render object
instead of flashing then redirecting
return a res.render
and put the flashing message in the errorMassage key

>>getLogin controller
add an empty oldInput, empty validationErrors to the render object

on the ejs 
put for the inputs value = the passed oldLogin

//we did setup that the wrong password gets a red border but wrong emails do not


///////////////////////////////////////////////////////////////////
//(18.1.2)
//sanitizing data (visual) trimming inputs before storing
security sanitizing will be covered later later

on the validator library docs that the express-validator use
we can also find sanitizers

for example
can ensure that there is no white space on the left/right
in a string passed by user

can normalize an email, its converted to lowercase with trimming etc.

//to ensure the data you get is not just valid
but also stored in a uniform way


>>go to the auth.js routes, getLogin/getSignup
and chain methods of normalizeEmail() to email and trim() to password




///////////////////////////////////////////////////////////////////
//(18.1.3)

//Validating Product Addition for add-product
to control input and display the error using the express-validator

//title that should be alphanumeric, at least 3 chars long

//imageUrl, valid url, 

//price should be a floating point number - decimal

//description at least 5 characters long


>> go to the admin.js router
import the express validator and destruct into body
>>work on the add-product/edit-product post routes

we start the middleware array by body("ejs-name")


>> go to the admin controller and make sure we 
collect these validation errors and return them

const { validationResult } = require("express-validator");

add if no error, render like the "edit-product"
however will make product key an object with the ejs data
and set a key of hasError to true (also copied as false in the get controller)

>> in the edit-product view
want to render the existing product inputs if i am editing
or if hasError

>> in the edit-product view
add from the login.ejs the if errorMessage to display errorMessage


//make sure each key put in post controllers render to pass info
is put in the get controllers as empty or null to not cause undefined errors

body("title")
//used instead of isAlphanumeric, isString as it allows white spaces
    .isString()


///////////////////////////////
//Validating Product Addition for edit-product
to control input and display the error using the express-validator

>> copy the validation methods array in the router
>>copy the validationErrors if is empty render
to the post edit-product controller
with changing key values to the ones in the controller

Note: we can overwrite the default error message displayed on the website
by using the methods we used before like custom, withMessage, 2nd body argument string

to add the red border css
>>add the validationErrors class line to each input
>> add this to the postEdit/postAdd controller render object
validationErrors: errors.array()
and put it with empty array for the get controllers


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//Wrap up

adding validation to routes with the express-validator and validator
then we collect errors in our controllers
and we do something if we do find errors
render, 
    pass error message(display with div), 
    validationErrors(for if for css),
    oldInputs (for refilling with entered values again)

//there are also other 3rd party validation packages to use
//



*/