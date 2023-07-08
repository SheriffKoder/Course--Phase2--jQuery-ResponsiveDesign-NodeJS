const express = require("express");
const router = express.Router();

const path = require("path");
const pathJSrootDir = require("../util/path.js");

const authController = require("../controllers/auth.js")

//(2.1)
router.get("/login", authController.getLogin);

//(2.2)
router.post("/login", authController.postLogin);



module.exports = router;