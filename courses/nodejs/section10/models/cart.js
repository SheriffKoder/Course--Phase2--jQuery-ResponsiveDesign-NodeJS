
//cart that holds all the products we added
//group products by id, increase their quantity incase added more than once

//want to add and remove products from the cart
//but the cart is not something we constantly re-create
//there will always be a cart in our application 
//and we just want to manage our products in there

//adding the logic for fetching the cart from a file
const fs = require("fs");
const path = require("path");

const rootPath = require("../util/path.js");
const myCartFilePath = path.join(rootPath, "data", "cart.json");


module.exports = class Cart {
    //constructor() {

        //should hold the product's id and quantity
        //this.products = [];
        //increases with every product we add, initially 0
        //this.price = 0;
        //but will use a different way
    //}
        static addProduct(id, productPrice) {
            // fetch the previous cart
            fs.readFile(myCartFilePath, (error, fileContent) => {

                let cart = {products: [], totalPrice: 0};

                if (error) {
                    //cart would have to be created
                    //otherwise we know we got an existing cart
                }

                else if (!error) {
                    //got an existing cart, our cart should be equal to parsed file content
                    cart = JSON.parse(fileContent);
                }

                //now we know we have a cart
                //now we can analyze it and add a product
                //and see if the product we want to add already exists
                //analyze the cart, see if we already have that product => find existing product
                const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
                //console.log("product exists at", existingProductIndex);
                const existingProduct = cart.products[existingProductIndex];
                //console.log("product of ", existingProduct);

                let updatedProduct;
                //add new product or increase the quantity
                if (existingProduct) {
                    updatedProduct = {...existingProduct};
                    updatedProduct.qty = updatedProduct.qty + 1;
                    //console.log("updated product qty", updatedProduct);
                    //replace the product with the updated product with new quantity
                    cart.products = [...cart.products];
                    cart.products[existingProductIndex] = updatedProduct;
                } else {
                    updatedProduct = {id: id, qty: 1};
                    //array of all the old cart products, with a new additional product
                    cart.products = [...cart.products, updatedProduct]; 
                }

                // +productPrice to convert the string to a number
                cart.totalPrice = cart.totalPrice + +productPrice;
                
                //array of all the old cart products
                cart.products = [...cart.products];
                
                //copy the cart to file
                fs.writeFile(myCartFilePath, JSON.stringify(cart), err => {
                    //console.log(err);
                });

            });

        };

        static deleteProduct(id, productPrice) {
            fs.readFile(myCartFilePath, (error, fileContent) => {
                let cart = {products: [], totalPrice: 0};

                //console.log("in the cart delete");

                if (error) {
                    return;
                }

                else if (!error) {
                    //console.log("in the cart delete !error");

                    //got an existing cart, our cart should be equal to parsed file content
                    cart = JSON.parse(fileContent);
                    const updatedCart = {...cart};
                    const product = updatedCart.products.find(p => p.id === id);

                    //not proceed if item is not in cart
                    //other wise removing deleting item not in cart will give a qty error
                    if (!product) {
                        return;
                    }
                    const productQty = product.qty;
                    updatedCart.products = updatedCart.products.filter(prod => prod.id !== id );
                    updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty;

                    fs.writeFile(myCartFilePath, JSON.stringify(updatedCart), err => {
                        //console.log(err);
                    });
    

                }
            });
        };



    //want to get all products in the cart
    static getCart(cb) {
        fs.readFile(myCartFilePath, (error, fileContent) => {
            const cart = JSON.parse(fileContent);
            if (error) {
                cb(null);
            }
            else {
                cb(cart);
            }
        });
    }


};