
//(8)
const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;


class User {
    constructor(username, email) {
        this.name = username;
        this.email = email;
    }

    save() {
        const db = getDb(); //database level

        //let newUserId = new mongodb.ObjectId(this._id);

        return db.collection("users").insertOne(this);
        

    }



    //////////////////////////////////////////////
    static findById(userId) {

        const db = getDb();
        let newUserId = new mongodb.ObjectId(userId);

        return db.collection("users").find({_id: newUserId }).next()

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

