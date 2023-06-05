/*

scripts on the node.js project that helps us 
in running the file

npm
node package manager, installed by default by node js
also to install third-party packages
and initialize the node project and add extra features

third-party packages,
codes that are not included into nodejs
so not reinvent the wheel
could help with parsing incoming requests, validating user input
packages like: express, body-parser
packages are stored in the npm repository
a cloud repo
installed and manage with the npm tool



//////Start npm script
project directory
# npm init

will ask for package name etc.
and out put a json file with configuration information

can add a start script in the json file
so when # npm start this terminal script always run

  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node createUser.js",
    "start-myServer": "node createUser.js"

  },


where start is a reserved name
    # npm start
start-myServer is a custom name
    # npm run start-myServer

helpful so when the code is shared
people do not have to figure out which file is the entry file
and just run npm start in terminal


//////auto-save server code and restart


# npm install package-name 

check the package description on the npm library

development dependency because only used during the development process
so once the app is installed on a real server, we do not need it there
as we will not change its code dynamically

//install as a production dependency 
# npm install package-name --save 

//install as a development dependency
# npm install package-name --save-dev

//install globally so can be used anywhere not just in the project
# npm install package-name -g


## npm install nodemon --save-dev

install the package in the node_modules directory
with its dependencies
this will update package.json
and add package-lock.json, and node_modules directory

## npm install
will look for the dependencies in package.json 
and install any updates available

can delete the node_modules directory
and when start working on the nodejs project again 
run npm install to install the packages

codes are shared with the source-codes without the modules folder
and when want to use them run # npm install



once the a package is installed can be used in code (not used till now)
# npm install --save express-session
//const sessions = require ("express-session");



//use nodemon auto-save
change start script to nodemon yourFilename.js
however changes are reset


nodemon app.js would not work in the terminal 
or command line because we don't use local dependencies 
there but global packages.
can install nodemon globally if want this feature


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//Errors

syntax errors; typos
runtime errors: code break when it runs
logical errors: app does not work the way it show, not show an error


nodejs debugger helps with logical errors
debugger attached and listening

highlight the line of code to stop at (+1 below) breakpoint
Run > Start debugging
select your start script and >
now can hover over the variable and see its contents
and use the middle menu to step into how the code runs

and more information in the left side debugger menu view
. where you can add watchers to watch them while going through code 
outside of the variables drop down menu
. breakpoints to check/uncheck
. callstack how the process went for your code and nodejs code

can use the variables in the table in the
debug console
not affect the code running, to experiment

can change the variables in the table
and it will affect runtime



//to restart
Run > add configuration >
add this line below "programs"
            "restart": true,
            "runtimeExecutable": nodemon,
            "console": "integratedTerminal"
select the program to be "app.js" file
to not use the routes.js file
as as start for debugging

but nodemon has to be installed globally



npm; node package manager
can initialize a project with npm init
make npm scripts
use 3rd party packages


///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
//Express.js

so you can focus on application logic not standard tasks
like extracting incoming data, routing..


can install as a third party package into your project

What is Express.js ?
Using Middleware
Working with Requests & Responses (Elegantly!)
Routing
Returning HTML Pages (files) instead of code


//What is Express.js
help install a package that does the parse data part

use a framework for the heavy lifting
framework: helper functions, tools and rules
that help you build your application


//alternatives to Express.js
vanilla node.js
Adonis.js (larvel inspired)
Koa
Sails.js


//install as a production dependency
because it should be present with every application shipped
# npm install --save express


create an express application
and store it in a constant

CMD + hover over express module will show the source code

express exports a function 
express, store and manage a lot of things behind the scenes


express.js is all about middleware
incoming request is automatically funneled by functions by expressjs
until a response is sent

request > middleware next() > middleware res.send() > Response

this allows splitting into many functions/pieces instead of a huge function
and plug in third party to add functionalities


nodemon on s4_app ?
*/



/*
const http = require("http");
const express = require("express");

//call the express return
const app = express();

//call a method defined by express
//allows to add a new middle ware functions
//accepts an array of request handlers
//pass a function to use, that will be exe on every incoming request
//which will receive three arguments
// req/res/next
//next is a function will be passed by express
//has to be exe to allow the request to be passed on to the next middleware
//adding next(); allow the request to be passed to the next middleware inline

app.use((req, res, next) => {
    console.log("in the middleware");
    next();
});

app.use((req, res, next) => {
    console.log("in the next middleware");

    //can still send responses as before with res.write 
    
    //send of express allows to send a response with data type any
    //sending an html string has automatically the content-type set to html
    //can overwrite this functionality
    //by res.setHeader to change content type like before
    //can check the source code for response.js > send
    //to know what it does and how it switches to html type on string
    //by default a string is considered an html
    res.send("<h1> Hello from Express</h1>");
    console.log(req.url);
    
});

//const server = http.createServer(app);
//server.listen(3000);
//which is
//(require("http").createServer(this)).listen(3000);
//can be replaced with
app.listen(3000);
*/

//want to handle different urls
//app.use(path,callback);
//path string/pattern/reg-ex pattern to match paths or array of these
//callback; middleware function, series of functions separated by commas, array of functions, combination of all of these

//path of "/" means any url does start with "/" not just "/"
//to separate, put the code for the url containing the next url before without next();
//avoiding next(); here is like avoiding sending another response in vanilla node
//next() allows the request to continue

/*

const http = require("http");
const express = require("express");
const app = express();

let productAdd = `
<form action="/product" method="POST">
    <label for="html"> Add Product </label>
    <input id="html" type="text" name="productAdded">
    <button type="submit"> Add Product </button>
</form>
`;

/*
//this code will run twice
//1st on its call on /, 2nd on visiting any page starting with "/"
//as the request is allowed to continue
app.use("/", (req, res, next) => {
    console.log("this always runs");
    next();
});
*/

//parser
//by default request does not parse the incoming
//request body
//to do that is to register a parser
//before other route handling middlewares
//because the parsing of the body
//should be done no matter where the request ends up
//by installing # npm install --save body-parser
//urlencoded registers a middleware and call next() at its end
//able to parse bodies like ones sent through a form, not files
//files will use a different parser

//configure in urlencoded the config option {extended:false}
//to be able to parse non default features

//now we are able to have an object of the input
//easier to extract than before with the split


/*

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use("/user", (req, res, next) => {
    //console.log("in the user middleware");
    res.send("<h1> Hello user Express</h1>");
});

//add form input page
app.use("/add-product", (req, res, next) => {
    //console.log("<h1>Add product page");
    res.send(productAdd);
});

//output the added input
app.post("/product", (req, res, next) => {
    //console.log(req.body);    
    //outputs object, so can know the keys, related to bodyParser
    console.log(req.body["productAdded"]);
    //res.send("<h1>Add product page 2");
    res.redirect("/");
});

app.use("/", (req, res, next) => {
    //console.log("in the / middleware");
    res.send("<h1> Hello / Express</h1>");
});

app.listen(3000);


//the request travels from top to bottom
//but only goes from middleware to middleware
//if you call next in the previous middleware "use" parameter





//till here same code copied edited in the routes folder files
//and started to work on html files from the views folder
*/
///////////////////////////////////////////////////////////
//routing

//want to only listen to a "post" request for the app.use having req.body
// "app.use" works for all http methods
//use "app.get" only will fire for incoming get requests
// use "app.post" to filter for post requests

//so the app.post above will run on the form post request
//but not when url manually entered for /product

//also have app.delete/patch/put



//create a routes folder
//create admin.js that handles the creation of products
//which an admin of the shop can do
//create shop.js (what the user will see)

//put the product add code to admin.js

//express.router explained in admin.js/
//code copied from above example to the ./route files
//removed app.use and replaced with get and post



/*


const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

//import the admin.js file module
//order of import does not matter
const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
//path to the folder we want to serve statically
//grant read access to
//with this user should be able to access the public path and in html
//and in the html link, omit the ./public
//can have many static folders
//and will look into all of them, till finds the first find on the file
//this can be for css, js files, images etc.
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "public2")));



//calling the exported router object in app.use (just by itself)
//so its code can run at this place/order (order matters)


app.use(adminJsRoutes); //replaced code
app.use(shopJsRoutes); //replaced code

////filtering mechanism
//useful to not repeat paths
////app.use("/admin", adminJsRoutes);
//only routes starting with /admin (ex. /admin/add-page)
//will be executed from this code 
//do not add the /admin in the route files's paths
// "./admin" will be placed before any path
//so place /product in the .js file use's
//and enter /admin/product url for this to work
//but the .js file's form should have a path with "/admin/add-product"



//if we reach here, and no middleware executed
//we will get and error as we did not handle that request
//set a 404 error page

//catch all middleware
//handles all http methods (.use)
//chaining the status() method before .send()
//always before send() can call status(), setHeader() etc.
//404 a common path for a page not found
app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));

});



app.listen(3000);

//we can repeat the paths without conflict if used
//different methods like get/post


*/
/*
///////////////////////////////////////////////////////////
////serving html pages


//we will slowly work towards mvc
//model view controller

//create a views directory to place
//what we serve to the user in our application
//which will be a bunch of html files

//create a shop.html in the views folder
//this will be for users visiting "/"

//create also add-product.html

//will use these files later, 
//with the concept of templating engines
//to be able to dynamically add content to the html files

//create in the html files
//html nav bar links
//main content of a form posting to /add-product (add-product.html)
//main content of products (shop.html)

//we will learn later how to manage data on the server


//now want to serve these html files in our routes

//// explanation continued from here in the shop.js
//where we added the path module also in admin.js
//path module is a built in



//const path = require("path");
//res.sendFile(path.join(__dirname, "..", "views", "shop.html"));


//we can get the parent directory with the help of a function
//we created in util/path.js


//not built in modules
//body parser
//nodemon
//express, require("express").Router, 

//built in modules
//path, path.dirname, path.join
//express: res.send, res.sendFile, res.redirect, express.static



////serving html pages
//editing css in the <style> tags in html normally

//how to use css files
//files stored, will point at them when app gets served

//create a folder named "public" > "css" > "main.css"
//and copy the shop.html css to it
//to indicate that this folder should be always
//exposed to the public
//and do not need any permissions to access it

//because all the files in the project are not accessible by the users
//for example url "localhost:3000/views/shop.html" wont work


//feature express js offers
//to serve files statically
//static: not handled by the express routers or middleware
//but directly forwarded to the file system
//app.use(express.static(path.join(__dirname, "public")));




//templates
//allow to turn the static html code
//hard coded html
//into more dynamic elements
//where we can inject data
//into the js code
//in the html returned to the user

*/
/////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////
//part 2
/*

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

//templates
//set a global configuration value
//allows to set any values globally on our express application
//key or configuration items node does not understand
//usually ignores them, but now can read them
//from the app object with app get
//another way of sharing data across our application
//view engine key: tell express for any dynamic content we are trying to render
    //please use this engine we are registering here
//views key: allows us to tell express where to find these dynamic views

app.set("view engine", "pug");
//set an additional configuration
//to let express know where to find our views
//can change views to another folder named
//as in the docs, the default setting for views is our project directory > views folder
//app.set("views", "views-folder");
app.set("views", "views");

//telling express, want to compile dynamic content
//with the pug engine and where to find these templates
//now add a pug template file views > views.pug



const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));



app.use(adminJsRoutes.routes); //replaced code
app.use(shopJsRoutes); //replaced code

////filtering mechanism
////app.use("/admin", adminJsRoutes);

//used the __dirname directly here because we are in a root file
app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {myTitle: "404 Page"});
});



app.listen(3000);

*/
/*


Dynamic content & templates

dynamic output into code that is sent to the users
like data from a database

managing data on a node express backend (without a database)

> render dynamic content in our views
for this we use Templating engines


////global users data sharing with vanilla code
for now can store the req.body data in js variables

.changed the exports in admin.js to export router and products array
.changed in app.js the app.use to adminJsRoutes.routes instead of adminJsRoutes
.imported the admin.js into shop.js
.and output the products
    console.log("shop.js is logging: ", adminData.products );

//adminData comes here in the form of routes, 
//and in shop.js in the form of products


so when opened another browser
like a new user, does not share cookies just the ip address
the data used here is shared there and inherited
shared between "all" users
later we will learn to share data for "each" user


////templating engines
html template
node express content : products array
temp engine understand certain syntax for which it scans your html'sh template
and then replace the place holders or certain snippets
depending on the engine used with real html content
content generated on the fly/server by temp engine
taking that dynamic content into account

could output a ul with list items for the data in the node express app
with the help of the temp engine

and the result will be dynamically on the fly generated html file
which is then sent back to users

free temp engines
. ejs; normal html       <p> <#= name %> </p>
. pug (jade);  p #{name}
    does not use real html, replaces with a minimized version
    custom temp language

.handlebars; <p> {{name}} </p>
    normal html, custom temp language, limited set of features






//production dependency
#npm install --save ejs pug express-handlebars

express-handlebars has integration with express rather than handlebars alone
ejs and pug have integration


//tell express, we have a templating engine that is express conforming
use it to render dynamic templates
//and is supported out of the box


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
////Using pug
(1) html, create your htmls
(1) pug, create a views > shop/add-product/404.pug and add htmlish syntax
(2) render, got to the shop.js file and use res.render() in the router
res.render("shop.pug", {anyKey: value}) by nodejs makes user of the defined templating engine
and then return that template
as we stated all the views are in the views folder, no need to construct a path
can just say shop
(4) put/insert your exported dynamic values from render to .pug

we can:
.ability to output html
.ability to output values using #{}
.ability to add html for each value using products in prods
req.body.productAdded(recent product) > admin products array > prods:  
.if statement             if prods.length > 0 



//adding layout
what to do with repeating pug code in your files ?
create a layout
create views > layouts-folder > main-layout.pug

other pug files use this layout and add more syntax
define such a hook by having
block 
then having any name of our choice that will be used in other pug files

main html
and block content

in the child pug
extent /layouts/main-layout.pug
block content
    custom html indented


//by extending the layout this will not define the hook
//but add content



//setting the active class depending on the link we are on

routes > admin.js
add to the render object, path: "/add-product"

//and enable the add-product link only when path is add-product
a(href="/add-product" class=(path === "/add-product" ? "active" : "" ) ) Add Product

//as you can see here
path is put without #{}
because it would not be considered a text
like putting after h1, have to declare it is not a text but a variable


///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////




*/
///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//using handlebars

/*

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");

//import
//return a function of the initialized view engine that can be called
const expressHbs = require("express-handlebars");

//registers a new templating engine, incase no built in
//pug was built in kind of, hbs is not
//the object in expressHbs is for the layouts directory
//default layout to be used for all files
//adding extname: "customExtension" if using custom extension on the layout file
app.engine("handlebars", expressHbs({layoutsDir: "views/layouts", defaultLayout: "main-hbs-layout"}));
app.set("view engine", "handlebars");
app.set("views", "views");


const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, "public")));



app.use(adminJsRoutes.routes); //replaced code
app.use(shopJsRoutes); //replaced code

////filtering mechanism
////app.use("/admin", adminJsRoutes);

//used the __dirname directly here because we are in a root file
app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {myTitle: "404 Page"});
});



app.listen(3000);


*/
//depending on the temp engine
//some are used using require like handle-bars (as stated in the document)

//import
//add engine
//create .handlebars files in views folder
    // or any extension as named in the app.engine()
//add html syntax from .html to .handlebars

//the way you pass template values in res.render
//are the same across all templating engine
//the difference is how you use it from engine to engine

//if helper
//# hashtag for special block statement
//not just outputting some text, but actually wrap some content
//that should be output conditionally or in a loop
//cannot use logic in handlebar's if's its passed from the js file render object
// {{#if hasProducts}}
//{{/if}}   //close the if condition
//{{else}}

//repeating html for every product added
//{{#each array}}   //array here is prods in our case
    //{{this.adminjsfilekey}}
//{{/each}}


////the layout
//add layouts folder to app.engine in app.js
//copy the html code to a layouts file
//handlebars does not have insertion block like pug
//we can use     {{{ body }}} and keep only the main html in the .handlebars
//to add insertions like add extra link in html head
//will have to make a workaround using if statement or use custom helpers

//{{#if productCSS}}
    //link
//{{/if}}

//in the relevant .js file add to the render object productCSS: true






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



app.use(adminJsRoutes.routes); //replaced code
app.use(shopJsRoutes); //replaced code

////filtering mechanism
////app.use("/admin", adminJsRoutes);

//used the __dirname directly here because we are in a root file
app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {myTitle: "404 Page", path: "404"});
});



app.listen(3000);

/*
ejs is supported out of the box no engine register needed

adding a value
<%=value %> //html will be displayed as text

<% vanilla js code %>

<% if (prods.length > 0) { %>
    //html
<% } else { %>
    <h1> no products found </h1>
<% } %>


<%  for (let products of prods) {%>
    //html
<% } %>

in the html form name=productAdded


ejs does not have layouts
but we can use "partials or includes"
a feature pug/handlebars also know

create a folder "includes" in the views folder
will create there shared files
head.ejs bodyEnd.ejs navigation.ejs
and copy the html to them

now import the html temps into the 404.ejs/shop.ejs etc.
<%- htmlcode %>
<%- include("includes/head.ejs") %> //from the pov of the file using this code


//to add class to links
<a class="<%= path === '/add-product' ? 'active' :'' %>" > </a>


-delete layout
-delete hbs pug files
copy the cleaned project till now for future work ?




*/