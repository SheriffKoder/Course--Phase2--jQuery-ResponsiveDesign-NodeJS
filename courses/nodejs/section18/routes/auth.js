const express = require("express");
const router = express.Router();

//(18.0.1)
//const expValidator = require("express-validator/check")
//as expValidator will be a js object, we can use destructuring
    //into check property which holds a function
    //validation result(will use later), and more in the official docs
//had to remove the /check fom the require as stated in the docs
const {check} = require("express-validator");



const path = require("path");
const pathJSrootDir = require("../util/path.js");

const authController = require("../controllers/auth.js")

//(2.1)
router.get("/login", authController.getLogin);

//(2.2)
router.post("/login", authController.postLogin);

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
//because you could add multiple checks lke .isAlphanumeric (check if only numbers and characters)
router.post(
    '/signup', 
    check("email")
    .isEmail()
    .withMessage("Please enter a valid email"),
    //want to make sure it is a specific email i want to have
    .custom(() => {

    })
    authController.postSignup);

//(4.1)
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

//(4.2)
//req.params.token in the controller
router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password/", authController.postNewPassword);


module.exports = router;