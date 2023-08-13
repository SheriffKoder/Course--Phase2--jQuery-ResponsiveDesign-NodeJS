import { Router } from "https://deno.land/x/oak/mod.ts";

const router = new Router();

//(35.0.3) import the Object id data type to use in the get router
import {Bson} from "https://deno.land/x/mongo@v0.31.2/mod.ts";


//(35.0.2)
//we will call this function whenever we want access to the DB
//and then use the DB to store/get data
import {getDb} from "../helpers/db_client.ts";
 

//we could put the interface in a separate models files
interface Todo {
  id?: string; // ? means the attribute is optional
  text: string;
}
 
//-(35.0.4)
//array full of Todo objects
//let todos: Todo[] = [];



router.get('/todos', async (ctx) => {

    //(35.0.3)
    //connect to the database, connect to a specific collection
    //find will return a promise so will call async

    const dbTodos = await getDb().collection('todos').find().toArray();
    //we will back an array of documents containing {_id: ObjectId, test: String} types

    //map has a function that runs on every todos object
    //return the transformed object
    //todo will be of an object type

    const transformedTodos = dbTodos.map((todo) => ({ id: todo._id.toString(), text: todo.text }));
            //store the id in the new id property
        //$oid will hold the generated id by mongoDB as a "string" not ObjectId object




    //oak will assume that this object should be added as json
    //so will transform it to json and set the appropriate response headers
    //oak will also always send back a response
    //ctx.response.body = {todos: todos}    
    ctx.response.body = { todos: transformedTodos };
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



// creating a todos
router.post('/todos', async (ctx) => {
  const data = await ctx.request.body().value;
  const newTodo: Todo = {
        //id: new Date().toISOString(), //commented out as mongoDB will create an Id for us
        text: data.text
  };
 
    //(35.0.3)
    //insert one new todo
    const id = await getDb().collection('todos').insertOne(newTodo);
 
    //$oid to get this id as a string
    //a property exists on the objectId type
    newTodo.id = id.$oid;
 
    //todos.push(newTodo);
    ctx.response.body = { message: 'Created todo!', todo: newTodo };
});
 

//we need to extract data from the params

router.put('/todos/:todoId', async (ctx) => {
    // add ! to make it clear to TS that this will never be undefined
    const tid = ctx.params.todoId!;
    const data = await ctx.request.body().value;

    //-(35.0.4)
    /*
    const todoIndex = todos.findIndex(todo => {
    return todo.id === tid  
    });
    //replace the object we have there with a new object
    todos[todoIndex] = {id: todos[todoIndex].id, text: data.value.text};
    */

    //(35.0.4)
    //updateOne takes the document we want to update
    //and 2nd argument the update instructions
    //convert the tid to an ObjectId
    //#set mongodb syntax

    await getDb().collection('todos')
    .updateOne({ _id: new Bson.ObjectId(tid) }, { $set: { text: data.text } });
 
    ctx.response.body = { message: 'Updated todo' };
});


 
router.delete('/todos/:todoId', async (ctx) => {
    const tid = ctx.params.todoId!;
     //replace the todo's array with a new array
    //function that executes on every element in the todo's array
    //if we return true, this element will be kept
    //if we return false, this element will be deleted
    //-(35.0.4)
    /*
    todos = todos.filter(todo => {
        //true
        todo.id !== tid
    })
    */

    //(35.0.4)
    await getDb().collection('todos').deleteOne({ _id: new Bson.ObjectId(tid) });
 
    ctx.response.body = { message: 'Deleted todo' };
});
 
export default router;