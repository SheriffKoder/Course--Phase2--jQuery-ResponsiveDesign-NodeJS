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


const express = require("express");         //(24.0.2)
const app = express();                      //(24.0.2)
const bodyParser = require("body-parser");  //(24.0.3)
const mongoose = require("mongoose")        //(25.0.5)
const path = require("path")                //(25.0.7) to import static images
const multer = require("multer");           //(25.2.0) uploading files

const feedRoutes = require("./routes/feed.js"); //(24.0.2)


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
app.use("/feed",feedRoutes);


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
    res.status(status).json({message: message})
})


//connect to the messages database by amending /messages
const mongoDB_URI = "mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/messages?retryWrites=true&w=majority";
//(25.0.5)
mongoose.connect(mongoDB_URI)
.then((result) => {
    app.listen(8080);
})
.catch((err) => {
    console.log(err);
})

//(24.0.2)
//listen to port 8080, will use 3000 for something else later
//app.listen(8080);



///////////////////////////////////////////////////////////////////
//section 25 part 2

/*
///////////////////////////////////////////////////////////////////
//(25.0.5)
//adding a database
//adding a mongoose model schema, connecting to mongooseDB

will use mongoDB/mongoose
will use the same mongoDB atlas server we configured earlier

//will allow us to connect to the database
//create the mongoose models, store data
# npm install --save mongoose

>> import and mongoose.connect uri
with /messages database to created
.then app.listen

>> create a models folder
and a post.js file in it
to define how a post should look like

import mongoose, schema
define a PostSchema
!! new: pass an option to the schema constructor
time_stamp





//378-384
///////////////////////////////////////////////////////////////////
//(25.0.6)
//using the database model
//sorting posts in the database



>> import the post.js model to the createPost feed controller
create a new post from the inputs and save




///////////////////////////////////////////////////////////////////
//(25.0.7)
//working on images, accepting image uploads

to serve the image
we have to make sure we serve the images folder statically

>> import in the app.js path module
use express.static() for the /images folder


///////////////////////////////////////////////////////////////////
//(25.0.8)
//setup proper error handling
//why? an elegant way of handling errors


instead of using the express-validation way
from using validation in the router and
returning a json with the validation result in the controller

will use the general error handling middleware

> on finding an error and it is thrown
will pass the controller
and get to the next middleware
which is the error handling middleware in app.js

>> create, throw new error in case validationResult has an error
and adjust the catch to forward the error with next()
>> setup the error middleware in app.js


> now when we generate a validation server error 
router says title length 7 and we input 5
the console shows the statusCode: 422



///////////////////////////////////////////////////////////////////
//(25.1.0)

//creating a route for getting a single post
so we can finally see if we can see our image


//if you throw an error inside a then block
//the next catch block will be reached
//and the error will be passed as an error to the catch block

>> add get route to /post with param of /:postId
>> add a getPost controller
Post.findById(postId)
then if error return error 
else return the response with status and json

//now we need to adjust our front-end code
>> go to FE singlePost.js file
we need to target the right URL of
fetch('http://localhost:8080/feed/post/' + postId)


//now the image is not displayed
because we are not looking at the right url for it
in the FE singlePost
in the       .then(resData => {
        this.setState({
add
image: "http://localhost:8080/" + resData.post.imageUrl,




///////////////////////////////////////////////////////////////////
//(25.1.1)
//since we defined the database, we should fetch data from there
//fetch all posts from the database instead of a dummy post

>> Post.find to find all posts
and return the response with status and json


//
///////////////////////////////////////////////////////////////////
//(25.2.0)
//image upload

the logic is the same as we used before

# npm install --save multer











*/










