

//(24.0.4)
const {validationResult} = require("express-validator");

//(25.0.6)
const Post = require("../models/post");


//(24.0.2)
exports.getPosts = (req, res, next) => {

    //(25.1.1)
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
exports.createPost = (req, res, next) => {

    //expect to get a title from the incoming request

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

    //(25.0.6)
    //we do not need to set createdAt
    //as mongoose will do that using the timestamp in the model
    //and _id will be created automatically as well
    const post = new Post({
        title: title,
        content: content,
        imageUrl: "images/image.png",
        creator: {name: "max"}
    });
    
    post.save()
    .then((result) => {
		console.log(result);
        res.status(201).json({
            message: "Post created successfully!",
            post: result
	    })
    })
	.catch((err) => {
		//console.log(err);         //-(25.0.8)
        //(25.0.8)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	})


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
exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    //find a post with that id in the database
    Post.findById(postId)
    .then((post) => {
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

    })
	.catch((err) => {
        //(25.0.8)
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	})

}
