// Setup Server

// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const port = 8000;

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require('body-parser');

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

//POST route
app.post("/add", async (req, res) => {
    const body = await req.body;
    projectData = body;
    res.status(200).send(projectData); //only sends if successful
});

//GET route
app.get("/all", async (req, res)=>{
    res.send(projectData);
});

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
app.listen(port, () => {
    console.log("Server is running on port "+ port +"...");
});