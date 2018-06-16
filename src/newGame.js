const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

async function getData(db, playerAddress1, playerAddress2, callback) {
  const tokenIds1 = await db
    .collection("lineups")
    .find({ playerAddress: playerAddress1 })
    .toArray();

  const tokenIds2 = await db
    .collection("lineups")
    .find({ playerAddress: playerAddress2 })
    .toArray();

  callback([tokenIds1[0].players, tokenIds2[0].players]);

  return [tokenIds1, tokenIds2];
}

function recordStats(db, team1Stats, team2Stats, team1TokenIds, team2TokenIds) {
  for (var i = 0; i < 5; i++) {
    db
      .collection("players")
      .update(
        { _id: ObjectId(team1TokenIds[i]) },
        { $push: { gameHistory: team1Stats[i] } }
      );
  }
  for (var i = 0; i < 5; i++) {
    db
      .collection("players")
      .update(
        { _id: ObjectId(team2TokenIds[i]) },
        { $push: { gameHistory: team2Stats[i] } }
      );
  }
}

function possession(offense, defense, offensePlayerStats, defensePlayerStats) {
  const [pgO, sgO, sfO, pfO, cO] = offense;
  const [pgD, sgD, sfD, pfD, cD] = defense;

  var hasBall = true;
  var messages = [];
  var points = 0;
  var ballHandler = Math.random() * 10 < 7 ? 0 : 1;
  var passer;

  while (hasBall) {
    if (!success(offense[ballHandler].confidence / 6)) {
      if (
        !success(offense[ballHandler].pass) &&
        success(defense[ballHandler].speed)
      ) {
        messages.push(`${defense[ballHandler].name} stole the ball!`);
        defensePlayerStats[ballHandler].steals += 1;
        offensePlayerStats[ballHandler].turnovers += 1;
        hasBall = false;
      } else {
        passer = ballHandler;
        var passedTo = Math.floor(Math.random() * 5);
        while (passedTo === ballHandler) {
          passedTo = Math.floor(Math.random() * 5);
        }
        ballHandler = passedTo;
        messages.push(
          `${offense[passer].name} passed the ball to ${offense[ballHandler]
            .name}`
        );
      }
    } else {
      if (success(offense[ballHandler].shot)) {
        if (success(defense[ballHandler].strength / 6)) {
          messages.push(
            `${defense[ballHandler].name} blocked ${offense[ballHandler]
              .name}s shot!`
          );
          defensePlayerStats[ballHandler].blocks += 1;
          hasBall = false;
        } else {
          var assisted = false;
          if (passer !== undefined) {
            assisted = success(offense[passer].pass);
          }
          messages.push(
            `${offense[ballHandler].name} scored! ${assisted
              ? `Assisted by ${offense[passer].name}`
              : ``}`
          );
          points += 2;
          hasBall = false;
          offensePlayerStats[ballHandler].shots += 1;
          offensePlayerStats[ballHandler].makes += 1;
          offensePlayerStats[ballHandler].points += 2;
          if (assisted) offensePlayerStats[passer].assists += 1;
        }
      } else {
        messages.push(`${offense[ballHandler].name} missed the shot!`);
        offensePlayerStats[ballHandler].shots += 1;
        const reboundPair = Math.floor(Math.random() * 10);
        if (reboundPair < 3) {
          if (
            offense[4].strength * offense[4].speed * Math.random() * 10 >
            defense[4].strength * offense[4].speed * (Math.random() * 10 + 5)
          ) {
            messages.push(`${offense[4].name} got the rebound!`);
            offensePlayerStats[4].rebounds += 1;
            ballHandler = 4;
          } else {
            messages.push(`${defense[4].name} got the rebound!`);
            defensePlayerStats[4].rebounds += 1;
            hasBall = false;
          }
        } else if (reboundPair < 6) {
          if (
            offense[3].strength * offense[3].speed * Math.random() * 10 >
            defense[3].strength * offense[3].speed * (Math.random() * 10 + 5)
          ) {
            messages.push(`${offense[3].name} got the rebound!`);
            offensePlayerStats[3].rebounds += 1;
            ballHandler = 3;
          } else {
            messages.push(`${defense[3].name} got the rebound!`);
            defensePlayerStats[3].rebounds += 1;
            hasBall = false;
          }
        } else if (reboundPair < 8) {
          if (
            offense[2].strength * offense[2].speed * Math.random() * 10 >
            defense[2].strength * offense[2].speed * (Math.random() * 10 + 5)
          ) {
            messages.push(`${offense[2].name} got the rebound!`);
            offensePlayerStats[2].rebounds += 1;
            ballHandler = 2;
          } else {
            messages.push(`${defense[2].name} got the rebound!`);
            defensePlayerStats[2].rebounds += 1;
            hasBall = false;
          }
        } else if (reboundPair < 9) {
          if (
            offense[1].strength * offense[1].speed * Math.random() * 10 >
            defense[1].strength * offense[1].speed * (Math.random() * 10 + 5)
          ) {
            messages.push(`${offense[1].name} got the rebound!`);
            offensePlayerStats[1].rebounds += 1;
            ballHandler = 1;
          } else {
            messages.push(`${defense[1].name} got the rebound!`);
            defensePlayerStats[1].rebounds += 1;
            hasBall = false;
          }
        } else {
          if (
            offense[0].strength * offense[0].speed * Math.random() * 10 >
            defense[0].strength * offense[0].speed * (Math.random() * 10 + 5)
          ) {
            messages.push(`${offense[0].name} got the rebound!`);
            offensePlayerStats[0].rebounds += 1;
            ballHandler = 0;
          } else {
            messages.push(`${defense[0].name} got the rebound!`);
            defensePlayerStats[0].rebounds += 1;
            hasBall = false;
          }
        }
      }
    }
  }
  return { messages, points };
}

function success(p) {
  const rand = Math.random() * 100 + 1;
  if (rand > p) {
    return false;
  } else {
    return true;
  }
}

function newGame(db, playerAddress1, playerAddress2) {
  const result = getData(db, playerAddress1, playerAddress2, function(data) {
    const player1TokenIds = data[0];
    const player2TokenIds = data[1];
  });
  const player1Team = [
    {
      name: "Ryan",
      shot: 56,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Hello",
      shot: 58,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Hey",
      shot: 46,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Wazzup",
      shot: 52,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Hey man",
      shot: 60,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    }
  ];
  const player2Team = [
    {
      name: "Tim",
      shot: 60,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Jesus",
      shot: 73,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Jackie",
      shot: 40,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Amigo",
      shot: 54,
      strength: 75,
      pass: 75,
      steal: 50,
      block: 79,
      confidence: 89,
      games: 0
    },
    {
      name: "Wallazoo",
      shot: 49,
      strength: 75,
      pass: 75,
      steal: 31,
      block: 79,
      confidence: 89,
      games: 0
    }
  ];

  var player1TeamStats = [
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[0].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[1].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[2].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[3].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[4].games
    }
  ];
  var player2TeamStats = [
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[0].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[1].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[2].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[3].games
    },
    {
      points: 0,
      assists: 0,
      rebounds: 0,
      blocks: 0,
      steals: 0,
      shots: 0,
      makes: 0,
      turnovers: 0,
      games: player1Team[4].games
    }
  ];

  var messages = [];
  var team1Points = 0;
  var team2Points = 0;

  var k = 3;

  const possessions = 197 + Math.floor(Math.random() * 10);

  if (player1Team[4].strength >= player2Team[4].strength) {
    messages.push(`${player1Team[4].name} won the tip!`);
  } else {
    messages.push(`${player2Team[4].name} won the tip!`);
    k = 4;
  }

  for (var i = k; i < possessions; i++) {
    if (i % 2 === 1) {
      const results = possession(
        player1Team,
        player2Team,
        player1TeamStats,
        player2TeamStats
      );
      results.messages.forEach(message => messages.push(message));
      team1Points += results.points;
    } else {
      const results = possession(
        player2Team,
        player1Team,
        player2TeamStats,
        player1TeamStats
      );
      results.messages.forEach(message => messages.push(message));
      team2Points += results.points;
    }
  }

  recordStats(
    db,
    player1TeamStats,
    player2TeamStats,
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10]
  );

  return { messages, player1TeamStats, player2TeamStats };
}

module.exports = newGame;
