'use strict';

///////////////////////////////////////
// Activating Strict Mode
///////////////////////////////////////
/*
let hasLicense = false;
const passTest = true;

//With strict mode on, you will get an error for the below line because the variable name used is not declared.
//if(passTest) hasLicens = true;

//With strict mode on below two statments will give '___ is a reserved identifier' error.
//let interface ='abc';
//let private =30;

//So always use the strict mode wih 'use strict' as the first line of the JS file to give more error proof file.

///////////////////////////////////////
// Functions
///////////////////////////////////////
function logger(){
    console.log("Just a logger function!");
}
logger();
logger();

function fruitProcessor(apples, oranges){
    console.log(apples, oranges);
    const juice = `Juice with ${apples} apple(s) and ${oranges} orange(s)!`;
    return juice;
}
const processedFruit = fruitProcessor(3, 1);
console.log(processedFruit);
console.log(fruitProcessor(3, 2));

//DONT REPEAT YOURSELF - DRY- is a principle that is served by using functions.

///////////////////////////////////////
// Function Declarations vs. Expressions
///////////////////////////////////////
//Declaring a function with name calcAgeOne
function calcAgeOne( birthYear) {
    return 2021 - birthYear;
}
console.log("Lidwin's age is : ", calcAgeOne(1985));

//Anonymous function - Function expression .. An expression , which is a function assigned to a variable.
//Expressions produces values and that is assigned to the const calcAgeTwo here.
const calcAgeTwo = function (birthYear){
    return (`Lijiya's age is : ${2021- birthYear}`)
}
console.log(calcAgeTwo(1989));

//Functions created with function declaration can be invoked in lines before they are declare.
//Whereas functions defined as expressions and assigned to a variable cannot be invoked before this assignment is done.


///////////////////////////////////////
// Arrow functions
///////////////////////////////////////
//Here the part 'birthYear => 2021-birthYear' is a Function expression.
//Arrow functions does not get a 'this' keyword reference 
const calcAge = birthYear => 2021-birthYear;
console.log("Using Arrow Functions : Age - " +calcAge(1985));

const yearsUntilRetirement = (firstname, birthYear) => {
    const age = 2021 - birthYear;
    const retirement = 55 - age;
    return `${firstname} retires in ${retirement} years.`;
}
console.log(yearsUntilRetirement('Lidwin', 1985));

///////////////////////////////////////
// Functions Calling Other Functions
///////////////////////////////////////
function cutFruitPieces(fruit) {
    return fruit * 4;
  }
  
  function fruitProcessor(apples, oranges) {
    const applePieces = cutFruitPieces(apples);
    const orangePieces = cutFruitPieces(oranges);
  
    const juice = `Juice with ${applePieces} piece of apple and ${orangePieces} pieces of orange.`;
    return juice;
  }
  console.log(fruitProcessor(2, 3));


///////////////////////////////////////
// Introduction to Arrays
///////////////////////////////////////

const friends = ['Joe', 'Jadon','Jesse', 'Jake'];
console.log(friends);

const family = new Array( 'Lidwin', 'Lijiya' , 'Ian' );
console.log(family);

const yob = new Array( 1985,1989,2017 );
console.log(yob);

//Looping the array based on Index
for(let i=0; i< friends.length; i++){
    console.log(friends[i]);
}
//Updating last element using index which is zero based
//NOTE that the const array is mutated ; this is possible because only primitives are immutable 
//Arrays are not primitive and they use references.
friends[friends.length-1] = 'Job';

//However making the array const point to a new array,like below, is not allowed.
//friends = ['Bob', 'Dylan'];

//Looping using the more modern way.
for(let friend of friends){
    console.log(friend);
}

//Multi typed arrays
//Using variables, expression, another arrays etc.
const firstname = 'Lidwin';
const myData = [ firstname, 'Lewis', 2021 - 1985 , friends, 'Software Engineer'];
console.log(myData);

const calculateAge =  function(yob){
    const currentYear = 2021;
    return currentYear - yob;
}

//Arrays can even be populated using expressions evaluated using method calls.
const ageArray = [ calculateAge(yob[0]),  calculateAge(yob[1]),  calculateAge(yob[2])];
console.log("Age Array : ", ageArray);

//Array methods
//Add element to the end of the array using push
const len1 = friends.push('Jay');
console.log(friends);
console.log("New Length : ", len1);

//Add element to the beginning of the array using unshift
const len2 =friends.unshift('John');
console.log(friends);
console.log("New Length : ", len2);

//Remove element from the end of the array
const popped1 = friends.pop();
console.log(friends);
console.log('Removed element : ', popped1);

//Remove first element from the array
const popped2 =  friends.shift();
console.log(friends);
console.log('Removed element : ', popped2);

//Using indexOf and includes functions on arrays.
console.log('Index of Jadon : ' ,friends.indexOf('Jadon'));
console.log('Index of Bob : ' ,friends.indexOf('Bob'));
//Includes uses strict comparison; i.e type and value need to match.
console.log("Is there a 'Jesse' : " , friends.includes('Jesse'));
console.log("Is there a 'Joel' : " , friends.includes('Joel'));

///////////////////////////////////////
// Introduction to Objects
///////////////////////////////////////

const user = {
    firstName : 'Lidwin',
    lastName : 'Lewis',
    age : 2021-1985,
    friends  : [ 'John', 'Jake', 'Jadon', 'Jesse'],
    job : 'Software Engineer'
}
///////////////////////////////////////
// Dot vs. Bracket Notation
///////////////////////////////////////
//dot notation for directly access the value if you know the key 
console.log(`${user.firstName} ${user.lastName}, age ${user.age}, is a ${user.job}`);

//brackets notation can be used with the key as well as an EXPRESSION.
console.log('Firstname : ', user.firstName);
console.log('Lastname : ', user['lastName']);

//example to show that bracket notation allows expressions to retrieve values from object 
const nameKey = 'Name';
console.log('Firstname : ', user['first'+nameKey]);
console.log('Lastname : ', user['last'+nameKey]);


const interestedIn = prompt(
  "What do you want to know about the user ? (Choose from firstName, lastName, age, job, friends)"
);
//brackets notation can be used with the key as well as an EXPRESSION.
if(user[interestedIn]) {
    console.log('interestedIn :', interestedIn );
    console.log( interestedIn ,' : ', user[interestedIn]);
}else{
    console.log('Wrong request - Please choose from firstName, lastName, age, job, friends');
}

//Adding new key-values to the 'user' object using dot and brackets
user.country = 'India';
user['state'] =  'Kerala';
console.log(user);

const challengeText = `${user.firstName} has ${user.friends.length} friends. His best friend is ${user.friends[0]}`;
console.log(challengeText);

///////////////////////////////////////
// Object Methods
///////////////////////////////////////
//Having method as object property. The syntax should be such that the function expression should be assigned to a 
//property
const user = {
    firstName : 'Lidwin',
    lastName : 'Lewis',
    birthYear : 1985,
    friends  : [ 'John', 'Jake', 'Jadon', 'Jesse'],
    job : 'Software Engineer',
    hasDriversLicense : false,
    // calcAge : function(birthYear){
    //     return 2021-birthYear;
    // },
    //
   
    calcAge : function(){
        this.age = 2021-this.birthYear;
        return this.age; 
    },
    calcRetirementYears : function(){
        return 55-(2021-this.birthYear);
    },
    getSummary : function(){
        const text = `${this.firstName} is a ${this.calcAge()} year old ${this.job}. He has ${this.hasDriversLicense ? 'a' : 'no'} drivers license`;
        return text;
    }
}
//when we invoke, user.calcAge(), the object on which the method is called will be the 'this', which is 'user'
//This is proved by the the console log inside the function.
console.log('Using dot operator - user.calcRetirementYears() => ', user.calcRetirementYears());
console.log("Using bracket operator - user['calcRetirementYears']() => ", user['calcRetirementYears']());

//First call evaluates and sets a new 'age' property
console.log('Using calcAge method : ', user.calcAge());
//second call onwards we can directly access the property instead of method call.
console.log('Using age Property :' , user.age);
console.log('Using age Property :' , user.age);

console.log(user.getSummary());



///////////////////////////////////////
// Iteration: The for Loop
///////////////////////////////////////
// for loop keeps running while condition is TRUE
for (let rep = 1; rep <= 2; rep++) {
    console.log(`Lifting weights repetition ${rep}`);
}
const firstName = 'Lidwin';
const friends = ['Joe', 'Jadon','Jesse', 'Jake'];
const myData = [ 
                firstName, 
                 'Lewis', 
                 2021 - 1985 , 
                 friends, 
                 'Software Engineer',
                true];
let types1 = [];
let types2 = [];
for(let i=0; i< myData.length; i++) {
    console.log(myData[i]);
    //Two wasy of populating the array
    types1[i] = typeof myData[i];
    types2.push(typeof myData[i]);
}
console.log(types1);
console.log(types2);

const yob= [1985, 1989 , 2017];
let age = [];
for(let i=0; i< yob.length; i++) {
    age.push( 2021 - yob[i]);
}
console.log('Year of Birth array : ', yob);
console.log('Age array : ', age);

//Continue and break
console.log('----ONLY STRINGS----');
for(let i=0; i< myData.length; i++) {
    if(typeof myData[i] !== 'string') 
        continue;
    console.log(myData[i], typeof myData[i]);
}
console.log('----BREAK ON NUMBER----');
for(let i=0; i< myData.length; i++) {
    if(typeof myData[i] === 'number') 
        break;
    console.log(myData[i], typeof myData[i]);
}

///////////////////////////////////////
// Looping Backwards and Loops in Loops
///////////////////////////////////////
const jonas = [
    'Jonas',
    'Schmedtmann',
    2037 - 1991,
    'teacher',
    ['Michael', 'Peter', 'Steven'],
    true
  ];
  
  // 0, 1, ..., 4
  // 4, 3, ..., 0
  
  for (let i = jonas.length - 1; i >= 0; i--) {
    console.log(i, jonas[i]);
  }
  
  for (let exercise = 1; exercise < 4; exercise++) {
    console.log(`-------- Starting exercise ${exercise}`);
  
    for (let rep = 1; rep < 6; rep++) {
      console.log(`Exercise ${exercise}: Lifting weight repetition ${rep} 🏋️‍♀️`);
    }
  }

*/

