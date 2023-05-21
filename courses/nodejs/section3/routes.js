

//want to connect app_clean.js to routes.js
//to send the incoming request to routes.js file
//for that will create a new function


const fs = require("fs");   //


//this function will replace the req/res in app_clean
//need to export this function
//using module.exports = requestHandler;
//the exported files are locked, not accessible from outside
//cannot change it but can read from outside

const requestHandler = (req, res) => {


    const url = req.url;
    const method = req.method;  //


    if (url === '/') {
        res.write('<html>');
        res.write('<head><title>Enter Message</title></head>');
        res.write('<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>');
        res.write('</html>');
        return res.end();
    }


    if (url === "/message" && method === "POST") {   //
        const requestBody = [];
        req.on("data", (chunk)=>{
            console.log(chunk);
            requestBody.push(chunk);
        });

        return req.on("end", ()=> {
            const parsedBody = Buffer.concat(requestBody).toString();
            const message = parsedBody.split("=")[1];

            fs.writeFile("message.txt", message, (err) => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            }); //

        });
    }

        res.setHeader('Content-Type', 'text/html'); //358
        res.write('<html>');
        res.write('<head><title>Page1</title></head>');
        res.write('<body><h1> Hi </h1> </body>');
        res.write('</html>');
        res.end();
}


//module.exports = requestHandler;

/* way2
module.exports = {
    handler : requestHandler,
    someKey: "text here"
}
*/

//way3
//module.exports.handler = requestHandler;
//module.exports.someKey = "text here";

//way4 (nodejs shortcut)
exports.handler = requestHandler;
exports.someKey = "text here";
