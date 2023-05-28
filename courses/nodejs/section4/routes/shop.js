

const path = require("path");
const express = require("express");

const router = express.Router();



router.get("/", (req, res, next) => {
    //console.log("in the / middleware");
    //res.send("<h1> Hello / Express</h1>");


    //send file allows to send back a file to the user
    //it automatically set the header content-type ?
    //as this file is in a child folder 
    //and the html needed is outside this folder
    //it will not be a problem because this path
    //is used in the s4_app.js file which is in the parent folder for both
    // path: /views/shop.html will refer to a path starting
    //from out operating system root folder not section4 of s4_app.js
    //to overcome that we imported the "path" core-module above
    //res.sendFile("/views/shop.html");
    res.sendFile(path.join());
});




module.exports = router;