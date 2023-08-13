

/*
//(34.0.4)
//create a node equivalent to the code from 34.0.3

//const fs = require("fs");
const fs = require("fs").promises; //use promise based file-system module


const text = "this is a test - and it should be stored in a file!";

fs.writeFile("node-message.txt", text).then(()=>{
    console.log("wrote file!");
})

*/



/*
//(34.1.2)
//create a node equivalent to the code from 34.1.1

const http = require("http");

//function that will be executed on every incoming request
const server = http.createServer((req, res) => {
    res.end("Hello World (from Node!)");
});

server.listen(3000);

*/