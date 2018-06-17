const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

function postLineup(db, playerAddress, pg, sg, sf, pf, c) {
  const tokenIds = db
    .collection("lineups")
    .find({ playerAddress: playerAddress })
    .update({ players: { pg, sg, sf, pf, c } })
    .then(data => console.log(data))
    .catch(err => console.log(err));

  return;
}

module.exports = postLineup;
