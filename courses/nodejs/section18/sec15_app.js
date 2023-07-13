///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs

//# nom install --save express-session  //s14: use sessions
//# npm install --save connect-mongodb-session //s14: store session in MDB
//# npm install --save bcryptjs  //s15: password hashing
//# npm install --save csurf    //s15: protecting against CSRF
//# npm install --save connect-flash    //s15:3.9 wrong credentials 

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

//User Authentication

/*
///////////////////////////////////////////////////////////////////
//(3.1)

add functionalities like user sign up, sign in
and some functionalities to allow specific content to users
who are signed in

not just hiding content, but locking access
how to store password securely
how to store and use the credentials (email, password)
protecting routes / locking access

How is authentication implemented ?
a user will send a login request with an email and password
a user need to have signed up before 
> on the server we check if this user's email/password combination is valid

> if that is the case, we create a session for that user
(stores info that user is authenticated)

this session then identifies this user
that connects requests otherwise a user will be logged out

then a 200 response is returned
> then we store the cookie belonging to that session on the client
returning with that response

now the user is able to visit our restricted routes
because a cookie is sent with every request

> on the server we can connect this cookie to a session
and in the session we have information wether the user is signed in or not

> and if the user is signed in we can grant access to certain resources

we will learn other ways of adding authentication
with rest and graphQL apis




we will
-create new users
-sign users in / out
-use the information whether the user is signed in / out in our views
-we can protect our routes on the server side too




///////////////////////////////////////////////////////////////////
//(3.2) Implementing a user flow
//creating a new user


the passed data will not be validated yet if right or wrong
in another module

in postSign
create a new user if email does not exist
with email, password, empty cart items

in the user model add email and password properties

remove the logic for dummy-user in mongoose.connect

delete existing users in the database through the compass app



///////////////////////////////////////////////////////////////////
//(3.3)

encrypt user passwords to protect users and
to avoid it being exposed to personals or database compromising

hash it in a way that is not reversible
and people cannot construct the password from

# npm install --save bcryptjs

in auth controller use bcrypt to hash passwords


//256-262
///////////////////////////////////////////////////////////////////
//(3.4)

//adding the sign in functionality
//signing in by email/password

User.findOne({email: email})
bcrypt.compare(password, user.password)
if do match set/save session

will find in the database sessions
a session with a user object containing all user's properties



///////////////////////////////////////////////////////////////////
//(3.5)

//we can still enter the url in the browser for the
urls offered to the logged in users only even though we are not logged in

//protect routes
check if the user is authenticated before returning
back the add-product-page

getAddProduct controller by putting
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }
before the render

but this is not a scalable way (to add to all controllers)
add a middleware that should be added for every route that
should be protected 

create in the project's folder
middleware folder with is-auth.js file
and write an exported middle function

to be imported and used in the routes files
the middleware added in the router get/post lines
where the router executes handlers from left to right

so we will either redirect
or on the next() proceed to the next handler in the route


///////////////////////////////////////////////////////////////////
//(3.6)

//understanding CSRF Attacks

cross site request forgery

people can abuse your sessions
and trick users of your application
to execute malicious code

where users can access websites look like your site
fake sites that have a link leading to your real page
and execute some request there
which could include a form that sends a post request
to your own node server
where there is some fields to send money to another person

why does this work ?
since you got a valid session for that user
if you sent something to your site/servers
that session is used for that user
in this case that behind the scenes data
that the user never sees
that configures the money/order transferral
in a way that is not ok with the user
is invisible to the user
but the valid session is used for it
and therefore it is accepted
thus the session is stolen

how can we protect against this pattern ?
ensure that people can only use your session
if they are working with your views
so the session is not available on any fake pages

and we can use this feature with a CSRF token


///////////////////////////////////////////////////////////////////
//(3.7)


# npm install --save csurf

a token, string value we can embed into our forms, pages
for every request that does something on the backend
that changes the user state
anything that does something sensitive
that we want to protect against

we can include this token in our views
and on the server this package will check
if the incoming request does have this valid token

the fake sites might send a request to your backend
and they could then use your session
but the request would be missing the token

and they cannot have the token because its a random hashed value
and only one value is accepted
and the package which runs on the server 
determines if the token is valid

so they cant guess it
or steal it because a new token is generated for every page you render


steps:
import and define the csrf middleware
(the logout button has a csrf undefined error so..)
add a csrf property to the render of getIndex controller
the navigation ejs use the csrf property
<input type="hidden" name="_csrf" value="<%=csrfToken%>"
the package that we added will look for the name

now the package is able to extract the csrf token
it also finds out that the token is valid
and thus it allows us to proceed



262-268
///////////////////////////////////////////////////////////////////
//(3.8)

//another way of adding the csrf token to every page we render
tell express js that we have some data should be included
in every rendered view

>> in app.js add a middleware to pass token to all renders
//locals allows to set local variables that are passed 
//into the views which are rendered
res.locals.isAuthenticated = req.session.isLoggedIn;
res.locals.csrfToken = req.csrfToken();

>> copy the input csrf to all the post forms in the ejs files  
even the forms for buttons

you can see in the dev tools form element the input csrf value
is a hashed string

a crucial thing that you have to add to any production ready application

however csrf is no longer maintained
so can use other packages 
https://www.npmjs.com/search?q=express%20csrf
https://www.npmjs.com/package/csrf-csrf



//fix
as we are using users with email/password
with no names
changed user.name to user.email 
in the postOrder controller and order model


///////////////////////////////////////////////////////////////////
//(3.9) using flash to store error messages in the session

now we have all the core features related to authentication implemented

until now when we enter wrong credentials we do not display any error
we just redirect


its easy to pass data to views but
it is a huge problem when passing data to the rendered view 
when we are redirecting
because on redirecting technically a new request is started
to the redirect-to path

and on that request we do not know if the user entered invalid credentials

to solve this
and store some data before we redirect
which we then use in a brand new request
that is triggered by the redirect
we can use a session for that
but do not want to store it permanently
want to store it and once the error message is used
can be pulled out of the session
and did something with it
i want to remove it from the session

so for subsequent requests
this error is not part of the session anymore

there is a package that makes that really easy

# npm install --save connect-flash

import and app.use in app.js

>>req.flash("error", "message") 
in the auth controller without import
as it has been initialized in app.js ?

in the getLogin controller render parameters
>>errorMessage: req.flash("error")

then this error message will be removed from the session 
on rendering the page

on the login.ejs
>>    <div><%=errorMessage=></div>

//this is working for any wrong emails



///////////////////////////////////////////////////////////////////
//(3.10)

//adding styling to the login.ejs div and css properties in main.css

however the div stays
because in the getLogin controller
the req.flash("error") on no error will output an empty array

so will set the message array if its not an empty array
to be the first element of the array
otherwise message be null

>>add to the password section also
req.flash("error", "Invalid Email or password.");

>>add to the sign up in case email exists
>>add the errorMessage div to the signup ejs
>>add the div logic to the getSignup in auth.js controller


///////////////////////////////////////////////////////////////////
//wrap up

Authentication
authentication means that not every visitor of the page can view 
and interact with everything

authentication has to happen on the server-side and builds up
on sessions

you can protect routes by checking the session-controlled
login status right before you access a controller action

Security & UX
Passwords should be stored in a hashed form
CSRF attacks are a real issue and you should therefore
include CSRF protection in ANY application you build

for a better user experience, you can flash data/messages
into the session which you then an display in your views









271-277
//Section16 & 17
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(3.11)
//password resetting mechanism via email

how we can send mails from inside our node application
so then use that feature to enhance our authentication
to add a password resetting mechanism 

 
we could want to send an email confirming the user signed up for example

sending emails via nodejs and express js

node server (with your code) > user

handling mails is a different technology from handling post/get requests
and it is complex to setup, so we use a third-party
like AWS for sending emails

search for node mailing what services available and how to implement
services like; SendGrid, mailchimp, aws, ses

#npm install --save nodemailer nodemailer-sendgrid-transport

#npm install --save nodemailer nodemailer-mandrill-transport

node mailer makes sending emails from inside nodejs easier



> import nodemailer and the mailchimp transporter in the auth controller

> create transporter
const transporter = nodemailer.createTransport(sendgridTransport({

> before the signInPost redirection
transporter.sendMail({configuration})


//i cannot access sendgrid to use it as in the lecture due to authenticaions
//and mailchimp gives a "you must specify a key value" or invalid
    //probably needs domain register
//AWS requires CC and i will need to secure the API if will use that and not post on github
//will continue as is and just learn the way and use later

on a large scale application
can use server side scripts that run every x hours/minutes
that sends emails to newly signed users


275-281
///////////////////////////////////////////////////////////////////
//(4.1) resetting the password from the site thorugh an email

improve authentication and security regarding authentication

make sure that only users who created a post can edit it

- resetting passwords
- authorization

//reset page
create a reset.ejs in the auth views folder
copy the login ejs there
create a getReset in auth.js controller, routes
add a link with href="/reset" in the login ejs

//reset email
create a unique token with an expiry date
which will be stored in the database
the link will include that token so we can verify that
the user did get that link from us 
users change the password only from the email that contains that token

create a postReset in auth.js controller, routes
import the nodejs crypto library
convert crypto to string
>> in the user model add resetToken, resetTokenExpiration of type Date
store that token on the user we wish to reset
then send email with that token embedded in a link

>> now when we press the reset, we will receive a token
in the reset link in the email and in the database's user

282-288
///////////////////////////////////////////////////////////////////
//(4.2) Creating a password form

//add logic to add this route
//extract that token
//validate whether we have a user for that token
//then offer a form that allows the user to set a new password



create new-password.ejs, inspired from the login.ejs
auth controller, getNewPassword

where the url param token is taken
and find the user with that token and date more than now still
then can render the view with that userId

as the route will be redirected again to /reset through the email
the getNewPassword router url will be /reset/token


>in postNewPassword controller in auth.js
take inputs including hidden, from the page
put into the new user, save the new user


now we can change the password without mail by
reset password, put user's email
get the token from compass and access
reset/tokenw23123123123 to access the put new password view
(like the email already sends)
you can submit a new password and refresh compass to see it



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(4.3) Why we need authentication

not every authenticated user is allowed to do everything
i can delete all products either i created or someone else
restrict the permissions of a logged in user
users should not be able to delete products they did not add

we did store the userId for each product created
is the current logged in user is the user who created that product
before allowing any edit

in the admin controller getProducts
want to show only products that where added by the current logged in user
add a filter of userId = the current logged in user
in the find method

///////////////////////////////////////////////////////////////////
but we can still send requests to delete these products

postEdit, postDeleteProducts
want to check that the product i try to delete
is really created by the currently logged in user

postEditProduct
if (product.userId.toString() !== req.user._id.toString()) {
redirect

postDeleteProduct
//delete one product where .. = ..
ProductClassModel.deleteOne({_id: prodId, userId: req.user._id})



///////////////////////////////////////////////////////////////////

Password Resetting
has to be implemented in a way that prevents users
from resetting random user accounts

Reset tokens have to be random, unguessable (at least till the expiration date) and unique
great mechanism to identify the user for whom we want to reset the password


Authorization
locking down access for authenticated users
Authorization is an important part of pretty much every app
Not every authenticated user should be able to do everything
Instead, you want to lock down access by restricting the 
permissions of your users






*/