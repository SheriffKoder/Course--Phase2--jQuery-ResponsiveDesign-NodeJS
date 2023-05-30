


const express = require("express");
const router = express.Router();
const path = require("path");

//RootPath (path.js) exports the root caller directory (RootJsFile > CalledJsFile > RootPath const)
const RootPath = require("../utl/path.js")


//**runs on visit
router.get("/product-list", (req, res, next) => {
    //console.log(req.body["productAdded"]);
    res.send(`<h1>Product is not added yet<h1>`);
    //res.redirect("/");
});


router.get("/", (req, res, next) => {

    //send file > send back a file to the user
    //cannot refer directly so use path.join

    //using __dirname will start locating from the file directory
    //path.join(__dirname, "..", "views", "filename.html");
    //__dirname a nodejs global variable hold the path for this file/project
    //then go up one level, go to views folder, and select the file
    //res.sendFile(path.join(__dirname, "..", "views", "shop.html"));

    //using path.js will start locating from the main app.js directory
    res.sendFile(path.join(RootPath, "views", "shop.html"));
    //file.html is located in /public folder but /public is omitted here as its provided in app.js's express.static


});


module.exports = router;


