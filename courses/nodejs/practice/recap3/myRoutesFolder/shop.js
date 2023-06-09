

const path = require("path");
const express = require("express");
const router = express.Router();
const pathJSrootDir = require("../utl/path.js");

const adminData = require("./admin.js");

router.get("/", (req, res, next) => {

    //between files sync*
    const products = adminData.products;
    //console.log("shop.js is logging: ", adminData.products );

    //.renter temp-engine extension
    res.render("shop", {prods: products, myTitle: "Shop page", path:"/", hasProducts: products.length > 0, productCSS: true, activeShop: true});

});


module.exports = router;



// between files sync*
// so when opening another browser
// like a new user, does not share cookies just the ip address
// the data used here is shared there and inherited
// shared between "all" users

