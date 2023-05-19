/*


server-side rendered views over REST APIs
all the way up to GraphQL APIs
and real-time web services

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////what is nodejs
javascript runtime
js manipulates the dom / interact with the page browser

built on js, run js on the server 
or other devices like any other 
out of the browser

nodejs uses V8
js engine built by google that runs js on the browser

engine takes js code, compiles it to machine code
so chrome compiles js to machine code to be handled efficiently
written in c++

node js adds 
to access local files to the v8 engine

node js allows to use js outside of the browser
and access the local files and other functionalities
engine takes js  

some features will be missing, for example you cannot access 
a dom because you do not have a page

////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////
download and install nodejs

check version by # node - v 
in terminal

interactive mode # node




*/

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//NodeJS Basics

////using node in terminal
//console.log("Hello from Node.js");
//then # node file-name.js
//will execute the command


//////file system functionality
//writing some output to a file instead of the function
//import it into that file to let node know that we will use this functionality
//syntax for that is the require function
//require the fs module,
//store the file system functionality in a constant


//const fs = require('fs');

////creating a file on the hard drive
//then use writeFileSync module to write a file to the hard drive
//the argument is path/filename
//second argument is the content given for that file, 
//here its a string

//fs.writeFileSync('hello.txt', 'Hello from Node.js');


//until now we di use nodejs without using the browser
//can use any js code




//on the server we do tasks we cannot/not allowed to
//do from the browser like;
//connect to databases, 
//do authentication outside of the browser as a safe place
//input validation, as servers are sheltered from user manipulation
//business logic


//so we write code on the server that returns 
//data the user can work with

//can use it for more than just server-side code
//uses like utility scripts, build tools, access file system
//do stuff on your computer that is never exposed to the public

//////Node.js role in Web-development;
//nodejs allows to run a server
//to write the code that takes 
//incoming requests and route them (writing the server)
//listening and what you want to do with your code

//business logic
//then work with the requests, files, databases
//handle requests, validate input, connect to database

//response side
//send back data to the clients
//html data, html data with dynamic content, data in json/xml/file form

////similar to nodejs
//python flask
//php larvel
//asp.net, ruby

//advantage to nodejs, that it uses js
//one language to write all the code for your web application

 


////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//Course outline

//express.js framework for node.js

//js refresher
//node.js basics
//efficient development
//using express.js
//templating engines
//model-view-controller
//advanced routes & models
//databases: SQL (mySQL)
//Sequelize package makes working with SQL DB easier
//Node + NoSQL (mongoDB)
//Mongoose working with NoSQL DB easier
//sessions and cookies
//authentication, signup/in
//sending emails when sigining
//advanced sign in function Authentication deep dive
//user input validation
//error handling, handling wrong user inputs
//file uploads and downloads, send-store-return
//automatically generate pdf docs on the server
//pagination: data in chunks instead on sent in a whole package for better bandwidth usage
//async requests
//handling payments, accept payments through stripe.js
//REST API basics
//advances REST API features
//using async-await in node application
//websockets & socket.io real time functionalities for your app
    //like when a user send a message and want to instantly notify another user
//GraphQL, modern/popular way of building API's
    //has some advantages over REST APIs

//Deployment, application to real server in the web and make sure it runs there
    //setting up ssl enc

//beyond web servers

//bonus nodejs + typescript 
    //and Deno node js alt by the creator of node



//get the most out of the course
//code along and do the exercises
//figure out solutions

 
//////////////////////////////////////
//////ways of executing nodejs code
////(1) REPL accessed but # node
//Read; read user input
//evaluate user input
//print; print output
//loop wait for new input

//where can write and execute js code in terminal
//not saved anywhere, a playground, execute code as you write it


// #console.log("hello"); 
//ENTER
//Hello

////(2) Execute files
//used for real apps
//ability to save file and deploy





//////////////////////////////////////
////before using npm
//run main .js file via node
//look into the code files to view and compare the code

////after using npm
//run # npm install inside of the extracted code attachment
//before you can run npm start to run the server


