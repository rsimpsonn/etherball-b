const speciesToFunction = {
  sloth: function(x) {
    return (
      31.1534 + (5.231039 - 31.1534) / (1 + Math.pow(x / 15.20487, 10.31144))
    );
  },
  bear: function(x) {
    return (
      38.33333 + (12.5 - 38.33333) / (1 + Math.pow(x / 20.30658, 146.8242))
    );
  },
  bunny: function(x) {
    return 30 - Math.pow(x - 5, 2);
  }
};

function slope(f, x, dx) {
  dx = dx || 0.0000001;
  return (f(x + dx) - f(x)) / dx;
}

function ageToDerivative(species, age) {
  return slope(speciesToFunction[species], age);
}

module.exports = ageToDerivative;
