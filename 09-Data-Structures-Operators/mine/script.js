'use strict';

// Data needed for a later exercise
const flights =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// Data needed for first part of the section
const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  openingHours: {
    thu: {
      open: 12,
      close: 22,
    },
    fri: {
      open: 11,
      close: 23,
    },
    sat: {
      open: 0, // Open 24 hours
      close: 24,
    },
  },

  order: function (starterIndex, mainIndex) {
    return [this.starterMenu[starterIndex], this.mainMenu[mainIndex]];
  },

  orderDelivery: function ({ address, time, starterIndex = 0, mainIndex = 0 }) {
    const message = `Your order containing ${this.starterMenu[starterIndex]} and ${this.mainMenu[mainIndex]} will be delivered to '${address}' at '${time}'`;
    console.log(message);
  },

  orderPasta: function (ing1, ing2, ing3) {
    const message = `Your delicious Pasta is ready with ${ing1}, ${ing2} and ${ing3} !!!`;
    console.log(message);
  },

  orderPizza: function (mainIngredient, ...otherIngredients) {
    console.log(mainIngredient);
    console.log(otherIngredients);
  },
};
//////////////////////////////////////////////////////////////////////////////////////////////
//
//  Array destructuring
//
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Array destructuring **********');
const fullName = ['Lewis', 'Thathenkery', 'John'];

let [firstname, middlename, lastname] = fullName;
console.log('Initial : ', firstname, middlename, lastname);

let [first, , last] = fullName;
console.log('Skipped : ', first, last);

//Swapping firstname middlename and lastname using array destructuring
[firstname, middlename, lastname] = [middlename, lastname, firstname];
console.log('Swapped : ', firstname, middlename, lastname);

//An array returned from a function is directly destructured to separate variables.
const [starterCourse, mainCourse] = restaurant.order(2, 0);
console.log(starterCourse, mainCourse);

//Nested Destructuring
const nested = [1, 2, 3, [4, 5]];
const [i, j, , k] = nested;
console.log(i, j, k);
const [a, b, , [c, d]] = nested;
console.log(a, b, c, d);
//Default values
const [p, q, r] = [8, 9];
//r will be undefined here.
console.log(p, q, r);

const [l = 0, m = 0, n = 0] = [8, 9];
//0 will be assigned to n as there is no value in index=2
console.log(l, m, n);

//////////////////////////////////////////////////////////////////////////////////////////////
//
//  Object destructuring
//
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Object destructuring **********');

//We have to use the exact property names frmo the object
const { name, categories, openingHours } = restaurant;
console.log(name, '||', categories, '||', openingHours);

//If we want to use different variable names
const {
  name: restaurantName,
  location: locality,
  categories: cuisines,
  openingHours: timings,
} = restaurant;

console.log(restaurantName, '||', locality, '||', cuisines, '||', timings);

//Using alias names and assigning default values, when we are not sure of the presence of a property
const {
  menu = [],
  starterMenu: starters = [],
  mainMenu: main = [],
} = restaurant;
//without default value declaration, menu would give undefined.
console.log(menu, '||', starters, '||', main);

//Mutating variables while destructuring
let a1 = 111;
let b1 = 222;
console.log(a1, b1);
const obj = { a1: 12, b1: 24, c1: 36 };
//Note that the below epression is wrapped in () otherwise { a1, b1} = obj will give error as {} is a block and we
//cannot assign anything to a block.
({ a1, b1 } = obj);
console.log(a1, b1);

//Nested Objects Destructuring and with alias op and cl
const { fri } = restaurant.openingHours;
console.log(fri);
const {
  fri: { open: op, close: cl },
} = restaurant.openingHours;
console.log(op, cl);

//Method arguments on the fly destructuring
restaurant.orderDelivery({
  starterIndex: 2,
  mainIndex: 0,
  address: 'Chateau De Paris',
  time: '20:30',
});
//using defaults for main and starter index
restaurant.orderDelivery({
  address: 'Chateau De Paris',
  time: '20:30',
});

//////////////////////////////////////////////////////////////////////////////////////////////
//
//  Spread Operator
//
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Spread Operator **********');

let arr = [0, 1, 2, 3];
let newArray = [...arr, 4, 5];
console.log(newArray);

const newMenu = [...restaurant.starterMenu, 'Gnocci'];
console.log(newMenu);

//Copying Arrays
const newMainMenu = [...restaurant.mainMenu];
console.log(newMainMenu);

//Merging arrays
const fullMenu = [...restaurant.starterMenu, ...restaurant.mainMenu];
console.log(fullMenu);

//Spread operator works on all Iterables : strings, arrays, Set, Map
//Objects are not Iterables, but spread operator works on Objects as well.
//Example with String and spread operator
const str = 'Lidwin';
const myName = [...str, ' ', 'L.'];
console.log(myName);

//Below use of spread operator is not expected in an expression.
//console.log(`${...str} Lewis`);

//Using spread operator to invoke functions
const ingredients = ['Mushrooms', 'Oregano', 'Cheese'];
restaurant.orderPasta(...ingredients);

//Object Spreading
const newRestaurant = { foundedIn: 1985, ...restaurant, founder: 'Guiseppe' };
console.log(newRestaurant);

//Copying objects using Spread operator
const restaurantCopy = { ...restaurant };
restaurantCopy.name = 'Ristaurante Roma';
console.log(restaurant.name);
console.log(restaurantCopy.name);

//////////////////////////////////////////////////////////////////////////////////////////////
//
//  Rest patterns and parameters
//
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Rest patterns and parameters **********');
//Rest operators collects the individual elemens into an array.
//Somewhat like the reverse of spread. Used on the left hand side of the = operator generally
//It collects all the arrays elements after the last selected element. Skipped elements are not included.

//This is SPREAD, used on the right side of the operator =
const arr1 = [1, 2, ...[3, 4]];
console.log(arr1);

//REST used on the left side of the operator =
const [a2, , b2, ...others] = [1, 2, 3, 4, 5, 6];
//'others' will be an array [4,5,6], after selecting a2 and b2, ie. 1 and 3;
//Skipped element(s) will not be considered
console.log(a2, b2, others);
//Note that the second element, 'Pasta' is skipped
const [pizza, , rissotto, ...otherFoods] = [
  ...restaurant.mainMenu,
  ...restaurant.starterMenu,
];
console.log(pizza, rissotto, otherFoods);

// REST on objects. Collects other objects other than sat : {} into weekdays object
const { sat, ...weekdays } = restaurant.openingHours;
console.log(weekdays);

//functions

//Like we used SPREAD operator to pass multiple arguments while invoking a function
//REST can be used to aggregate any number of incoming arguments into an array
//Versy useful when number of args in the method call can vary.
// ...numbers will collate all incoming args to an array
const add = function (...numbers) {
  //console.log(numbers);
  let sum = 0;
  for (let n1 of numbers) {
    sum += n1;
  }
  console.log(`Sum of ${numbers} : ${sum}`);
};

add(1, 2);
add(1, 2, 3, 4);
const spreadArray = [1, 2, 3, 4, 5, 6];
add(...spreadArray);
//REST will be applied to the args in the function
restaurant.orderPizza('mushroom', 'paneer', 'cheese', 'olives');

//////////////////////////////////////////////////////////////////////////////////////////////
//
//  AND and OR operator SHORT CIRCUITING
//
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Short Circuiting **********');

console.log('==================== OR ====================');
//OR operator short circuits when the first value is truthy and returns that
console.log(0 || 5);
console.log(undefined || 6);
console.log('' || 'Mangosteen');
console.log(true || 12);
//when all values are falsy , last one is returned.
console.log(undefined || null);
//First truthy will be evaluated
console.log(undefined || null || '' || 'Hello' || false || 0);

//restaurant.numberOfGuests = 23;
//Traditional approach
const guests1 = restaurant.numberOfGuests ? restaurant.numberOfGuests : 10;
console.log(guests1);
//Newer approach
const guests = restaurant.numberOfGuests || 10;
console.log(guests);
//NOTE both solution will not work when restaurant.numberOfGuests = 0

console.log('==================== AND ====================');
//AND operator short circuits at the first falsy value and returns that
//If no falsy value, last truthy value is returned.
console.log(0 && 5);
console.log(undefined && 6);
console.log('' && 'Mangosteen');
console.log(true || 12);
console.log(undefined && null);
//First truthy will be evaluated
console.log('Hello' && null && '' && undefined && false && 0);

//Traditional approach
if (restaurant.orderPizza) {
  restaurant.orderPizza('mushroom', 'cheese', 'spinach');
}
//Newer apporach -
restaurant.orderPizza && restaurant.orderPizza('mushroom', 'cheese');

//////////////////////////////////////////////////////////////////////////////////////////////
//Nullish coalescing operator- ES2020 FEATURE
//////////////////////////////////////////////////////////////////////////////////////////////
restaurant.numberOfGuests = 0;
//Nullish values : null and undefined. Only if nullish proceed evaluating next operand
const guests2 = restaurant.numberOfGuests ?? 10;
console.log(guests2);

//////////////////////////////////////////////////////////////////////////////////////////////
//  for...of Loop
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** for...of Loop **********');

const combinedMenu = [...restaurant.starterMenu, ...restaurant.mainMenu];
//Basic looping without needing the index.
for (let item of combinedMenu) {
  console.log(item);
}
//array.entries() give each element in another array with index and value as its elements
//[0, "Focaccia"] , [1, "Bruschetta"] etc.
//+1 is done just for displaying the counter from 1 instead of 0
for (let item of combinedMenu.entries()) {
  console.log(`${item[0] + 1}) ${item[1]}`);
}
//Using array destructuring on the entry instead of using the index.
for (let [key, element] of combinedMenu.entries()) {
  console.log(`${key + 1}) ${element}`);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//  Enhanced object literals
//////////////////////////////////////////////////////////////////////////////////////////////
const profile = {
  designation: 'Team Lead',
  primarySkills: ['WebSphere Commerce', 'Spring', 'Java', 'J2EE', 'Javascript'],
};
const employee = {
  empName: 'Lidwin Lewis',
  empId: 10001,
  yearOfBirth: 1985,
  dept: 'DX-DCOM',
  //This is an ES6 enhanced object lieteral capability,instead of using profile : profile , just use the object name
  profile,
  /*calcAge: function () {
    return 2021 - this.yearOfBirth;
  },*/
  //This is another advanced object literal way , where older appoarch is commented above.
  calcAge() {
    return 2021 - this.yearOfBirth;
  },
};

console.log(employee.profile);
console.log(employee.calcAge());

//////////////////////////////////////////////////////////////////////////////////////////////
//
//  Optional chaining - ES2020 Feature
//
//////////////////////////////////////////////////////////////////////////////////////////////
//This is something which we know exists
console.log(restaurant.openingHours.sat);
//But in scenarios where you are not sure of the object property(ies) on which you are invoking .(dot)
//It could result in undefined and reference errors.

//Old approach is to check
if (restaurant.openingHours.mon)
  console.log('Monday Opens at : ', restaurant.openingHours.mon);
//This method can be tedious if we are not sure about existence of the more and more properties,
//in this case if openingHours also you are not sure, then
if (restaurant.openingHours && restaurant.openingHours.mon)
  console.log('Monday Opens at : ', restaurant.openingHours.mon);

//Using optional chaining on openingHours and mon
//When the first undefined is detected , execution return undefined.
//This would return Undefined on finding that .mon does not exist. subsequent code is not executed.
console.log('Monday Opening @ ', restaurant.openingHours?.mon?.open);
//This executes as both openingHours and sat exists
console.log('Saturday Closing @ ', restaurant.openingHours?.sat?.close);
console.log('======================================================');
//If we want to use a variable name as a property name the we need to use the brackets notation.
const daysofweek = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
for (let dow of daysofweek) {
  //If restaurant.openingHours[dow]?.open is NULLISH, then assign -1
  //Using for diferent message when time undefined.
  //There is one opening time , for sat , which is 0, therefore using ?? (NULLISH) operator
  let val = restaurant.openingHours[dow]?.open ?? -1;
  //console.log(val);
  let message =
    val === -1
      ? `On ${dow} we are closed!!`
      : `On ${dow} we open at : ${restaurant.openingHours[dow]?.open}.`;

  console.log(message);
}
console.log('======================================================');
//Optional chaining on METHODS
//Note order?.() I thought it would be order?() - why dot ? is that the operator ?.
console.log(restaurant.order?.(0, 2) ?? 'Method does not exist');
console.log(restaurant.orderRisotto?.(0, 2) ?? 'Method does not exist');

console.log('======================================================');
//Optional chaining on Arrays
const member = [{ name: 'Jonas', age: 32, yob: 1985 }];
console.log(member[0]?.name ?? 'Empty array');
console.log(member[1]?.name ?? 'No element at index 1');

//////////////////////////////////////////////////////////////////////////////////////////////
//
//  Looping Object keys, values and Entries
//
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Object keys, values and Entries **********');
//Property names or keys
const keys = Object.keys(restaurant.openingHours);
console.log('Keys :', keys);
//Property values
const vals = Object.values(restaurant.openingHours);
console.log('Values :', vals);
//Entire object
const entries = Object.entries(restaurant.openingHours);
console.log('Entries :', entries);

//Using entries and then destructuing (even the nested object destructuring)
for (let [key, { open, close }] of entries) {
  //console.log(key, open, close);
  console.log(`On ${key} we open at ${open} and close at ${close}.`);
}

//////////////////////////////////////////////////////////////////////////////////////////////
//  Sets - Creating a set takes in an Iterable like Array, Strings etc.
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Sets **********');
const orderSet = new Set([
  'Pizza',
  'Pasta',
  'Noodles',
  'Rissotto',
  'Choupsey',
  'Pizza',
  'Pasta',
]);

const stringSet = new Set('Lidwin');
//String is an iterable and can be used for create Set.
//Here the duplicate alphabet will be removed
console.log(stringSet);
//Set Methods
console.log(orderSet);
console.log('Using .has() :: ', orderSet.has('Rissotto'));
orderSet.delete('Choupsey');
console.log('Using .size :: ', orderSet.size);
orderSet.add('Garlic Bread');
orderSet.add('Garlic Bread');
//orderSet.clear();
orderSet.forEach(x => {
  console.log(x);
});
console.log(orderSet);

//Example
const staffPosts = [
  'Waiter',
  'HouseKeeping',
  'Chef',
  'Manager',
  'Waiter',
  'Chef',
  'Waiter',
  'Security',
  'Cashier',
  'HouseKeeping',
];
//Any iterable can be used to creaet a set, and Array is an iterable.
const uniquePosts = new Set(staffPosts);
console.log(uniquePosts, uniquePosts.size);
//Any iterable can be used with SPREAD operator and SET is an Iterable.
const uniquePostsArray = [...uniquePosts];
console.log(uniquePostsArray, uniquePostsArray.length);
//////////////////////////////////////////////////////////////////////////////////////////////
//  Maps -
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Maps **********');

const rest = new Map();

rest.set('name', 'Classico Italiano');
rest.set(1, 'Naples, Italy');
rest.set(2, 'Lisbon, Portugal');
rest.set(true, 'We are Open :D');
rest.set(false, 'We are Closed :(');
rest.set('open', 11);
rest.set('close', 23);

//.set() on map returns the updated map and therefore .set() can be chained as below.
rest
  .set('categories', ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'])
  .set('founded', 1990)
  .set('foundedBy', 'Mauriccio Pellegrini');
console.log(rest, rest.size);
rest.delete(2);
console.log(rest, rest.size);

console.log('Using .has() on map :: ', rest.has('name'));
let time = 21;
//Using the boolean key in the map to display the message
// time > rest.get('open') && time <= rest.get('close')) epression evaluates to a boolean
console.log(rest.get(time >= rest.get('open') && time <= rest.get('close')));
//rest.clear();

//Better way of initializing Maps , using array of arrays.

const question = new Map([
  ['Question', 'Which is the greatest programming language ?'],
  [1, 'Java'],
  [2, 'JavaScript'],
  [3, 'C'],
  ['answer', 2],
  [true, 'You got that right!'],
  [false, 'Try again.'],
]);

console.log(question);
console.log(question.get('Question'));
for (let [key, value] of question) {
  if (typeof key === 'number') console.log(key, value);
}
const yourAnswer = 2;
//again making use of the boolean keys for printing the text message
console.log(question.get(question.get('answer') === yourAnswer));
//This structure of array of arrays is similar to the Object.entries();
console.log(Object.entries(restaurant.openingHours));
//So easy way of creating a map from Object entries
const openingHoursMap = new Map(Object.entries(restaurant.openingHours));
console.log(openingHoursMap);

//Map into an Array
const mapArray = [...question];
//Gives the array of arrays.
console.log(mapArray);

//These will give some MapIterators
console.log(question.entries());
console.log(question.keys());
console.log(question.values());

//can always spred into arrays as below
console.log([...question.entries()]);
console.log([...question.keys()]);
console.log([...question.values()]);

//////////////////////////////////////////////////////////////////////////////////////////////
//  Strings -
//////////////////////////////////////////////////////////////////////////////////////////////
console.log('********** Strings **********');

const airplane = 'TAP Air Portugal';
const plane = 'A37B';

//These methods on the string are case sensitive
console.log(`Source String is '${airplane}'`);
console.log(`Using String.indexOf('r') : ${airplane.indexOf('r')}`);
console.log(`Using String.lastindexOf('r') : ${airplane.lastIndexOf('r')}`);
console.log(
  `Using String.indexOf('Portugal') : ${airplane.indexOf('Portugal')} `
);
//When there is no match -1 is returned.
console.log(
  `Using String.indexOf('portugal') : ${airplane.indexOf('portugal')} `
);
//methods like slice return another string.
console.log(`Using slice method on String.slice(8) : ${airplane.slice(8)}`);
console.log(
  `Using slice method on String.slice(4,7) : ${airplane.slice(4, 7)}`
);
console.log(
  `Using slice method to extract fist word  : ${airplane.slice(
    0,
    airplane.indexOf(' ')
  )}`
);
console.log(
  `Using slice method to extract last word  : ${airplane.slice(
    airplane.lastIndexOf(' ') + 1,
    airplane.length
  )}`
);
console.log(
  `Using slice method with negative index numbers 'airplane.slice(-3)' : ${airplane.slice(
    -3
  )}`
);
console.log(
  `Using slice method with negative index numbers 'airplane.slice(4,-4)'  :  ${airplane.slice(
    4,
    -4
  )}`
);

console.log(`Using toLowerCase method : ${airplane.toLowerCase()}`);
console.log(`Using toUpperCase method : ${airplane.toUpperCase()}`);

const travellerName = '  jOnAs \n';
//Correcting TravellerName Using trim() slice() and case methods.
console.log(`Original Name==>${travellerName}<==`);
const trimmedName = travellerName.trim();
console.log(`Trimmed Name==>${trimmedName}<==`);
const lowercaseName = trimmedName.toLowerCase();
const correctedName = lowercaseName[0].toUpperCase() + lowercaseName.slice(1);
console.log(`Using case methods and trimming on Strings : ${correctedName}`);

console.log('***********replace() === replaceAll() ***********');
//Using replace methods = it replaces first occurence of the given char or string with the provided one.
//Returns the new string without mutating the orginal
const priceGB = '299,78 £';
console.log('UK Price format : ', priceGB);
const priceus = priceGB.replace('£', '$').replace(',', '.');
console.log('US Price format : ', priceus);

//replace methods are case sensitive.
const announcement = 'All passenger come to boarding door . Boarding door 23!';
//Replacing happens ONLY to the first occurence of the string 'door'
console.log(announcement.replace('door', 'gate'));
//Solution is to use replaceAll() instead of replace() OR use regex
console.log(announcement.replaceAll('door', 'gate'));
//Using Regex
console.log(announcement.replace(/door/g, 'gate'));

//Booleans
console.log('***********includes() === startsWith() === endsWith()***********');
const aircraft = 'Airbus A362Fneo';
console.log('Original String ', aircraft);
console.log('includes() the word neo ', aircraft.includes('neo'));
console.log('includes() the word nuevo ', aircraft.includes('nuevo'));
console.log('startsWith() the word Airbus ', aircraft.startsWith('Air'));
console.log('startsWith() the word airbus ', aircraft.startsWith('airbus'));
console.log('endsWith() the word neo ', aircraft.endsWith('neo'));

//split() and join()
console.log('***********split() === join() ***********');
const full_name = 'Thathenkery John Lewis';
const [firstName, middleName, lastName] = full_name.split(' ');
const new_name = ['Mr.', middleName, lastName.toUpperCase()].join(' ');
console.log(new_name);

const capitalizeName = function (name) {
  const nameArr = name.split(' ');
  const capitalName1 = [];
  const capitalName2 = [];
  for (const n of nameArr) {
    //Method-1
    capitalName1.push(n[0].toUpperCase() + n.slice(1));
    //Method-2
    capitalName2.push(n.replace(n[0], n[0].toUpperCase()));
  }
  console.log(capitalName1.join(' '));
  console.log(capitalName2.join(' '));
};

capitalizeName('anna john smith');
capitalizeName('thathenkery john lewis');

//Padding
console.log('***********padStart() === padEnd() ***********');

const maskCreditCard = function (ccNumber) {
  const ccString = String(ccNumber);
  //Get last four characters that need not be masked
  const lastFour = ccString.slice(-4);
  //Mask the entire cc number except last 4
  const maskedCC = lastFour.padStart(ccString.length, '*');
  console.log(maskedCC);
};

maskCreditCard(5896589674563214);
maskCreditCard('5896589674563994');

//repeat()
console.log('***********repeat() ***********');
const baseString = 'Welcome to Manchester United !!\n';
console.log(baseString.repeat(5));
