
const path = require("path");

module.exports = path.dirname(process.mainModule.filename);


//this gives the path to the file that is responsible 
//for the fact that our application is running

//dirname, returns the directory name of a path
//for which file we want to get the directory name
//there we can use the global process variable
//that is also a variable that is available in all files, no need to import it
//a main module property
//will refer to the main module that started your application
//basically to the module created in app.js

//filename to find out, which file this module was spun up

//if got a deprecation warning, use
//module.exports = path.dirname(require.main.filename);
