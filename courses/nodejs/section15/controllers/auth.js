
//(2.9)
let User = require("../models/user");

//(3.3)
const bcrypt = require("bcryptjs");



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

    //(2.1)
    res.render("auth/login", {
        path: "/login",
        myTitle: "Login Page",
        //helps with <% if (isAuthenticated) { %> in the head ejs file
        //isAuthenticated: isLoggedIn //(2.3)
        //isAuthenticated: req.session.isLoggedIn //(2.7)
        isAuthenticated: false //(2.7)

    });        
}

//(2.2)
exports.postLogin = (req, res, next) => {

    //(3.4)
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
    .then(user => {
        if (!user) {
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
    res.render('auth/signup', {
      path: '/signup',
      myTitle: 'Signup',
      isAuthenticated: false
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

    //check if an email already exists
        //in MDB you could create an index in the database
        //on the email field and give that index a unique property
    //alt. can try to find a user with that email
    //find one user who already has this email    
    //by passing a filter in {}
    User.findOne({email: email})
    .then((userDoc) => {
        //if user exists
        if (userDoc) {
            return res.redirect("/signup");
        }

        //(3.3)
        //1st, a string to hash
        //2nd, how many levels of hashing
            //the higher the value, the longer it takes and more secure it will be 
            //currently the value of 12 is accepted as highly secure
        //async task that gives back a promse
        return bcrypt
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
            return res.redirect("/login");
        });
    })
	.catch((err) => {
		console.log(err);
	})


};
