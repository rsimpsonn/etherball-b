const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

async function getLineup(db, playerAddress, callback) {
  const tokenIds = await db
    .collection("lineups")
    .find({ playerAddress: playerAddress })
    .toArray();

  callback(tokenIds[0].players);

  return tokenIds;
}

module.exports = getLineup;
