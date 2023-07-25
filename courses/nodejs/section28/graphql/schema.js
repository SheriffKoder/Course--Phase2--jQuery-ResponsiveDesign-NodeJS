
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