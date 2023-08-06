

const expect = require("chai").expect; //(30.0.2)
const sinon = require("sinon"); //(30.0.3)

const User = require("../models/user");

//import to test the login in the controller
const AuthController = require("../controllers/auth");


const mongoose = require("mongoose"); //(30.1.2) setup a testing database

require("dotenv").config(); //(29.0.1)

//the "it" will not wait for async code to return a promise .then
//use "done", a function that will be called when the code execution end
//will wait for you to call it
//and then you can call it in an async code snippet
//otherwise the test will pass on all occasions fail/succeed
describe("Auth Controller", function () {

    //(30.1.3)
    //initialization
    //with before, mocha will know you are done with initializations
    //then it will start running the test cases
    //will run before all test cases, not each test case
    before(function(done) {
        //const mongoDB_URI = "";
        mongoose.connect(process.env.MONGO_URI_TEST_MESSAGES)
        .then(result => {

            //testing logic
            //user should be created as 
            const user = new User({
                email: "test@test.com",
                password: "tester",
                name: "Test",
                posts: [],
                _id: "5c0f66b979af55031b34728a"
            });
            return user.save();
        })
        .then(() => {
            done();
        })
    });


    //to check wether the default statusCode 500 in the controller
    //gets applied correctly
    it("Should throw an error with code 500 if accessing the database fails", function (done) {

        //first step is to Stub the findOne method
        //to not make a database access

        sinon.stub(User, "findOne");
        //make findOne throw and error
        User.findOne.throws();


        //dummy request object
        const req = {
            body: {
                email: "test@test.com",
                password: "tester"
            }
        }

        //want when calling the AuthController.login method
        //that it actually throws an error
        //the code works async so the expect might work as expected
        //x so we added a return at the end of the login controller
        //x to return the promise hidden behind async/await
        //and that gave undefined, so will return the error instead
        //.then() as we return a promise in the login method now
        //which will execute when the method is finished
        //and there we want to check for the error status code

        //the controller logic either returns an undefined or an error

        AuthController.login(req, {}, () => {}).then(result => {
            //console.log(result);
            //an(object, string, null, promise etc.)
            expect(result).to.be.an("error");
            expect(result).to.have.property("statusCode", 500);
            //signal to mocha to wait for this async code to execute
            done();
        });


        User.findOne.restore();



    });


    //(30.1.2)
    //want to test a dummy user in a testing database
    //on the getUserStatus controller in auth.js
    it("should send a response with a valid user status for an existing user", function(done) {

        //the database uri with /test-messages
        //to create a testing database
        /*
        const mongoDB_URI = "mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/test-messages?retryWrites=true&w=majority";
        mongoose.connect(mongoDB_URI)
        .then(result => {

            //testing logic
            //user should be created as 
            const user = new User({
                email: "test@test.com",
                password: "tester",
                name: "Test",
                posts: [],
                _id: "5c0f66b979af55031b34728a"
            });
            return user.save();

        })
        */
        //.then(() => {

            const req = {
                //a mongoDB valid string format
                userId: "5c0f66b979af55031b34728a"
            };

            //we have a res object we can interact with just as in the auth.js controller
            const res = {
                statusCode: 500,
                userStatus: null,
                status: function(code) {
                    this.statusCode = code; //will be 200 from code
                    return this; //return this res object again
                },
                json: function (data) {
                    this.userStatus = data.status //user.status "I am new" by default
                }
            };

            //testing the getUserStatus controller
            //we need to pass a request with a user.id
            //and a our response object that has ha status method and a json method
            //where we then can set some status data
            //then as the getUserStatus is async and implicitly returns a promise
            AuthController.getUserStatus(req, res, () => {}).then(() => {
                //then i can define my expectation
                expect(res.statusCode).to.be.equal(200);
                expect(res.userStatus).to.be.equal("I am new")
                done();

            });

                /*
        })
        .catch(err => {
            console.log(err);
        });
        */

    });


    //(30.1.3)
    //clean-up
    //position of after in code does not matter
    after(function(done) {
        //clean: delete the created dummy user once done
        //as this test will create the same user again next time
        //and will throw an error and not quit the test process
        User.deleteMany({})
        .then(() => {
            
            //close the connection with the DB
            //because it is an open process will not allow the test 
            //to quit by itself
            return mongoose.disconnect();
            
        })
        .then(() => {
            done();
        });
    });


       





});