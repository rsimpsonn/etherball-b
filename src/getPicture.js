var name = "Ryan Simpson";
var species = "bear";

function convertToInt(name) {
  var hex = "";
  for (var i = 0; i < str.length; i++) {
    hex += "" + str.charCodeAt(i).toString(16);
  }
  var integer = parseInt(hex);
  var remainder = integer % 7;
  if (remainder < 2) {
    return 1;
  } else if (remainder < 4) {
    return 2;
  } else if (remainder < 7) {
    return 3;
  } else if (remainder < 9) {
    return 4;
  } else {
    return 5;
  }
}

function convertToFile(name, species) {
  const files = {
    bear_1: "https://www.dropbox.com/s/j7typ3uzgv6wem5/bear_1.png?raw=1",
    bear_2: "https://www.dropbox.com/s/dxs3pfcnfjhsnpi/bear_2.png?raw=1",
    bear_3: "https://www.dropbox.com/s/h9si2v4u63kgzhl/bear_3.png?raw=1",
    bear_4: "https://www.dropbox.com/s/26k66zjyexen9gw/bear_4.png?raw=1",
    bear_5: "https://www.dropbox.com/s/bqow94kebb6arwd/bear_5.png?raw=1",
    bunny_1: "https://www.dropbox.com/s/f1uisu7fa1o34nt/bunny_1.png?raw=1",
    bunny_2: "https://www.dropbox.com/s/adap9oiisp79ue8/bunny_2.png?raw=1",
    bunny_3: "https://www.dropbox.com/s/3vp9ubtk90i1d8n/bunny_3.png?raw=1",
    bunny_4: "https://www.dropbox.com/s/afdf7dvs5ib58b0/bunny_4.png?raw=1",
    bunny_5: "https://www.dropbox.com/s/5d9zpuahtfs89cp/bunny_5.png?raw=1",
    sloth_1: "https://www.dropbox.com/s/6kn68q6qhsm13ev/sloth_1.png?raw=1",
    sloth_2: "https://www.dropbox.com/s/q6j73cd4s8m7214/sloth_2.png?raw=1",
    sloth_3: "https://www.dropbox.com/s/i7jcvqh9vba33tq/sloth_3.png?raw=1",
    sloth_4: "https://www.dropbox.com/s/6j947kk6ndybsdc/sloth_4.png?raw=1",
    sloth_5: "https://www.dropbox.com/s/0748u7vw3kyrv5r/sloth_5.png?raw=1"
  };
  var colors = convertToInt(name);
  var url = species + "_" + colors;
  return files[url];
}
