const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//(25.2.5)
const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        //a url pointing at the file
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    //this is what caused the error on the FE all the time
    //because we could not load it
    status: {
        type: String,
        //every user will start with this status
        default: "I am new"
    },
    //array with each object in that array
    //will be of type schema, types, objectId
    //as it will be a reference to a post
    //restore references to posts for the users
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
    //2nd argument to Schema, options
}, {
    //mongoose will auto add timestamps 
    //when a new version is added to the db
    //createdAt, updatedAt timestamps
    //timestamps: true,
});

//we export a model based on the schema (db_name, schema)
module.exports = mongoose.model("User", userSchema);