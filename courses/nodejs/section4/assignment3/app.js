/*

//create and express.js app
//serves two html files for "/" and "/users"
//provide static serving for css and js files


*/

const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));



const HomeJsRoutes = require("./routes/home.js");
const UsersJsRoutes = require("./routes/users.js");

app.use(express.static(path.join(__dirname, "public")));


app.use(HomeJsRoutes);
app.use(UsersJsRoutes);


app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));

});


app.listen(3000);
