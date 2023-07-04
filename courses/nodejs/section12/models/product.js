
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
    constructor(title, price, description, imageUrl, id, userId) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userId = userId; //(9)
        //allows to pass an id object to the comparison with _id instead of just a string
        //if there is no id, store it as null, otherwise new products wont be added

    }

    //here want to connect to mdb and save the product
    save() {
        //get access to the database by calling get db
        const db = getDb(); //database level
        let dbOp;

        //if there is an id to the product (exists) update
        //updateOne, updateMany
        //takes two arguments
        //what and how
        // $set (mdb) command
        //this (replaces all key fields) or can write an object {title = this.title, .. }

        //(6)
        if (this._id) {
            dbOp = db.collection("products").updateOne({_id: this._id}, { $set: this });
        }
        //else insert
        else {
            dbOp = db.collection("products").insertOne(this);
        }

        //collection level,specify - if not exist will be created the first time data entered
        //can execute a couple of mdb commands/operations
        //more about these in the official docs or mdb course
        // .insertOne(), .insertMany() product(s)
        //insertOne only takes the object(document) you want to insert
        //insertMany takes an array of js objects want to insert
        //a js object inserted will be converted by mdb
        //db.collection("products").insertOne({name: "A Book", price: 12.99});  
        //we want to insert this product
        //return this collection and the entire command chain
        //because returning will allow to use .then on the save() in other files
        //(3)
        //return db.collection("products").insertOne(this)
        return dbOp
            .then((result) => {
                //console.log("model result: ");
                //console.log(result);

            })
            .catch((err) => {
                console.log("save error" + err);
            })  

    }


    static fetchAll() { //(4)

        //get access to the database
        const db = getDb();

        //.find to find data using a filter with title "A Book" for example
        //if left empty will find all
        //find does not return a promise, but returns a cursor
        //an object provided by mongoDB allows us to go through our document step by step
        //take all documents and turn them into a js array
        //array is useful when talking about near a hundred documents
        //otherwise its better to implement pagination (will implement later in course)
        //after toArray can return a promise
        //return db.collection("products").find({title: "A Book"});
        return db.collection("products").find().toArray()
            .then((products) => {
                //console.log(products);
                return products;
            })
            .catch((err) => {
                console.log(err);
            })
    
    
    
    }


    static findById(prodId) { //(5)
        const db = getDb();
        //find will still give a cursor not a promise
        //even its one product - because mdb does not know its one

        //allows to pass an id object to the comparison with _id instead of just a string
        let newProdId = new mongodb.ObjectId(prodId);
        //console.log(newProdId);
        //.next() returns the next document , in our case the last document
        //returned by find
        //however if used findOne it will not return a cursor and can return without next
        return db.collection("products").find({_id: newProdId }).next()
        .then((product) => {
            //console.log(product);
            return product;
        })
        .catch((err) => {
            console.log(err);
        })
    

    }

    static deleteById(prodId) { //(7)
        const db = getDb();

        //can check more about methods on the official docs
        //we also have deleteOne, deleteMany
        //as id is an arguments, need to convert it manually
        let newProdId = new mongodb.ObjectId(prodId);

        return db.collection("products").deleteOne({ _id: newProdId })
            .then((result) => {
                console.log("Deleted");
            })
            .catch((err) => {
                console.log(err);
            })
    
    }



}


/*
//define a model that will be managed by sqlz
//arguments: modelName, structure of our model and the auto constructed db table
//in the structure we define the fields our product should have
//find more on defining the structure in the official docs/model-definition
const Product = sequelize.define("product", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    //can set the type directly without an object, however can use obj to add allowNull: false
    title: Sequelize.STRING,

    price: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },

    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false
    },

    description: {
        type: Sequelize.STRING,
        allowNull: false
    }

});
*/

//this is the product model, now we need to export it
module.exports = Product;

