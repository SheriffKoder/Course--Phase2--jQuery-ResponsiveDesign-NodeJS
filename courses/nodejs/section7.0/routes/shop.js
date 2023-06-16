

const path = require("path");
const express = require("express");

const router = express.Router();

//module imported from /util/path.js
//const pathJSrootDir = require("../util/path.js");
//const adminData = require("./admin.js");

const productsController = require("../controllers/products.js")


router.get("/", productsController.getProducts);

/*
router.get("/", (req, res, next) => {
    const products = adminData.products;
    res.render("shop", {prods: products, myTitle: "Shop page", path:"/", hasProducts: products.length > 0, productCSS: true, activeShop: true});

    console.log("shop.js is logging: ", adminData.products );

});
*/



module.exports = router;





