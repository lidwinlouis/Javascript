// Remember, we're gonna use strict mode in all scripts now!
'use strict';

const temperaturesMonday = [-3, -2, 0, 2, 'error', 10, 7, 6, 8, 9];
const temperaturesTuesday = [-1, 'error', -2, 0, 4, 'error', 7, 3, 6, 12, 9];

const calcAmplitude = function (temperatures1, temperatures2) {
  // Merge arrays using .concat()
  let temperatures = temperatures1.concat(temperatures2);
  console.log(temperatures);

  let temps = removeErrors(temperatures);
  console.log(temps);

  //Sorting without casting to string
  let sortedTemps = temps.sort((a, b) => a - b);
  console.log(sortedTemps);

  const minTemp = sortedTemps[0];
  const maxTemp = sortedTemps[sortedTemps.length - 1];
  const amplitude = maxTemp - minTemp;
  console.log('Amplitude :: ', amplitude);
};

function removeErrors(sortedTemps) {
  let finalArray = [];
  for (let i = 0; i < sortedTemps.length; i++) {
    if (sortedTemps[i] !== 'error') {
      finalArray.push(sortedTemps[i]);
    }
  }
  return finalArray;
}

calcAmplitude(temperaturesMonday, temperaturesTuesday);
