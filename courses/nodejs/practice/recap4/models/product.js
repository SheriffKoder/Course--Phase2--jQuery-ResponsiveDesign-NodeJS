/* models/product.js */


const fs = require("fs");
const path = require("path");
const rootPath = require("../util/path.js");
const myDataFilePath = path.join(rootPath, "data", "products.json");


const getProductsFromFile = (in_cb) => {

    fs.readFile(myDataFilePath, (error, fileContent) => {
        fs.readFile(myDataFilePath, (error, fileContent) => {
            //if (error) {
                //in_cb([]);
            //}

            if (!error) {
                console.log("file content " + JSON.parse(fileContent));

                //*if no error my reading into products
                in_cb(JSON.parse(fileContent));
            }
        });
    });

};



//add property title
//add save method
//this in save refers to the object created based on the class
//static makes the method accessible from the class itself not the new instances

const products = [];

module.exports = class Product {
    constructor (title1) {
        this.title = title1;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
    
            fs.writeFile(myDataFilePath, JSON.stringify(products), (error) => {
                console.log(error);
            });
        });

    }

    static fetchAll(cb1) {

        getProductsFromFile(cb1);
    }

}