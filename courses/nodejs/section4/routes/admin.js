
//in admin.js the express.router
//which is like a mini express app, tied to it
//which we can export

//use that router to register some things
//define a use function for all requests
//like router.get, post etc.
//copy code from s4.app.js
//and replace app. with router.


const express = require("express");

const router = express.Router();

let productAdd = `
<form action="/admin/product" method="POST">
    <label for="html"> Add Product </label>
    <input id="html" type="text" name="productAdded">
    <button type="submit"> Add Product </button>
</form>
`;


//add form input page
// /add-product => GET
router.get("/add-product", (req, res, next) => {
    //console.log("<h1>Add product page");
    res.send(productAdd);
});

//output the added input
// /add-product => POST
router.post("/product", (req, res, next) => {
    //console.log(req.body);    
    //outputs object, so can know the keys, related to bodyParser
    console.log(req.body["productAdded"]);
    //res.send("<h1>Add product page 2");
    res.redirect("/");
});

//the router will be exported with these two routes registered



module.exports = router;