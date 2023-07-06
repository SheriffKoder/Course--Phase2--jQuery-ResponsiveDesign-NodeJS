

const path = require("path");
const express = require("express");

const router = express.Router();

//module imported from /util/path.js
//const pathJSrootDir = require("../util/path.js");
//const adminData = require("./admin.js");

const shopController = require("../controllers/shop.js")


router.get("/", shopController.getIndex);

/*
router.get("/", (req, res, next) => {
    const products = adminData.products;
    res.render("shop", {prods: products, myTitle: "Shop page", path:"/", hasProducts: products.length > 0, productCSS: true, activeShop: true});

    console.log("shop.js is logging: ", adminData.products );

});
*/


router.get("/products", shopController.getProducts);

// //tell express router that there will be some variable segment
// //by adding a : then any name of our choice, that we will use to extract that information
// //router.get("/products/delete",...);
router.get("/products/:productId", shopController.getProduct);

// router.get("/checkout", shopController.getCheckout);

// router.get("/cart", shopController.getCart);

// router.post("/cart-delete-item", shopController.postCartDeleteProduct);

// router.post("/cart", shopController.postCart);

// router.get("/orders", shopController.getOrders);

// router.post("/create-order", shopController.postOrder);

module.exports = router;





