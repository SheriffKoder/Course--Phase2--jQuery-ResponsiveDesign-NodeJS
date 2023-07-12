
//(8)
const mongoose = require("mongoose");

//allows to create new schemas
const Schema = mongoose.Schema;
//pass in a js object and define how the product should look like
//keys and type
//we still have to tell mongoose how our product should look like
//however we still have the flexibility to deviate from that and not use all keys
//or can use the required key and give up this flexibility
//no need to put _id as it will be added automatically as an object it
//user id will be added later
//Schema/blueprint define
const userSchema = new Schema({
    /*
    name: {
        type: String,
        required: true
    },
    */
    email: {
        type: String,
        required: true
    }, //(3.2)
    //(4.1)
    resetToken: String,
    resetTokenExpiration: Date,
    password: {
        type: String,
        required: true
    },
    //a cart with the items as an embedded document
    //define as an array by using []
    //[String] and array of strings, numbers, boolean
    //an array of documents [{}]
    //an array of documents with documents inside [{productId: {}}]
    //objectId because it will store a reference to a product
    //(8)
    //(9) refer to the product model
    //will store products that refers to some id and that id refers to a product stored
    //however embedded documents like cart may not need references
    cart: { 
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true }, 
                quantity: { type: Number, required: true}
            }
        ]
    }
});


//(15)
userSchema.methods.clearCart = function (product) {
    this.cart = {items: []};
    return this.save();
}

//(13)
userSchema.methods.removeFromCart = function (productId) {
       const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
       });
       this.cart.items = updatedCartItems;
       return this.save();

}

//(11) 
//add a custom method the userSchema
//use the function () to be able to use "this"
userSchema.methods.addToCart = function (product) {
    
        //check if the product is already in the cart
        //if just want to increase the quantity
        //or if it is not there and want to add it for the first time

        //find the product in the cart (as we stored only its id)
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
            // new mongoDB is not needed in mongoose, can just store product._id
            //let newProductId = new mongodb.ObjectId(product._id); //(11)
            updatedCartItems.push({productId: product._id , quantity: newQuantity});
         }


        //add item to the cart - update user to add a product to the cart
        //pull out all properties of product and add to it quantity 1
        //we will store only the product id not the whole product data
        //const updatedCart = {items: [{...product, quantity: 1}]};

        //const updatedCart = {items: [{productId: newProductId, quantity: newQuantity}]};  //(10)
        
        const updatedCart = {
            items: updatedCartItems
        };
        
        
        //const db = getDb();
        //let newUserId = new mongodb.ObjectId(this._id);

        //over write the old cart with the new cart
        //updateOne where, how
        //return db.collection("users").updateOne({ _id: newUserId }, { $set: {cart: updatedCart} });

        //(11)
        //in mongoose no need to call the database
        //and can update using .save()
        //the object saves itself
        this.cart = updatedCart;
        return this.save();
}


//mongoose will take the "User" turns into plural lower-case for the collection name
module.exports = mongoose.model("User", userSchema);


// //(8)
// const mongodb = require("mongodb");


// class User {
//     constructor(username, email, cart, id) {
//         this.name = username;
//         this.email = email;
//         this.cart = cart;   // {items: [, , ]} //(10)
//         this._id = id;   //(10)
//     }

//     save() {
//         const db = getDb(); //database level

//         //let newUserId = new mongodb.ObjectId(this._id);

//         return db.collection("users").insertOne(this);
        

//     }

//     //(10)
//     //we will receive from postCart the prodId (product)
//     //so expected to get a product here which we can add

//     //(11)
//     //however do not want to update by always overwriting items with a new array
//     //with exactly one object
//     //instead want to add a new object to the array if the product does not exist in there
//     //or if it does exist in there, i want to update that one product

//     addToCart(product) {
//         //check if the product is already in the cart
//         //if just want to increase the quantity
//         //or if it is not there and want to add it for the first time

//         //find the product in the cart (as we stored only its id)
//         //(11)
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             //the _id here is not a string but treated as a string
//             //so either convert toString or use == not ===
//             //on both sides to make sure we only work with strings
//             return cp.productId.toString() === product._id.toString();
//          })
//          let newQuantity = 1;
//          const updatedCartItems = [...this.cart.items];

//         //increase the quantity
//         //find index returns -1 on true
//         //if the product exist
//          if (cartProductIndex >=0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             updatedCartItems[cartProductIndex].quantity = newQuantity;
//          } else {
//             //if the product not exist
//             let newProductId = new mongodb.ObjectId(product._id);
//             updatedCartItems.push({productId: newProductId, quantity: newQuantity});
//          }


//         //add item to the cart - update user to add a product to the cart
//         //pull out all properties of product and add to it quantity 1
//         //we will store only the product id not the whole product data
//         //const updatedCart = {items: [{...product, quantity: 1}]};

//         //const updatedCart = {items: [{productId: newProductId, quantity: newQuantity}]};  //(10)
        
//         const updatedCart = {
//             items: updatedCartItems
//         };
        
        
//         const db = getDb();
//         let newUserId = new mongodb.ObjectId(this._id);

//         //over write the old cart with the new cart
//         //updateOne where, how
//         return db.collection("users").updateOne({ _id: newUserId }, { $set: {cart: updatedCart} });


//     }

//     //////////////////////////////////////////////
//     //this function is useful because when the cart is fetched
//     //we can have the product items as in the product class and same updated
//     getCart() {
//         //we can use this to return the users cart
//         //however we also need to return the full details of the product not just the id
//         //return this.cart;

//         const db = getDb();
//         //find all products that are in the cart
//         //return the result of the db operation
//         //find all products that are in my cart
//         //find all products where _id equals
//         //will not pass an id because not looking for a single id
//         //an object of special mdb query operators
//         // $in operator, takes an array of id's
//         //every id in the array will get back a cursor
//         //with all products mentioned with the id's in the array
//         //mapping an array of items where each item is a js object
//         //into an array of just strings of just the productId's
//         //then stored in the productIds constant

//         const productIds = this.cart.items.map(i => {
//             return i.productId
//         })
//         //give me all elements where the id is one of the id's mentioned in this array
//         return db.collection("products").find({ _id: {$in: productIds} }).toArray()
//             .then(products => {
//                 console.log(products);
//                 //need to return the products found + the quantity we know
//                 //arrow functions ensure that "this" still refers to the user class
//                 //return each product with its respective quantity in an object
//                 //cat items find(js) returns the product object
//                 //then we can access its property
//                 return products.map(p => {
//                     return {...p, quantity: this.cart.items.find(i => {
//                         return i.productId.toString() === p._id.toString();
//                             }).quantity
//                     };
//                 })
//             });
//     }


//     //returns a new cart items without the product with the id passed it
//     deleteItemFromCart(productId) {
//         //copy all existing cart items
//        //const updatedCartItems = [...this.cart.items];

//         //filter by js allows to define a criteria  
//         //about how we want to filter the elements in that array (items)
//         //then it will return an array with all the items that make it through the filter

//         //return true if want to keep the item in the array
//         //or false if want to get rid of it
//         //want to keep all items except for the item i am deleting

//        const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//        })

               
//        const db = getDb();
//        let newUserId = new mongodb.ObjectId(this._id);

//        //over write the old cart.items with the new cart.items
//        //updateOne where, how
//        return db.collection("users").updateOne(
//             { _id: newUserId }, 
//             { $set: {cart: {items: updatedCartItems}} }
//         );

//     }

//     //////////////////////////////////////////////
//     addOrder() {
//         //can have a separate order collection
//         //order details is already in this user's cart
//         //but will use the orders as a method on the user

//         const db = getDb();

//         //items with the product information and the quantity and user data
//         //create a new collection
//         //insert the cart the user have
//         //return on this.getCart allows in the controller to call then
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     item: products,
//                     user: {
//                         _id: new mongodb.ObjectId(this._id),
//                         name: this.name,
//                     }
//                 };
//                 return db.collection("orders").insertOne(order);

//             })
//             //then empty the cart
//             .then(result => {
//                 //empty the cart
//                 this.cart = {items: []};

//                 //also clear the cart in the database
//                 let newUserId = new mongodb.ObjectId(this._id);
//                 //over write the old cart.items with an empty array
//                 //updateOne where, how
//                 return db.collection("users").updateOne(
//                     { _id: newUserId }, 
//                     { $set: {cart: {items: []}} }
//                 );
//             })

//     }



//     //(14)
//     //////////////////////////////////////////////
//     getOrders() {
//         const db = getDb();
//         let newUserId = new mongodb.ObjectId(this._id);

//         //find all orders for that user
//         //compare the user._id to this._id
//         //as the orders can be more than one, can use the toArray to put into an array
//         return db.collection("orders").find({"user._id": newUserId}).toArray();

//     }







//     //////////////////////////////////////////////
//     static findById(userId) {

//         const db = getDb();
//         let newUserId = new mongodb.ObjectId(userId);

//         return db.collection("users").findOne({_id: newUserId });    

//     }




// }



// /*
// const Sequelize = require("sequelize");

// const sequelize = require("../util/database");


// const User = sequelize.define("user", {
//     id: {
//         type: Sequelize.INTEGER,
//         autoIncrement: true,
//         allowNull: false,
//         primaryKey: true
//     },
//     name: Sequelize.STRING,

//     email: Sequelize.STRING

// });
// */

// module.exports = User;

