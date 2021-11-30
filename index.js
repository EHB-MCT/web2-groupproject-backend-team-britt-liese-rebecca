//const credentials = require("./credentials.js");
const {
    MongoClient
} = require("mongodb")
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 1337;

// extra variable & info fr mongodb to work
const url = `mongodb+srv://teamwork:britt@cluster0.fkenc.mongodb.net/teamwork?retryWrites=true&w=majority`;
const client = new MongoClient(url);
//console.log(credentials)

// The database to use

const dbName = "teamwork";

app.use(express.static('public'))
app.use(bodyParser.json());


//get route -> every route has at least 2 parameters at least: the url & the calback function with request & response
app.get('/', (req, res) => {
    res.send('Everything is OK!')
})

app.get('/challenges', async (req, res) => {
    //get data from mongo en send naar res
    // Demo op github (ex3)
    //this is the same but data on small level without mongodb
    /*    let data = {
           name: "Challenge1",
           course: "webII",
           points: 1000
       }
       res.send(data) */
    try {
        //connect to the database
        await client.connect();
        console.log("Connected correctly to server");

        const db = client.db(dbName);
        // Use the collection "people"
        const col = db.collection("challenges");
        // Find document
        const myDoc = await col.find({}).toArray();

        // Print to the console
        console.log(myDoc);
        //Send back the data with the response
        res.status(200).send(myDoc);
    } catch (err) {
        console.log(err.stack);
    } finally {
        await client.close();
    }
})


// create server with 'port' as fisrt variable & callback function as the second variable
app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
})
console.log("test")