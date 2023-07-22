
//(25.2.5)
const User = require("../models/user");
const { validationResult } = require("express-validator");

//(25.2.6)
const bcrypt = require("bcryptjs");

//(25.2.8)
const jwt = require("jsonwebtoken");


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


//(25.2.8)
exports.login = (req, res, next) => {

    const email = req.body.email;
    const password = req.body.password;

    //find if the email address exists
    User.findOne({email: email})
    //we always end up in the then block if no error is found
    //so we can reach the then with an undefined user
    .then((user) => {

        //that is why we check again for the user if found in the then
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 401; //not authenticated
            throw error;
        }
        loadedUser = user;
        return bcrypt.compare(password, user.password)

    })
    //bcrypt.compare returns true or false
    .then((isEqual) => {
        if (!isEqual) {
            const error = new Error("User not found");
            error.statusCode = 401; //not authenticated
            throw error;
        }
        //passwords match, generate JSON-Web-token
        //(25.2.8)
        //creates a new signature and pack that in a new web token
        //we can store anything we want in the web token
        //and the second argument is the secret private key
        //third argument to configure the key (will be hashed)
        const token = jwt.sign({
            email: loadedUser.email,
            //convert to string as it is a mongoDB object
            userId: loadedUser._id.toString()
            //should not store the password as will be returned to the user

        }, "secret", { expiresIn: "1h"}); 
        res.status(200).json({token: token, userId: loadedUser._id.toString()})



    })
	.catch((err) => {
		if (!err.statusCode) {
		    err.statusCode = 500;
		}
		next(err);
		//async error handling
		//(25.0.8)
	})


};
