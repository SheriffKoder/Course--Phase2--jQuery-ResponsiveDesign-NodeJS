/* models/product.js */


const fs = require("fs");
const path = require("path");
const rootPath = require("../util/path.js");
const { error } = require("console");

const products = [];

//add property title
//add save method
//this in save refers to the object created based on the class
//static makes the method accessible from the class itself not the new instances

module.exports = class Product {
    constructor (title1) {
        this.title = title1;
    }

    save() {
        //products.push(this);  //push new instances to the products array to iterate on
        const myDataFilePath = path.join(rootPath, "data", "products.json");

        //reads the entire file content of a file
        //for big files, more memory efficient ways, using fs.createReadStream
        ////p is the file interested in, 
        //then will do something once reading it in
        //there we either get error or the data (fileContent)
        //if no error then i want to read the products from the file we extracted
        //transform the json to js code using parse
        //so my product will be an empty array or what is read from file
        //arrow function is useful here to allow "this" to have the context of this class
        fs.readFile(myDataFilePath, (error, fileContent) => {
            //console.log(fileContent);

            let products = [];

            if (!error) {
                products = JSON.parse(fileContent);
            }

            products.push(this);
            //products into json and written to the file
            //also use callback to log if got an error
            fs.writeFile(myDataFilePath, JSON.stringify(products), (error) => {
                console.log(error);
            });

        });

    }

    static fetchAll() {
        
        //return empty array if no products
        const myDataFilePath = path.join(rootPath, "data", "products.json");

        fs.readFile(myDataFilePath, (error, fileContent) => {
            if (error) {
                return [];
            }
            return JSON.parse(fileContent);
        })

        //return products;
    }

}