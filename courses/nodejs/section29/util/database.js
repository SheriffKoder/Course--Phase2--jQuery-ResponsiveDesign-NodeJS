const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

//edit the url to
//jgxkgch.mongodb.net/shop
//mongodb will create the database as soon we start writing data to it

//connecting and storing the connection to the database
const mongoConnect = (callback) => {
    //connect takes a url parameter (a)
    //the connect returns a promise
    MongoClient.connect("mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/shop?retryWrites=true&w=majority")
        .then((client) => {
            console.log("connected");
            //store access/connection to the db
            //can enter any name in a string in db and it overwrites the /shop in the url
            _db = client.db();
            callback();
        })
        .catch((err) => {
            console.log(err);
        });
}

//add another function instead of returning callback()
//return access to the connected database if it exists
//allows to interact with the database
const getDb = () => {
    if (_db) {
        return _db;
    }
    throw "no database found"
    
}

//mongoDb will manage multiple connections by connection-pooling
//by providing sufficient connections for multiple simultaneous connections with the database

//module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;