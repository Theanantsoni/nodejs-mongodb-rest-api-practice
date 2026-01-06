// ----------------------- Make API with  Mongodb and Node js  -----------------------

import express from 'express'   //npm i express
import { MongoClient } from 'mongodb'   // npm i mongodb 

const app = express()   //express package store in app variable

const dbName = "school";    //Connect database name: school
const url = "mongodb://localhost:27017";    //Connect local server

const client = new MongoClient(url);

app.set("view engine", "ejs") //Template setup

client.connect().then((connection) => {
    const db = connection.db(dbName);

    app.get("/api", async (req, res) => {
        const collection = db.collection("students");
        const students = await collection.find().toArray();
        res.send(students);
    });

    app.get("/ui", async (req, res) => {
        const collection = db.collection("students");
        const students = await collection.find().toArray();
        res.render("students", {students});
    });

});

app.listen(3200);