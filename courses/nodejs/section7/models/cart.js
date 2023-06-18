
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
const myDataFilePath = path.join(rootPath, "data", "cart.json");


module.exports = class Cart {
    constructor() {

        //should hold the product's id and quantity
        //this.products = [];
        //increases with every product we add, initially 0
        //this.price = 0;
        //but will use a different way

        static addProduct(id) {
            // fetch the previous cart
            fs.readFile(myDataFilePath, (error, fileContent) => {

                let cart = {products: [], totalPrice: 0};

                if (error) {
                    //cart would have to be created
                    //otherwise we know we got an existing cart
                }

                else if (!error) {
                    //got an existing cart, our cart should be equal to parsed file content
                    cart = JSON.parse(fileContent);
                }


            });

            //now we know we have a cart
            //now we can analyze it and add a product
            //analyze the cart, see if we already have that product => find existing product

            //add new product or increase the quantity


        };


    };
};