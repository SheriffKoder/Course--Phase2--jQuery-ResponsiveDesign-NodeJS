/* models/product.js */


const fs = require("fs");
const path = require("path");
const rootPath = require("../util/path.js");
//const { error } = require("console");
const myDataFilePath = path.join(rootPath, "data", "products.json");

const cartModel = require("./cart.js");

const getProductsFromFile = (in_cb) => {

        fs.readFile(myDataFilePath, (error, fileContent) => {
            //if (error) {
                //in_cb([]);
            //}

            if (!error) {
                //console.log("file content " + JSON.parse(fileContent));

                //*if no error my reading into products
                in_cb(JSON.parse(fileContent));
            }
        });

};

let cb2 = (products) => {
        products.push(this);

        fs.writeFile(myDataFilePath, JSON.stringify(products), (error) => {
            console.log(error);
        });
}


const products = [];

//add property title
//add save method
//this in save refers to the object created based on the class
//static makes the method accessible from the class itself not the new instances

module.exports = class Product {
    constructor (id, title1, imageUrl1, price1, description1) {
        this.id = id;   //null for new product, existing product will be assigned here
        this.title = title1;
        this.imageUrl = imageUrl1;
        this.description = description1;
        this.price = price1;
    }

    save() {

        
        //getProductsFromFile(cb2);
        //edit or add product
        getProductsFromFile((products) => {
            //if id, update the existing one
            if (this.id) {
                const existingProductIndex = products.findIndex(prod => prod.id === this.id);
                const updatedProducts = [...products];
                //replace it in the array which is stored in the file with the newly created product i am in
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(myDataFilePath, JSON.stringify(updatedProducts), (error) => {
                    console.log(error);
                });
    
            } else {
                //if no id yet, then proceed with this
                
                //from 1-10
                this.id = Math.floor(Math.random()*11).toString();
                //products.push(this);  //push new instances to the products array to iterate on

                products.push(this);
        
                fs.writeFile(myDataFilePath, JSON.stringify(products), (error) => {
                    console.log(error);
                });
            }
        });

    }

        //add new product list and also call the cartModel to delete from cart+price
        static deleteById (id) {
            getProductsFromFile((products) => {

                const product = products.find(prod => prod.id === id);

                //filter takes a function and returns a new array of
                //the elements that match the criteria my function returns
                const updatedProducts = products.filter(prod => prod.id !== id);    //default js
    
                fs.writeFile(myDataFilePath, JSON.stringify(updatedProducts), (error) => {
                    console.log(error);
                    if (!error) {
                        cartModel.deleteProduct(id, product.price);
                    }
                });

            });
        };

    

        /*
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

            //*if no error my reading into products
            if (!error) {
                products = JSON.parse(fileContent);
            }

            //*write filecontent + this

            products.push(this);
            //products into json and written to the file
            //also use callback to log if got an error
            fs.writeFile(myDataFilePath, JSON.stringify(products), (error) => {
                console.log(error);
            });

        });
        */

    

    static fetchAll(cb1) {
        
        //return empty array if no products
        //the readFile callback here is async, it is registered but not used when fetchAll is called
        //thus content is undefined, and we get a length error
        //so will call the render from contr/product.js once fetchAll is done reading
        //just like the readFile which takes our function as a callBack
        //however had to make at least one input in JSON and ignore it in .ejs html as [] do no work
        //gives unexpected end of json input
        //also can give a starting json an empty array
        /*
        const myDataFilePath = path.join(rootPath, "data", "products.json");

        fs.readFile(myDataFilePath, (error, fileContent) => {
            if (error) {
                //cb([]);
            }

            if (!error) {
                //*if no error my reading into products
                cb(JSON.parse(fileContent));
            }
        });
        */

        getProductsFromFile(cb1);


        //return products;
    }


    static findMyId(id, cb) {

        //returns a parsed object of the products
        //will filter the id interested in
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id);    //default js
            //ex a function on every element in the array
            //return an element if the function we pass returns true
            //p is the product it is currently looking at
            //check the id of the product looking at is equal to the id passed to this method
            //if true then the product will be stored in the constant
            //then ex a callback with this product
            cb(product);

        });


    };





}