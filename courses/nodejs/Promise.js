
//Asynchronous code

//promise will start its code in its order of execution in your code (here its 1st)
//timeout code delay end, code start
//all the timer code will run, when reach.then, will be given to the background task till finished
//finished with /without delay, will output after timer code, 
//adding it in a function wrap/return will make the promise start later and wait + its full duration

///////////////////////////////////////////////////////////////////////////////
///////////simple Promise

const myPormise = new Promise ((resolve, reject) => {
        resolve("Promise Resolved");
});

setTimeout(()=>{                                //this function will run after 5secs
    console.log("timeout delay ended");

    myPormise.then((PromiseFeedback) =>{        //.then waits for the resolve to happen
        console.log(PromiseFeedback);           //so we can use the resolve (defined string) value
    });

    console.log("dummy code1");  //this line will exe before / while the promise is wait/then
}, 5000);
