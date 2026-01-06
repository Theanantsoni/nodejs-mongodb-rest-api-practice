// ----------------------- Display data from  Mongodb  on UI with Node js -----------------------

import express from 'express'   //npm i express
import { MongoClient } from 'mongodb'   // npm i mongodb 

const app = express()   //express package store in app variable

const dbName = "school";    //Connect database name: school
const url = "mongodb://localhost:27017";    //Connect local server

app.set("view engine", "ejs") //Template setup

const client = new MongoClient(url);

// Data display code :

app.get("/", async (req, res) => {

    await client.connect()      
    const db = client.db(dbName);

    const collection = db.collection('students');   //Connect collection name: students

    const students = await collection.find().toArray();   //data in array formats
    console.log(students);    //display data 

    res.render("students", {students});
});

app.listen(3200);
