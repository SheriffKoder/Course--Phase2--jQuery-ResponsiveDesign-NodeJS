///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs

//# nom install --save express-session  //s14: use sessions
//# npm install --save connect-mongodb-session //s14: store session in MDB
//# npm install --save bcryptjs  //s15: password hashing

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

const mongoose = require("mongoose");   //(2)
const User = require("./models/user"); //(8)

const session = require("express-session"); //(2.6)


const mongoDBStore = require("connect-mongodb-session")(session);
const MongoDbUri = "mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/shop"; // mongoDB web app connect url //shop?retryWrites=true&w=majority
const store = new mongoDBStore({
    uri: MongoDbUri,
    //define a collection where your sessions will be stored
    collection: "sessions"
    //can also add when it should expire - and that can be cleaned automatically by mongoDB

});


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
on the server we check if this user's email/password combination is valid

if that is the case, we create a session for that user
(stores info that user is authenticated)

this session then identifies this user
that connects requests otherwise a user will be logged out

then a 200 response is returned
then we store the cookie belonging to that session on the client
returning with that response

now the user is able to visit our restricted routes
because a cookie is sent with every request

on the server we can connect this cookie to a session
and in the session we have information wether the user is signed in or not

and if the user is signed in we can grant access to certain resources

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













*/