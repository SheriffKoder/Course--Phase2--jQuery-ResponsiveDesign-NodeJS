/* models/product.js */


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
        products.push(this);
    }

    static fetchAll() {
        return products;
    }

}