
//(2.9)
let User = require("../models/user");

//(3.3)
const bcrypt = require("bcryptjs");

//(4.1)
//nodejs has a built in crypto library
//helps with creating secure/unique random values
const crypto = require("crypto");

//(18.0.1)
//allows to gather all the errors prior the validation middleware
//in the check in postSignup route might throw/stored
//had to remove the /check fom the require as stated in the docs
const {validationResult} = require("express-validator");


//(3.11)
const nodemailer = require("nodemailer");
const providerTransport = require("nodemailer-mandrill-transport");

//setup telling node mailer how your emails will be delivered
//providerTransport function will then return a configuration
//that nodemailer can use to use sendgrid/mailchimp
//where you pass an object like this
//the api values can be obtained from the api_keys from mailchimp 
//can use your username/password api_user/api_key
//but will use the api key
// create a new api key node-shop
//as we configured the transporter, we can use it to send an email
const transporter = nodemailer.createTransport(providerTransport({
    auth: {
        //the api key is the pragmatic way to access an app's data instead a username/password
        apiKey: "95edd8a909ccc47db33f7a508e4145f3-us21"
    }  
}));





//(2.1) 
exports.getLogin = (req, res, next) => { 

    //(2.3)
    //console.log(req.get("Cookie"));
    //to output from many values
    //console.log(req.get("Cookie").split(":")[1]);
    //access more request data
    //console.log(req.get("User-Agent"));
    //const isLoggedIn = req.get("Cookie").trim().split("=")[1];
    //console.log(isLoggedIn);
    //

    //console.log(req.session); //(2.7)
    //console.log(req.session.isLoggedIn); //true //(2.7)

    //(3.10)
    //console.log(req.flash("error")); //[]
    let message = req.flash("error");
    if (message !== [] ) {
        message = message[0]
    } else {
        message = null;
    }

    //(2.1)
    res.render("auth/login", {
        path: "/login",
        myTitle: "Login Page",
        //helps with <% if (isAuthenticated) { %> in the head ejs file
        //isAuthenticated: isLoggedIn //(2.3)
        //isAuthenticated: req.session.isLoggedIn //(2.9) //-(3.8)
        //isAuthenticated: false, //(2.7)
        //just access the key for the message
        //errorMessage: req.flash("error") //-(3.10)
        errorMessage: message
    });        
}

//(2.2)
exports.postLogin = (req, res, next) => {

    //(3.4)
    const email = req.body.email;
    const password = req.body.password;


    //(18.0.6)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //return so the code below not execute
        return res.status(422).render("auth/login", {
            path: "/login",
            myTitle: "Login Page",
            errorMessage: errors.array()[0].msg
        });        
    
    }

    //can put this part in a custom validator like     //(18.0.5)
    //and return a rejected promise
    //in the route middlewares themselves
    User.findOne({email: email})
    .then(user => {
        if (!user) {
            //(3.9)
            //if user does not exist, want to flash an error message on to the session
            //takes a name key, the message
            //its in the session until we use it
            req.flash("error", "Invalid Email or password.");
           return res.redirect("/login"); 
        }

        //compare the entered password with the hashed password value
        //returns a promise with matching value true/false
        bcrypt.compare(password, user.password)
        .then((doMatch) => {
            if (doMatch) {

                req.session.isLoggedIn = true; //(2.9)
                req.session.user = user;

                //return to avoid redirecting to /login below
                return req.session.save((err) => {

                    console.log(err);
                    res.redirect("/"); 
                })
            }

            req.flash("error", "Invalid Email or password.");
            return res.redirect("/login"); 

        })
        .catch((err) => {
            //error when something goes wrong not if not match
            console.log(err);
            return res.redirect("/login"); 

        })
    })
    .catch(err => {
        console.log(err);
    })

    //in the dummy user example we did save the user as logged in by req.user = user
    //saved the user in the request
    //req.isLoggedIn = true;

    //(2.3)
    //set cookie with setting a header, value of AnyNamekey=AnyNameValue 
    //res.setHeader("Set-Cookie", "loggedIn=True");

    //(2.7)
    //put any key you want ex. isLoggedIn
    //req.session.isLoggedIn = true;

    //(2.9)
    /*
    User.findById("64a6f2a6c017acc261356a8c")
    .then(user => {
        //req.user = user;
        //create a new user in order to be able to call its methods 
        //mongoDB //(10)
        //req.user = new User(user.name, user.email, user.cart, user._id);

        req.session.isLoggedIn = true; //(2.9)

        //we store the session for our user on logging in
        //session stores with the help of mongoDB as in app.js
        //it only fetches the data not the object
        //req.user = user;
    
        req.session.user = user;

        //normally you would not want to use this
        //only if need to get this guarantee
        //if want to be sure that the session was created
        //before you continue
        //because you could get redirected before the 
        //user session is created
        //a function will be called once done saving the session
        req.session.save((err) => {
            console.log(err);
            res.redirect("/");

        });
    

   })
   
   .catch(err => {
       console.log(err);
   })
    */

    // res.redirect("/");

}



//(2.10)
exports.postLogout = (req, res, next) => {

    //reach to the session object
    //destroy is provided by the session package we are using
    //will remove the "session" from the "database"
    //and the cookie will still be on the browser
    //takes a function that will execute after destroying
    //all session data will be removed
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect("/");
    });

}

//(3.1)
exports.getSignup = (req, res, next) => {

    //(3.10)
    //console.log(req.flash("error")); //[]
    let message = req.flash("error");
    if (message !== [] ) {
        message = message[0]
    } else {
        message = null;
    }

    res.render('auth/signup', {
      path: '/signup',
      myTitle: 'Signup',
      //isAuthenticated: false,
      errorMessage: message, //(3.10)
      //(18.1.0)
      oldInput: {
        email: "", 
        password: "",
        confirmPassword: ""
    }

    });
  };
  
//(3.1)
exports.postSignup = (req, res, next) => {
    //(3.2)
    //storing a new user in the database
    //the values that would reach this route
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    //(18.0.1)
    //extract errors
    //on that "request" the check middleware in routes
    //will have added errors that can be retireved
    //the validation will go through the errors object and collect them
    const errors = validationResult(req);
    //check if there are errors
    //is empty method will return true or false 
    //if not empty
    if(!errors.isEmpty()) {
        console.log(errors.array());
        //status code indication that the validation failed
        //it will send a response with just a different status code
        //if there are errors, render the signup page again
        return res.status(422).render('auth/signup', {
            path: '/signup',
            myTitle: 'Signup',
            errorMessage: errors.array()[0].msg, //this outputs [object object] so use [0]
            //(18.1.0)
            oldInput: {
                email: email, 
                password: password,
                confirmPassword: confirmPassword
            }
        });
    }


        //(3.3)
        //1st, a string to hash
        //2nd, how many levels of hashing
            //the higher the value, the longer it takes and more secure it will be 
            //currently the value of 12 is accepted as highly secure
        //async task that gives back a promise
        //-(18.0.5) return bcrypt
        bcrypt
        .hash(password, 12)
        //these then blocks are only executed if we made it into the hashing mode
        .then((hashedPassword) => {
            //(3.2)
            //no user with that email exists yet
            //create a new user
            const user = new User({
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            })
            return user.save();
        })    
        .then ((result) => {
            //(3.11)
            //pass a js object where you configure the email want to send
            //sendMail returns a promise so can add .then to it
            //or simply return and put another .then after this then to redirect
            //you can also redirect immediately and not wait for the email to be send
            //for that put the redirect above it and return it so can catch any errors 
            res.redirect("/login");

            //(3.11)
            return transporter.sendMail({
                to: email,
                from: "shop@node-complete.com",
                subject: "Signup succeeded!",
                //can put any complex html
                html: "<h1> You successfully signed up!</h1>"
            });
            //
        })
        .catch((err) => {
            console.log("transporter return ");
            console.log(err);

        });


    //check if an email already exists
        //in MDB you could create an index in the database
        //on the email field and give that index a unique property
    //alt. can try to find a user with that email
    //find one user who already has this email    
    //by passing a filter in {} //-(18.0.5) used in auth.js router
    /*
    User.findOne({email: email})
    .then((userDoc) => {
        //if user exists
        if (userDoc) {
            req.flash("error", "Email exists already, please pick a different email");
            return res.redirect("/signup");
        }

        //part (3.3) was here then placed at top when this was not used

    })
	.catch((err) => {
		console.log("userDoc" + err);
	})
    */

};


//(4.1)
exports.getReset = (req, res, next) => {

    let message = req.flash("error");
    if (message !== [] ) {
        message = message[0]
    } else {
        message = null;
    }


    res.render('auth/reset', {
        path: '/reset',
        myTitle: 'Reset Password',
        errorMessage: message //(3.10)
      });
  
}

//(4.1)
exports.postReset = (req, res, next) => {
    
    //use the imported crypto library
    //32 random bytes, cb that will be called once its done 
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            //can also flash the message here if we wanted to
            console.log(err);
            return res.redirect("/reset");
        }
        //convert hex values to normal ASCII characters
        const token = buffer.toString("hex");
        //that token should be stored in the database user object

        //find the user in the database
        //use the mongoose user model
        //find using the email we are trying to reset
        //received from the ejs page
        User.findOne({email: req.body.email})	
        .then((user) => {
            if (!user) {
                req.flash("error", "no account with that email found");
                return res.redirect("/reset");
            }
            user.resetToken = token;
            //expiration data 1 hour from now
            user.resetTokenExpiration = Date.now() + 360000;
            //update the user
            return user.save();
        })
        //now the user is saved in the database
        //now want to send the token reset email
        .then((result) => {
            //send email then redirect
            res.redirect("/");

            return transporter.sendMail({
                to: req.body.email,
                from: "shop@node-complete.com",
                subject: "Password Reset!",
                //can put any complex html
                html: `
                    <p> You requested a password reset </p>
                    <p> Click this 
                        <a href="http://localhost:3000/reset/${token}"
                        link to set a new password </p>
                    `
            });
        })    
        .catch((err) => {
            console.log(err);
        })
    })

}

//(4.2)
exports.getNewPassword = (req, res, next) => {

    //want also to check wether i can find a user for that token
    const token = req.params.token
    //the user's resetToken property equals to the token in the link
    //and still valid from a date perspective
    //the expiration is still higher than the current date
    //$gt special sign operator stands for greater than
    //and compare with Date.now()
    //if the expiration is still less than the added +1 hour
    User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}})
	.then((user) => {
        let message = req.flash("error");
        if (message !== [] ) {
            message = message[0]
        } else {
            message = null;
        }
    
        res.render('auth/new-password', {
            path: '/new-password',
            myTitle: 'New Password',
            errorMessage: message, //(3.10)
            //pass also the user id so we can include it
            //in the user request where we can update the password
            //and add it as a hidden input in the new-p.ejs
            userId: user._id.toString(),
            passwordToken: token
          });
    })
	.catch((err) => {
		console.log(err);
	})




}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;

    User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt: Date.now()},
        _id: userId
    }).then((user) => {
        //store the user to use in next then
        resetUser = user;
        //number of hashing rounds
        return bcrypt.hash(newPassword, 12)
    })
    .then ((hashedPassword) => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then (result => {
        res.redirect("/login");
        //can also send a mail confirming that reset if wanted to
    })
	.catch((err) => {
		console.log(err);
	})



}