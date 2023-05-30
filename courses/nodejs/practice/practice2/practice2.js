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
path.dirname (used in path.js), path.join (gives the path to res.sendFile)
res.sendFile("path")
res.send, res.redirect, res.setHeader, res.write, res.end
req.on(data), req.on(end)

external-modules
nodemon (pkg) - autosave
express (pkg) - for (require("express")).use , require("express").static() 
body-parser (pkg) - able to use html body


//npm: node package manager - installed by default by node js
library cloud-repo allows installing third-party packages (codes that are used do functionalities)


// "app.use" works for all http methods
// "app.get" only will fire for incoming get requests
// "app.post" to filter for post requests
//also have app.delete/patch/put
//can repeat the paths without conflict if used different methods like get/post



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

/*

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






*/
//                         ****** Project 2: routing the code ******
/*

create local files and put the relevant code there
routes >
    admin.js    (product add code)
    shop.js     (display code)

utl >
    path.js


(1) create html files in the view folder (can have css <style>) and css files the public folder
(2) code the utl/path.js to get the directory of the .js file calling it

(3) copy relevant express code to the created routes folder files
    & import express.Router and use its constant instead of app.
    express router is like a mini express app
    & use the path.join with the help of path.js import to send html

//in app.js
(4) import the routes folder files in a constant



*/


////starting modules
const express = require("express");
const app = express();
const path = require("path");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));


////(4) import route's folder files
const adminJsRoutes = require("./routes/admin.js");
const shopJsRoutes = require("./routes/shop.js");


////static folders (for our css files)
//for example url "localhost:3000/views/shop.html" wont work
//static: not handled by the express routers or middleware
//but directly forwarded to the file system
//grant access to a local/public path/files html/css/js/images etc.
//exposed to public no permissions
//will go through all static folders provided till first match
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static(path.join(__dirname, "public2")));


//app.use exported router object - order matters
app.use(adminJsRoutes);
app.use(shopJsRoutes);


////filtering
//app.use("/admin", adminJsRoutes);     // on accessing /admin + router.use adminJsRoutes's paths (/add-product) = url /admin/add-product
//                                      // but other code parts like form etc should include /admin


////wrong paths - 404
//error as wrong urls are not handled
//no location set to catch all middleware
app.use((req, res, next) => {
    //res.status(404).send("<h1>Page not found</h1>");
    res.status(404).sendFile(path.join(__dirname, "views", "404.html"));

});


//End
app.listen(3000);




//check
//source code for response.js > send
//express();
//express.Router
