

import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

//we could put the interface in a separate models files
interface Todo {
    id: string;
    text: string;
}

//array full of Todo objects
let todos: Todo[] = [];



//we have the ctx object instead of req,res and we have the next
router.get("/todos", (ctx) => {
    //oak will assume that this object should be added as json
    //so will transform it to json and set the appropriate response headers
    //oak will also always send back a response
    ctx.response.body = {todos: todos}
});


/*
Oak will automatically look into the request body and headers
and if the request signals that the request carries json data 
    by setting the appropriate request headers
then oak will automatically parse that body
and give us access to that parsed body
on the context request body field
but body is not an object with the parsed body
but gives a promise now

so we will use await/async for the data const
where body is a method

and can find the text in this returned data.value

*/
router.post("/todos", async (ctx) => {

    const data = await ctx.request.body();

    const newTodo: Todo = {
        id: new Date().toISOString(),
        text: data.value.text
    };

    todos.push(newTodo);
    ctx.response.body = {message: "created todo", todo: newTodo};

});



//we need to extract data from the params

router.put("/todos/:todoId", async (ctx) => {
   const tid = ctx.params.todoId;
   const data = await ctx.request.body();


   const todoIndex = todos.findIndex(todo => {
    return todo.id === tid  
  });
  //replace the object we have there with a new object
  todos[todoIndex] = {id: todos[todoIndex].id, text: data.value.text};

  ctx.response.body = {message: "Updated todo"};


});

router.delete("/todos/:todoId", (ctx) => {
    const tid = ctx.params.todoId;

    //replace the todo's array with a new array
    //function that executes on every element in the todo's array
    //if we return true, this element will be kept
    //if we return false, this element will be deleted
    todos = todos.filter(todo => {
        //true
        todo.id !== tid
    })

    ctx.response.body = {message: "Deleted todo"};


});


export default router;