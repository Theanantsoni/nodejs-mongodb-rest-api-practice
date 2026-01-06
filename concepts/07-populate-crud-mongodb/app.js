// ----------------------- Populate Data with Mongodb in Node js -----------------------

import express from 'express'   //npm i express
import { MongoClient, ObjectId } from 'mongodb'   // npm i mongodb 

const app = express()   //express package store in app variable

const dbName = "school";    //Connect database name: school
const url = "mongodb://localhost:27017";    //Connect local server

const client = new MongoClient(url);

app.set("view engine", "ejs") //Template setup

app.use(express.urlencoded({extended: true}))   //Middleware
app.use(express.json()) //Middleware

client.connect().then((connection) => {
    const db = connection.db(dbName);

    // Display data on UI without rendering students.ejs file

    app.get("/api", async (req, res) => {
        const collection = db.collection("students");
        const students = await collection.find().toArray();
        res.send(students);
    });

    // Display data on UI in table format using students.ejs file rendering

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

    // Add data using ThunderClient : POST - http://localhost:3200/add-students-api

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

    //Delete data on ThunderClient using ID : DELETE - http://localhost:3200/delete/id

    app.delete("/delete/:id", async (req, res) => {
        console.log(req.params.id);
        const collection = db.collection("students");
        const result = await collection.deleteOne({_id: new ObjectId(req.params.id)})
        
        if(result.deletedCount === 1){      
            res.send({
                message: "Student data is deleted.",
                success: true
            })
        }
        else{
            res.send({
                message: "Error: Student data not deleted.",
                success: false
            })
        }
    });

    // Delete data on UI using ID when we click delete button in UI

    app.get("/ui/delete/:id", async (req, res) => {
        console.log(req.params.id);
        const collection = db.collection("students");
        const result = await collection.deleteOne({_id: new ObjectId(req.params.id)})
        
        if(result.deletedCount === 1){      
            res.send(`
                <h1>Student record deleted.</h1>    
            `)
        }
        else{
            res.send(`
                <h1>Error in delete student record.</h1>    
            `)
        }
    });

    // Fetch data on UI using ID : http://localhost:5000/ui/students/id

    app.get("/ui/students/:id", async (req, res) => {
        console.log(req.params.id);
        const collection = db.collection("students");
        const result = await collection.findOne({_id: new ObjectId(req.params.id)})
        res.send(result);
    });

    //Fetched data into ThunderClient using ID : GET - http://localhost:5000/update/id

    app.get("/update/:id", async (req, res) => {
        const id = req.params.id;
        console.log(id);
        const collection = db.collection("students");
        const result = await collection.findOne({_id: new ObjectId(req.params.id)});

        res.send({
            message: 'Data fetched',
            success: true,
            result: result
        })
    });

    // Update data into Thunder Client - {Body} in JSON Format : POST - http://localhost:5000/update/id
    
    app.post("/update/:id", async (req, res) => {
        const result = await db.collection("students").updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.send({
                success: false,
                message: "ID not found"
            });
        }

        res.send({
            success: true,
            message: "Data updated successfully"
        });
    });

    // Get data with table form and display old data on UI

    app.get("/ui/update-students/:id", async (req, res) => {
        const student = await db.collection("students").findOne({
            _id: new ObjectId(req.params.id)
        });

        res.render("update-students", { student });
    });

    // Submit form with new filled data on UI

    app.post("/ui/update-students/:id", async (req, res) => {
        await db.collection("students").updateOne(
            { _id: new ObjectId(req.params.id) },
            {
                $set: {
                    name: req.body.name,
                    age: req.body.age,
                    email: req.body.email
                }
            }
        );

        res.redirect("/ui");
    });

});

app.listen(5000);