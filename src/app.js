var express = require('express');
const redis = require("redis");
const cors = require("cors");
var app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json())

let client = redis.createClient(6379);

client.on('error', (err) => {
  console.log(err);
});
client.connect();

// This responds with "Hello World" on the homepage
app.get('/', async function (req, res) {
   try {
      let leaderboard = await client.zRangeWithScores("sortiermeister_leaderboard", 0, -1,);
      res.send(leaderboard);
   } catch(e) {
      console.log(e);
      res.status(500).send("Internal Server Error");
   }
})

app.post('/record', async function (req, res) {
   console.log("post");
   console.log(req);
   const score = req.body.score;
   const name = req.body.name;
   
   if (!score || !name) return res.status(400).send("error");

   try {
       await client.zAdd("sortiermeister_leaderboard", [{score, "value": name}])
       return res.status(200).send();
   } catch (error) {
       console.error("Error adding record to Redis:", error);
       return res.status(500).send("Internal Server Error");
   }
})

app.listen(PORT, () => {
    console.log('App listening on Port ' + PORT);
})