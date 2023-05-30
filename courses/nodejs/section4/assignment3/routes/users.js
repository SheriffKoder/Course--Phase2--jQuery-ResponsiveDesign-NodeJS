
let input = `not entered yet`;

function generateHTML (gen_input) {

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <link rel="stylesheet" href="/css/users.css">
</head>
<body>
    <div class="container1">
        <header>
            <nav>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/contact">404</a></li>
                </ul>
            </nav>
        </header>    
    </div>

    <div class="container2 center-text">
        <h1>
            Here is the user you entered : ${gen_input}
        </h1>

    </div>


    <script src="/js/users.js">
    </script>
</body>
</html>`;


}

const express = require("express");
const router = express.Router();
const path = require("path");

const RootPath = require("../utl/path.js")


router.get("/users", (req, res, next) => {
    //res.send(productAddHtml);
    //file.html is located in /public folder but /public is omitted here as its provided in app.js's express.static
    //res.sendFile(path.join(RootPath, "views", "users.html"));
    res.send(generateHTML(input));

});


router.post("/users", (req, res, next) => {
    //res.send(productAddHtml);
    //file.html is located in /public folder but /public is omitted here as its provided in app.js's express.static
    input = req.body["username"];
    res.send(generateHTML(input));
    
    //res.send(`<h1>The added user is : ${req.body["username"]}<h1>`);
});



module.exports = router;
