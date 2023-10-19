'use strict';

const bookings1 = [];

const createBooking = function (
  flightName,
  numberOfPassengers = 1,
  price = 1200 * numberOfPassengers
) {
  const bookings = [];
  //ES5
  //numberOfPassengers = numberOfPassengers || 1;
  //price = price || 1200;

  const booking = {
    flightName,
    numberOfPassengers,
    price,
  };

  bookings.push(booking);
  console.log(bookings);
};

createBooking('LF205');
createBooking('LF205', 2, 1100);
createBooking('LF205', undefined, 1200);

/**************************
 * Higher order functions and First class functions
 *Video 129 and 130
 **************************/

const oneWord = function (str) {
  console.log(`Original String : ${str}`);
  str = str.replace(/ /g, '');
  console.log(`Updated String : ${str}`);
};

const firstWordCapitalize = function (str) {
  console.log(`Original String : ${str}`);
  const [firstWord, ...others] = str.split(' ');
  const newWord = [firstWord.toUpperCase(), ...others].join(' ');
  console.log(`Updated String : ${newWord}`);
};

//Higher order function
const transformer = function (str, fn) {
  console.log(`Transfer invoked : ${fn.name}`);
  return fn(str);
};

transformer('javascript is an awesome language!', oneWord);
transformer('javascript is an awesome language!', firstWordCapitalize);

//Function returning another function

/* const greet = function (message) {
  return function (name) {
    console.log(`${message} ${name}`);
  };
};
 */
//Using arrows
const greet = message => {
  return name => {
    return console.log(`${message}, ${name}`);
  };
};
//Shorter format
const greetings = message => name => console.log(`${message}, ${name}`);

const greeter = greet('Hello');
greeter('Lidwin');
//another syntax
greet('Good morning')('Ian');

greetings('Good morning')('Lijiya');

/**************************
 * this keyword work arounds with call() and apply()
 * Video 132
 **************************/
console.log('**************************');

const lufthansa = {
  airline: 'Lufthansa',
  iataCode: 'LH',
  bookings: [],

  book(flightNumber, passengerName) {
    console.log(
      `${passengerName} has booked a ticket on ${this.airline} Airlines, ${this.iataCode}${flightNumber}`
    );
    this.bookings.push({
      flight: `${this.iataCode}${flightNumber}`,
      passenger: passengerName,
    });
    console.log(this.bookings, this.bookings.length);
  },
};

const airAsia = {
  airline: 'AirAsia',
  iataCode: 'AA',
  bookings: [],
};

const swissAirlines = {
  airline: 'SwissAir',
  iataCode: 'SW',
  bookings: [],
};

lufthansa.book(235, 'Jonas');

const bookingMethod = lufthansa.book;

//this will not work
//bookingMethod(65, 'Martha');
//While using the call() method, the first argument defines 'this'.
//In this case since the book method uses attributes like iataCode and airline on the this keyword
//All objects using this book method should have same properties.
bookingMethod.call(airAsia, 65, 'Martha');
bookingMethod.call(lufthansa, 265, 'Martin');

//Apply does not take in arguments as given in the call()
//in stead it takes in an array of arguments
const argairAsia = [320, 'Noel'];
bookingMethod.apply(airAsia, argairAsia);
const argswiss = [120, 'Noah'];
bookingMethod.apply(swissAirlines, argswiss);

//Modern JS tend to lean towards .call() with spread operator in case args are available as an array
bookingMethod.call(lufthansa, ...argswiss);
