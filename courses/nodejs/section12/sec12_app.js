
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

const mongoConnect = require("./util/database").mongoConnect;
const User = require("./models/user");


app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");


//(8)
app.use((req, res, next) => {
    User.findById("64a37b774e1411fabef70045")
        .then(user => {
            //req.user = user;
            //create a new user in order to be able to call its methods //(10)
            req.user = new User(user.name, user.email, user.cart, user._id);
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
//(1)
mongoConnect(() => {

    app.listen(3000);
});




///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/*

NoSQL Databases/MongoDB

another alternative to SQL database that is used heavily

mongoDB driver to interact with mongoDB from inside our nodejs application

MDB is a database solution/engine
tool to run very efficient noSQL databases

can store and work lots and lots of data
large scale applications
quickly store and work with data

run a mdb server and then can have multiple "databases"
shop db, has multiple "collections" like users and orders

from inside each collection, we do not have "records"
but we have "documents" like users > {name:"max", age: "29"}

>> documents are schemaless
we can have any type of data inside the same collection



Database (shop)
Collections for shop (users, orders)
Documents for users {name:"max", age: "29"}



a document in mdb looks like this
in json data format (BSON: Binary JSON)
where it is transformed behind the scenes before storing it in the files
a json object is similar to a js object
where we can have embedded/nested documents 
like in address with objects/arrays/strings/numbers
{
    "name": "max",
    "age": "29",
    "address": { "city": "munich" },
    "hobbies": [ {"name": "cooking"}, {"name": "sports"}]
}


we can have a users collection
that "part" of its data is embedded in another orders collection

can depict the relation by embedding data in to other documents

when you copy the needed part of data from a collection to another collection
it stays there, so whenever looking into the another collection
we will not have to look into other collections for data - it is there
and that what makes it fast and efficient

mdb is built to make sure you build/store data in the format you need
without having to combine multiple collections behind the scenes

however can also set up relations
so we have two ways of relations
>> nested/embedded documents && references

references can be used when there is data updated constantly
and need to be updated in many places manually
lots of data duplications


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//installing

enter mongoDB atlas website
register
create new database with the free M0 option
make sure the users have read-write access

atlas admin role, is something the db admin does
we will not do db administration through node js

check the ip whitelist
for all ip addresses allowed to connect to mongodb server
add your ip address, as we are using a local server
later when deploying using a server, will put the ip address of that server


after database configured on the site
connect
connection method application
will give a url (a)
mongodb+srv://sheriffkoder:<password>@cluster0.jgxkgch.mongodb.net/?retryWrites=true&w=majority

# npm install --save mongodb



(1)///////////////////////////////////////////////////////////////////
//using

>> code the database.js file
so it can connect
and export that connection
to use in app.js

and use that imported as a function to server.listen

comment out the routes for now to avoid old code errors



(2)///////////////////////////////////////////////////////////////////
//connecting

go to product.js model and create a class constructor and import the mongoConnect database file

however
//the mongo connect would run a connection for every request
//if we could manage one connection in our database
//and then simply return access to the client that we setup once
//from the one or two different places that need access
// to do that we need to tune the mongoConnect

>> so create a function that returns a connection to the database

from
MongoClient.connect
.then(client)
client.db


(3)///////////////////////////////////////////////////////////////////
//using the db

>> work on the save method on product.js model
db.collection("products").insertOne(this)


//start working on the admin.js controller
to create a new product from the postAddProduct and save it

//viewing the added product
download compass from mongoDB

connect using the url provided from the mongo site and put the password
click databases, should find the shop (configured in database.js)

then products collection open will see then the documents (products added)

learn about all the features of compass
can edit the documents using compass


(4)///////////////////////////////////////////////////////////////////
//using the product data on the shop page


besides being able to save data
want to get the products

add a static method in products.js model named fetchAll
return db.collection("products").find().toArray()
.then products

then in the shop controller
product model . fetchAll then render products

disable all routes except getindex and getproducts

comment in the shop routes in app.js


(5)///////////////////////////////////////////////////////////////////
//fetching a single product


getProduct in shop controller

first work on a static findById 
that takes the prodId and find with filter prodId
then returns the product in the .then

uncomment the route

note: in mongoDB we use _id
so adjust that in the details link in ejs

note: the id in mongoDB database is an object of BSON
so import mongoDB and use it on the prodId in the product model
_id: new mongodb.ObjectId(prodId)

allows to pass an id object to the comparison with _id instead of just a string

//188
(6)///////////////////////////////////////////////////////////////////
//the edit button


//view the products in admin page by working on the getProducts

//editing
work on the save method in the product model to
update if exists (by id) or save normally (insert)

controller admin > postEditProduct
create a new product with the prodId converted by mongodb
then save it (save method will work on existing/new products)


(7)///////////////////////////////////////////////////////////////////
//the delete button

//add a static method deleteById in the product model
by using deleteOne with a converted passed prodId


(8)///////////////////////////////////////////////////////////////////
//creating new users

how to work with relations
with working with users


working on the user.js model like the product model
add a save and findById methods

then go to app.js and add the middleware that use User.findById(id)

go to the compass application and create new collection (users) in the shop (database)
then add a document with user details like described in your model
take the number id and place in the middleware's findById


//195
(9)///////////////////////////////////////////////////////////////////
//use the user object and store that reference in the database


//want to store a reference to user when storing a product
//by embedding the user data
this of course mean that we will have to update the user data
manually in every place it is used

. go to the product model and make the class have the property of userId
. then in postAddProduct in admin controller add the id to the new created product
using the passed req.user._id from the app.js middleware


(10)///////////////////////////////////////////////////////////////////
//working on cart items and orders

what is the purpose of the cart ?
//for every user we have we want to store a cart
//this user will have a cart and that cart will hold the products

so it is a strict one-to-one relation between the user and the cart

so will not work with a cart model,
will store the cart items in the user model

>> in the user model add method addToCart
to add product to the user
the passed in product will be merged with quantity 1 to a updatedCart
then update the user with this id, to hold the new cart


>>wire the cart in app.js
//create a new user in order to be able to call its methods //(10)


>> in shop controller work on the postCart method
to find the product in the product model then use the getToCart on the req.user

now the user will have a product "collection"

but the product if updated, this update wont show in the cart
we will store only the product id not the whole product data in the addToCart

as the id is sufficient for fetching information when needed


(11)///////////////////////////////////////////////////////////////////
//storing multiple data in the cart and increase the quantity if product exists


>>tune the addToCart user's method
if the product exist, increase its quantity after finding its index in the cart
if not exist push the product id and quantity 1 to cart


199
(12)///////////////////////////////////////////////////////////////////
//Displaying the cart items

>>work on the getCart in the user model
to return the products from the products model with the id in the cart property in user
and also amend to each product by using js map method and {..., } constructor
to return an array of objects each of product-details plus its quantity in the same object

look into the cart ejs to adjust the values properly


(13)///////////////////////////////////////////////////////////////////
//deleting from the cart

filter cart items where prodId = passed in prod id
and update the user's cart items with the filtered array 


(14)///////////////////////////////////////////////////////////////////
//adding an order

using another way of relating data

want to store orders on users
>>work on addOrder in the user model

insert the user's cart to a new orders collection
then empty the user's cart in code and in the database

>>postOrder controller
just call the model's method

//seeing the order's page
>>work on the getOrders method in the user model



*/


