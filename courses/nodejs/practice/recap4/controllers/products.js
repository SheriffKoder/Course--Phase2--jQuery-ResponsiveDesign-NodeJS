const Product = require("../models/product.js");

exports.getAddProduct = (req, res, next) => {
    res.render("add-product", {myTitle: "Add-Product page", path: "/add-product", productCSS: true, formsCSS: true, activeProductAdd: true});
};

exports.postAddProduct = (req, res, next) => {
    
    //pass the form title and push the title to the products array in product.js using save
    const product = new Product(req.body.productAdded);
    
    product.save();
    res.redirect("/");
};


exports.getProducts = (req, res, next) => {
    //on fetchAll call, send this function that will be called to retrieve render 
    //based on the product status empty-array or data

    Product.fetchAll(products => {
        res.render("shop", {prods: products, myTitle: "Shop page", path:"/", hasProducts: products.length > 0, productCSS: true, activeShop: true});
    });

};
