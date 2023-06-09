

const path = require("path");
const express = require("express");
const router = express.Router();
const pathJSrootDir = require("../utl/path.js");


const products = [];

router.get("/add-product", (req, res, next) => {
    //console.log("<h1>Add product page");
    //res.send(formHtmlString);
    //res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
    //res.sendFile(path.join(pathJSrootDir, "views", "add-product.html"));

    //add-product with file extension left out .template-engine extension
    //productCSS is for handlebars layout link insertion
    res.render("add-product", {myTitle: "Add-Product page", path: "/add-product", productCSS: true, formsCSS: true, activeProductAdd: true});
})

router.post("/product", (req, res, next) => {
    //console.log(req.body);    
    //outputs object, so can know the keys, related to bodyParser in the app.js
    //console.log(req.body["productAdded"]);

    //change the value of products[] before getting to export
    //recent product 1 ?
    products.push({"recent_product": req.body.productAdded});
    //res.send("<h1>Add product page 2");
    res.redirect("/");
});


//the router will be exported with these two above routes registered
//module.exports = router;
exports.routes = router;
exports.products = products;