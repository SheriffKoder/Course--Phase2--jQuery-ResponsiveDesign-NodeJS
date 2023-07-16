const fs = require("fs");

//(20.2.3)
const deleteFile = (filePath) => {

    //unlink, deletes the file connected to this path
    //exe an error if it fails
    fs.unlink(filePath, (err) => {
        if (err) {
            throw (err);
        }
    });
};


exports.deleteFile = deleteFile;