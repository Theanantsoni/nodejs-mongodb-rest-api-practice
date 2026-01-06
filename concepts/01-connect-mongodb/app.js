// ----------------------- Connect MongoDB with nodeJS -----------------------

import express from 'express'   //npm i express
import { MongoClient } from 'mongodb'   // npm i mongodb 

const app = express()   //express package store in app variable

const dbName = "school";    //Connect database name: school
const url = "mongodb://localhost:27017";    //Connect local server

const client = new MongoClient(url);

async function dbConnection(){  
    await client.connect()      
    const db = client.db(dbName);

    const collection = db.collection('students');   //Connect collection name: students

    const result = await collection.find().toArray();   //data in array formats
    console.log(result);    //display data 
}

dbConnection()  //function calling

app.listen(3200);