
const Product = require("../models/product.js");


exports.getAddProduct = (req, res, next) => {
    //console.log("<h1>Add product page");
    //res.send(productAdd);
    //res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
    //res.sendFile(path.join(pathJSrootDir, "views", "add-product.html"));

    //add-product with file extension left out
    //productCSS is for handlebars layout link insertion
    res.render("add-product", {myTitle: "Add-Product page", path: "/add-product", productCSS: true, formsCSS: true, activeProductAdd: true});

};

//const products = [];


exports.postAddProduct = (req, res, next) => {
    //console.log(req.body);    
    //outputs object, so can know the keys, related to bodyParser
    //console.log(req.body["productAdded"]);

    //change the value of products[] before getting to export
    //products.push({"recent_product": req.body.productAdded});

    //pass the form title and push the title to the products array in product.js using save
    const product = new Product(req.body.productAdded);
    product.save();

    //res.send("<h1>Add product page 2");
    res.redirect("/");
};

exports.getProducts = (req, res, next) => {
    //const products = adminData.products;
    //products already exists in this file no no need to define it

    const products = Product.fetchAll();

    res.render("shop", {prods: products, myTitle: "Shop page", path:"/", hasProducts: products.length > 0, productCSS: true, activeShop: true});

    console.log("shop.js is logging: ", products );

};