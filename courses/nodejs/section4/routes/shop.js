

const path = require("path");
const express = require("express");

const router = express.Router();

//module imported from /util/path.js
const pathJSrootDir = require("../util/path.js");

//
const adminData = require("./admin.js");

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
    //to overcome that, we imported the "path" core-module above
    //join returns a path constructed by concatenating the different segments
    //first to pass a global variable made available by nodejs
    //it holds the path for this project on our os
    //2nd: "../" or ".." go up one level 
    //(as dirname points to the directory of this file shop.js)
    //or can omit it if we are in the project root
    //3nd: the folder in our project
    //4rd: the file
    //no beginning slash, because it puts the appropriate slash based on the os system
    //res.sendFile("/views/shop.html"); //x
    //res.sendFile(path.join(__dirname, "..", "views", "shop.html"));
    
    //pathJSrootDir holds the path of the module starting this function
    //in this case the module in s4_app.js
    //res.sendFile(path.join(pathJSrootDir, "views", "shop.html"));


    // .render("shop.pug") by nodejs makes user of the defined 
    // templating engine and then return that template
    // as we stated all the views are in the views folder, no need to construct a path
    // can just say shop
    // render allows to pass data that should be rendered into our view
    // wrap products in an object to map and use in the template
    // and access it in .pug with prods
    //render shop.pug and export these values with these key names
    const products = adminData.products;
    res.render("shop.pug", {prods: products, myTitle: "Shop page"});

    console.log("shop.js is logging: ", adminData.products );

});




module.exports = router;


