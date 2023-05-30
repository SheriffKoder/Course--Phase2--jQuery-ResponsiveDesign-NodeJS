

// express.Router is like a mini express app
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


//find and send html to response
router.get("/add-product", (req, res, next) => {
    //res.send(productAddHtml);
    //file.html is located in /public folder but /public is omitted here as its provided in app.js's express.static
    res.sendFile(path.join(RootPath, "views", "add-product.html"));
});

//**runs on form post
router.post("/product-list", (req, res, next) => {
    //console.log(req.body["productAdded"]);
    res.send(`<h1>The added product is : ${req.body["productAdded"]}<h1>`);
    //res.redirect("/");
});



module.exports = router;