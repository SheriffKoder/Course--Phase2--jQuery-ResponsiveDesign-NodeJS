/* models/product.js */


//const fs = require("fs");
//const path = require("path");
//const rootPath = require("../util/path.js");
//const { error } = require("console");
//const myDataFilePath = path.join(rootPath, "data", "products.json");

const cartModel = require("./cart.js");

/*
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

*/
//const products = [];

const db = require("../util/database.js");



module.exports = class Product {
    constructor (id, title1, imageUrl1, price1, description1) {
        this.id = id;   //null for new product, existing product will be assigned here
        this.title = title1;
        this.imageUrl = imageUrl1;
        this.description = description1;
        this.price = price1;
    }

    save() {

        //edit or add product
        /*
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
        */

        //should reach out to the database and save the data there
        //fields should be like the order in the database
        //no need to specify the id because it will be specified automatically by the db engine
        //followed by values
        //values can be unsafe to specify directly
        //so will add "?" and then specify the values for db engine to handle that replacement 
        return db.execute("INSERT INTO products (title, price, description, imageUrl) VALUES (?,?,?,?)",
        [this.title, this.price, this.description, this.imageUrl ]
        );


    }

    //add new product list and also call the cartModel to delete from cart+price
    static deleteById (id) {
        /*
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
        */
    
    
    };

    

    //static fetchAll(cb1) {
            //getProductsFromFile(cb1);
    static fetchAll() {

        //should reach out to the database
        //need access to the database
        //import the pool object from the database js file
        
        //select just the id and title "SELECT id, title"
        //this returns a promise
        //can use then() and catch() here, but will use it in the place we will call fetchAll
        return db.execute("SELECT * FROM products");


    }

    //static findMyId(id, cb) {
    static findMyId(id) {

        /*
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
        */
        //using "?" make it secure to get/send values
        //selects the whole row of this id
        return db.execute("SELECT * FROM products WHERE products.id = ?", [id]);


    };





}