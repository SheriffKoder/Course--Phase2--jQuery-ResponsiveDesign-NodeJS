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
//const User = require("./models/user");


app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", "views");

const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");

/*
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
*/






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







*/