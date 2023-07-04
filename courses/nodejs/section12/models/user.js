
//(8)
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;


class User {
    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart;   // {items: [, , ]} //(10)
        this._id = id;   //(10)
    }

    save() {
        const db = getDb(); //database level

        //let newUserId = new mongodb.ObjectId(this._id);

        return db.collection("users").insertOne(this);
        

    }

    //(10)
    //we will receive from postCart the prodId (product)
    //so expected to get a product here which we can add

    //(11)
    //however do not want to update by always overwriting items with a new array
    //with exactly one object
    //instead want to add a new object to the array if the product does not exist in there
    //or if it does exist in there, i want to update that one product

    addToCart(product) {
        //check if the product is already in the cart
        //if just want to increase the quantity
        //or if it is not there and want to add it for the first time

        //find the product in the cart (as we stored only its id)
        //(11)
        const cartProductIndex = this.cart.items.findIndex(cp => {
            //the _id here is not a string but treated as a string
            //so either convert toString or use == not ===
            //on both sides to make sure we only work with strings
            return cp.productId.toString() === product._id.toString();
         })
         let newQuantity = 1;
         const updatedCartItems = [...this.cart.items];

        //increase the quantity
        //find index returns -1 on true
        //if the product exist
         if (cartProductIndex >=0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
         } else {
            //if the product not exist
            let newProductId = new mongodb.ObjectId(product._id);
            updatedCartItems.push({productId: newProductId, quantity: newQuantity});
         }


        //add item to the cart - update user to add a product to the cart
        //pull out all properties of product and add to it quantity 1
        //we will store only the product id not the whole product data
        //const updatedCart = {items: [{...product, quantity: 1}]};

        //const updatedCart = {items: [{productId: newProductId, quantity: newQuantity}]};  //(10)
        
        const updatedCart = {
            items: updatedCartItems
        };
        
        
        const db = getDb();
        let newUserId = new mongodb.ObjectId(this._id);

        //over write the old cart with the new cart
        return db.collection("users").updateOne({ _id: newUserId }, { $set: {cart: updatedCart} });


    }

    //////////////////////////////////////////////
    static findById(userId) {

        const db = getDb();
        let newUserId = new mongodb.ObjectId(userId);

        return db.collection("users").findOne({_id: newUserId });    

    }




}



/*
const Sequelize = require("sequelize");

const sequelize = require("../util/database");


const User = sequelize.define("user", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: Sequelize.STRING,

    email: Sequelize.STRING

});
*/

module.exports = User;

