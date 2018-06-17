const MongoClient = require("mongodb").MongoClient;
const newGame = require("./newGame");
const getLineup = require("./getLineup");
const postLineup = require("./postLineup");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

var db;

app.get("/", (req, res) => {
  return res.send("Connected to server.");
});

app.post("/getlineup", (req, res) => {
  getLineup(db, req.body.playerAddress, function(data) {
    res.end(JSON.stringify(data));
  });
});

app.post("/postlineup", (req, res) => {
  postLineup(
    db,
    req.body.playerAddress,
    req.body.pg,
    req.body.sg,
    req.body.sf,
    req.body.pf,
    req.body.c
  );
  res.end("Worked!");
});

app.post("/game", (req, res) => {
  console.log(req.body.playerAddress1);
  res.end(JSON.stringify(newGame(db, req.body.team1, req.body.team2)));
});

MongoClient.connect(
  "mongodb://ryan:etherball1@ds261430.mlab.com:61430/etherball",
  (err, client) => {
    if (err) return console.log(err);
    db = client.db("etherball");

    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  }
);
