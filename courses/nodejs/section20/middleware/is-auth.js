
//(3.5)
//this checks if the user accessing if authenticated
//is used in the routes files
module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/login");
    }

    //otherwise call next
    //allow the request to continue to where ever the route want to go to
    next();

}