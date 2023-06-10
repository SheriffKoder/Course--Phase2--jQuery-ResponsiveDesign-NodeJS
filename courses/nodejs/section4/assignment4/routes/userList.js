const path = require("path");
const express = require("express");
const router = express.Router();
const pathJSrootDir = require("../utl/path.js");


const HomeRoute = require("./home.js");

router.get("/user-list", (req, res, next) => {

    res.render("userList", {myTitle: "User List Page", path: "/userList", "userList_users": HomeRoute.usersHomeExport});
});

module.exports = router;
