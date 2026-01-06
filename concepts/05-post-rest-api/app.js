// ----------------------- POST API for save with Mongodb and Node js -----------------------

import express from 'express'   //npm i express
import { MongoClient } from 'mongodb'   // npm i mongodb 

const app = express()   //express package store in app variable

const dbName = "school";    //Connect database name: school
const url = "mongodb://localhost:27017";    //Connect local server

const client = new MongoClient(url);

app.set("view engine", "ejs") //Template setup

app.use(express.urlencoded({extended: true}))   //Middleware
app.use(express.json()) //Middleware

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

    //rendering add-students file for filled the form data
    app.get("/add", (req, res) => {
        res.render('add-students');
    });

    //Data get from add-students
    app.post("/add-students", async (req, res) => {
        
        const collection = db.collection("students");
        const result = await collection.insertOne(req.body);
        console.log(result);
        res.send("Data saved");
    });

    //http://localhost:3200/add-students-api

    app.post("/add-students-api", async (req, res) => {
        console.log(req.body);     
        
        const {name, age, email} = req.body;
        
        if(!name || !age || !email){
            res.send({message : "Operation Failed", success:false})
            return false
        }

        const collection = db.collection("students");
        const result = await collection.insertOne(req.body);
        res.send({message : "Data Stored", success: true, result: result});
    });

});

app.listen(3200);