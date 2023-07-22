
//(25.2.5)
const User = require("../models/user");
const { validationResult } = require("express-validator");


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
 




}


