const express = require("express");
const router = express.Router();
const path = require("path");

const RootPath = require("../utl/path.js")



router.get("/", (req, res, next) => {
    //res.send(productAddHtml);
    //file.html is located in /public folder but /public is omitted here as its provided in app.js's express.static
    res.sendFile(path.join(RootPath, "views", "home.html"));
});

module.exports = router;
