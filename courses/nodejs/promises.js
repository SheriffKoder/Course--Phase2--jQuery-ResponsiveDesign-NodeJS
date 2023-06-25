///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
//Asynchronous code

//promise will start its code in its order of execution in your code (here its 1st)
//timeout code delay end, code start
//all the timer code will run, when reach.then, will be given to the background task till finished
//finished with /without delay, will output after timer code, 
//adding it in a function wrap/return will make the promise start later and wait + its full duration

//so a promise can do whatever it wants
//take the resolved data from a function so can use in between code
    //as a function would be waited for to finish 
    //and get into next code in the main-code ?

///////////////////////////////////////////////////////////////////////////////
///////////simple Promise
const myPormise = new Promise ((resolve, reject) => {
        resolve("Promise Resolved");
});

setTimeout(()=>{                                //this function will run after 5secs
    console.log("timeout delay ended");

    myPormise.then((PromiseFeedback) =>{        //.then waits for the resolve to happen
        console.log(PromiseFeedback);           //so we can use the resolve (defined string) value
        console.log(`promise resolved in = ${Math.floor((Date.now() - start)/1000)}s`);
    });

    console.log("dummy code1");  //this line will exe before / while the promise is wait/then
}, 5000);





///////////////////////////////////////////////////////////////////////////////
///////////Promise with time-stamp
const start = Date.now();
const myPormise = new Promise ((resolve, reject) => {

        console.log("Promise Start");
        setTimeout (() => {
            resolve("Promise Resolved");
        }, 10000);

});

setTimeout(()=>{                                //this function will run after 5secs

    console.log("timeout delay ended");

    myPormise.then((PromiseFeedback) =>{        //.then waits for the resolve to happen
        console.log(PromiseFeedback);           //so we can use the resolve (defined string) value
        console.log(`promise resolved in = ${Math.floor((Date.now() - start)/1000)}s`);

    });

    console.log("dummy code1");  //this line will exe before / while the promise is wait/then    

}, 5000);




///////////////////////////////////////////////////////////////////////////////
///////////complex multi promise callback with time-stamp
const start = Date.now();

const fetchData = () => {   //

    const myPormise = new Promise ((resolve, reject) => {

            console.log(`PROM: Time to reach the promise code = ${Math.floor((Date.now() - start) / 1000)}s`);
            console.log("PROM: Promise called");

            setTimeout(() => {
                resolve("PROM: Promise Resolved");
            }, 7000);

            console.log("PROM: Promise call ended, now waiting");
            console.log(`PROM: Time to end the promise code = ${Math.floor((Date.now() - start) / 1000)}s`);

            console.log("...........")

    });

    return myPormise;   //
}                       //

////in case promise used in Timeout1 as a const
//promise code will start and end, promise timeout will now wait
//timeout1 will run and wait for 5 secs to execute its code (promise already ran so will pass .then)
//promise timeout has 2secs remaining to return a promise

////in case promise is wrapped/returned in a function that is called in Timeout1
//timeout1 will run and wait for 5 secs to execute its code
//timeout1 will start the promise (not yet resolved) and pass .then
//after 7secs promise will be resolved


setTimeout(()=>{                                //this function will run after 5secs

    console.log("TIMER : Timeout1 ended, now will execute");                 //this execute first
    console.log(`TIMER : Time to reach timeout btw is = ${Math.floor((Date.now() - start) / 1000)}s`);
    console.log("...........")



    fetchData().then((PromiseFeedback) =>{
    //myPormise.then((PromiseFeedback) =>{        //.then waits for the resolve to happen
        console.log(PromiseFeedback);           //so we can use the resolve (defined string) value
        console.log(`TIMER THEN: Time to reach a resolve = ${Math.floor((Date.now() - start) / 1000)}s`);
        console.log("...........");
        return fetchData();
    }).then((PromiseFeedback) =>{
            console.log(PromiseFeedback);           //so we can use the resolve (defined string) value
            console.log(`TIMER THEN 2: Time to reach a resolve = ${Math.floor((Date.now() - start) / 1000)}s`);
            console.log("...........");
    });

    console.log("TIMER : the dummy code");  //this line will exe before / while the promise is wait/then    
    console.log(`TIMER : Timeout1 code end time = ${Math.floor((Date.now() - start) / 1000)}s`);
    console.log("...........");

}, 5000);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////



const hobbies = ["Sports", "Cooking"];

for (let hobby of hobbies) {
    console.log(hobby);
}


//define a custom method to a function constructor prototype
//to be used in new instances
newObject3.prototype.play = function () {
    console.log( `${this.name} + ${this.age}`);
}
let newObject3Copy2 = new newObject3("nameX", "ageX");

newObject3Copy2.play();



//pure function that does not depend on outer sources
const summarizeUser = (userName, userAge, userHasHobbies) => {
    return (
        "name is " + userName + 
        " age is " + userAge +
        " and the user has hobbies " + userHasHobbies
    );
}

console.log(summarizeUser(name, age, hasHobbies));


//////////////////////////////////////
//Arrow functions
const add = (a,b) => a + b;
console.log("add is " + add(1,2));


const addOne = a => a + 1;
console.log("addOne is " + addOne(1));

const addRandom = () => 4 + 1;
console.log("addRandom is " + addRandom(1));


let newObject4 = {
    name: "Max",

    greet2() {
        console.log("Hi i am," + this.name);
    }
}


//map takes a function that runs over every item in an array
//edit it accordingly and returns a new (edited) array
console.log(hobbies.map(hobby =>  "hobby: " + hobby));


//techniques of copying an array
const copiedArray1 = hobbies.slice();

////spread syntax, works for arrays and objects
//pulling elements OUT of an array
//pull out all elements or properties of an array
//and put it whatever is around that spread operator
//in this case the []
const copiedArray3 = [...hobbies];



////rest operator, the opposite to spread
//merging multiple arguments INto an array

//return an array that returns these arguments
const toArray1 = (arg1, arg2, arg3) => {
    return [arg1, arg2, arg3];
};
console.log(toArray1(1,2,3));


//more flexible way to add any number of arguments
//to the new array
const toArray2 = (...args) => {
    return args;
};
console.log(toArray2(1,2,3,4));


/*

//Destructuring
/*
const person = {
    name: "Max",
    age: 20
}

const printName = ({ name }) => {
    console.log(name);
}
printName(person);

//always pulled out by name
const { name, age } = person;
console.log(name, age);

//arrays pulled out by order
const hobbies = ["Sports", "Cooking"];
const [hobby1, hobby2] = hobbies;
console.log(hobby1, hobby2);





*/





