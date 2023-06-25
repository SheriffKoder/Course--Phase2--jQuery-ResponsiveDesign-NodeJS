/*
a shop website using file data storage

//remaining files to be put from section7
//and check text notes in sec7_app.js


*/


//(1) default requires
const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

//(2) use body-parser && set static folder
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

//used the __dirname directly here because we are in a root file
app.use(express.static(path.join(__dirname, "public")));



//(3) set temp engine
app.set("view engine", "ejs");
app.set("views", "views");


//(4) import routes
const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");
app.use(shopJsRoutes); //replaced code
//filtering mechanism
//not put /admin/.. in the routes links but put in the navigation/form etc.
app.use("/admin", adminJsRoutes);


//(5) 404
const errorController = require("./controllers/errorController.js");
app.use(errorController.get404);

//(6) listen
app.listen(3000);


/*

///////////////////////////////////////////////////////////////////
////Preparing the html's

//make admin folder in the views
put in it the add-product.ejs, edit-product.ejs, products.ejs


//shop folder for customers
put in it the shop.ejs and rename it to product-list.ejs
adjust the links using this file in other js files and the includes to ../includes

make a starting page index.ejs, product-details.ejs, cart.ejs, checkout


//work on the navigation
add links to all important views


///////////////////////////////////////////////////////////////////













*/