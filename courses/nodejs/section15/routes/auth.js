const express = require("express");
const router = express.Router();

const path = require("path");
const pathJSrootDir = require("../util/path.js");

const authController = require("../controllers/auth.js")

//(2.1)
router.get("/login", authController.getLogin);

//(2.2)
router.post("/login", authController.postLogin);

//(2.10)
router.post("/logout", authController.postLogout);

//(3.1)
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

//(4.1)
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);

//(4.2)
//req.params.token in the controller
router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password/", authController.postNewPassword);


module.exports = router;