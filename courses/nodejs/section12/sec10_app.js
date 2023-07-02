
/*
Databases introduction


storing:
memory: store data in a variable
file
database

database, a specific program for storing/retrieving data
types: SQL (e.g MySQL) and NoSQL (e.g MongoDB)

our goal is to store data and make it easily available/accessible
easy > efficient / fast 
quicker than accessing a file especially when data grows
do not have to read the entire file to just find one piece of information

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
SQL (structured query language)
commands we use to interact with the data base


thinks in tables
and in each table fields/columns
we fill in data for these fields called records

core feature:
allows to relate different tables
ex. an Order can be described as a connection between a user and a product tables
a user can order a couple of different products
and an order can be ordered by a couple of different users


table: Users 
field: id/email/name fields
records: 1/max@test.com/Maximilian Schwarzmuller

table: Products table: 
field: id/title/price/description
record:  1/chair/ 120.99/A comfy chair
         2/book/ 10.99/exciting book

//(relation between users and products)
table: Orders 
field: id/user_id/product_id
record 2/1      /1

///////////////////////////////////
core sql database characteristics:
strong data schema; for each table we clearly define how the data in there should look like
which fields we do have, 
so structure is required - all data (in a table) has to fit


Data relations;
one-to-one; each record fits another record
one-to-many; a record might fit multiple other records
many-to-many; multiple records in table A can fit multiple records in table B

tables are connected

ex: SELECT * FROM users WHERE age > 28
SELECT * FROM (table) where (field) > (record)
SQL Keywords/Syntax: SELECT, FROM, WHERE
Parameters/Data to connect with these keywords; *, users, age > 28



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
NoSQL


Database; shop
Collections (like tables); Users, Orders
Documents (like records); {name: "max", age: 29} , {name: "peter"}
        - documents not must have a schema, data entries can not be all used (Schema-less)
        - you can store multiple documents with different structures (fill) in the same collection


Orders:
{id: "sdasd", user: {id: 1, email: "max@test.com"}, products: {id:2, price: 10.99} }

Users:
{id: 1, email: "max@test.com"}

Products:
{id:2, title:"Chair", price: 10.99}


in NoSQL we do not have relations between collections but "duplicate data"
this means that when data is updated, it has to be updated in many places

but also has an advantage that we do not have to write code to relate all datas 
for example we can have all the data we need in the orders collection without reaching to other collections

characteristics:
> no data schema - no structure is required for the documents
> no data relations - you can relate documents but you do not have to 
                        and shouldn't do it too much or your queries become slow
                        we do have no / few connections
                        instead copy data and have data collections of their own



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
as our application grows and need to store more and more data
and access that data or work with it more frequently
we might need to scale our database servers

horizontal and vertical scaling

horizontal scaling: we add more servers, can do this infinitely
can always buy new servers, on a cloud provider or our own data center
and connect them to our data base and split this data across all our servers
-this means we would need some process that runs queries on all of them
    and merges them together intelligently, not an easy to do thing

vertical scaling: make our existing server stronger
by adding more hardware, cpu, memory, 
and this has some limit on the machine, not infinite


so SQL:
Data uses Schemas
has relations
data is distributed across multiple tables
horizontal scaling is hard or impossible due to the way SQL works
this is a problem if we have multiple/thousands read and write queries per second
thus SQL can reach limits

NoSQL:
schema-less
has only a few relations if at all
data is not distributed across multiple collections
but instead we work with merged or nested documents in an existing document
though we have different collections for the different features in our application
horizontal scaling is easier, still you know what you are doing
but there are cloud providers that can do this for us
due to the few relations existing
great performance for mass read and write requests for applications with high trough put

choosing between the two always depends on the kind of data you are storing
also for different parts of the application, for example handling user info does not change frequently

but for orders etc. they can be stored in a NoSQL (change frequently)
and there also the relations might not be that important because you can always put
the shopping information that belongs to a shopping cart in one single document


//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
working with SQL (mySQL)
go to mySQL.com and download the community edition

mySQL community server, mySQL workbench
or a combined installer for windows MySQL (installer & tools)

the work bench is a virtual client used to connect to the database
inspect it and play around with it outside our node application
which simply makes debugging a little easier


//////////////////////////////////////////////////////////////////////
working in the workbench

left pane > schemas (database)
right-click > create new > name: node-complete > apply > apply
you will find you have a couple of tables
will later store data in the tables drop down


//////////////////////////////////////////////////////////////////////
in our project to use/interact with SQL from inside node
we have to install a new package

//allows to write and execute SQL code and interact with a database
# npm install --save mysql2

need to connect to a database from inside our application
create database.js file in the utl folder

>>database.js

//create pool
//export pool with promise
//in app.js require the database.js
//attach.then to the execute syntax in app.js

//in the workbench
//create new schema "node-module"
//create new table "products" in the schema
//will ask for "fields" in this table for id, title, price etc
//then can populate "fields with records"

*/



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs
/*
const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

//the pool which allows us to use a connection in it
const db = require("./util/database.js");


app.set("view engine", "ejs");
app.set("views", "views");


const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");

// methods.execute (execute queries)
// .query same but .execute is a bit safer
// .end //if we want to end it whenever our application is shut down
// .getConnection
//we want to connect or execute a command
//we can execute here by writing a SQL syntax as a string
//we will learn here basic SQL commands but for further commands take a SQL course
//select everything from products
//then is provided by the fact that we are using promise in the db export
//promises have two functions, then() and catch()
//then() runs when the promise is resolved and its "argument" is "the returned from promise"
//catch executes in case of an error, in case the db failed or something
//we can chain them on to the result of the execute call
//so they will execute on whenever db(pool).promise gives us back
//then can take a function
//result is the whole result, result[0] outputs the products
db.execute("SELECT * FROM products")
    .then((result) => {
        console.log("result", result[0]);
    })
    .catch((err) => {
        console.log(err);
    });

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));


//app.use(adminJsRoutes.routes); //replaced code
//app.use(adminJsRoutes); //replaced code
app.use(shopJsRoutes); //replaced code

////filtering mechanism
//not put /admin/.. in the routes links but put in the navigation/form etc.
app.use("/admin", adminJsRoutes);

//used the __dirname directly here because we are in a root file

//app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    //res.status(404).render("404", {myTitle: "404 Page", path: "404"});
//});

const errorController = require("./controllers/errorController.js");
app.use(errorController.get404);


app.listen(3000);

*/


/*

///////////////////////////////////////////////////////////////
//using the mySQL workbench
we have no products table yet
for the db.method
so get to the workbench and on tables right click create table
give it a name of products
and can add new fields

add in the columns
id > with datatype INT and checkmarks for PK, NN, UQ, UN, AI
title > with type VARCHAR(45) which is basically a string
and edit the 45 to 255 characters long (longer titles will be cut off)
check NN
price > type double (so we can enter decimal) check NN
description > type TEXT, check NN
imageUrl > type VARCHAR(255) (means longer urls will not work), check NN

click apply
now we can see the products table in the tables on the left pane
and if clicked on the table icon can see the entries in there

can add an entry manually in the result grid


above we were able to output a record from the db
time to use sql in the project code


right now we are fetching data from our files
in the product model
want to fetch data from the database

(1)////////////////////////////////////////////////
do not need fs and path modules
empty all the methods in the product model as we will not use files
also remove the callbacks from parameters
we will use promises

(2)////////////////////////////////////////////////
return from "fetchAll" the db.execute
db returns a promise

(3)////////////////////////////////////////////////
and in the shop controller getIndex destruct in the .then
and use the first element as products for render

now when we change values in the database workbench
the change can be seen on the page

(4)////////////////////////////////////////////////
do the same for getProducts of url (/products product-list.ejs)

skill : extracting different elements of an array
let [element1, element2] = arrayof2elements;


(5)////////////////////////////////////////////////
working on the save() for postAddProduct
go to the model
add db.execute(INSERT INTO..)




(6)////////////////////////////////////////////////
in the admin.js controller
add to save .then().catch()
just redirect in then (once the insertion is completed)

now (add product) data can be inserted in the db
can be viewed by refreshing the table in the workbench


(7)////////////////////////////////////////////////
working on the product-details
by working on the findById in the product model

(id here is passed as a value from the argument)
selects the whole row of this id
"SELECT * FROM products WHERE products.id = ?", [id]


(8)////////////////////////////////////////////////
return to shop.js controller
add the render to the .then




*/




///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs and sqlz

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

//the pool which allows us to use a connection in it
const sequelize = require("./util/database.js");

//(17)
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart.js");
const CartItem = require("./models/cart-item.js");
const Order = require("./models/order.js");
const OrderItem = require("./models/order-item.js");



app.set("view engine", "ejs");
app.set("views", "views");


const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));




//(18)
//this middleware will be executed even though the sync is below
//but this has to be called before using the routes using it
app.use((req, res, next) => {
    User.findByPk(1).then(user => {
        //returns a sqlz object not just the value
        //an object we can use sqlz methods on
        req.user = user;
        console.log("user is", req.user);
        next();
        //this user will be stored in req.user
        //which will be used in "next" middleware
        //which is postAddProduct
    })
    .catch(err => {
        console.log(err);
    })
});

//app.use(adminJsRoutes.routes); //replaced code
//app.use(adminJsRoutes); //replaced code
app.use(shopJsRoutes); //replaced code

////filtering mechanism
//not put /admin/.. in the routes links but put in the navigation/form etc.
app.use("/admin", adminJsRoutes);


//used the __dirname directly here because we are in a root file

//app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    //res.status(404).render("404", {myTitle: "404 Page", path: "404"});
//});

const errorController = require("./controllers/errorController.js");
app.use(errorController.get404);



//(17)
//can learn about more association usage in the documentation/association
//configure some options, onDelete: on delete, the relation should be also deleted for "Product"
//so if we delete a user, all products related to the user would also be gone
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Product);
//(21)
User.hasOne(Cart);
Cart.belongsTo(User); //inverse to the above, thus two directions, one direction is enough
//many-to-many relation
Cart.belongsToMany(Product, {through: CartItem });    //the through key, telling where these connections should be stored
Product.belongsToMany(Cart, {through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {through: OrderItem});
//can include the reverse that a product belongs to many orders


//sync will now also define the defined relations
//setting sync({force:true}) will allow the already created products table 
//to be overwrite by the new relation information 


//has a look at all the models you defined and sync them to the db and if you have relations
//and start our server if we made it into then
//when running the app.js, will find the SQL syntax used in the console result
//the product model is not linked anywhere in code, did it auto check the models folder ?
//sequelize.sync({force: true} )
sequelize.sync( )
    .then((result) => {
        //console.log(result);
        return User.findByPk(1);
    })
    .then((user) => {
        //this will listen to the returned
        if (!user) {
            return User.create({name: "max", "email": "test@email.com"});
        }
        //a promise that instantly resolve the user
        //to keep the returns in this block consistent
        //however if you returned a value in a then block
        //it automatically returns a new promise
        //return Promise.resolve(user);
        return user;
    })
    .then(user => {
        //listens to the above .then return
        user.createCart();  //(21)
    })
    .then(user => {
        //listens to the above .then return
        //console.log(user);
        app.listen(3000);
    })
    .catch((err) => {
        console.log(err);
    });



/*


////////////////////////////////////////////////
//Module 11 Sequelize
next step is not to write our own queries
as going through the app it will get complex and need to relate tables
using sql syntax
however we can use a third-party library for that without using sql syntax
using Sequelize
so can focus more on Node.js not on SQL

still using sql database in the background 
but the code we write will be different

allows to work with js objects and convenient methods
to create new elements to the database, edit, delete, find, connect them

is an object relational mapping library
does all the heavy lifting, sql code, behind the scenes for us 
and maps it into js objects with convenience methods 
which we can call to execute behind the scenes sql code
so we never have to write sql code on our own

object of user with name,age,email,password
then is mapped to a database table by Sequelize using a method

automatically creates tables, set relations for tables 

from
"INSERT INTO table (field1, field2,..) VALUES (?, ?, ..)", [value1, value2, ..]
to
const user = User.create({value1: "..", value2: ".."});

sqlz offers us the models to work with our database 
and define such models, which data makes up a model, which data will be saved in the db
Models: e.g "User", Product


can instantiate these models / classes so to say
can execute their constructor functions or use utility methods 
    to create a new user object based on that model
Instances: const user = "User".build()

can then run queries on that, save a new user, find all users
Queries: "User".findAll()

can also associate our models
associate for example the User model to a Product model
Associations: "User".hasMany(Product)


(9)////////////////////////////////////////////////
install sqlz

sqlz needs the sql2 package to be installed
# npm install --save sequelize

1. create a model to sqlz
2. connect to the db

go to the workbench and delete/drop the existing products table
we want sqlz to manage our tables


>> util> database.js
use SQL to connect to db / setup a connection pool

>> (a) create pool in database.js

(10)////////////////////////////////////////////////
//defining and working with the models 

go to the products.js model and delete everything
(copied the model using SQL syntax to another file)
define the Product model using sqlz syntax and export

>> (b) import and sequelize.define("product" in product model


(11)////////////////////////////////////////////////
//Syncing JS Definitions (defined table) to the database


we need a product table, sqlz can create it
models are transferred into tables or tables that refer to the models
whenever we start the application
if the table exists it will not overwrite it by default except if we told it to do so

change the name of the database file import to sequelize
"lower case because it is not an external third-party import"


>>sync the product model to the db
>> (c) in app.js sequlize.sync()
then go to the work bench and right-click the schema, refresh all - will find the table
to proof its from sqlz, will find fields of createdAt, updatedAt



(12)////////////////////////////////////////////////
//inserting data and creating product



//controllers, create a new product

controllers > admin.js > postAddProduct
squelize.create to create a new product instance

>> (d)  ProductClassModel.create({ , .then


visit add product page
>> now can add-product and see it in the db


(13)////////////////////////////////////////////////
//use sqlz to retrieve data - fetchAll for index/products pages

With Sequelize v5, findById() (which we'll use in this course) 
was replaced by findByPk().
You use it in the same way, so you can simply replace all occurrences 
of findById() with findByPk()


// (e) working on the fetchAll for ctr shop getIndex
>>    ProductClassModel.findAll().then(products into render)

//findAll gets all the records for this data
//can pass an object with some options
//like where to restrict the kind of data we retrieve (more in the official docs/Querying)
//for more options like greater than, different optios etc.
//ProductClassModel.findAll({where:..}).then().catch();


(14)////////////////////////////////////////////////
//how to retrieve a single product if clicked on details




(f) ctr shop getProduct
>>ProductClassModel.findByPk(prodId)
//findAll always gives multiple items in an array even if it is only one element
>>ProductClassModel.findAll({where: {id: prodId}})
both are the same but will use findByPk



(15)////////////////////////////////////////////////
//fetching admin products

admin controller >  getProducts > add findAll().then()

//updating products - edit products

admin controller > getEditProduct > 
    ProductClassModel.findByPk(prodId)
        .then((product) => {


//posting an edited product
add the filled values to the returned product from find
product.save();    //by seqeulize
then redirect


JS Skill:
    ProductClassModel.findByPk(prodId)
        .then((product) => {
            //can return this, which returns a promise
            return product.save();
         

        })
        .then(()=> {
            //handles any success responses from the (save) promise
            console.log("updated product");
            res.redirect("/admin/products");

        })
        .catch((err) => {
            //this catch will catch errors for the first promise (findByPk) 
            //and second promise (save)
            console.log(err);
        });

//
(16)////////////////////////////////////////////////
//Deleting Products


admin.js > postDeleteProducts
    ProductClassModel.findByPk(prodId)
        .then((product) => {
            return product.destroy();
        })


(17)////////////////////////////////////////////////
//Creating a user model - Relations


//1. define a user model like the product model models/user.js
//create an association


association / relation
defining how models work together
multiple users, multiple carts

product/user relation to cart;
a product can belong to many carts
each user has only one cart

product/user relation to order;
a product belongs to multiple orders
a user has many orders

a user can own multiple products (created)

2. add to app.js
Product.belongsTo(User, {constraints: true, onDelete: "CASCADE"});
User.hasMany(Product);

as we put force in sync
the created products will be deleted for a new relational-products table
will populate products that ARE related to a user*

remove the force: true


(18)////////////////////////////////////////////////
//Creating a user

in the app.js sync
use the create method to create a user


//retrieve (store) the user in the request so can use it in the app


(19)////////////////////////////////////////////////
//use the user to create associated products

using next in the user middleware in app.js
allows to use req.user in the next middlewares
like postAddProduct
to add to the created product, a userid
to associate that product to this user of id 1 for example


//162
(20)////////////////////////////////////////////////
//Fetching related products

in getEditProduct
    req.user.getProducts({ where { id:prodId }})
    ProductClassModel.findByPk(prodId)

in getProducts
use     res.user.getProducts()  <<given by sqlz relation hasMany
instead of ProductClassModel.findAll()

getProducts given by sqlz


(21)////////////////////////////////////////////////
//one-to-many, many-to-many relations
//working on the cart


a cart should be related to the user
with a product or many products
with quantity associated to them

delete everything in cart
define a cart using sqlz

we will also need a new cart-item.js file
because a user can have many carts
define a cart-item using sqlz

>> set relations in app.js


(21)////////////////////////////////////////////////
//creating and fetching a cart

//disable sync force here
go to shop controller > getCart


>> when creating a user in app.js, also use
>>user.createCart in another then
req.user.getCart().then().catch()   <<given by sqlz relation

in user getCart()
return cart.getProducts()   << as cart has many products relation

//169
(22)////////////////////////////////////////////////
//adding products to cart

shop.js controller > postCart
..

in cart.ejs 
adjust p.productData.title to p.title

p.qty to p.cartItem.quantity
as products have in between relation by cartItem
and quantity named quantity

//adding existing products in the cart to the cart




(23)////////////////////////////////////////////////
//delete from cart

    req.user.getCart().then(cart => {
        return cart.getProducts({where: {id: prodId}});
                        product.cartItem.destroy();




(24)////////////////////////////////////////////////
//adding an order model

put a checkout button
to be able to take all elements of this cart
out of this cart and create a new order 
that is related to a couple of products and a user

create a new order.js model
move cartItem code there

an order in the end is just an in between table
between a user to which the order belongs
and then multiple products that are part of the order

and that products then do have quantity attached to them

just as we have cart-items for the cart
we have order-items for the order
copy code from cart-items to order-items

import the cart and order-items into app.js

set the relations between orders, users, products through order item
force sync


(25)////////////////////////////////////////////////
//Sorting cart items as OrderItems

//adding the checkout button
>> in cart.ejs
<form action="/create-order" method="POST" >
    <button type="submit" class="btn">Order Now!</button>

//want to move the cart items to order items
to create an order with all the elements in there
and clear the cart (26)

1) create a middle ware in the shop controller and export to the shop routes

work on postOrders in shop.js controller


(26)////////////////////////////////////////////////
//resetting the cart and fetching outputting orders


fetchedCart.setProducts(null); //(26)


(27)////////////////////////////////////////////////
//show orders

//after items been added to cart and on "order now" the items moved to order-items
and its cleared

shop.js controller > getOrders

also include the products in the order sent to the ejs




////////////////////////////////////////////////

SQL
uses strict data schemas and relations
can connect your Node.js app via packages like mysql2
writing SQL queries is not directly related to nodejs and something to learn separately

Sequelize
instead of writing SQL queries manually
can use packages (ORMs) like sqlz to focus on the Nodejs and work with native js objects
sqlz allows you define models and interact with the database through them
can also easily setup relations (associations) and interact with your related models through them



















sql-skill: 
db.execute("..");
SELECT * FROM products

insert these values in db:
"INSERT INTO table (field1, field2,..) VALUES (?, ?, ..)", [value1, value2, ..]

selects the whole row of this id
using "?" make it secure to get/send values
"SELECT * FROM products WHERE products.id = ?", [id]



*/
