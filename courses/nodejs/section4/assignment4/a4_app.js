/*

create a nodejs project using express
choose a temp engine

add two routes
"/" holds a form that allows users to input their name
/users outputs an <ul> with the user names (or some error text)


//create app.js express skeleton and make route files, link route files
//create the html
//add includes
//create the .ejs files with includes from the html, add res.render to routers
//add the if/ for each / added user value from form to the html to be displayed


*/

const http = require("http");
const express = require("express");
const app = express();
const path = require("path");


app.set("view engine", "ejs"); //pug, handlebars
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));


const adminJsRoutes = require("./routes/home.js");
const shopJsRoutes = require("./routes/userList.js");
app.use(adminJsRoutes.routes);
app.use(shopJsRoutes);


app.use((req,res,next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    //res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
   res.status(404).render("404", {myTitle: "404 Page", path: "/404"});


});


app.listen(3000);


