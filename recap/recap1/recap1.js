

console.log("Hello");

////////////////////////////////////////////////////////////////////////
////strict functions
function sum() {
    //"use strict"
    this.myNumber = 20;
}

sum();
console.log(myNumber);

////////////////////////////////////////////////////////////////////////
////switch cases
let foo = "SSA";
let xSwitch;

switch (foo) {
    case "SS": {
        xSwitch = 1;
        break;
    }
    default: {
        xSwitch=2;
    }
}

console.log(xSwitch);


////////////////////////////////////////////////////////////////////////
//Objects

const newObject = {};
newObject.key1 = "key1";
console.log(newObject.key1);

const newObject2 = {
    key1: [[8,9],2,3],

    key2: function (fnConfig) {
        console.log("Key function");
        this.myConfig = fnConfig
        console.log(this.myConfig);

    },

    "two wordkey": "two word key",


}

//key access
console.log(newObject2.key1[0][0]);

//function key use
newObject2.key2("pass key to object function");

//create key
newObject2["key3"] = "SS";
console.log(newObject2["key3"]);
console.log(newObject2);

//access a string key
console.log(newObject2["two wordkey"]);

//access a string key
let xObj = "two";
console.log(newObject2[xObj +" wordkey"]);

//create key using defineProperty
const object1 = {};
Object.defineProperty(newObject2, 'property1', {
    value: 42,
    writable: false
  });  
console.log(newObject2.property1);
// Expected output: 42





//convert an object or array to JSON and switch back
//but have to stringify any functions before that
newObject2.key2 = newObject2.key2.toString(); 

let stringObject = JSON.stringify(newObject2);
console.log(stringObject);

let retrievedObject = JSON.parse(stringObject);
console.log(retrievedObject.key2);





//using custom toString on objects
function newObject3(name, age) {
    this.name = name;
    this.age = age
}

newObject3.prototype.toString = function objectToString () {
    return `my name is ${this.name} my age is ${this.age}`;
}


let newObject3Copy = new newObject3("myName", "myAge");
console.log(newObject3Copy.toString());

//update property with assign
//merging objects separate using the spread syntax
//copy an object(not reference) in another object using spread
//spread in functions
//spread to copy an array to another array format and concatenate


//output keys using Object.keys, and for(let x in y)
let x = newObject2.hasOwnProperty("key1");
console.log(x);

console.log(Object.keys(newObject2));

for(let prop in newObject2) {
    console.log(prop);
}


//define a custom method to a function constructor prototype
//to be used in new instances
newObject3.prototype.play = function () {
    console.log( `${this.name} + ${this.age}`);
}
let newObject3Copy2 = new newObject3("nameX", "ageX");

newObject3Copy2.play();



// * hashtag and create example from above *