

//(24.0.4)
const {validationResult} = require("express-validator");

//(24.0.2)
exports.getPosts = (req, res, next) => {

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

};


//our response here will be a json response
//or a json response depending on the input

//we expect the client to interact with us with json data, as we return json data

//(24.0.3)
//POST controller to /feed/post
exports.createPost = (req, res, next) => {

    //expect to get a title from the incoming request
    const title = req.body.title;
    const content = req.body.content;

    //(24.0.4) validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: "Validation failed, entered data is incorrect",
            errors: errors.array()
        })
    }

    //create post in db

    //status 201 as we created a resource
    res.status(201).json({
        message: "Post created successfully!",
        //post data i want to parse from the incoming request
        //id should be created automatically by mongoDB
        //but we will create a dummy here as not used the db yet
        post: {
            _id: new Date().toISOString, 
            title: title,
            content: content,
            creator: {
                name: "max"
            },
            createdAt: new Date()
        }
    });

}
