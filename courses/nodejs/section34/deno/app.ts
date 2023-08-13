

//(34.3.1)
import { Application } from "https://deno.land/x/oak/mod.ts";

//must keep the file extension
import todosRoutes from "./routes/todos.ts";

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


app.use(todosRoutes.routes());
//also register this to make sure that Oak properly handles incoming requests
//to your routes
app.use(todosRoutes.allowedMethods());


await app.listen({ port: 3000 });

// deno run --allow-net app.ts
