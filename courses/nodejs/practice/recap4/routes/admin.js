

//main requires
const path = require("path");
const express = require("express");
const router = express.Router();


//this route uses the middleware from controllers/product.js
const productsController = require("../controllers/products.js")

router.get("/add-product", productsController.getAddProduct);

router.post("/product", productsController.postAddProduct);


module.exports = router;
