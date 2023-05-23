/*
this is an assignment for sections 1-3

were we need to
. create a /user page with user a list
. in the "/" page create a form with
    - form has POST method to action /create-user page
    - input field
    - submit type button

. add the "/create-user" route and parse the incoming data
and log it to the console

here i choose to log it into a sting containing html code
to be able to use that code in the /create-user markup

also stored the general html format in connected strings
so that i can update a string of them independently

now the html part of user list can be edited independently

*/



// "/user" page with <ul><li> User1 </li> </ul>
let usersHtml = `<html>
                    <head>
                        <title>Users Page</title>
                    </head>
                    <body>
                        <h1>List of Users</h1>
                        <ul>
                            <li> User1 </li>
                            <li> User2 </li>
                            <li> User3 </li>
                        </ul>
                    </body>
                </html>`;


usersHtml_Users = `
                        <li> User1 </li>
                        <li> User2 </li>
                        <li> User3 </li>
                        `;

function generateHTML (usersHtml_UsersInput) {





let usersHtml_UserList = `
                        <ul>
                        ${usersHtml_UsersInput}
                        </ul>
                        `;


let usersHtml_Body = `
                    <body>
                    <h1>List of Users</h1>
                    ${usersHtml_UserList}
                    </body>
                    `;

let usersHtml_Head = `
                    <head>
                    <title>Users Page</title>
                    </head>
                    `;

let usersHtml_Html = `
                <html>
                    ${usersHtml_Head}
                    ${usersHtml_Body}
                </html>
                    `;

return { usersHtml_Html, usersHtml_Head, usersHtml_Body, usersHtml_UserList, usersHtml_Users };
}



//form with username input in the "/" page 
//and submit a POST request to "/create-user" on btn click
let homeHtml = `<html>
                    <head>
                        <title>Main Page: createUser</title>
                    </head>
                    <body>
                        <h1>Hello myPage</h1>
                        <p>this is a NodeJS page</p>

                        <form action="/create-user" method="POST">
                            <label for="html"> Add User </label>
                            <input id="html" type="text" name="formMessage">
                            <button type="submit"> Create </button>
                        </form>

                    </body>
                </html>`;




//add the "/create-user" route and parse the incoming data
//and log it to the console


const http = require("http");
const fs = require("fs");





const serverHandler = (req, res) => {


    const url = req.url;
    const method = req.method;

    if( url === "/") {
        res.setHeader("Content-Type", "text/html");
        res.write(homeHtml);
        return res.end();
    }


    if ( url === "/user") {
        res.setHeader("Content-Type", "text/html");
        res.write(generateHTML(usersHtml_Users).usersHtml_Html);
        console.log("............");
        console.log(generateHTML(usersHtml_Users).usersHtml_Html);
        return res.end();
    }

    if( url === "/create-user" && method === "POST") {

        let text = `<li> User4 </li>`;
        usersHtml_UsersNew = generateHTML(usersHtml_Users).usersHtml_Users.concat(text);
        res.setHeader("Content-Type", "text/html");
        //console.log(usersHtml_Users);
        //console.log(usersHtml_Html);
        //return res.end();


        const incomingData = [];

                req.on("data", (chunk) => {
                    incomingData.push(chunk);
                });

        return  req.on("end", () => {
            const ParsedBody = Buffer.concat(incomingData).toString();
            const message = ParsedBody.split("=")[1];

            let newUserAdd = `<li> ${message} </li>`;

            usersHtml_UsersNew = usersHtml_UsersNew.concat(newUserAdd);
            //console.log(usersHtml_Users);


            usersHtml_Users =usersHtml_UsersNew;
            res.write(generateHTML(usersHtml_Users).usersHtml_Html);
            res.end();


        });
    }

    if ( url === "/new-user") {
        res.setHeader("Content-Type", "text/html");
        res.write(generateHTML(usersHtml_Users).usersHtml_Html);
        return res.end();
    }


    res.setHeader("Content-Type", "text/html");
    res.write(generateHTML(usersHtml_Users).usersHtml_Html);
    return res.end();



}


//i am able to add the new user input to usersHtml_Users
//and output usersHtml_Users as html
//but the usersHtml_Html does not want to update/change
//how can i make the usersHtml_Html update/change ?
//use a an html generator function ?
//i was able to do so with an html generator function
//but certainly there is a cleaner way to do it using
//function constructors or objects or something
//will check on it later

const server = http.createServer(serverHandler);
server.listen(3000);