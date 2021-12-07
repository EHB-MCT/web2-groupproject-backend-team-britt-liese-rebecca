//const credentials = require("./credentials.js");
const {
    MongoClient
} = require("mongodb")
const cors = require ("cors");
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
app.use(cors());

//get route -> every route has at least 2 parameters at least: the url & the calback function with request & response
app.get('/', (req, res) => {
    res.send('Everything is OK!')
})

app.get('/challenges', async (req, res) => {
    //get data from mongo en send naar res
    // Demo op github (ex3)
    //this is the same but data on small level without mongodb database
    /*    let data = {
           name: "Challenge1",
           course: "webII",
           points: 1000
       }
       res.send(data) */

    try {
        //read the file
        //connect to the database
        await client.connect();
        console.log("Connected correctly to server");

        const db = client.db(dbName);
       
        const col = db.collection("challenges");  // Use the collection "challenges"
     
        const myDoc = await col.find({}).toArray();  // Find document & convert it to an array
        console.log(myDoc);   // Print to the console
        res.status(200).send(myDoc); //Send back the data with the response
    } catch (err) {
        console.log('error');
        res.status(500).send({
            error: 'an error has occured',
            value: error
        });
    } finally {
        await client.close();
    }
})

app.post('/challenges', async (req, res) => {
    //can only send data in the body 
    /* console.log(req.body);
    res.send('ok'); */

    if (!req.body.name || !req.body.points || !req.body.course || !req.body.session) {
        res.status(400).send('bad result, missing name, points, course or session');
        return;
    }

    try {
        //connect with database
        await client.connect();
        console.log("Connected correctly to server");
        // retrieve the collection data
        const db = client.db(dbName);
        const col = db.collection("challenges");  // Use the collection "challenges"
        
      //validation for double challenges 
      const myDoc = await col.findOne({name: req.body.name});  // Find document 
      if (myDoc){
        res.status(400).send('Bad request: boardgame already exists with name' + req.body.name);
        return; //cause we don't want the code to continue
        }

        //save new challenge
        let newChallenge = {
            name: req.body.name,
            points: req.body.points,
            course: req.body.course,
            session: req.body.session
        }
        
        //insert into database
        let insertResult = await col.insertOne(newChallenge);

        //send back succes message

        res.status(201).json(newChallenge);
        console.log(newChallenge)
        return;

    } catch (error) {
        console.log('error');
        res.status(500).send({
            error: 'an error has occured',
            value: error
        });
    }finally{
        await client.close();
    }
});

/* app.delete('/challenges/:id', async (req, res) => {
    try {
        //read the file
        //connect to the database
        await client.connect();
        console.log("Connected correctly to server");
        const db = client.db(dbName);
        const col = db.collection("challenges");  // Use the collection "challenges"
     
        await col.findOneAndDelete({req.body.name}).toArray();  // Find document & convert it to an array
    
        
    } catch (err) {
        console.log('error');
        res.status(500).send({
            error: 'an error has occured',
            value: error
        });
    } finally {
        await client.close();
    }
}) */


// create server with 'port' as fisrt variable & callback function as the second variable
app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
})
console.log("test")