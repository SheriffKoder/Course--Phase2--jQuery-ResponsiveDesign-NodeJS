
//on visit add-product html is served
//on posting to product-list , the product is displayed in an h1

// express.Router is like a mini express app
// create modular, mountable route handlers
// complete middleware and routing system
const express = require("express");
const router = express.Router();
const path = require("path");

//RootPath (path.js) exports the root caller directory (RootJsFile > CalledJsFile > RootPath const)
const RootPath = require("../utl/path.js")


let productAdd = `
<form action="/product-list" method="POST">
    <label for="html"> Add Product </label>
    <input id="html" type="text" name="productAdded">
    <button type="submit"> Add Product </button>
</form>
`;

// middleware that is specific to this "router"
//find and send html to response
router.get("/add-product", (req, res, next) => {
    //res.send(productAddHtml);
    //file.html is located in /public folder but /public is omitted here as its provided in app.js's express.static
    res.sendFile(path.join(RootPath, "views", "add-product.html"));
});

//**runs on form post
//req.body used here as the body parser is called in caller app.js file
router.post("/product-list", (req, res, next) => {
    //console.log(req.body["productAdded"]);
    res.send(`<h1>The added product is : ${req.body["productAdded"]}<h1>`);
    //res.redirect("/");
});



module.exports = router;