const express = require("express");
const router = express.Router();

//(18.0.1)
//const expValidator = require("express-validator/check")
//as expValidator will be a js object, we can use destructuring
    //into check property which holds a function
    //validation result(will use later), and more in the official docs
//had to remove the /check fom the require as stated in the docs
//can user body, query, cookie, param, header
//to check in a specific place only
const {check, body} = require("express-validator");



const path = require("path");
const pathJSrootDir = require("../util/path.js");

const authController = require("../controllers/auth.js")

//(18.0.5)
const User = require("../models/user.js");


//(2.1)
router.get("/login", authController.getLogin);

//(2.2)
//(18.0.6)
//can wrap the validators in an array or separate with ,
router.post(
    "/login", 
    [
    body("email")
      .isEmail()
        .withMessage("Please enter a valid email address"),
    body("password", "Password has to be valid")
        .isLength({min: 5})
            //.withMessage("")
        .isAlphanumeric()
            //.withMessage("")
    ],
    authController.postLogin
);

//(2.10)
router.post("/logout", authController.postLogout);

//(3.1)
router.get('/signup', authController.getSignup);
//(18.0.1)
//add a pre middleware, as they will exe in order
//the check from the validator import, will return a middleware
//add a field name you want to check
//in the ejs we have name=email for example
//this tells the validator that i am interested in validating that value
//then we call a method that will return a middleware understood by expressjs
//will look for that field(email) in the incoming request
//and look in the body, in the query parameters, in the headers, cookies
//finds that field and checks if that is a valid email address
//the check middleware will store errors, and gives them to the validationResult in controller
//(18.0.2)
//.withMessage will refer to the validation that was right before it "isEmail"
//because you could add multiple checks like .isAlphanumeric (check if only numbers and characters)
router.post(
    '/signup', 
    check("email")
    .isEmail()
    //if withMessage not included, will use the default value message
    .withMessage("Please enter a valid email")
    //want to make sure it is a specific email i want to have
    //(18.0.2)
    //the validator is a function, 
    //that receives the value for the email we are checking
    //and optionally an object where we can extract things
    //with destructuring
    //the location to which it will send, the path or the req object
    //(18.0.5)
    //the express validator package will check for a custom validator
    //to return true or false, to return throw an error, to return a promise
    //every .then implicitly returns a new promise
    //if we return a promise, express-validator will wait for this promise
    //to be fulfilled with no error, then it treats this validation as successful
    //if there is rejection, express-validator will detect this rejection
    //and will store this as an error - the reject"" in our case
    //this is asynchronous validation
    //because we need to reach out for the database
    //which is not an instant task
    //express validator will kind of wait for us here
    .custom((value, {req}) => {
        // if (value === "test@test.com") {
        //     throw new Error("This email address is forbidden");
        //     //return false; //to go with the default error message
        // }
        // return true; //if succeeded
        //

        //(18.0.5)
        //value will be the entered email
        return User.findOne({email: value})
        .then((userDoc) => {
            //if user exists
            if (userDoc) {
                //will not throw a flash
                //return a promise reject call
                //promise is a built in js object
                //and with reject i basically throw an error
                //inside of the promise
                //and reject with the error message
                return Promise.reject("Email exists already, please pick a different email");

            }
        });
    }),
    //(18.0.3)
    //check in the body of the request, can use the above approach
    //2nd parameter is the default error message for all validators
    //isLength a built in validator, can use min and max
    //isAlphanumeric to only allow numbers and normal characters
    body("password", "Please enter a password with only numbers and text and at least 5 characters")
    .isLength({min: 5})
    .isAlphanumeric(),
    //(18.0.4)
    //want to check if it is equal to our password
    //we will use a custom validator
    //and extract the request with destructuring
    body("confirmPassword")
    .custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords have to match!");
        }
        return true;
    }),
    authController.postSignup
);

//(4.1)
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

//(4.2)
//req.params.token in the controller
router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password/", authController.postNewPassword);


module.exports = router;