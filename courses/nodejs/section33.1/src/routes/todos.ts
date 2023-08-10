
//(33.2.0)
//import express from "express";
import { Router } from "express";

//(33.2.1)
import { Todo } from '../models/todo';

//(33.3.0)
type RequestBody = { text: string };
type RequestParams = { todoId: string}

//(33.2.1) #1
//set type for todos to be an array full of Todos
let todos: Todo[] = [];

//const router = express.Router();
const router = Router();








router.get("/", (req, res, next) => {

    //(33.2.1) #1
    res.status(200).json({todos: todos});

});


//(33.2.1)
//expose a route for adding a todo
//set type of newTodo to Todo
//to allow TS to force us to write the correct data to this object
//because an empty object would not match the defined type
//it lets us avoid omitting/forgetting data
router.post("/todo", (req, res, next) => {
    
    //(33.3.0)
    //const body = req.body as { text: string }
    const body = req.body as RequestBody;

    //(33.2.1) #2
    const newTodo: Todo = {
        id: new Date().toISOString(),
        //expect on the incoming request body we have 
        //a text field that holds the text we want to add
        //text:  req.body.text
        text: body.text //(33.3.0)
    };

    todos.push(newTodo);

    res.status(201).json({message: "added todo", todo: newTodo, todos: todos});



});



//(33.2.2)
//request reaching this route, replaces a todo
//want to override the todo identified by the param
router.put("/todo/:todoId", (req, res, next) => {

    //(33.3.0)
    const body = req.body as RequestBody;
    const params = req.params as RequestParams;
    
    
    //const tid = req.params.todoId;
    const tid = params.todoId;

    //find the index of that todo in the todos array
    //want to return the index of the todo item
    //having the id of the tid
    const todoIndex = todos.findIndex(todoItem => todoItem.id === tid);

    //if we found a valid index
    if (todoIndex >= 0) {
        //an empty object is not a valid todo
        //will keep the same id
        //todos[todoIndex] = { id: todos[todoIndex].id, text: req.body.text };
        todos[todoIndex] = { id: todos[todoIndex].id, text: body.text };     //(33.3.0)

        //return all our todos
        //we return to avoid the next res. to be executed
        return res.status(200).json({message: "Updated todo", todos: todos});
    }

    //if not found
    res.status(404).json({message: "Could not find todo for this id."});


});



//(33.2.2)
//want to attach any data that is parsed from the incoming request
//in the request body


router.delete("/todo/:todoId", (req, res, next) => {

    //(33.3.0)
    const params = req.params as RequestParams;
        
    //update the todos to get rid of one
    //filter runs a function on every todo
    //if it returns true, we keep the todo
    //if returns false, we delete it
    //todos = todos.filter(todoItem => todoItem.id !== req.params.todoId);
    todos = todos.filter(todoItem => todoItem.id !== params.todoId);     //(33.3.0)

    res.status(200).json({message: "deleted todo", todos: todos});

});











export default router;