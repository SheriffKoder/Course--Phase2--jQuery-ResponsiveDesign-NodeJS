/*

//templating engines
//able to understand a certain syntax present in html code
// and replace 

//free temp engines
. ejs; normal html       <p> <#= name %> </p>
. pug (jade);  p #{name}
    does not use real html, replaces with a minimized version
    custom temp language
.handlebars; <p> {{name}} </p>
    normal html, custom temp language, limited set of features



(1*) # npm init   - to initialize the project directory for npm usage
(2) edit the scripts object in the package.json provided, "start": "node fileName.js", "start-myServer": "nodemon createUser.js"
(3) # npm start / npm run customStart
(4) # npm install nodemon --save-dev    (development dependency: not needed on real server)
(-) # npm install nodemon -g    (global dependency: available on every server launched and be able to use it in the terminal)
(-) # npm install   (installs the packages in the .json dependency)

(5*) # npm install --save express    (production dependency: be present with every application shipped)
(6*) # npm install --save body-parser


[2] # npm start // # npm run nodemon-start

# npm install --save ejs pug express-handlebars


//express-handlebars has integration with express rather than handlebars alone
//ejs and pug have built in integration



*/

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");




/////////////////////////////////////////////////////////////////
//tell express what templating engine we are using and where our public files folder is
app.set("view engine", "pug");
//tell express what folder is the views(html) folder in our root directory
app.set("views", "myViewsFolder");

//set static file locations, allows to use .css/.js files in the public folder
app.use(express.static(path.join(__dirname, "myPublicFolder")));




/////////////////////////////////////////////////////////////////
//import route code files as normal and use the body-parser
const adminJsRoutes = require("./myRoutesFolder/admin.js");
const shopJsRoutes = require("./myRoutesFolder/shop.js");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));

//use the imported route files and a default use for 404
app.use(adminJsRoutes.routes);
app.use(shopJsRoutes);





app.use((req,res,next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
    res.status(404).render("404", {myTitle: "404 Page"});




});


app.listen(3000);



// .render("...") by nodejs makes user of the defined temp engine and then return that template
// as we stated all the views are in the views folder, no need to construct a path, can just say shop


//app.js:   write this code - where myTitle is a variable shared with html-templates
//utl:      copy the utl folder (for root directory code)
//routes:   code admin.js/shop.js to render.pug on get and push data on post
//.pugs:    no need for .html files, we will render htmlish template engine files (.pug) in views folder
//layout.pug: views/layouts/main-layout.pug

////temp-engines allow to
// output html
// output values using insertion syntax
// repeat a part of the html for each url visit/post (pug: if prods.length > 0 )
// if statement (pug: if prods.length > 0 )


//notes:
//in routes js files 
    //we render fileName and the temp engine extension will be added depending on the defined template in app.js
    //also we add an object to the render, of key values, will be used in the htmlish 
        //like myTitle, path, 

        //pug
        //and enable the add-product link only when path is add-product
        //a(href="/add-product" class=(path === "/add-product" ? "active" : "" ) ) Add Product
        //path is put without #{} because it would not be considered a text
