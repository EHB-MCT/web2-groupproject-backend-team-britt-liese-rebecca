const express = require ('express');
const bodyParser = require ('body-parser');
const app = express();
const port = process.env.PORT || 1337;

app.use(express.static('public'))
app.use(bodyParser.json());


//get route -> every route has at least 2 parameters at least: the url & the calback function with request & response
app.get('/', (req, res) => {
    res.send('Everything is OK!')
})

app.get('/challenges', (req, res) => {
    let data = {
        name: "Challenge1",
        course: "webII",
        points: 1000
    }
    res.send(data)
})

// create server with 'port' as fisrt variable & callback function as the second variable
app.listen(port,() => {
    console.log(`API is running at http://localhost:${port}`);
} )
console.log("test")