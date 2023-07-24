
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    imageUrl: {
        //a url pointing at the file
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    //will later be a link to a user
    creator: {
        //(25.3.0)
        //as we now have users signed up, we can use type Schema
        //because will store a reference to the user
        type: Schema.Types.ObjectId,
        ref: "User", //(25.3.0)
        required: true

    }
    //2nd argument to Schema, options
}, {
    //mongoose will auto add timestamps 
    //when a new version is added to the db
    //createdAt, updatedAt timestamps
    timestamps: true,
});

//we export a model based on the schema (db_name, schema)
module.exports = mongoose.model("Post", PostSchema);