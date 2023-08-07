
//# udo npm install -g typescript  //(33.0.1)
//# tsc --init //(33.0.4) add a tsconfig.json file

//(33.0.3)
const num1Element = document.getElementById("num1") as HTMLInputElement;
const num2Element = document.getElementById("num2")as HTMLInputElement;
const buttonElement = document.querySelector("button")!;

//the ! means, that the expression before it could theoretically be null
//but we know that it isn't

//(33.0.2) add a number type
function add(num1: number, num2: number) {
  return num1 + num2;
}

//(33.0.4) if the below code runs, buttonElement cant be null
//if (buttonElement) {
  //(33.0.3)
  buttonElement.addEventListener("click", () => {
    const num1 = num1Element.value;
    const num2 = num2Element.value;

    //value will always return a string, so the IDE marks num1
    //to solve this we will convert it to a number with +
    //this is what TS is about, forced to write cleaner code by listening to the IDE
    const result = add(+num1, +num2); //convert to numbers and add
    const stringResult = add(num1, num2); //add numbers or concat strings
    console.log(result);

  });
//}



//console.log(add(1, 6));
//console.log(add('1', '6'));



///////////////////////////////////////////////////////////////////
//section 33

/*
///////////////////////////////////////////////////////////////////
//node.js with typescript (optional)

a new way of writing our node code

using node.js with typescript
writing node js as we did before 
with extra features provided by typescript


What is typescript ?
extends or builds up javascript, 

typescript does not run in the browser
has to be compiled to js so that it runs again

it gives a better development experience
as adds certain features to the code
which only exists during development
but certainly help us write better code
and avoid unwanted behaviors or errors

//////////////
in the console write some code
SHIFT + ENTER adds a new line 

function add(num1, num2) {
  return num1 + num2;
}

enter (commit to console)

add(1,5) //6
add("1", "5") //15 //this is an unwanted behavior
//////////////


we can check this code's input with js and will allow us to avoid such mistakes
but that means that you have to write extra code at runtime
to make sure that your code works

when you can avoid this during development if you have strict typechecks
> you can tell js in advance, what types of data you want
and then js and your IDE can warn you
when you have some code in your program where wrong types put in

//495
> Typescript, adds strict typing

Typescript adds a bunch of features to js
- adds Types
- adds next-gen javaScript Features (compiled down for older Browsers)
  without using extra tools (like babel)
- adds some non next-gen features that do not exist in js at all
  but that help us write cleaner code (like interfaces or Generics)
  these features are stripped away once compiled, but used in development
- adds meta-programming features like decorators
- has rich configuration options to allow us to fine tune how the code should be compiled
- gives us modern tooling and integrates greatly into modern tooling
  to give us a great development experience
  that helps in even non-typescript projects

we will understand the basics here
but for more details about Typescript check the "Understanding Typescript" course

TypeScript code converts to JavaScript, which runs anywhere JavaScript runs: 
In a browser, on Node.js or Deno and in your apps.



///////////////////////////////////////////////////////////////////
//(33.0.1)

//Typescript setup

>> download the .ts/.html files
>> download the typescript compiler

npm install typescript --save-dev
or
> sudo npm install -g typescript //to install it globally

nodejs has to be installed on your operating system first
(an installer like downloaded from nodejs site)


will execute the code in the browser
the browser does not run typescript
so the compiler will will convert typescript to javascript
(this compiler is built-into DENO)

//convert the .ts file to .js file
# tsc fileName_to_compile.ts
>> tsc app.js

>> import the .js file into the html file with the script tag
add the "defer" attribute to make sure the script (in head)
executed only after the full html body has been parsed


>> we will work in the .ts file not .js
in Deno you will not see these files because they are stored behind the scenes
we see it here because it is a basic project where we control everything on our own with the help of the compiler


>> install typescript, add .ts file, convert to .js, import .js into the html
now when open the html in the browser can see the console.log



///////////////////////////////////////////////////////////////////
//(33.0.2)
//Assigning Types

//using typescript in our code
//compiling TS code
//getting an error with TS code


we want to avoid that strings can pass in
we can set types on variables, parameters and other places

>> add type to the function parameters
to make it clear what type of values will be accepted here

> parameter:Type

some of the Types used in TS:
number; 1 , 5.3 , -10 (integers, decimals, negative)
string; single, double quotes, `` template literals
boolean; true, false (just these two, no "truthy" or "falsy")
object; a js object, more specific types {type of object} are possible
Array; can have flexible types in there or can also define the array element types
Any; any kind of value is allowed, a fallback 

>> compile code again, 
# tsc app.ts

> will get an error because we 
try to pass to the function a string
when we defined the parameter to have 
a strict type of number

however it did compile the code, this is a default feature can be adjusted
also in the compiled code, will see that the Type TS syntax is removed


///////////////////////////////////////////////////////////////////
//(33.0.3)

>> give id attr to the inputs in html
>> get these elements by id in the .ts code

TS builds up on JS, 
so you can build the code with js normally
then step by step add TS syntax

//inferred types (view/set)

when hovering over the buttonElement const 
typescript knows that the button we got from the query
is an html button type element (inferred type)
HTMLButtonElement is one of many built-in types
which are supported by TS out of the box
TS is able to know which type of value will be stored in this constant
because of the querySelector line
that is why it knows that we can call add event listener
 

//need to convince TS that the num1 we get access to 
//will be an input
//as we selected them by Id to TS has no chance
//knowing we selected input elements

//we can do something else regearing types
//type casting
//if we know a certain element will be of a certain type
//is to add the as keyword
// as HTMLInputElement;
//these are general DOM types built into TS 

// now we can access num1Element.value with opposition from the IDE
//giving red line under our syntax


>> finished with writing code ?
# tsc app.ts , refresh the browser


///////////////////////////////////////////////////////////////////
//(33.0.4)

//add configuration to the project
//so can walk through some core settings

>> add a configuration file
which will then be taken into account with the TS compiler to this project

# tsc --init

this will create a tsconfig.json
there are many options you can enable/uncomment and read their description

//we will talk about the "strict" option
strict mode is generally encouraged
certain things are not allowed which normally would be allowed in TS

when setting "strict" to true
there are other options below it that gets true (even though uncommented)
can comment out "strict" and select the strict options want 

now we have a red-line under buttonElement as it is expected to be null
this is checked by one of the "strict" options
not to call something on something else

as TS does not know if that button selected by the query
actually exists, it does not check the html code
> so this could be null if we have no button element

> solution to that,
1) check if buttonElement is truthy, and move the code into this if check
or
2) add ! after the querySelector line
//the ! means, that the expression before it could theoretically be null
//but we know that it isn't


!! see how trying to work around the red-lines gives a more error prone code ?


something else that would cause a red-line
if gave only one parameter in the add function a type
the un typed parameter will cause a red-line warning that there is no type set
so not setting any type is not allowed

!!!!!!
now after edited the code
running # "tsc app.js" will not take the config file into account or ignored
running # "tsc" will compile all TS files in the folder
  while taking the config file into account

the IDE always picks up the config json file
so the IDE support is always provided no matter how you compile it tsc app.js or just tsc


///////////////////////////////////////////////////////////////////
//(33.0.4)

//working with union types

now we added a configuration
let us say we want to make the add function a bit more flexible

to work with numbers but it should also work with strings

so the result convert num's to numbers and give them to add
and a stringResult constant, just adds or concatenate if string is incoming 

writing the stringResult without +'s will give a red-line








*/

