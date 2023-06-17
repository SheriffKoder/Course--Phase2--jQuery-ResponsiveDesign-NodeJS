
const ProductClassModel = require("../models/product.js");


exports.getProducts = (req, res, next) => {
    //const products = adminData.products;
    //products already exists in this file no no need to define it

    //on fetchAll call, send this function that will be called to retrieve render 
    //based on the product status empty-array or data
    ProductClassModel.fetchAll(products => {
        res.render("shop/product-list", {prods: products, myTitle: "All Products page", path:"/products"});

    });


    //console.log("shop.js is logging: ", products );

};

//express js gives us a params object on our request
//access our productId because its used in the routes js files
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    console.log("prodId", prodId);
    res.redirect("/");
}

//main-page
exports.getIndex = (req, res, next) => {
    ProductClassModel.fetchAll(products => {
        res.render("shop/index.ejs", {prods: products, myTitle: "Shop page", path:"/"});

    });
};


exports.getCart = (req, res, next) => {
    res.render("shop/cart", {
        path: "/cart",
        myTitle: "Your Cart"
    });
};


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        myTitle: "Checkout"
    });
};


exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        myTitle: "Your Orders"
    });
};