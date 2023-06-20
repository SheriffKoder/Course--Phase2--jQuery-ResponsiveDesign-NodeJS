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
new product
< model (data logic) /save / pass to fetchall my product render to render the readfile


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
//Part2
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

//work on the navigation
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


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
// Part3
/*


//adding a product image, price, text
go to the model
add to the class constructor parameters imageUrl, description, price

add to the view add-product.ejs more form html inputs

add to the admin.js controller these req.body received inputs
and pass to the created new product class

add these variables to the product-list.ejs and index.ejs forms

//
add edit link to product.js (admin products)
that has an href to /admin/edit-product

later we will work on editing a specific product not all products
also when working on delete

the delete button
should not send a get request
instead wrap in a form leads to /admin/delete-product with post method

//working on the add to cart button
i need to have an idea of the product i want to add 
and want to add it to the route/path we are loading
so will also wrap it in a form /add-to-cart

so now we have three routes



///////////////////////////////////////////////////////////////////

create in views/shop /orders/ejs
responsible for displaying orders

copy the cart empty ejs for now
and add a link to the navigation /orders

add route and controller middleware in shop.js's



///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
section 9: passing dynamic data through our routes
accessing product details by id

encode data as a part of the url so can pass an id in the url
passing route Params/parameters
using query Params
we will also use these to enhance our models

add more functionalities and new models

add a details link to the product-list.ejs
this is a case use for passing additional information as part of our path
/product/information-for-this-specific-product
for that we need a unique identifier id for each product created

add an id property to the class model in the save method before saving
this.id = Math.random().toString();
and add this "id" to the ejs link using /products/<%= products.id %>

use this id in the path of the routes file to load the correct product

//output the id
add in the shop.js router
tell express router that there will be some variable segment
by adding a : then any name of our choice, that we will use to extract that information
router.get("/products/:productId", shopController.getProduct);

then go to controllers/shop.js

order does matter, in the router files

express js gives us a params object on our request
access our productId because its used in the routes js files
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;


//--//
class creates id
product-list.ejs uses this id in the href - redirects to a link with the id
shop router /products/:productId will take any link after /products as an id
    (however it can over rule a products/notId for example, so :productId get has to be put below noId)
shop controller req.params.productId to access the router's :productId
pass this prodId to the findMyId static method and a callback that console it

////
create a static method in the class findMyId
that finds in the read products the id passed

jpeg file links are encoded in base64, text encoding technique


////add a view to display the details
create a product-details.ejs in views/shop
to access the product.information

in the shop controller
now make the callback passed to findMyId render, render the ejs with the product found

//
add a form that leads to /cart with a post request as we want to add this product
and add a button with type submit




///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//working on the add to cart functionality in the product-details

form method post button add to cart
in the post request, we can use the req.body

will add additional information with the sent request
using input with type hidden, not shown but sent

we have a get request for the /cart
but we need a post request
work on the route, then add a post middleware in the controller
to get the additional information productId
and redirect to the cart

copy the add to cart form button to all the places using it

so add to cart product has an independent functionality
using the router, controller and passed productId generated on the product card/details-page

can also use <%- include("../included/add-to-cart.ejs", {product: product})%>
as this piece of code is repeated
{product: product}) allows to pass the ejs variable to the include ejs
to make the include works when "in a loop"


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//working on the cart

add a new model, cart.js
reads our cart file
search if product exists in the cart and inc quantity
else quantity +1
update cart price


save the cart back to our file
work on cart.js and shop.js controller postCart




///////////////////////////////////////////////////////////////////
query parameters helping with editing a product

want to edit a product
want to render the same product i have for edit-product
want to pre-populate the form with the product existing values

delete the add-product.ejs file
and change the controllers/admin.s getAddProduct

add a getEditProduct same as getAddProduct

add a router in the admin.js 

add editable=true in the controller render


can use query parameters to pass in additional information
using the value in the url after "?"
http://localhost:3000/admin/edit-product/7?edit=true

by adding in the controller
using string "true" etc.
const editMode - req.query.edit;
if (!editMode || editMode === "false") {
    res.redirect("/");
}
res.render(..., editing: editMode);


///////////////////////////////////////////////////////////////////
next step is to populate the form with the product existing values
when edit mode is true

as we have the :productId in the router
can extract it in the controller
by using the model findMyId

and passing the product to the ejs
using the if editing to populate and change form action



///////////////////////////////////////////////////////////////////
next is to hook up the edit button and work on the functionality to store the updated info

change the edit link in the products.js 
to have an href to /admin/product.id?edit=true

//work on the update product button link
register this route in admin.js
create the controller middleware in admin.js

add a hidden input in the ejs to hold the id value to access with req.body

work on the save method in the class to 
update products with the edited product as well as a new product

///////////////////////////////////////////////////////////////////
//work on the delete functionality

add a post router in the admin.js router based on the delete button url in products.ejs
also add a hidden input to pass the product.id

in the product class add a delete method that "filters" the products for this id
so you can have products without this product and store them in the file again

also start working on removing from the cart
by adding a delete method 
and call that method in the product class model

this will be accessed from the postDeleteProduct controller


///////////////////////////////////////////////////////////////////
//display items on the cart





*/