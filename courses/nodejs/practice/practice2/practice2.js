/*

////// Previous Sections //////

core-modules
require("fs").writeFileSync("output.txt", "output string or js toString value");


const myServerFunction = (req,res) => {                //run on each incoming request
    req.url, req.method, req.headers["user-agent"];

    //if url
        res.setHeader("content-type", "text-html");
        res.write(htmlCode);
        return res.end();   //no other code to be exe below + cannot write any res below

    //if url and method
        const collectDataChunks = [];
        req.on("data", (incomingChunk) => {         //whenever new chunk is read ready
            collectDataChunks.push(incomingChunk);
        });
    
        return req.on("end", () => {               //on parse finish //(async func registered) 
            const BufferedMessage = Buffer.concat(collectDataChunks).toString();
            const BufferedSplitMessage = BufferedMessage.split("=")[1];

            //writefile with a function exe on success to redirect - no sync thus no code blocking
            require("fs").writeFile("output.txt", BufferedSplitMessage, (error) => {
                res.statusCode = 302;               //redirection
                res.setHeader("Location", "/");     //set location
                return res.end();
            });

        })

    //no-if
        res.setHeader("Content-Type", "text/html");
        res.write(htmlCode2);                       //default html
        res.end();

        process.exit();

}

const server = require("http").createServer(myServerFunction);             //server created
server.listen(3000,localhost);

# node fileName.js & open url localhost:3000
//export.myExportedServerFn = myServerFunction;     //routes.js
//myServerImport= require(./myServerFnFile.js);     //app.js
//createServer(myServerImport.myExportedServerFn);

//the event loop is aware/handles/registers events and their callbacks in some order


*/


/*
////// Section 4 & 5 Recap //////

errors: syntax, runtime(code-break), logical(code-runs-not-properly)
vscode debugger helps with logical errors

core-modules
http, https, fs, os, path
npm (pkg) - install libraries

external-modules
nodemon (pkg) - autosave
express (pkg) - for app.use etc
body-parser - able to use html body


//npm: node package manager - installed by default by node js
library cloud-repo allows installing third-party packages (codes that are used do functionalities)


// "app.use" works for all http methods
// "app.get" only will fire for incoming get requests
// "app.post" to filter for post requests
//also have app.delete/patch/put


//                         ****** Project 1: understanding express ******

(1) # npm init   - to initialize the project for npm usage
(2) edit the scripts object in the package.json provided, "start": "node fileName.js", "start-myServer": "nodemon createUser.js"
(3) # npm start / npm run customStart
(4) # npm install nodemon --save-dev    (development dependency: not needed on real server)
(-) # npm install nodemon -g    (global dependency: available on every server launched and be able to use it in the terminal)
(-) # npm install   (installs the packages in the .json dependency)



//express.js
//simplifies code writing to focus more on app functionality
//framework, helper function, tools, rules
//allows splitting code into "middlewares"

(5) # npm install --save express    (production dependency: be present with every application shipped)
(6) # npm install --save body-parser


[2] # npm start // # npm run nodemon-start

*/

//this will be sent/viewed in "/add-product" and posts to "/product"
let productAddHtml = `
<form method="POST" action="/product-list">
    <label for="html"> Add Product </label>
    <input id="html" type="text" name="productAdded">
    <button type="submit"> Add Product </button>
</form>
`;



const express = require("express");
const app = express();  // () allows to add middleware, accepts an array of request handlers, 

//urlencoded option to be able to parse non default features
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:false}));

//**add product page
app.get("/add-product", (req, res, next) => {
    res.send(productAddHtml);
});

//**runs on form post
app.post("/product-list", (req, res, next) => {
    //console.log(req.body["productAdded"]);
    res.send(`<h1>The added product is : ${req.body["productAdded"]}<h1>`);
    //res.redirect("/");
    next();
});

//**runs on form post when next() is added before
app.post("/product-list", (req, res, next) => {
    console.log(req.body["productAdded"]);
    //res.redirect("/");
});

//**runs on visit
app.get("/product-list", (req, res, next) => {
    //console.log(req.body["productAdded"]);
    res.send(`<h1>Product is not added yet<h1>`);
    //res.redirect("/");
});


//the callBack function passed will be exe on each incoming request
//the location if provided
app.use("/", (req, res) => {
    //can still use the vanilla node js code syntax
    console.log("Default / Middleware 1"); //runs on each "/name" ?

    //strings content-type set to html automatically
    res.send("<h1> Hello from Practice 2</h1>")

    //next allows this code to run/continue in next middlewares
    //omitting: avoid sending other responses
    //can remove the next parameter if not used
    //next();
})

//replaces the vanilla listen
app.listen(3000);



//check
//source code for response.js > send
//express();





