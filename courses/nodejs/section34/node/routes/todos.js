
//(34.3.0)

const express = require("express");

const router = express.Router();


let todos = [];





//fetch todos
router.get("/todos", (req, res, next) => {
    res.json({todos: todos});
    res.status(201).json({message: "Todo created!", todo: newTodo});
});

//add todos
router.post("/todos", (req, res, next) => {
    const newTodo = {id: new Date().toISOString(), text: req.body.text};
    todos.push(newTodo);
});

//replace todos
router.put("/todos/:todoId", (req, res, next) => {
    const tid = req.params.todoId;
    const todoIndex = todos.findIndex(todo => {
      return todo.id === tid  
    });
    //replace the object we have there with a new object
    todos[todoIndex] = {id: todos[todoIndex].id, text: req.body.text};
    res.status(200).json({message: "Updated todo!"});
});

//delete a todo
router.delete("/todos/:todoId", (req, res, next) => {
    const tid = req.params.todoId;
    //replace the todo's array with a new array
    //function that executes on every element in the todo's array
    //if we return true, this element will be kept
    //if we return false, this element will be deleted
    todos = todos.filter(todo => {
        //true
        todo.id !== tid
    })
    res.status(200).json({message: "Deleted todo!"});

});


module.exports = router;

