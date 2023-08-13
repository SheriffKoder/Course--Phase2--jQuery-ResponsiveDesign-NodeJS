
//(34.3.0)

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
//parse all incoming requests
//check if they contain json data
//the json data will be parsed
//and will be made available as a js object in the req.body field
app.use(bodyParser.json());     //to be able to access incoming req.body


const todoRoutes = require("./routes/todos");


app.use((req, res, next) => {
    console.log("Some middleware");
    next();
});


app.use(todoRoutes);


app.listen(3000);




