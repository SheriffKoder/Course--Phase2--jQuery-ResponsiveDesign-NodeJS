const path = require("path");
const express = require("express");
const router = express.Router();
const pathJSrootDir = require("../utl/path.js");

let userHomeArray= [];


router.get("/", (req, res, next) => {

    //res.send("hello from home");
    res.render("home", {myTitle: "Home Page", path: "/home"})
});


router.post("/user-add", (req, res, next) => {

    console.log(req.body.formUser);
    userHomeArray.push({"pushed_user": req.body.formUser});
    res.redirect("/user-list");

});

exports.routes = router;
exports.usersHomeExport = userHomeArray;


//userList_users < usersHomeExport < userHomeArray < {"pushed_user": req.body.formUser}
//in the end userList_users is {"pushed_user": req.body.formUser} use key pushed_user