
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
        type: Object,
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