

/*

//(34.0.4)

//repeating the same code in 34.0.3 with node

when using the "require" will get an IDE warning
to fix this we will have to disable Deno extension

differences
when using writeFile, data can be just a string
does not return a promise, pass in a callBack (code that executes when it completes)

or use .promises to turn it to a promise based method

# node app.js
node by default has permissions to run any code
even from sources you do not know


the main difference is TS which is built into deno
and the permissions




*/


//const fs = require("fs");
const fs = require("fs").promises;


const text = "this is a test - and it should be stored in a file!";

fs.writeFile("node-message.txt", text).then(()=>{
    console.log("wrote file!");
})