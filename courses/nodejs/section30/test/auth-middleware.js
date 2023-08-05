
const expect = require("chai").expect; //(30.0.2)

const authMiddleware = require("../middleware/isAuth"); //(30.0.2)

const jwt = require("jsonwebtoken"); //(30.0.3)

const sinon = require("sinon"); //(30.0.3)


//a unit test when we just want to test our function
//if all unit tests succeeds you have a great chance for all the overall application
//to be working correctly
//its easier to write and easier to track bugs in code with


//to a functionality flow tracing - integration test
//test whether the test is routed correctly, then also the middleware and controller 
//but you do not test that very often because it is complex to test such long chains


//organizing test cases
//later when having many tests, it will become complex to read all the outputs
//beside "it", mocha also gives the "describe" function
//to group your tests
//and can nest as many describes function calls as you want

//takes a string, which is not like an english sentence
//but instead like a header describing the group

//takes a function as a second argument
//that contains all the "it" cases
//can also have a describe in a describe


describe("Auth middleware", function () {

    //want to test if did not get authorization header
    //first part of the function
    //create a dummy request object we pass in
    //simulate not get an authorization header
    it("should throw an error if no authorization header is present", function () {

        //because in the auth middleware calling get on req
        //get should return the value of the authorization header
        const req = {
            get: function() {
                return null;
            }

        };

        //pass our own request to the auth middleware
        //it has all what it need for this test
        //empty response object, because we are not testing anything related
        //and the part of the code we are testing does not rely on response
        //same for next
        //expect the code to throw and error, with the same message defined in our code
        //can leave throw empty if just want to check on an error not with a specific message

        //this should pass without an error because i am expecting an error
        //for that want the tools to call the function, 
        //if i call it, it will give an error before checking on the throw
        //for that we use bind and "this" added to the arguments we pass
        //where we pass a reference to the function
        //expect(authMiddleware(req, {}, () => {})).to.throw("Not Authenticated");
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw("Not Authenticated");

    });

    //checking on the 2nd part of the function, if not splitable
    it("should throw an error if the authorization header is only one string", function () {

        //
        const req = {
            get: function() {
                return "xyz";
            }

        };
        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();

    });


    //make sure the userId of the decodedToken gets passed to the req object (before next)
    //what if we want to test when we have a token
    //whether this is a valid token or not
    it("should yield a userId after decoding the token", function () {

        //xyz is the token that will actually be used
        //certainly will be an incorrect token
        const req = {
            get: function() {
                return "Bearer xyz";
            }

        };

        //(30.0.3)
        //overwriting the verify method the middleware have
        //to give us a "forced" userId
        // jwt.verify = function () {
        //    return { userId: "abc" };
        // }

        //pass in the object where i have the method i want to replace
        //and the actual method
        //by default will replace with an empty function
        //and function calls (can test if function is called)
        sinon.stub(jwt, "verify")
        //can call jwt.verify which is a stub
        //returns configure what this function should return
        jwt.verify.returns({userId: "abc"});
        //now whenever we use jwt.verify this get used
        //then we can restore it after expecting ends


        //(30.0.2)
        authMiddleware(req, {}, () => {});
        expect(req).to.have.property("userId");


        //(30.0.3)
        expect(req).to.have.property("userId", "abc");
        //check if the verify method has been called (by stub)
        expect(jwt.verify.called).to.be.true;
        //restore the method from sinon stub to its original
        //to be used correctly in next "it"s
        jwt.verify.restore();


    });



    //part 3 of the function, tokens
    //how can we test that the test fails for incorrect tokens
    //if we pass anything into our function,
    //other than the generated token from verify (which we cannot guess) it will fail
    //we are not testing "verify" itself
    it("should throw an error if the token cannot be verified", function () {

        //xyz is the token that will actually be used
        //certainly will be an incorrect token
        const req = {
            get: function() {
                return "Bearer xyz";
            }

        };

        expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();



    });







});


