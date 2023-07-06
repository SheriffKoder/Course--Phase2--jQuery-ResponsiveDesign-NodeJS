///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

const mongoose = require("mongoose");   //(2)
const User = require("./models/user"); //(8)


app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");


app.use((req, res, next) => {
    User.findById("64a6f2a6c017acc261356a8c")
        .then(user => {
            //req.user = user;
            //create a new user in order to be able to call its methods 
            //mongoDB //(10)
            //req.user = new User(user.name, user.email, user.cart, user._id);

            //mongoose //(8)
            //user here is a full mongoose model, can call methods on the req.user object
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
mongoose.connect("mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/shop?retryWrites=true&w=majority")
    .then(result => {

        //always gives back the first user it finds
        //(8)
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
        app.listen(3000);
    })  
    .catch(err => {
        console.log("mongoose connect" + err)
    });



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
/*



///////////////////////////////////////////////////////////////////
//(1)

as we had sequelize for SQL, we have Mongoose for MongoDB
which enables you to focus more on the code and data
instead of working with the queries

sequelize was O R M
Object Relational Mapping Library

Mongoose is an O D M
Object Document Mapping Library

MongoDB is not a relational db, it thinks in Documents


the user data (js object)
map it/save it into a collection

so in mongoDB we used
db.collection("users").insertOne({name: "max", age: 28, password: 23123})

in mongoose
const user = User.create({name: "max", age: 28, password: "23123"})

see how object or our data should look like and then work with it

mongoose allows us to define models by which we can work
and then all the queries are done behind the scenes
and still we can influence/change some things


//Core Concepts:
we can work with Schemas & models > define how our models should look like 
e.g "User",Product

Instances > to create js objects that are based on our blueprints
const user = new "User"()

then we can run queries
"User".find()


//on mongoose website can see the official docs 
for more information and usages
as this course aims to focus on nodejs and give an introduction to mongoose
core fundamentals
 


///////////////////////////////////////////////////////////////////
//(2) installing and connecting to mongoDB

#npm install --save mongoose

connecting:
we do not need a database.js file as mongoose does all the configurations behind the scenes

>> import mongoose in the app.js file
and use its connect method to listen to the server

will transfer the code to mongoose
. comment out the routes and will gradually comment them back in
. comment out the models and remove lines which use the database file
. remove all data from mongoDB compass app
. comment out the user in app.js

will use the same mongodb server but with using the mongoose package

>>define a product schema for mongoose in the product model


///////////////////////////////////////////////////////////////////
//(3)
//-> a model based on the Schema and then create an object based on the model and work with that

define the mongoose model for the product schema

>>postAddProduct
define a new product instance
the save method is defined by mongoose
comment in the routes
[now we can fill in a product and click add[post] to add it to the database]

new product({values})
product.save


//214
///////////////////////////////////////////////////////////////////
//(4) fetching all products

using productmodel.find()

///////////////////////////////////////////////////////////////////
//(5) single product details

getProduct in shop.js controller
mongoose has a findById method with id transformation to mongo object


///////////////////////////////////////////////////////////////////
//(6) Updating products

//let us complete the curd functionalities on the admin side
and be able to add and delete products

getEditProduct
getProducts

postEditProduct
just call the findById ad and then call the save method in it, the object will be updated


>> mongoose logic is very similar to sequelize


///////////////////////////////////////////////////////////////////
//(7) Deleting products

//last part of the curd operations

>> PostDeleteProduct in admin js controller
ProductClassModel.findByIdAndRemove(prodId)



///////////////////////////////////////////////////////////////////
//(8) Adding and using a user model and saving to the database

//add a user and see how can relate different entities with mongoose
//so can manage relations
//then can work with the cart and orders

>> create a user schema as done with the product
the user also had a cart, with items and define the type of the 


>> create and save a user in app.js before listening to server
it will appear in the database

>>comment in the user middleware in app.js
and copy the database's user id to the findById in the middleware


///////////////////////////////////////////////////////////////////
//(9) using relations in mongoose

using the user with the product model
every product should be assigned to a user
need to change the product schema

a product should have a userId field referring to the user model
and the user cart's item id should refer to the product model

when creating a new product in "postAddProduct" it should also have a userId
>> userId: req.user._id //however can just use req.user and mongoose will pick the id from that object

now a created product will have a userId


///////////////////////////////////////////////////////////////////
//(10) fetching relations














*/