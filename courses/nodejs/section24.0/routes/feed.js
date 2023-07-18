//(24.0.2)
const express = require("express");
const router = express.Router();

//(24.0.2)
const feedController = require("../controllers/feed");


//(24.0.2)
//route where we will serve the posts later on
//  "/feed/posts" would be handled (/feed as stated in app.use in app.js)
//as long as it is a GET request and then will be handled by the controller
router.get("/posts", feedController.getPosts);

//(24.0.3)
// POST request to /feed/post
router.post("/post", feedController.createPost);


 





//(24.0.2)
module.exports = router;