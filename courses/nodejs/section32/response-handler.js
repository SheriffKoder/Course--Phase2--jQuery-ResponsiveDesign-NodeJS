



///////////////////////////////////////////////
//export method 1
/*

//const fs = require('fs');
import fs from "fs"; //(32.0.1)


const resHandler = (req, res, next) => {
    fs.readFile('my-page.html', 'utf8', (err, data) => {
        res.send(data);
    });
};


//module.exports = resHandler;
//the default can be only used once per file like module.exports (exports.multiple)
export default resHandler; //(32.0.1)

*/




///////////////////////////////////////////////
//(32.0.1)
//export method 2
/*

//const fs = require('fs');
import fs from "fs"; //(32.0.1)

//(32.0.2)
//import all the path module (default) and its dirname method
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//(32.0.2)
//a globally available variable, which gives the path of this file
const __filename = fileURLToPath(import.meta.url);
//with the dirname, gives the path to the current folder where this file is
const __dirname = dirname(__filename);


//export method 2
export const resHandler = (req, res, next) => {


    // fs.readFile('my-page.html', 'utf8', (err, data) => {
    //     res.send(data);
    // });

    //(32.0.2)
    //another way of sending a file
    //but it requires an absolute path
    //__dirname points to the current working directory
    //path.join then constructs one long path of the two arguments
    res.sendFile(path.join(__dirname, "my-page.html"));


};
*/




///////////////////////////////////////////////
//(32.0.3)
//using promises with the core modules instead of callbacks

import fs from "fs/promises"; //(32.0.1)


//export method 2
export const resHandler = (req, res, next) => {
    fs.readFile('my-page.html', 'utf8')
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        console.log(err);
    })
};



