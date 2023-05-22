/* //this is a recap/practice for sections 1,2,3




//similar to nodejs, python flask, php larvel, asp.net, ruby

Javascript runs on Google's V8 engine to run on the browser
engine: compile to machine code using c++
//weakly typed language, no explicit type assignment, data types can be switched dynamically
//object oriented language, data can be organized in logical objects, primitive and reference types
//versatile language, runs in a browser and on a pc/server, broad variety of tasks







NodeJS (javascript runtime) 
"allows to use js to make servers, so a webapp can be made in one language
allows js to run on devices/servers other than the browser
and is never exposed to the public

so we can do using nodejs the following with js code
- access the file system read/write
- connect to "databases"
- do "authentication" outside of the browser (safer)
- do input "validation", as servers are sheltered from user manipulation
- "business logic" (handle requests/files)
- utility scripts, build tools, etc.





we write the server in js code and run the server
listen for incoming requests
route requests
return data/response to the user based on the request
response can be html/json/xml/files/dynamic-content-html










///////////////////////////////





*/

//////(REPL method), no saving, # node
//////EX1:
//download and install nodejs from their website
// node -v to check on njs version
//# node , will get into interactive mode then you can write js code in the terminal



//////(Executing method), file saving, # node file.js
//////EX2:
//write a js code in the .js file and execute # node filename.js in the terminal
//console.log("Hello from Node.js");


//////EX3: 
//use file system core module to output a string to a desired file
//require("node-module").moduleMethod("file", "string");

//output a normal string
//require("fs").writeFileSync("practice1_output.txt", "this is the output for practice1 ex3");

//output js code, must use toString
//let myFunction = new Date().getFullYear();
//let myFunction_inStringFormat = myFunction.toString();
//require("fs").writeFileSync("practice1_output.txt", `We are in ${myFunction_inStringFormat}`);
// # node practice1.js




