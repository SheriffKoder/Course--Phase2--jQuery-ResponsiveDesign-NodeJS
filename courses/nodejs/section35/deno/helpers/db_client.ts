

//the mongoClient will automatically take care about the connection
//manage that connection, setup multiple simultaneous connections
//use a concept called connection pooling
    //to give us the fastest way connecting to mongoDB
//import the Database type to use as a TS type
import {MongoClient, Database} from "https://deno.land/x/mongo@v0.31.2/mod.ts";


let db: Database;


//wrap the code in a function because
//want to export both connect and getDb
//and call connect from inside app.ts
//and getDb from todos.js to get access to the DB
export async function connect() {
    const client = new MongoClient();

    // Connecting to a Local Database
    await client.connect("mongodb+srv://sheriffkoder:Blackvulture_92@cluster0.jgxkgch.mongodb.net/?authMechanism=SCRAM-SHA-1");
      


    db = client.database("todo-app");

}


export function getDb() {
    //return the latest db object
    return db;
}