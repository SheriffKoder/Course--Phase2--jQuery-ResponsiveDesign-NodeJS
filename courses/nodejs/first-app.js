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
access local files to the v8 engine

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
console.log("Hello from Node.js");

// # node file-name.js
//will execute the code


//////file system functionality
//writing some output to a file instead of the function
//import it into that file to let node know 
//that we will use this functionality
//syntax for that is the require function
//require the fs module,
//store the file system functionality in a constant


const fs = require('fs');

////creating a file on the hard drive
//then use writeFileSync module to write a file to the hard drive
//the first argument is path/filename
//second argument is the content given for that file, 
//here its a string

fs.writeFileSync('hello.txt', 'Hello from Node.js');


//until now we did use nodejs without using the browser
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
//"do stuff on your computer that is never exposed to the public

//////Node.js role in Web-development;
//nodejs allows to run a server
//to write the code that takes 
//incoming requests and route them (actually writing the server)
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



////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
//javascript refresher

//weakly typed language
    //no explicit type assignment
    //data types can be switched dynamically

//object oriented language
    //data can be organized in logical objects
    //primitive and reference types

//versatile language, 
    //runs in a browser and on a pc/server
    //broad variety of tasks


//////////////////////////////////////
/*
const name = "Max"; //make clear intention to not change name
let age = 29;   //let is newer syntax than var
let hasHobbies = true;

//const helps to avoid changing a const by giving an error


//pure function that does not depend on outer sources
const summarizeUser = (userName, userAge, userHasHobbies) => {
    return (
        "name is " + userName + 
        " age is " + userAge +
        " and the user has hobbies " + userHasHobbies
    );
}

console.log(summarizeUser(name, age, hasHobbies));


//////////////////////////////////////
//Arrow functions
const add = (a,b) => a + b;
console.log("add is " + add(1,2));


const addOne = a => a + 1;
console.log("addOne is " + addOne(1));

const addRandom = () => 4 + 1;
console.log("addRandom is " + addRandom(1));


*/

//////////////////////////////////////
//Objects
/*
const person = {
    //key, key pair is also called a property or a field of the object
    name: "Max",
    age: 29,
    //arrow function will make this context global

    greet1: function () {
        console.log("Hi i am," + this.name);

    },
    //use normal function or 
    greet2() {
        console.log("Hi i am," + this.name);
    }

};

console.log(person); //outputs the whole object
person.greet1();
person.greet2();



//////////////////////////////////////
//arrays
//can store in arrays also (arrays and objects)

const hobbies = ["Sports", "Cooking"];

for (let hobby of hobbies) {
    console.log(hobby);
}

//map takes a function that runs over every item in an array
//edit it accordingly and returns a new (edited) array
console.log(hobbies.map(hobby =>  "hobby: " + hobby));


//object and arrays are reference types
//they are references, so const contains a reference
//so can edit a const array/object because what will be edited
//is its content not the reference


//////////////////////////////////////
////rest and spread operators

//immutability
//replace with copies plus the changes
//new array with the old items plus new items


//techniques of copying an array
const copiedArray1 = hobbies.slice();
console.log(copiedArray1);

//copy the array into a (first item) of another array - nested array
const copiedArray2 = [hobbies]; //can put an object
console.log(copiedArray2);



////spread syntax, works for arrays and objects
//pulling elements OUT of an array
//pull out all elements or properties of an array
//and put it whatever is around that spread operator
//in this case the []
const copiedArray3 = [...hobbies];
console.log(copiedArray3);


const copiedObject3 = {...person}; 
//to copy an object has to be wrapped in {}
console.log(copiedObject3);




////rest operator, the opposite to spread
//merging multiple arguments INto an array

//return an array that returns these arguments
const toArray1 = (arg1, arg2, arg3) => {
    return [arg1, arg2, arg3];
};
console.log(toArray1(1,2,3));


//more flexible way to add any number of arguments
//to the new array
const toArray2 = (...args) => {
    return args;
};
console.log(toArray2(1,2,3,4));

*/


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//Day2
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

////JS Refresher
//Destructuring
/*
const person = {
    name: "Max",
    age: 20
}

const printName = ({ name }) => {
    console.log(name);
}
printName(person);

//always pulled out by name
const { name, age } = person;
console.log(name, age);


//two individual values
//in arrays you can choose any element
//always pulled out by position
const hobbies = ["Sports", "Cooking"];
const [hobby1, hobby2] = hobbies;

console.log(hobby1, hobby2);

*/
////////////////////////////////
//Asynchronous code
/*
//code that does not finish immediately
//this a callback function, a function will be called back
//so synchronous code will be executed
//and the timeout later once the timer is done

//const fetchData = callBack => {
const fetchData = () => {

    const promise = new Promise((resolve, reject) => {  //Promise constructor function that is built into js
    //the new keyword, new object based on  a constructor
    //resolve and reject are two functions
    
    setTimeout(() => {
//       callBack("Done");   //passed fn code uses "Done" parameter
        resolve("Done");
    }, 1500)


    });

    return promise;
    //after defining the promise we have to return it
    //it is a sync code, will be returned after the promise
    //created before the timeout is complete

};

setTimeout(() => {
    console.log("timer is done");

    //fetchData(text => { //this is callBack, with argument
    //    console.log(text);
    //});

    //then, callable on a promise
    //and we have returned a promise
    //allows to define the callback function
    //that will execute once the promise is resolved
    //advantage: 
    fetchData().then(text => { //this is callBack, that will execute once the promise is resolved
            console.log(text);
            return fetchData();     //#446
        }).then(text2 => {
            console.log(text2);
        });

        //i would not write nested callbacks again
        //inside of the promise
        //return a new promise and add the next then block after it
        //chain of then blocks
        //return another promise
        //even if it will not give us a promise
        //inside of that then block
        //returning it will convert it to a promise
        //that instantly resolves
        //now we add another then block that refers to the
        //returned promise #446


}, 2000);

console.log("timer is not done"); //runs first
console.log("timer is not done");

//you will have a problem when you have
//dependent async operations


//promises
//third party packages will use them for us
//but understanding them is good, crucial concept
//makes async code more manageable
//await will be introduced later

*/

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
//NodeJS Basics

//How Does the web work ? 
//what role nodejs plays into that
//creating a node.js server
//running nodejs code when requests reach that server
//send back responses
//using node core modules

//Async code and the event loop concept
//to stay reactive and ensure our script never slows down 
//and always runs just fine



////////////////////////////////
//user/client (browser)
//enters url
//Domain lookup on DNS name to ip address of the server requested
//the browser then sends a request to the given ip address of the server

//handle that incoming request using nodejs
//and do tasks like validation, 
//communicating with a database that runs on a separate database server
//reached from your backend

//send back a response to the client
//html code, other data


//requests and responses have headers
//that describe what is inside them for example

//nodejs is the code that makes the server
//request and response transmission is done
//through a protocol (standarized way of communicating/rules)
//http/https

//hyper text transfer protocol
//a protocol of transferring data which is understood by browser and server
//defines how a valid request looks like
//how the data should be transferred from browser to server
//and the other way around

//hyper text transfer protocol secure
//ssl encryption is turned on
//where all the data that is transmitted
//is encrypted


////////////////////////////////
