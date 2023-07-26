
//(28.0.2)
//allows to build a schema which can be GQL or Express GQL
const {buildSchema} = require("graphql");

//to define a GQL schema we write a string
//no commas, new lines

//basic schema to send a hello query to get back "some text"

//add a separate type field with custom name "RootQuery"
//sub-queries
//can have all the different queries you can make
//say "hello" which returns a :String
// :String! means is required or get an error

//queries are the part we get data
//the return type of schema query

//that "some text" now is defined in the resolver
//we need a resolver for the hello in RootQuery
//but not need a resolver for the query in schema because it uses hello in the end


//(28.0.2)
/*
module.exports = buildSchema(`

    type TestData {
        text: String!
        views: Int!
    }

    type RootQuery {
        hello: TestData!
    }

    schema {
        query: RootQuery
    }

`);
*/

//(28.0.3)
//can specify arguments to the query name "createUser"
//can make it createUser(email: String, password: String )
//"input" special type for data that is used as an argument/data-input

//what do i get back after a user was created
//want to get back a user object
//createUser return a User! when its created
//for that will define a new type User
//do not necessarily need to return a password

//ID provided by graph.ql that signals that it is unique and treated as an id

//also need to define how a post should look like
//so will define a new type Post

//creator of type User
//having an array of Posts [Posts!]!

//RootQuery added //(28.0.4)

module.exports = buildSchema(`

    type Post {
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String
        posts: [Post!]!
    }

    input UserInputData {
        email: String!
        name: String!
        password: String!
    }

    type RootQuery {
        hello: String
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);