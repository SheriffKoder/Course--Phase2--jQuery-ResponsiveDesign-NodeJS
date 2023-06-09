const path = require("path");

module.exports = path.dirname(process.mainModule.filename);


//this returns the directory path of the .js file calling this export
//if got a deprecation warning, use
//module.exports = path.dirname(require.main.filename);
