//(24.0.2)
const express = require("express");
const router = express.Router();

//check(headers/query params etc) or body
const {body} = require("express-validator"); //(25.0.4) 

//(24.0.2)
const feedController = require("../controllers/feed");

//(25.2.9)
const isAuth = require("../middleware/isAuth");


//(24.0.2)
//route where we will serve the posts later on
//  "/feed/posts" would be handled (/feed as stated in app.use in app.js)
//as long as it is a GET request and then will be handled by the controller
router.get("/posts", isAuth ,feedController.getPosts);

//(24.0.3)
// POST request to /feed/post
router.post("/post", isAuth, [
    body("title") //(24.0.4) adding validation
    .trim()
    .isLength({min:5}),
    body("content")
    .trim()
    .isLength({min:5})

], feedController.createPost);


//(25.1.0)
//fetch a single post
router.get("/post/:postId", isAuth, feedController.getPost);

//(25.2.1)
//with normal browser forms will not be able to send a PUT request
//but can send put requests with async requests triggered by js
//PUT/PATCH both have a request body like POST requests
router.put("/post/:postId", isAuth, [
    body("title") //(24.0.4) adding validation
    .trim()
    .isLength({min:5}),
    body("content")
    .trim()
    .isLength({min:5})

] ,feedController.updatePost);



//(25.2.3)
//delete cant send body but can as all routes send params
router.delete("/post/:postId", isAuth, feedController.deletePost)








//(24.0.2)
module.exports = router;