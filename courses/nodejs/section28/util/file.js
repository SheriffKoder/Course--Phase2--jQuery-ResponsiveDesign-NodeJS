
//(28.1.11)


const path = require("path");
const fs = require ("fs");

const clearImage = (filePath) => {
   
    //up one folder as we are in the controllers folder now
    filePath = path.join(__dirname, "..", filePath)
    //unlink removes the file
    fs.unlink(filePath, err => console.log(err));

}

exports.clearImage = clearImage;