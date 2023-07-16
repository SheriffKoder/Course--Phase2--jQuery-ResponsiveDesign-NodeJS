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
//Section 20

/*


//319-325
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//(20.0.0)

File Uploads and Downloads

how to allow users to upload files, how to handle that on the server-side
and what different possibilities you have for returning files to your users


//give the user the possibility of uploading images
when adding a product

1) adjust our form to show a file picker to users
2) accept that file in the place we handle the incoming request


>> go to the edit-product.ejs view
add a form with input type file, names/ids image
in the form itself add this attribute
enctype="multipart/form-data"
which tells the server that this submission/request
will not contain just plain text - mixed data - text and binary data
www-form url encoded is the default (text only)
>> go to the admin controller postAddProduct
change to req.body.image


>> go to the route, remove the imageUrl validation

the bodyParser in app.js we used urlEncoding
which extracts input in a text format
which does not work on the image file
can check that in the dev tools > network > path name > form-data

bodyParser cannot handle files
will use another package
# npm install --save multer

this package parses incoming requests for text and files
will look for incoming requests with the type of data
defined in the form multipart/form-data
and will then be able to parse both text and our file


///////////////////////////////////////////////////////////////////
//(20.0.1)

>> go to the admin controller postAddProduct
we want to use multer to extract incoming files
multer is a middleware
which we execute on every incoming request
and it have a look at that request
sees if it's multipart form data
and tries to extract files if that is the case

an extra middleware we add

>> import in app.js
>> app.use(multer({dest: "images"}).single("image"));
where image is the input name in ejs

>>> in the postAddProduct
change req.body.image to req.file

now we can have an image without extension in our project folder

//to add more config to control the path and the file name

in app.js
>> const fileStorage = multer.diskStorage({
    with destination and filename functions
>> app.use(multer({storage: fileStorage}).single("image"));
storage instead of dest, as it gives more config
fileStorage will use the set config in diskStorage


///////////////////////////////////////////////////////////////////
//(20.0.2)

//validate file types to only support specific types
adding a filter to multer to only use some kind of files

in app.js
>> define a fleFilter function
to store if specific file types

>> use this function in the use filter
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single("image"));

if other type, multer will not use the file



325-331
///////////////////////////////////////////////////////////////////
//(20.0.3) storing the image fs path in the database



> admin controller postAddProduct
change imageUrl const to image
if no image, redirect to add-product with an error message

files should not be stored in the database as they have big sizes
store files on a file system
but you need to store the path for the file in the database

by storing the image.path in the imageUrl passed to ejs
ejs uses
<img src="<%= product.imageUrl %>"


///////////////////////////////////////////////////////////////////
//(20.0.4) updating images in the editProduct

want to have the option if we did not insert an image
in the postEditProduct, to keep the old one
and only overwrite with a new file if we choose a new file


>> adjust the req.body req.body.imageUrl to req.file
remove the imageUrl from previous validation block
in findById (saving/updating product)
if there is an image, set imageUrl to image.path
in the routes also remove image validation


now we can upload an image to the fs and its path to the server
in add product and edit product


///////////////////////////////////////////////////////////////////
//(20.0.5) serving images!

//we want to download/view images on the site

serve the images folder in a "static" way
>> duplicate the express.static in app.js to share the "images" folder

>> inspecting the response in the dev tools
gives an error that the path should be /admin/images
to fix this
in the products.ejs, 
the image src should start with /
this will make it an absolute path
so it will "not get appended to the current path"
but rather point to the current domain

a better way than editing all ejs's is to store the images
in the addProduct post controller
with an appended with "/" + image path at the beginning

another issue to fix
now express.static will use the images in the "images" folder
as if there where in the root folder
as if the images are not stored with /images/filename 
but rather filename directly

so will add in the express.static middleware at the beginning
"/images", express.static
this tells that if we have a request with /images
we use the images folder not the root


//now we can see the image



///////////////////////////////////////////////////////////////////
//(20.1.0) downloading invoices
downloading files with authentication

now want to add add a product to the cart
make and order
and download an invoice to that order

invoices should "not" be a public file
that everyone is able to access
only us

>> create invoices folder in the data folder (to keep the root directory cleaner)
and move any pdf file there (we will generate later)

we can make the invoices folder statically accessible
but that is not what we want to do


>>work on the orders view to make sure we have a link to that invoice
add invoice link to the order item
<li class="orders__products-item">
    <%= p.product.title %> (<%= p.quantity %>)
    - <a href=""> Invoice </a> 
</li>
href="/orders/"<%= order._id=>

the order id is received with the getOrder
order id will be moved to route, controller
to gather the filename and path to view the file



want to setup a route for working with invoices
because then it will allow to check for things like
is user authenticated
>> go to the shop.js route
create route with a shopController.getInvoice
with orderId params

>> grab the order _id from compass
and name the invoice.pdf to invoice-thisId.pdf

>> in the shop controller
add the getInvoice controller

which constructs the file name from the param order Id
and uses the path module to construct the file's path and name
and read the file

//now we can click invoice and download the pdf
however it does not have a user friendly file name or 
or file extension


///////////////////////////////////////////////////////////////////
//(20.1.1) setting file type headers

we can pass extra information to the browser
so it can use a different file name and the right extension
for this we will set some headers

>> cont. the getInvoice controller
set req.setHeaders for 
content type
and 
content disposition

//now only authenticated users (users with that order)
can request this invoice
we can still improve that

///////////////////////////////////////////////////////////////////
//(20.1.2) restricting file access

in the getInvoice controller
if no order return error

check if the order user id is equal to the currently logged in user
if not, return error

otherwise continue reading the file







331-337
///////////////////////////////////////////////////////////////////
//(20.2.0) reading files by streaming instead of static reading 


when you read a file using fs.readFile
node will first of all access the file
read the entire content into memory
then return it with the response
this means that for bigger files
this will take very long before a response is sent
and the memory on the server might overflow
from many incoming requests
because it has to read all the data into memory
which of course is limited
instead you should be streaming your response data

>> comment out the fs.readFile code in getInvoice controller


///////////////////////////////////////////////////////////////////
//(20.2.1)

//create a pdf file on the fly
want to generate a pdf file based on the real order data

using third party packages like PDFKit
very popular for creating pdf on a node js server
//check out its docs, it has so many options, its powerful
and can do a lot of things

the docs are written in coffeeJs library which is different from vanilla js

# npm install --save pdfkit

>> import in the shop.js controller pdfkit
create new pdfDocument object
set headers on the response for file type and name 
pipe to fs.createWriteStream and res
add text 
end stream to save and send

///////////////////////////////////////////////////////////////////
//(20.2.2)
//populating the created pdf with order data

will add multiple pdfDoc.text lines
with a order.products.forEach looping over each product
and adding its text (with counting order cost sum)



///////////////////////////////////////////////////////////////////
//(20.2.3) //deleting files

with the file system package also have options for deleting files
you could delete files whenever you edit a product

if we overwrite an image (product.findById postEditProduct)
or when we delete a product

>> create a file.js in util folder
to add this functionality
by fs.unlink the imported file path

>> go to admin.js controller
go to postEditProduct


///////////////////////////////////////////////////////////////////
//wrap up

we learned the file upload functionality
both on the form and the backend
by using multer

how to store files for adding and editing
how to download files
statically with the express.static and make sure that it uses the right path
and alternatively how you can serve files as a response in a route
by loading it into memory and then returning it
or 
could steam files instead
or generate files on the fly
depending on the app requirement


*/


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//Section 21
/*


//338-344
///////////////////////////////////////////////////////////////////
//(21.0.0)


Pagination allows to split data across multiple pages
something you typically want to do when working with a lot of data


let us say we have 100's of products
we would not want to display all of these products on one page
instead we would like to split them across multiple pages
and at the bottom of the page for example we have some controls
to go to page one, two, next, previous pages

this is pagination, and you can find third party packages for that
but we will implement it from scratch on our own

implemented by adding some controls that always lead to the same path
always /products for example
then you add a query parameter
which allow you to specify optional data
like page=1, page=2

and these query parameters are changed with the controls added


>>in the index.ejs
add a section with page links with /?page1 query parameters
inside the if products block
add some styling in the main.css


///////////////////////////////////////////////////////////////////
//(21.0.1)


to use these query parameters on the back-end to control the data
we are fetching

>> go to the shop.js controller getIndex
as we are working on index.ejs or shop link of "/"
add the query value
and use in the product.find that sends product array to the ejs
skip and limit items to 2 (global variable) for example 


///////////////////////////////////////////////////////////////////
//(21.0.2) Adding dynamic pagination links

we adjust the number of page buttons
based on the page we are on and the maximum number of items available

might want to highlight the page i am on
and then show the next page number, previous page number

>> go to the shop.js controller getIndex
add totalItems variable
that will have the total number of items stored into it
> then can pass the total to the render
> with other keys like next, previous page etc.
to be used in the ejs
-- the find products, skip and limit will be moved to the 
find countDocument's then block
and the render will be on the then block after it

>> in the index.ejs
add links for page 1, previous page, current page, next page, last page
with if logics to output depending on page on


>>

344-340
///////////////////////////////////////////////////////////////////
//(21.0.3) Adding the pagination to products page 
as we did for the index page


>> add the pagination section to a separate ejs in the views/include folder

<%- include('../includes/pagination.ejs', {currentPage: currentPage, ...}) %>

>> add the include to the product list ejs

Note: the url should not start with /
so it can be appended to whatever the current path is
otherwise will always refer to the / page and not work for /products-->
like we did before to put the / at the beginning of the image url
while saving so the static save to fs way not direct to the root folder

>> add the same logic for getIndex controller to the getProducts controller
with changing only the render path etc.


///////////////////////////////////////////////////////////////////
//wrap up

with pagination
you can display the data you want to display
and to not fetch all the data in one go

as .find() in the controller uses a cursor
it does only find the items you need
as we used .countDocuments() that does not retrieve all
which only counts them (faster than retrieving them)

and .skip() .limit() provided by mongoDB
which does not do server side filtering on the data
it re-filters the data on the database server










*/