
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