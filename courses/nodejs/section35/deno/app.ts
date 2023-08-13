

//(34.3.1)
import { Application } from "https://deno.land/x/oak/mod.ts";

//must keep the file extension
import todosRoutes from "./routes/todos.ts";

//(35.0.2)
import { connect } from "./helpers/db_client.ts";
connect();

const app = new Application();

//ctx, context, summarizes the request/response objects into one

//oak automatically sends back a response
//whenever it is done executing a middleware, "any" not "all" middleware's

//the route middleware's will return a promise
//when the stuff in them is finished

//this middleware will return a response too early
//before the route middleware's has been able to process the request

//thus if have any middleware that do async stuff
//should make all the middleware's async
//and always await next

//this way we tell oak
//to wait for other middleware's to finish
//before we send back this automatically generated response
//otherwise the response bodies set by our async route middleware's
//will not be taken into account
app.use( async (ctx, next) => {
    console.log("Middleware");
    await next();
});


//(35.0.1)
//middleware makes sure that every outgoing response
//has the proper headers attached
app.use( async (ctx, next) => {
    //every domain is allowed to access our resources/send a request
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    //which http methods can for requests being sent to this backend
    ctx.response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    //which headers may be set by the frontend when it requests data
    //because on the frontend app we set the content-type to application/json
    //which tells the backend that the data will be sent will be in the JSON format
    //which allows Oak on the backend to automatically parse that
    //when we try to get access to the request body
    ctx.response.headers.set("Access-Control-Allow-Headers", "Content-Type")
    await next();
});


app.use(todosRoutes.routes());
//also register this to make sure that Oak properly handles incoming requests
//to your routes
app.use(todosRoutes.allowedMethods());


await app.listen({ port: 8000 });

// deno run --allow-net app.ts





/*
///////////////////////////////////////////////////////////////////
//Section 35


///////////////////////////////////////////////////////////////////
//(35.0.0)

doing more with deno
will connect the previous REST API
with a front-end and MongoDB database

we have an attached front-end app in the folder

>> cd to the FE folder
>> # npm install
>> # npm start (start the front-end server)


>> open a new terminal/console with the + sign

>> change the listening port of the deno app to 8000
>> run the deno app from the deno folder
# deno run --allow-net app.ts


> in the FE > src > components > todos.js
change the url to connect to 8000 instead of 3000

///////////////////////////////////////////////////////////////////
//(35.0.1)

> now we will face a cors error
by default browsers prevent GET/POST/PATCH etc.
if frontend and backend are not on the same server

we can tell the browser that we do want to allow access
we have to set this setting
on the server where we do post the data on the REST API

send specific response headers to the responses we send back
to the front-end application
that getting this data is ok and the FE should proceed 

which is a browser mechanism
this is why we did not face that in postman

>> add the cors middleware in app.ts with async/await



///////////////////////////////////////////////////////////////////
//(35.0.2)


the frontend allows to add todos and edit them
but until now this is stored to the memory

time to add a database

we will add a third-party deno module
"mongo"
which is a wrapper for the native RUST mongoDB library
a programming language used by Deno under the hood

>> copy the module import line

>> add a new folder, helpers
> add file "db_client.ts"
>> where we will put the database management logic in there

> copy some initiating code from the package docs
> insert the mongoDB URI (node.js)
> connect to the "todo-app" database


naming conventions
in node file names separated by dashes -
in Deno separated by _


>> export the connect and db functions from db_client
>> import the connect function in app.ts

///////////////////////////////////////////////////////////////////
//(35.0.3)

//using the MongoDB Client module
//connecting to the DB

>> work on the get route
find all, map all, return to put in the response.body
>> work on the post route
insert the newTodo into the database
and change the id for the newTodo to be added when used in the response.body

//but we get an error
as Deno uses RUST feature called plugins

max used this command to run the app without errors
# deno run --allow-net --unstable --allow-read --allow-write --allow-plugin

however the connect line code in db_client.ts
has changed on the mongo package docs

i used the "//connect using srv url" method
stated, it connects, but does not give an error like max faced regarding permissions


///////////////////////////////////////////////////////////////////
//(35.0.4)

>> work on the update, delete routes


# deno run --allow-net app.ts

///////////////////////////////////////////////////////////////////
//course wrap up

keep on practicing
build example projects
clone popular apps
build your own simplified clones

you will face issues,
don't know how to continue
to research and dig through that problem on your own
this is the most important part

learn more about the APIs, GraphQL
built examples there too

dive into serverless technologies and services
there is a course on that
more on the logic less on spinning up a server

dive into frontend development







//we could put the interface in a separate models files
interface Todo {
    id?: string;    //the ? makes it optional
    text: string;
}







*/