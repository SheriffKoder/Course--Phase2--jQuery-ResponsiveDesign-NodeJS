
//main requires
const path = require("path");
const express = require("express");
const router = express.Router();

//this route uses the middleware from controllers/shop.js
const productsController = require("../controllers/products.js")

router.get("/", productsController.getProducts);

module.exports = router;
