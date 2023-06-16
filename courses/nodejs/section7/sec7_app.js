/*

Model View controller MVC
follow a certain pattern for structuring code

how to separate our code into different functions
each part of code does a different thing

models
views
controllers

Models: objects, representing data in your code, saving/fetching to-from file, 
Views; what the user sees, decoupled from your application code, minor insertions with temp engines
controllers; connecting your models and your views, contains the in between logic, 
            defines which model to work and which view to render    
            kind of split up across middleware functions    
            middleman, routes: which path for which http method for which controller it should execute
            
*/
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using ejs

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");


app.set("view engine", "ejs");
app.set("views", "views");


const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");

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
/*
app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {myTitle: "404 Page", path: "404"});
});
*/
const errorController = require("./controllers/errorController.js");
app.use(errorController.get404);


app.listen(3000);



/*


app.js 
< routes (method redirection) 
< controllers: middleware callback functions = render ejs / call model class js
new product/save / pass to fetchall my product render to render the readfile


the router.get is an example of a controller
interacting with data, returning a view
    
const products = adminData.products;
res.render(


create controllers folder
create controllers for the functionalities in .js files we have
create a products.js file that only works with product logic
copy the res,req function from the routes /add-product router.get etc. into contr>products.js

now want to add a link to the products.js function in the routes admin.js
by exporting the function (a middleware function)
and importing in admin.js const productsController = require("../controllers/products.js")
router.get("/add-product", productsController.getAddProduct)

same code just a separation
do the same for router.post("/products", ..) with its products array

*yea, so basically all the middleware functions in .js files
are moved to controllers/products.js and exported to be used in the router of .js files as function variables


///////////////////////////////////////////////////

make a models folder in the project root
now we have models, views, controllers - and that makes the mvc pattern

//
create product.js
where we create a product class
    which we will create new instances of the product
and create in the class save/fetch methods

//
remove the product array logic from controller>products.js*
and import the product class
in the .post create a new const of a new product class with form title passed
and call the class save method

in the .get call its the fetchAll method of the class itself


///////////////////////////////////////////////////////////////////
saving our product to a file

create a data folder in project root
will use the save method in the controller with the fs, path modules and util
const myDataFilePath = path.join(rootPath, "data", "products.json");
data folder, file name = products

will read the file contents put into an array
or if no contents, keep array empty
and write to the file the products array in json format with checking on an error

//now did output the title to a json file

now in the fetchAll method which gives the "/" the products to be viewed
will parse the json file into js format
by calling the render after file is read giving it the appropriate parsed products data using callback

json.parse > js
json.stringify > text



///////////////////////////////////////////////////////////////////
refactoring

clean reused code

model: responsible for representing and managing your data
doesn't matter if you manage data in memory, files, databases
contains data-related logic

view: what the user sees, should not contain much logic

controller: connects model and view, makes sure the two can communicate in both directions


-- before project check the node links






///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//Creating the shop structure

starting page
view all products
create new products
add products
as an admin to delete products
add products to a shopping cart
go to a checkout page and pay for the products
see our orders as a customer


//make admin folder in the views
put in it the add-product.ejs, edit-product.ejs, products.ejs

//shop folder for customers
put in it the shop.ejs and rename it to product-list.ejs
adjust the links using this file in other js files and the includes to ../includes

make a starting page index.ejs, product-details.ejs, cart.ejs, checkout

work on the navigation
add links to all important views

//
add routes to links
add fitting controller functions
or even new controllers
and make sure you render the appropriate views with navigation and content
//


> add route for added navigation links in route > shop.js and admin.js

> make two controllers for admin and shop
    move middlewares to the appropriate controller
    add new middlewares then add their routes from the appropriate controller export

> work on the ejs files that will be rendered from the routes



*/
