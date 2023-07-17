
//(22.0.1) Async requests

//get access to the delete buttons
//listen to a click on them
//and do something when they get clicked

const deleteProduct = (btn) => {
    //console.log(btn);

    //get access to the csrf token and the productId
    const prodId = btn.parentNode.querySelector("[name=productId]").value;
    const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

    //(22.0.3)
    //closest method provided by js
    //gives the closest ancestor element with that selector
    //as we have only one article in the ancestor history for the btn
    const productElement = btn.closest("article");

    //method supported by the browser for sending http requests
    //as we try to send to the router to activate the controller
    //for finding and "sending" data
    //fetch(url, {configObject})
    //will send to the same server if have no http:// before the url
    //can add a body config (post request not delete request)
    // /admin as we used the filering in app.js on the admin.js route
    fetch("/admin/product/"+ prodId, {
        //define that this is a delete request
        method: "DELETE",
        //in the headers we can encode our csrf token
        //t he csrf token looks in the req body as well as 
        //the query parameters and the headers, so we could add it there
        //you can find all the keys will be looked in the csurf Github docs
        headers: {
            "csrf-token": csrf
        }

    })
    //will return a promise that allows to listen to the response
    .then((result) => {
		//console.log(result);

        //(22.0.3)
        //this is the response from the fetch sending to route>controller>logic
        //a function that will return a new promise
        return result.json();
	})
    .then(data => {
        //then will have the data(response body)
        console.log(data);
        //(22.0.3)
        //productElement.remove(); //will work on all modern browsers but not IE
        productElement.parentNode.removeChild(productElement); //will work on all modern browsers
    })
	.catch((err) => {
		console.log(err);
	})




}