
const Product = require("../models/product.js");

exports.getAddProduct = (req, res, next) => {
    //console.log("<h1>Add product page");
    //res.send(productAdd);
    //res.sendFile(path.join(__dirname, "..", "views", "add-product.html"));
    //res.sendFile(path.join(pathJSrootDir, "views", "add-product.html"));

    //add-product with file extension left out
    //productCSS is for handlebars layout link insertion
    res.render("admin/add-product", {myTitle: "Add-Product page", path: "/admin/add-product", productCSS: true, formsCSS: true, activeProductAdd: true});

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

    Product.fetchAll(products => {
        res.render("admin/products.ejs", {prods: products, myTitle: "Admin Products", path:"/admin/products"});

    });
};