//(25.2.9)
//the token is given the a user for 1h when the user login
//the token is sent again from the FE to the backend API (when access get posts)
//to decode and verify the token before going to the next route middleware (viewing)

//we will need that package to validate incoming tokens
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {

    //get the header from the FE fetch
    //extract the token from an incoming request
    //with the GET, get the header value
    const authHeader = req.get("Authorization");
    //if cant find the header
    if (!authHeader) {
        const error = new Error("Not Authenticated");
        error.statusCode = 401;
        throw error
    }

    //get the bearer token in the FE
    //interested in the value that comes after the white space of bearer
    const token = authHeader.split(" ")[1];
    let decodedToken;
    try {
        //verify will decode and verify the token
        //also have a decode method, which will only decode and not check if it is valid
        //same secret key used in the auth controller
        decodedToken = jwt.verify(token, "secret");
    } catch {
        err.statuscode = 500;
        throw err;
    }


    //decoding worked (no catch error) but unable to verify the token
    if (!decodedToken) {
        const error = new Error("Not authenticated");
        error.statusCode = 401;
        throw error
    }

    //if we got here we will have a valid token
    //extract some information from the token
    //so can use in other places where the request will go
    //like in the routes
    //decodedToken.userId which is stored in the token
    //later we will use that to match the userId got from the token
    //with the userId of the post we want to delete
    req.userId = decodedToken.userId;
    //then forward the request
    //so either will have an error or pass decoding/verification
    next();




};