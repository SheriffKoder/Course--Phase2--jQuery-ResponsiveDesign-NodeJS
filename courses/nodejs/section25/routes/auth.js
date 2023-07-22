const express = require("express");
const router = express.Router();

//check(headers/query params etc) or body
//used to set the validation and custom message that returns a reject
const {body} = require("express-validator"); //(25.0.4) 

//(25.2.5)
const User = require("../models/user");
const authController = require("../controllers/auth");



//(25.2.5)
router.put("/signup", [
    body("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .custom((value, {req}) => {
        //returns true if validation succeeds
        //or returns a promise if the validation uses async task
        return User.findOne({email: value})
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject("E-Mail address already exists!");
            }
        })
    })
    .normalizeEmail(),
    body("password")
    .trim()
    .isLength({min:5}),
    body("name")
    .trim()
    .not().isEmpty()


], authController.signup);


//(25.2.8)
router.post("/login", authController.login);




module.exports = router;
