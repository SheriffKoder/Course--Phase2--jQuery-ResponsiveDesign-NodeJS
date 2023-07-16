
//(19.0.1)
const sum = (a, b) => {

    if (a && b) {
        return a + b;
    } 
    //throw is a built in keyword
    //Error is a built in object node ships with
    //this is an unhandled error, causes node app to crash
    throw new Error("Invalid Arguments");

}

//console.log(sum(1));
//if used only one argument, will get NaN
//which is not a technical error object 
//so will use throw new Error
//as the error is not try-catch it will stop the app and crash

//to handle such error for a sync code
//try (the code), catch (how we can handle it)
try {
    console.log(sum(1));
} catch (error) {
    console.log("error occurred");
    //console.log(error);
}
console.log("this line still executes after catching the error");

//thus we can send an invalid page informing the user that something bad happened
//without stopping all the code

//this is also what the express-validator package do with the thrown error

//catches it, add it to its own errors array 
//and allows us to read that list of errors it caught
