
//(25.2.5)
const User = require("../models/user");
const { validationResult } = require("express-validator");

//(25.2.6)
const bcrypt = require("bcryptjs");

exports.signup = (req, res, next) => {

    //collect any router validation errors from the start
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;


    }


    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password
 
    bcrypt.hash(password, 12)
    .then((hashedPw) => {
        const user = new User({
            email: email,
            password: hashedPw,
            name:name
        });
        return user.save();
    })
    .then((result) => {
        res.status(201).json({message: "User Created!", userId: result.id});
    })
	.catch((err) => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);  //async error handling         //(25.0.8)
	})




}


