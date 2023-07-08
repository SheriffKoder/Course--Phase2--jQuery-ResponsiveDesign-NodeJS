
//(1) 
exports.getLogin = (req, res, next) => { 

    //(3)
    //console.log(req.get("Cookie"));
    //to output from many values
    //console.log(req.get("Cookie").split(":")[1]);
    //access more request data
    //console.log(req.get("User-Agent"));
    const isLoggedIn = req.get("Cookie").trim().split("=")[1];
    console.log(isLoggedIn);
    //

    res.render("auth/login", {
        path: "/login",
        myTitle: "Login Page",
        isAuthenticated: isLoggedIn //
    });        
}

//(2)
exports.postLogin = (req, res, next) => {

    //in the dummy user example we did save the user as logged in by req.user = user
    //saved the user in the request
    //req.isLoggedIn = true;

    //(3)
    //set cookie with setting a header, value of AnyNamekey=AnyNameValue 
    res.setHeader("Set-Cookie", "loggedIn=True");

    res.redirect("/");

}