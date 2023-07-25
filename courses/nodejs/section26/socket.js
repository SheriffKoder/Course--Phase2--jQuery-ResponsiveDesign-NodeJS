

let io;

//define two functions to export
module.exports = {


    init: (httpServer, CORS_Object) => {
        io = require("socket.io")(httpServer, CORS_Object);
        return io;
    },

    //we can just call getIO to get the connection
    //that has been already initialized in app.js
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized");
        }
        return io;
    }


}