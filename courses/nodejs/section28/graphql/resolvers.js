
//you need a method for every query you define in your schema
//and the name has to match
//(28.0.2)
/*
module.exports = {
    hello() {
        return {
            text: "Hello World!",
            views: 1245
        }
    }
}
*/


//(28.0.3)
//import the mongoose user model
//as we will still interact with the database
const User = require("../models/user");
const bcrypt = require("bcryptjs");

const validator = require("validator"); //(28.0.5)

const jwt = require("jsonwebtoken");     //(28.1.1) 

const Post = require("../models/post"); //(28.1.2) 



//the inputs will be the user input data
//args object, request
//using the args which is the args of the schema UserInputData
//can retrieve email, name, password
//args will have a userInput field which will have these properties
/*
module.exports = {
    createUser(args, req) {
        const email = args.userInput.email;
    }
}
*/

//can also use destructuring to get userInput out of the args object

//need to use the async/await syntax
//to do that need to change the way this method is written

//find in the database User with email

//if will use fineOne without async/await, then have to 
//return it and put .then/.catch
//if you do not return the promise in the resolver
//graphQL will not wait for it to resolve
//when using async await, it automatically gets returned for you

module.exports = {
    createUser : async function ({userInput}, req) {

        ////////////////////////////////////////////////////
        //(28.0.5) validation, checking on validity of inputs
        const errors = [];
        if (!validator.isEmail(userInput.email)) {
            errors.push({message: "E-Mail is invalid"});
        }

        //if password is empty or not long enough
        if (validator.isEmpty(userInput.password) || 
        !validator.isLength(userInput.password, {min: 5})) {

            errors.push({message: "Password too short!"});
        }
        
        if (errors.length > 0) {
           const error = new Error("invalid input");
            error.data = errors; //(28.0.6)
            //on the error get created here
            //can add a data field, which is my array of errors
            error.code = 422;
            //add a code, or come up with own coding system not limited to http

           throw error; 
        }
        ////////////////////////////////////////////////////


        //const email = userInput.email;
        const existingUser = await User.findOne({
            email: userInput.email
        })

        if (existingUser) {
            const error = new Error("User exists already");
            throw error;
        }

        //if email not exist, store user in the db
        const hashedPw = await bcrypt.hash(userInput.password, 12);
        const user = new User({
            email: userInput.email,
            name: userInput.name,
            password: hashedPw
        })

        const createdUser = await user.save();

        //return some data as defined in the schema
        return {
            //contains just the user data, 
            //without all the meta data mongoose would add otherwise
            ...createdUser._doc,
            //overwrite the mongoose id field
            //by pulling as a separate property and pulling out of
            //the _doc, because need to convert it from
            //an object id field to a string field
            _id: createdUser._id.toString()

        }
    },
    //(28.1.1) 
    // de-construct from args
    //email and password as defined in the RootQuery in schema
    login: async function({email, password}) {

        //find the user with the correct email address
        //then confirm the password
        const user = await User.findOne({email: email});
        if (!user) {
            const error = new Error("User not found.");
            error.code = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error("Password is incorrect");
            throw error;
        }

        //email exists, password is correct
        //the data want to encode in the token, key, expiry
        const token = jwt.sign({
            userId: user._id.toString(),
            email: user.email
        }, "secret", {expiresIn: "1h"});

        //return token: as defined in the schema
        return {token: token, userId: user._id.toString()};
    },

    //(28.1.2) 
    //postInput which is defined in the schema,
    //will need req later to get the user data 
    createPost: async function ({postInput}, req) {

        //(28.1.3)
        //user not authenticated, not want to grant access
        //to creating a post
        if (!req.isAuth) {
            const error = new Error("Not authenticated");
            error.code = 401;
            throw error;
        }
        //if the user is authenticated, we can continue


        ////////////////////////////////////////////////////
        //title validation
        const errors = [];
        if (validator.isEmpty(postInput.title) ||
        !validator.isLength(postInput.title, {min: 5})) {

            errors.push({message: "Title is invalid"});
            
        }

        //content validation
        if (validator.isEmpty(postInput.content) ||
        !validator.isLength(postInput.content, {min: 5})) {

            errors.push({message: "Content is invalid"});
            
        }

        //
        if (errors.length > 0) {
            const error = new Error("invalid input");
             error.data = errors; //(28.0.6)
             //on the error get created here
             //can add a data field, which is my array of errors
             error.code = 422;
             //add a code, or come up with own coding system not limited to http
 
            throw error; 
        }
        ////////////////////////////////////////////////////

        //(28.1.3)
        //get a user
        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error("Invalid user");
            error.code = 401;
            throw error;
        }





        //input is valid, can create a new post

        const post = new Post({
            title: postInput.title,
            content: postInput.content,
            imageUrl: postInput.imageUrl,
            creator: user         //(28.1.3)
        });

        const createdPost = await post.save();
        user.posts.push(createdPost);         //(28.1.3)

        //add post to user's post

        //getting all the data from the created post doc
        //overwrite the id, cant return the mongoDB object id
        //need to return a string
        //overwrite createdAt, updatedAt
        //because these will be stored as data types
        //graphql does not understand that, so need to convert to a string
        return {
            ...createdPost._doc, 
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString,
            updatedAt: createdPost.updatedAt.toISOString,

        
        
        }




    } 

}
