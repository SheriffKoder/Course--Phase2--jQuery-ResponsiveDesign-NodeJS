
//in admin.js the express.router
//which is like a mini express app, tied to it
//which we can export

//use that router to register some things
//define a use function for all requests
//like router.get, post etc.
//copy code from s4.app.js
//and replace app. with router.

const path = require("path");
const express = require("express");
const router = express.Router();
const pathJSrootDir = require("../util/path.js");

//const products = [];
const adminController = require("../controllers/admin.js")

//(3.5)
const isAuth = require("../middleware/is-auth.js");

//(18.1.3)
const {body} = require("express-validator");


/*
let productAdd = `
<form action="/admin/product" method="POST">
    <label for="html"> Add Product </label>
    <input id="html" type="text" name="productAdded">
    <button type="submit"> Add Product </button>
</form>
`;
*/

//add form input page

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

/*
router.get("/add-product", (req, res, next) => {
    //console.log("<h1>Add product page");
    //res.send(productAdd);
    //res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
    //res.sendFile(path.join(pathJSrootDir, "views", "add-product.html"));

    //add-product with file extension left out
    //productCSS is for handlebars layout link insertion
    res.render("add-product", {myTitle: "Add-Product page", path: "/add-product", productCSS: true, formsCSS: true, activeProductAdd: true});


});
*/

//output the added input

// /admin/product => POST
router.post(
    "/add-product",
    [
        //(18.1.3)
        body("title")
        //used instead of isAlphanumeric, isString as it allows white spaces
            .isString()
            .isLength({min: 3})
            .trim(),
        body("price")
            .isFloat(),
        body("description")
            .isLength({min: 5, max: 400})
            .trim()
    ],
    isAuth, adminController.postAddProduct
);
/*
router.post("/product", (req, res, next) => {
    //console.log(req.body);    
    //outputs object, so can know the keys, related to bodyParser
    //console.log(req.body["productAdded"]);

    //change the value of products[] before getting to export
    products.push({"recent_product": req.body.productAdded});
    //res.send("<h1>Add product page 2");
    res.redirect("/");
});
*/

//the router will be exported with these two above routes registered

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);


router.post(
    "/edit-product",
    [
        //(18.1.3)
        body("title")
            .isString()
            .isLength({min: 3})
            .trim(),
        //body("imageUrl") //-(20.0.4)
        //    .isURL(),
        body("price")
            .isFloat(),
        body("description")
            .isLength({min: 5, max: 400})
            .trim()
    ], 
     isAuth, adminController.postEditProduct
);

router.post("/delete-product", isAuth, adminController.postDeleteProduct);


module.exports = router;
//exports.routes = router;
//exports.products = products;