

const authMiddleware = require("../middleware/isAuth");

//a unit test when we just want to test our function
//if all unit tests succeeds you have a great chance for all the overall application
//to be working correctly
//its easier to write and easier to track bugs in code with


//to a functionality flow tracing - integration test
//test whether the test is routed correctly, then also the middleware and controller 
//but you do not test that very often because it is complex to test such long chains


//want to test if did not get authorization header
//create a dummy request object we pass in
//


it("should throw an error if no authorization header is present", function () {

    //because in the auth middleware calling get on req
    const req = {
    };







})