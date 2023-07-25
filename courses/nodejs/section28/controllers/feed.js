
//(25.2.2)
const fs = require("fs");
const path = require("path");

//(24.0.4)
const {validationResult} = require("express-validator");

//(25.0.6)
const Post = require("../models/post");

//(25.3.0)
const User = require("../models/user");

//(27.0.4)
const io = require("../socket");



//(24.0.2)
//get all posts
//(26.0.1) using async/await
//can write code as if it runs sync
exports.getPosts = async (req, res, next) => {

    //(25.2.4)
    const currentPage = req.query.page || 1;
    const perPage = 2;  //we have the same value in the front-end
                        //option: can send this value to the FE to adjust

    //how many items are in the database
    //(25.2.4)
    /////////////////////////////
    ////async/await //(26.0.1)
    try {
        const totalItems = await Post.find().countDocuments()
        //.then((count) => {
            //totalItems = count;
            //(25.1.1)
            //return Post.find()
            //Post.find()
        const posts = await Post.find()
            //(27.0.5)
            .populate("creator") //not just fetch the creator id but the full object for that creator
            
            //(27.0.7)
            //making latest posts appear first
            //sort fetched posts by createdAt in a descending
            .sort({createdAt: -1})

            .skip((currentPage - 1) * perPage)
            .limit(perPage);
        //})
        //.then((posts) => {
            //(25.2.4)
            //in the FE we have some logic to take the total amount of posts into account
            //so in the react front-end, we know when to show next/prev buttons
            //the FE needs for that the totalItems property
            res.status(200).json({
                message: "fetched posts successfully", 
                posts: posts, 
                totalItems: totalItems
            });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        //(26.0.1) still have to use next as we used it before
        //because behind the scenes it still gets converted to then as used before
        next(err);  //async error handling         //(25.0.8)
    }
    //})
	// .catch((err) => {
	// })


    /*                 
    //how many items are in the database
    let totalItems;
    //(25.2.4)
    Post.find().countDocuments()
	.then((count) => {
        totalItems = count;
        //(25.1.1)
        return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
        //(25.2.4)
        //in the FE we have some logic to take the total amount of posts into account
        //so in the react front-end, we know when to show next/prev buttons
        //the FE needs for that the totalItems property
        res.status(200).json({message: "fetched posts successfully", posts: posts, totalItems: totalItems});
    })
	.catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	})
    */
    
    //(25.1.1)
    //-(25.2.4) moved to the countDocuments, where it is returned
    //its then chained
    //and the catch already there will catch its errors
    /*
    Post.find()
	.then((posts) => {
        res.status(200).json({message: "fetched posts successfully", posts: posts});
    })
	.catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	})
    */


    //json is a method provided by express js
    //to return a response with json data
    //with the right headers being set
    //we can pass a js object and will be transformed to a json
    //and sent back to the client who sent the request
    //with sending json response we send the status code, 200 is the default
    //because the client will render the user interface based on the response
    //especially error codes are important to pass back to the client
    //the user will decide what to render based on the status code received
    //(24.0.3)
    //-(25.1.1)
    /*
    res.status(200).json({
        posts: 
        [
            {
                //(25.0.2) 
                _id: "001",
                title: "first post",
                content: "this is the first post",
                imageUrl: "images/image.png",
                creator: {
                    name: "Max"
                },
                createdAt: new Date()
            }
        ]
    });
    */

};


//our response here will be a json response
//or a json response depending on the input

//we expect the client to interact with us with json data, as we return json data

//(24.0.3)
//POST controller to /feed/post
exports.createPost = async (req, res, next) => {

    //expect to get a title from the incoming request

    //(24.0.4) validation
    //validationResult passed from the router
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //(25.0.8)
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422; //custom property, custom name
        throw error;

        /*
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect",
            errors: errors.array()
        })
        */
    }

    //(25.2.0) if multer is not able to extract the file
    if (!req.file) {
        const error = new Error("no image provided");
        //as it is a kind of a validation error
        error.statusCode = 422;
        throw error;

    }


    //the path is generated by multer as it was stored on the server
    const imageUrl = req.file.path //(25.2.0)
    const title = req.body.title;
    const content = req.body.content;

    //(25.3.0)
    //let creator;





    //(25.0.6)
    //we do not need to set createdAt
    //as mongoose will do that using the timestamp in the model
    //and _id will be created automatically as well
    const post = new Post({
        title: title,
        content: content,
        //imageUrl: "images/image.png", //-(25.2.0)
        imageUrl: imageUrl,             //(25.2.0)
        //creator: {name: "max"}        //-(25.3.0)
        //the user id is already received from the isAuth middleware
        //that would be a string not an object id, but mongoose will convert it
        creator: req.userId             //(25.3.0)

    });
    
    try {

    await post.save()
    //.then((result) => {
		//console.log(post_save_result);

        //(25.3.0)
    const user = await User.findById(req.userId);
    //})
    //.then((user) => {

        //(25.3.0)
        //now i have the user found, the currently logged in user
        //take the user object which is a mongoose model
        //access the posts of that user
        //mongoose will pull out the userId and add the post to the user
        //creator = found_user;
        user.posts.push(post);
        await user.save();
    //})

        //(27.0.4)
        //get the socket.io here
        //can call io methods
        //.emit will send a message to all connected users
        //emit("event name", {data-want to send})
        //you can send any data you want, do not have to have action key
        io.getIO().emit("posts", {
            action: "create",
            //all the data about the post
            //set the creator = to an object where we have
            //(27.0.5)
            post: {...post._doc, creator: {_id: req.userId, name: user.name}}
        });


    //.then((result) => {
        res.status(201).json({
            message: "Post created successfully!",
            //post: push_save_result, 
            post: post,         //(25.3.0)
            //removed creator lines, so will use the user
            creator: {_id: user._id, name: user.name}
        })
    //})

    } catch (err) {
	//.catch((err) => {
		//console.log(err);         //-(25.0.8)
        //(25.0.8)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	//})
    }


    //create post in db
    //-(25.0.6)
    //status 201 as we created a resource
    /*
    res.status(201).json({
        message: "Post created successfully!",
        //post data i want to parse from the incoming request
        //id should be created automatically by mongoDB
        //but we will create a dummy here as not used the db yet
        post: {
            _id: new Date().toISOString, 
            title: title,
            content: content,  //-(25.0.6)
            creator: {
                name: "max"
            },
            createdAt: new Date()
            
        }
    });
    */

}


//(25.1.0)
exports.getPost = async (req, res, next) => {
    const postId = req.params.postId;
    //find a post with that id in the database
    try {
    const post = await Post.findById(postId);
    //.then((post) => {
        if (!post) {
            const error = new Error("Could not find post");
            //if you throw an error inside a then block
            //the next catch block will be reached
            //and the error will be passed as an error to the catch block
            error.statusCode = 404;
            throw error;
        }

        //if we find the post
        //will return a response with a status,
        res.status(200).json({message: "Post fetched", post: post}); 

    //})
    } catch (err) { 
	//.catch((err) => {
        //(25.0.8)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	//})
    }

}


//(25.2.1)
// PUT to /feed/post
exports.updatePost = async (req, res, next) => {
    const postId = req.params.postId;

    //(24.0.4) validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

        //(25.0.8)
        const error = new Error("Validation failed, entered data is incorrect");
        error.statusCode = 422; //custom property, custom name
        throw error;

        /*
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect",
            errors: errors.array()
        })
        */
    }

    const title = req.body.title;
    const content = req.body.content;    

    //for the image url we have two options
    //1. it can be part of the request body 
    //that is the case if no new file was added
    //the frontend code has the logic to take the existing url and keep it
    let imageUrl = req.body.image;
    //2. you might have picked a file
    if (req.file) {
        imageUrl = req.file.path;
    }

    //not extracted, 
    //wont get to this code as the FE validation requires an image
    if (!imageUrl) {
        const error = new Error("No file picked");
        error.statusCode = 422;
        throw error;
    }


    //here i can know i have valid data
    //and now can update it in the database
    try {
    //(27.0.6)
    //when find the post and populate it with creator data
    const post = await Post.findById(postId).populate("creator")
    //.then((post) => {
        if (!post) {
            const error = new Error("Could not find post");
            //if you throw an error inside a then block
            //the next catch block will be reached
            //and the error will be passed as an error to the catch block
            error.statusCode = 404;
            throw error;
        }

        //(25.3.1)
        //check if the creator id is the id of the currently logged in user
        //id belongs to the token we received
        //if (post.creator.toString() !== req.userId) {
        //(27.0.6) as we populated the creator with data
        if (post.creator._id.toString() !== req.userId) {

            const error = new Error ("Not authorized");
            error.statusCode = 403;
            throw error;
        }



        //(25.2.2)
        if (imageUrl !== post.imageUrl) {
            clearImage(post.imageUrl);
        }



        //found a post
        post.title = title;
        post.imageUrl = imageUrl;
        post.content = content;
        //overwriting the old post but keeping the old id
        //return post.save();
        const result = await post.save();

        //(27.0.6)
        io.getIO().emit("posts", {
            action: "update",
            post: result
        })


    //})
    //.then(result => {
        //we did not create a new resource so it is not 201
        res.status(200).json({
            message: "Post updated",
            post: result
        });
    //})
    } catch (err) {
	//.catch((err) => {
        //(25.0.8)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	//})
    }
}



//(25.2.3)
exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;

    //can use findByIdAndRemove
    //but we later would need to verify if a user
    //created this post before we delete it
    try {
    const post = await Post.findById(postId)
    //.then((post) => {
        //Check logged in user

        //check wether this post exists
        if (!post) {    //repeated
            const error = new Error("Could not find post");
            //if you throw an error inside a then block
            //the next catch block will be reached
            //and the error will be passed as an error to the catch block
            error.statusCode = 404;
            throw error;
        }

        //(25.3.1)
        //check if the creator id is the id of the currently logged in user
        //id belongs to the token we received
        if (post.creator.toString() !== req.userId) {
            const error = new Error ("Not authorized");
            error.statusCode = 403;
            throw error;
        }



        clearImage(post.imageUrl);
        //return Post.findByIdAndRemove(postId);
        await Post.findByIdAndRemove(postId);

    //})
    //(25.3.2)
    //.then((result) => {
        //return User.findById(req.userId)
        const user = await User.findById(req.userId)

    //})
    //.then((user) => {
        //(25.3.2)
        //pass the id of the post want to remove
        user.posts.pull(postId);
        //return user.save();
        const result = await user.save();
    //})

        //(27.0.8)
        io.getIO().emit("posts", {
            action: "delete",
            post: postId
        });

    //.then((result) => {
        console.log(result);
        res.status(200).json({  //repeated
            message: "Deleted post",
        });
    //})
    } catch (err) {
	//.catch((err) => {
        //(25.0.8)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	//})
    }


}






//(25.2.2)
//want to trigger the clearImage function
//whenever uploaded a new image
const clearImage = (filePath) => {
   
    //up one folder as we are in the controllers folder now
    filePath = path.join(__dirname, "..", filePath)
    //unlink removes the file
    fs.unlink(filePath, err => console.log(err));

}