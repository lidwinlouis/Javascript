'use strict';
//Constructor Functions
console.log('************ Constructor Function ************');
//Function declartion and function expressions can be used for creating 'Constructor Functions'.
//Arrow functions does not work for being used as a constructor functions because they do not have 'this' keyword.
//Use a captial letter to start the construction function name
const Person = function (firstName, yearofBirth) {
  //instance properties
  this.firstName = firstName;
  this.yearofBirth = yearofBirth;
  //methods can be created like below, but its NOT RECOMMENDED as it will carry around a copy of this method
  //for each instance of the Person object,as its bad performance.
  //Instead we use 'prototypes' and prototype inheritance.
  /*
    this.calcAge = function () {
        return 2037 - this.yearofBirth;
    };
  */
};

//With an empty body in the construction function , while creating an instance using new keyword below things happen
//1. A new empty obect {} is created
//2. function is called, and 'this' is assigned to the empty object , this = {}
//3. {} is then linked to a Prototype
//4. then the functino automatically returns the above created {}
const jonas = new Person('Lidwin Lewis', 1985);
console.log(jonas);
//Any number of instances can be creted from the blueprint using new keyword.
const jake = new Person('Jake Davis', 1990);
console.log(jake);
console.log(`jonas instanceof Person => `, jonas instanceof Person);

/***************************************/
/************Prototypes*****************/
/***************************************/
console.log('************ Prototypes ************');

//Prototype property of Constructor Function can hold methods and attributes.
Person.prototype.calcAge = function () {
  return 2037 - this.yearofBirth;
};
Person.prototype.species = 'Homo Sapiens';

/***************************************/
/************Prototypes*****************/
/***************************************/

console.log(`Person.prototype  => `, Person.prototype);
console.log(`jonas.__proto__   => `, jonas.__proto__);
console.log(
  `jonas.__proto__ === Person.prototype  => `,
  jonas.__proto__ === Person.prototype
);
//Person.prototype is a prototype of the instance jonas and jake
console.log(
  `Person.prototype.isPrototypeOf(jonas)  => `,
  Person.prototype.isPrototypeOf(jonas)
);
console.log(
  `Person.prototype.isPrototypeOf(jake)=>`,
  Person.prototype.isPrototypeOf(jake)
);
//Person.prototype is not a prototype of Person
console.log(
  `Person.prototype.isPrototypeOf(Person)=>`,
  Person.prototype.isPrototypeOf(Person)
);

console.log(`Person.prototype`, Person.prototype);
console.log(`jonas.__proto__   => `, jonas.__proto__);
//Prototype chaining leading back to the prototype of Object (Object.prototype)
console.log(`jonas.__proto__.__proto__   => `, jonas.__proto__.__proto__);
//Tries to access the __proto__ of Object , which is NULL. the chain ends here
console.log(
  `jonas.__proto__.__proto__.__proto__   => `,
  jonas.__proto__.__proto__.__proto__
);

//Here the speicies and caclAge are prototype inherited properties
//they are not ownproperty with respect to the Person object. This can be checked using hasOwnProperty
console.log(`jonas.species - `, jonas.species);
console.log(`jonas.calcAge - `, jonas.calcAge());
//jonas.hasOwnProperty('firstName');
console.log(
  `jonas.hasOwnProperty('firstName') - `,
  jonas.hasOwnProperty('firstName')
);
console.log(
  `jonas.hasOwnProperty('calcAge') - `,
  jonas.hasOwnProperty('calcAge')
);
console.log(
  `jonas.hasOwnProperty('species') - `,
  jonas.hasOwnProperty('species')
);

console.log(
  `jonas.__proto__.hasOwnProperty('firstName') - `,
  jonas.__proto__.hasOwnProperty('firstName')
);
console.log(
  `jonas.__proto__.hasOwnProperty('calcAge') - `,
  jonas.__proto__.hasOwnProperty('calcAge')
);
console.log(
  `jonas.__proto__.hasOwnProperty('species') - `,
  jonas.__proto__.hasOwnProperty('species')
);
console.log('************ Array Prototype ************');

const myArray = new Array(2, 3, 4, 5, 2, 4, 5); // Or just myArray = [2,3,4,5,6]
console.log(`myArray.__proto__ `, myArray.__proto__);

//Adding custom method to the Array prototype _ NOT RECOMMENDED
Array.prototype.unique = function () {
  return [...new Set(this)];
};
console.log(myArray.unique());

const h1 = document.querySelector('h1');
console.dir(h1.__proto__);
console.dir(h1.__proto__.__proto__);
console.dir(h1.__proto__.__proto__.__proto__);
console.dir(h1.__proto__.__proto__.__proto__.__proto__);
console.dir(h1.__proto__.__proto__.__proto__.__proto__.__proto__);
console.dir(h1.__proto__.__proto__.__proto__.__proto__.__proto__.__proto__);

console.log('************ ES6 Classes ************');
//classes are syntactical sugar. behind the scenes they are special type of functions

//1. Classes are not hoisted - i.e. Cannot be used before declaring
//2. Class body is always executed in strict mode.
//3. Classes are first-class citizens, i.e they can be passed as args or returned from a function.

//Methd :1 - class expression
const PersonClassExp = class {};

//Method :2 - class declaration
class PersonClass {
  constructor(firstName, fullName, yearofBirth) {
    this.firstName = firstName;
    this.yearofBirth = yearofBirth;
    this.fullName = fullName;
  }
  //This method will be automatically added to the Prototype property of PersonClass
  calcAge() {
    let age = 2037 - this.yearofBirth;
    console.log(age);
    return age;
  }
  //getter age
  get age() {
    let age = 2037 - this.yearofBirth;
    console.log(age);
    return age;
  }
  // Setter can be used to validate fields
  //Setter for an already existing prperty
  set fullName(fName) {
    if (fName.includes(' ')) {
      //The _fullName is used because the property fullName already exists and therefore will result in an error.
      //Here onwards the property that gets the fullname is '_fullName' and not 'fullName'
      this._fullName = fName;
    } else {
      //Validation message
      console.log('The name is not a Full Name !!');
    }
  }

  //Now to get the fullName , we need to use this._fullName and not this.fullName
  //Therefore we can write the getter as below.
  get fullName() {
    return this._fullName;
  }
}
//If we pass a name that does not have ' ' in between then it would be validated in set fullName and
//logs an error in the console. this.fullName OR this._fullName will not be set in this case
const jessica = new PersonClass('Jessica', 'Jessica Davis', 1988);
//Explicitly adding greet function to the Prototype property of PersonClass
PersonClass.prototype.greet = function () {
  return `Hello, ${this.firstName} !`;
};

console.log(`jessica.__proto__ => `, jessica.__proto__);
jessica.calcAge();
console.log(`jessica.greet() =>`, jessica.greet());
//Using getter
console.log(`jessica.age =>`, jessica.age);
//Using getter of fullName which returns the validated fullname which is stored in this._fullName
console.log(`jessica.fullName  `, jessica.fullName);

console.log(
  `jessica.__proto__ === PersonClass.prototype =>`,
  jessica.__proto__ === PersonClass.prototype
);

//Accessor properties and Data properties
//Getters and Setters for regular object
const account = {
  owner: 'Jonas',
  movements: [1000, 2500, -300, -1500, 4500],
  //the accessor property (getter) is named like below ; latest is the property name
  get latest() {
    return this.movements.slice(-1).pop();
  },
  //the accessor property (setter) is named like below ; latest is the property name
  //setter should have exactly one argument
  set latest(mov) {
    this.movements.push(mov);
  },
};
//the getter is invoked as if its a property and NOT as a function, latest().
console.log(account.latest);
//The setter is assessed as a property
account.latest = -2000;
console.log(account.movements);

console.log('************ Static Methods ************');
//Array.from() is a static method on Array and its not a prototype method.
//Means that [1,2,3].from() will not work.
console.log(Array.from(document.querySelectorAll('h1')));
//similarly Number.parseFloat() is also another static method
class StudentClass {
  constructor(firstName, lastName, yearofBirth) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.yearofBirth = yearofBirth;
  }
  //Instance method - Will be added to the _proto_ of instances.
  calcAge() {
    return 2037 - this.yearofBirth;
  }
  //staic method - Will not be avialble to instances.
  static greetings() {
    console.log('Static Method : Greetings from static methods !');
    console.log(this);
  }
}
//Static method on the class implemented as ES6 class,  StudentClass
StudentClass.greet = function () {
  console.log('Hey there.. Good morning.!');
};
StudentClass.greet();
const jonathan = new StudentClass('Jonathan', 'Blake', 1990);
console.log('Calling instance method calcAge() ', jonathan.calcAge());
//This will not work as greet() is a static method on the Class StudentClass and not available on its instances.
//jonathan.greet();
//Invoking Static methods
StudentClass.greetings();

console.log('************ Object.create() ************');

//1. Create an object , that will act as the prototype of the instances

const StudentProto = {
  calcAge() {
    return 2037 - this.yearofBirth;
  },
};
//An instance is created using the above plain object as its prototype (__proto__)
const david = Object.create(StudentProto);
console.log(
  `david.__proto__ === StudentProto => `,
  david.__proto__ === StudentProto
);
console.log(david);

david.yearofBirth = 1985;
console.log(david);
console.log(david.calcAge());

////////////////////////////////////////////////////
/////////// Inheritance between Classes ////////////
////////////////////////////////////////////////////
console.log(
  '************ Inheritance between classes Using Constructor Functions  ************'
);
//Using Constructor Functions
//PARENT class
const Parent = function (firstName, lastName, yearofBirth) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.yearofBirth = yearofBirth;
};
//Method that will be later inherited by Child by prototype chaining
Parent.prototype.calcAge = function () {
  return 2021 - this.yearofBirth;
};

//CHILD class
const Child = function (first, last, yob, placeOfBirth) {
  //Property local to Child
  this.placeOfBirth = placeOfBirth;
  //Instead of copying properties from Parent, we call the parent.
  Parent.call(this, first, last, yob);
};

//This is the link between Child and Parent class.
//This is done before attaching private method to child becuase otherwise a new object
//will overwrite the Child.prototype on executing Object.create()
Child.prototype = Object.create(Parent.prototype);

//Method unique to child
Child.prototype.introduce = function () {
  return `Hi, I am ${this.firstName}, and I am from ${this.placeOfBirth}`;
};

//Instance of Child
const firstChild = new Child('Lidwin', 'Lewis', 1985, 'Kerala');

console.log(`Child :: `, firstChild);
console.log(`Child - private method :: `, firstChild.introduce());
console.log(`Child - inherited method :: `, firstChild.calcAge());
console.log(`firstChild instanceof Child `, firstChild instanceof Child);
//If we comment the place where Child.prototype is linked to Parent.prototype
//Belo expression will evaluate to false.
console.log(`firstChild instanceof Parent `, firstChild instanceof Parent);
console.dir(Child.prototype.constructor);
Child.prototype.constructor = Child;
console.dir(Child.prototype.constructor);

console.log(
  '************  Inheritance between classes Using ES6 Classes  ************ '
);

class ParentClass {
  constructor(firstname, lastname, yearofBirth) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.yearofBirth = yearofBirth;
  }

  get age() {
    return 2021 - this.yearofBirth;
  }

  calcAge() {
    return `I am ${2021 - this.yearofBirth} years old.`;
  }
}

class ChildClass extends ParentClass {
  constructor(first, last, yob, pob) {
    //super() should be called first in the constructor
    super(first, last, yob);
    this.placeOfBirth = pob;
  }

  introduce() {
    //firstname from the Parent and placeOfBirth from Child
    return `My Name is ${this.firstname} and I am from ${this.placeOfBirth}`;
  }

  calcAge() {
    return `I am ${2021 - this.yearofBirth} years old but I feel older.`;
  }
}

const childObj = new ChildClass('Lidwin', 'Lewis', 1985, 'Cochin');
console.log(`Child Class :: `, childObj);
console.log('Child method : Age : ', childObj.calcAge());
console.log('ChildClass.introduce() : ', childObj.introduce());
console.log('Inherited age from Parent getter : ', childObj.age);

console.log(
  '************  Inheritance between classes Using Object.create  ************ '
);

const PersonProto = {
  init(firstname, lastname, yearofBirth) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.yearofBirth = yearofBirth;
  },
  calcAge() {
    return `I am ${2021 - this.yearofBirth} years old.`;
  },
};

const steven = Object.create(PersonProto);
console.log(`Steven :`, steven);

//PersonProto is inherited in StudentProto here
const StudentProt = Object.create(PersonProto);
//Adding StudentProt speicific attribute
StudentProt.nationality = 'Norway';
StudentProt.greet = function () {
  return `I'm ${this.firstname} ${this.lastname} and I am from ${this.nationality}`;
};
//init is just a pattern used to mock the constructor and we use .call() like calling super()
StudentProt.init = function (first, last, yob) {
  PersonProto.init.call(this, first, last, yob);
};

//Object inherits from PersonProto and StudentProt and has access to all methods and attributes from
//PersonProto and StudentProt
const jay = Object.create(StudentProt);
jay.init('Jay', 'motta', 1980);
console.log(`jay :`, jay);

console.log(`jay.greet() : `, jay.greet());
console.log(`jay.calcAge() : `, jay.calcAge());

console.log('********ES6 Classes-Data Encapsulation and Privacy********* ');

class Account {
  constructor(owner, pin, currency) {
    this.owner = owner;
    this.currency = currency;
    //Protected property
    this._pin = pin;
    //Not all attributes need to be passed in for initializaiton.
    this._movements = [];
    this.locale = navigator.language;
    console.log(`Welcome ${this.owner}! Thank you for opening the account`);
  }

  deposit(val) {
    this._movements.push(val);
  }

  withdraw(val) {
    this.deposit(-val);
  }

  approveLoan() {
    return true;
  }

  requestLoan(amt) {
    if (this.approveLoan()) {
      this.deposit(amt);
      console.log(`Loan Approved! ${amt} deposited to your account`);
    }
  }
}

const myAccount = new Account('Alex', 1111, 'INR');

myAccount.deposit(2000);
myAccount.withdraw(500);
myAccount.requestLoan(1500);
//This is not good for privacy, even though we intend to call approveLoan() from requestLoan(), others can
//access. There should be a way to restrict access to these more private methods. Encapsulation and Data Privacy.
//Javascrit has not developed truly private properties or methods yet, but the convention now is to name the
//attribute/property to be considered or flagged as protected, name it with a leading underscore.
//People can still change it , but just gives the indicatino that its not supposed to be accessed directly..
myAccount.approveLoan();
console.dir(myAccount);

console.log('******** Proposed Data privacy techniques ********* ');

//THESE ARE STILL IN STAGE 3 of development , not official yet
//These are on the ES6 Class

//1) Private fields
//2) Private methods
//3) Public fields
//4) Public methods

class AccountSecure {
  //1) public fields (instance fields)
  locale = navigator.language;

  //2) private fields - Note use of #
  #movements = [];
  #pin;

  constructor(owner, pin, currency) {
    this.owner = owner;
    this.currency = currency;
    //Protected property
    this._pin = pin;
    console.log(`Welcome ${this.owner}! Thank you for opening the account`);
  }

  deposit(val) {
    this.#movements.push(val);
    //For chaining
    return this;
  }

  withdraw(val) {
    this.deposit(-val);
    //For chaining
    return this;
  }

  //Public methods
  getMovements() {
    return this.#movements;
  }

  //Private Method - Not yet implemented
  /*
   #approveLoan(){
    return true;
   }
 */

  approveLoan() {
    return true;
  }
  requestLoan(amt) {
    if (this.approveLoan()) {
      this.deposit(amt);
      console.log(`Loan Approved! ${amt} deposited to your account`);
      //For chaining
      return this;
    }
  }
}

const mySecureAccount = new AccountSecure('Alex', 1111, 'INR');
//Private hence below access is denied.
//mySecureAccount.#movements.push(100);
//mySecureAccount.#movements;
//mySecureAccount.#pin;

mySecureAccount.deposit(2500);
mySecureAccount.withdraw(50);
//Allowing access via getter
console.log(mySecureAccount.getMovements());
console.dir(mySecureAccount);

//Chaining methods
//For chaining to work the methods that are part of the chain should return the object on which the
// subsequent method can be applied.
mySecureAccount.deposit(5000).deposit(2500).requestLoan(1500).withdraw(3000);
console.log(mySecureAccount.getMovements());
