
//(2.9)
let User = require("../models/user");

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


    // res.redirect("/");

}



//(2.10) //duplicated postLogin
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