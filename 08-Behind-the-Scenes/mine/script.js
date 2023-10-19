'use strict';

//Scoping

//this function is global scope
function calcAge(birthYear) {
  const age = 2021 - birthYear;
  //Everything in calcAge() is accessible to printMessage()
  //firstName is also in global scope hence accessible.
  function printMessage() {
    const info = `${firstName} is ${age} years old, born in the year ${birthYear}`;
    console.log(info);
    if (birthYear >= 2000) {
      var functionScoped = true;
      //Local variable will not cause to lookup to happen for the variable name firstName
      const firstName = 'Lidwin';
      const milllenial = `${firstName} , you are a millenial !`;
      console.log(milllenial);
      //In ES6 functions are block scoped in 'strict' mode
      function incrementAge(currentAge) {
        return currentAge++;
      }
    }
    //console.log(milllenial);
    //var is function scoped. millenial is const hence block scoped.
    console.log(functionScoped);

    //In ES6 functions are block scoped in 'strict' mode - Remove strict mode to make below line work.
    //console.log(incrementAge(34));
  }
  printMessage();
  return age;
}
const firstName = 'Lidwin Lewis';
calcAge(2010);

//Hoisting and TDZ
console.log('========Hoisting and TDZ========');

console.log(empName);
//Cannot access 'age' OR 'job' before initialization
//console.log(age);
//console.log(job);

var empName = 'Lidwin';
let age = 35;
const job = 'Engineer';

//Method declaration will be hoisted and available before declaration
console.log(methodDec(1, 2));
//
//console.log(methodExp(1, 2));
//var will be hosited but initialzied to 'undefined' hece methodArrow(a,b) will be like undefined(a,b)
//console.log(methodArrow(1, 2));

function methodDec(a, b) {
  return a + b;
}
const methodExp = function (a, b) {
  return a + b;
};
var methodArrow = (a, b) => a + b;

//variables created with 'var' will create a property on the window object.
var x = 1;
let y = 2;
const z = 3;
console.log(
  'x is created as a property on the window object - window.x = ',
  window.x
);
console.log(x === window.x);
//let and const does not create a property on the window object.
console.log(y === window.y);
console.log(z === window.z);

///////////////////////////////////////////////////////////////////////////////////////
//Demonstartion of issue with var. numberOfItems being a var, will be hoisted to 'undefined'
//So even when numberOfItems=10  when the if block is executed, it evaluates to !undefined and
//therefore deleteOrder() is invoked. Intention was to invoke only when numberOfItems=0
///////////////////////////////////////////////////////////////////////////////////////

if (!numberOfItems) {
  deleteOrder();
}

var numberOfItems = 10;

function deleteOrder() {
  console.log('Order is deleted !');
}
///////////////////////////////////////////////////////////////////////////////////////
// this keyword
// this keyword always points to the method that calls it. Or it points to the owner
// Arrwo functions uses lexical this, i.e it does not have its own this, instead it uses the this of its parent.
// The global this has its owner as window.
///////////////////////////////////////////////////////////////////////////////////////
console.log(
  `****************************** Usage of 'this' keyword ******************************`
);
console.log(`Global 'this' :`, this);

const calculateAge = function (yob) {
  console.log(`'this' of a method invoked without object : `, this);
};
console.log(
  `1) Invoking a function Expression without using an object or owner : `
);
calculateAge();

const jonas = {
  yearofBirth: 1993,
  calcAge: function () {
    console.log(`'this' of the calling object instance `, this);
    return 2021 - this.yearofBirth;
  },
};
console.log(`2) Invoking a function using an object or owner, jonas : `);
console.log(jonas.calcAge());

//Borrowing funtion frmo jonas. But this will correspond to the calling object 'matilda'
const matilda = {
  yearofBirth: 1995,
};
matilda.calcAge = jonas.calcAge;
console.log(
  `3) Invoking a borrowed function using the borrowing object or owner, matilda : `
);
console.log(matilda.calcAge());

//This extracted function form jonas object does not have an owner, hence this will be undefined.
//and undefined.yearofBirth will give error
const extractedFunction = jonas.calcAge;
console.log('extractedFunction : ', extractedFunction);
console.log(
  `4) Invoking the calcAge() function extracted from jonas, owner or calling object is not present hence this is undefined.  `
);
//extractedFunction();
///////////////////////////////////////////////////////////////////////////////////////
var studentName = 'Ryan';
const employeeOne = {
  empname: 'Jonas',
  yearofBirth: 1993,
  calcAge: function () {
    console.log(`'this' of the calling object instance `, this);
    return 2021 - this.yearofBirth;
  },
  greet: () => {
    /****
     * Arrow function does not have 'this' keyword. It takes the this from the global scope here the code after
     * employeeOne = {} is not a block but its an Object Literal. Therefore the parent object is the window object which
     * does not have empname property, hence undefined.
     *****/
    console.log(this);
    console.log('Window x1 :: ', this.x1); // the this corresponds to the global scope , window.
    //window does not have empname hence undefined.
    console.log(`${this.empname}, Good morning..`);
    //the studentName comes from the window object and its var  - another reason to avoid vars- unexpected behaviours
    console.log(`${this.studentName}, Good morning..`);
  },
};
// If we change greet from an arrow function to a regular function expression this will give employeeOne instance and its
//firstName.
console.log(
  `5) Invoking an arrow function which does not have this keyword but takes its parents (window) 'this'`
);
employeeOne.greet();

///////////////////////////////////////////////////////////////////////////////////////
//A Regular function call has 'this' keyword set to undefined.
// Solution :1 is to use the self or that approach . Pre ES6 approach
///////////////////////////////////////////////////////////////////////////////////////
const customer = {
  custName: 'Jonas',
  yearofBirth: 2001,
  calcAge: function () {
    console.log(`'this' of the calling object instance `, this);
    //saving the 'this' from the parent to a variable to be used by scope chaining.
    const self = this; //called self or that
    const isMillenial = function () {
      //The regular function call, isMillenial() has the 'this' set to undefined.
      //Therefore this.yearofBirth and this.custName will be undefined.
      /*if (this.yearofBirth >= 2000) {
        console.log(`${this.custName} is a millenial`);
      }*/
      //This can be fixed by using the self or tht apporach given below.
      if (self.yearofBirth >= 2000) {
        console.log(`${self.custName} is a millenial`);
      }
    };
    //The regular function call, isMillenial() has the 'this' set to undefined.
    isMillenial();
    return 2021 - this.yearofBirth;
  },
};
console.log(
  `6) Solution :1 to invoking the regular function which has the 'this' set to undefined. Using self/other `
);
console.log(`${customer.custName} is ${customer.calcAge()} years old`);

///////////////////////////////////////////////////////////////////////////////////////
//A Regular function call has 'this' keyword set to undefined.
// Solution :2 is to use the self or that approach . Pre ES6 approach
///////////////////////////////////////////////////////////////////////////////////////

const player = {
  playerName: 'Jonas',
  yearofBirth: 2001,
  calcAge: function () {
    console.log(`'this' of the calling object instance `, this);
    //The arrow function uses the 'this' from  its parent scope , calcAge()
    //And in calcAge() this refers to the calling object 'player'
    const isMillenial = () => {
      if (this.yearofBirth >= 2000) {
        console.log(`${this.playerName} is a millenial`);
      }
    };
    //The regular function call, isMillenial() has the 'this' set to undefined.
    isMillenial();
    return 2021 - this.yearofBirth;
  },
};
console.log(
  `7) Solution :2 to invoking the regular function which has the 'this' set to undefined. Using arrow function which uses this from its parents scope, caclAge() where 'this' is 'player' `
);
console.log(`${player.playerName} is ${player.calcAge()} years old`);

///////////////////////////////////////////////////////////////////////////////////////
// 'arguments' keyword for regular functions.  It can be used to access all arguments passed on to a regular
// function, even the ones that are not named. Example given below.
// It does not exist for arrow functions.
///////////////////////////////////////////////////////////////////////////////////////
console.log(`8) arguments keyword in regular functions`);

const addExpr = function (a, b) {
  console.log(arguments);
  for (let arg of arguments) {
    console.log(arg);
  }
  return a + b;
};
addExpr(2, 5, 8, 10);

const addArrow = (a, b) => {
  // Below commented line with throw ReferenceError on arguments.
  //console.log(arguments);
  return a + b;
};

addArrow(2, 5, 9, 11);

///////////////////////////////////////////////////////////////////////////////////////
// 'primitives' vs 'objects' or reference types
///////////////////////////////////////////////////////////////////////////////////////
//Primitive types
let fname = 'Jessica';
let lname = 'Alba';
console.log('Before marriage : ', fname, lname);
let prevLname = lname;
lname = 'Simpson';
console.log('After marriage : ', fname, lname);

//Reference Types
const spinsterD = { fname: 'Diana', lname: 'David' };
console.log('spinsterD 1 : ', spinsterD);
const marriedD = spinsterD;
marriedD.lname = 'Charles';
console.log('spinsterD 2 : ', spinsterD);
console.log('marriedD : ', marriedD);

//Copying object using Object.assign() creates only a SHALLOW copy.
//i.e Object inside the object is not copied, instead that will still point to the source
const me = {
  firstName: 'Lidwin',
  lastName: 'Lewis',
  age: '35',
  family: ['Lewis', 'Merly', 'Lijiya', 'Ian'],
};
//Making a copy , by merging empty object with 'me' object.
const friend = Object.assign({}, me);
friend.lastName = 'Mendonca';
friend.family.push('Jacob');
//A new element added to te array reference to the shallo copy actually affected the me.family also.
console.log('me', me);
console.log('friend', friend);
