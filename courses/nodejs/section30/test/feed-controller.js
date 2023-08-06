

const expect = require("chai").expect; //(30.0.2)
const sinon = require("sinon"); //(30.0.3)

const User = require("../models/user");

//import to test the login in the controller
const FeedController = require("../controllers/feed");
const io = require("../socket"); //(27.0.4) in the controller flow

const mongoose = require("mongoose"); //(30.1.2) setup a testing database

require("dotenv").config(); //(29.0.1) hiding variables

//the "it" will not wait for async code to return a promise .then
//use "done", a function that will be called when the code execution end
//will wait for you to call it
//and then you can call it in an async code snippet
//otherwise the test will pass on all occasions fail/succeed
describe("Feed Controller", function () {

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



    //test if a post is created successfully
    //then add it to the post array of the user

    //looking into the createPost controller code flow 
    //we find that to reach its success end we need
    //req.file.path
    //req.body.title, req.body.content
    //req.userId


    it("should add a created post to the posts of the creator", function(done) {

        const req = 
        {
            body: {
                title: "Test Post",
                content: "A Test Post"
            },
            file: {
                path: "abc"
            },
            userId: "5c0f66b979af55031b34728a"
        };

        //we need the response just not to get an error, 
        //as it is used in res.status(201).json
        //not need contents
        const res =
        {
            status: function() {
                //return a reference to this res object which has a json
                return this;
            },
            json: function() {}
        };

        //stub the io in the controller code flow to not cause an error
          const stub = sinon.stub(io, 'getIO').callsFake(() => {
            return {
                emit: function() {}
            }
        });

        FeedController.createPost(req, res, () => {})
        .then((savedUser) => {
            expect(savedUser).to.have.property("posts");
            expect(savedUser.posts).to.have.length(1);
            stub.restore();
            done();
        })
        .catch(err => {
            console.log(err);
        })



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