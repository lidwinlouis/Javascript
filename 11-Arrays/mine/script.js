'use strict';

/////////////////////////////////////////////////
// BANKIST APP
/////////////////////////////////////////////////
// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//LOGIN functionality
let currentUser;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentUser = accounts.find(acc => {
    return acc.username === inputLoginUsername.value;
  });
  if (currentUser?.pin === Number(inputLoginPin.value)) {
    console.log(`Logged in ${currentUser.owner} `);
    labelWelcome.textContent = `Welcome back ${
      currentUser.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    updateAccountDisplay(currentUser);
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
});

//Update Transaction details.
const updateAccountDisplay = function (user) {
  displayTransactions(user.movements);
  calcAndDisplayBalance(user);
  displaySummary(user);
  resetFormFields();
};

const resetFormFields = function () {
  inputTransferAmount.value = '';
  inputTransferTo.value = '';
};

//Transfer Amount - Deduct from current user and add to the target user.
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const transferAmount = inputTransferAmount.value;
  const transferTo = inputTransferTo.value;
  const recieverAccount = accounts.find(acc => {
    return acc.username === transferTo;
  });
  //console.log(`${transferAmount} to ${transferTo}`);
  if (
    transferAmount > 0 &&
    recieverAccount &&
    currentUser.balance >= transferAmount &&
    recieverAccount?.username !== currentUser.username
  ) {
    console.log(
      `Going to transfer ${transferAmount} to ${recieverAccount.owner}`
    );
    currentUser.movements.push(transferAmount * -1);
    recieverAccount.movements.push(Number(transferAmount));
    updateAccountDisplay(currentUser);
  }
});

//Loan - Allow loan if there is atleast one deposit which is >= 10% of requested amount
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  console.log(currentUser.movements);
  const loanAmount = Number(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentUser.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    currentUser.movements.push(loanAmount);
    console.log(currentUser.movements);
    updateAccountDisplay(currentUser);
  }
  inputLoanAmount.value = '';
});

//Delete an account(using findIndex)
//Returns the index of the match
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const user = inputCloseUsername.value;
  const pin = Number(inputClosePin.value);
  if (currentUser.username === user && currentUser.pin === pin) {
    const index = accounts.findIndex(
      acc => acc.username === user && acc.pin === pin
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  } else {
    console.log(`Wrong Account details... Cannot be deleted !`);
  }
});

//Sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayTransactions(currentUser.movements, sorted);
});

const displayTransactions = function (transactions, sort = false) {
  containerMovements.innerHTML = '';

  //Applying sort based on flag
  let movs = sort ? transactions.slice().sort((a, b) => a - b) : transactions;

  movs.forEach(function (transaction, index) {
    //console.log(transaction);
    const type = transaction > 0 ? 'deposit' : 'withdrawal';

    let html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${transaction}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/*
//Reducer => accumulator, currentvalue, index and array are the args of callback function
const globalBalance = account1.movements.reduce(function (acc, curr, i, arr) {
  //console.log(`Iteration ${i} :: ${acc} :: ${curr}`);
  return acc + curr;
}, 0);
*/
//Using arrow funciton - index, i and fullarray, arr are not required actually
const calcAndDisplayBalance = function (currUser) {
  currUser.balance = currUser.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);
  labelBalance.textContent = `${currUser.balance} €`;
};
//calcAndDisplayBalance(account1.movements);

const displaySummary = function (curr) {
  const income = curr.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  labelSumIn.textContent = `${income}€`;
  //console.log('INCOME ', income);
  const outgoing = curr.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  //console.log('outgoing ', Math.abs(outgoing));
  labelSumOut.textContent = `${Math.abs(outgoing)}€`;

  const balance = curr.movements
    .filter(mov => mov > 0)
    .map(deposit => {
      //console.log(`Interest Rate : ${curr.interestRate}`);
      return (deposit * curr.interestRate) / 100;
    })
    .reduce((acc, curr) => {
      return acc + curr;
    }, 0);
  // const interest = balance * 0.074;
  //Math.round;
  labelSumInterest.textContent = `${Math.abs(balance)}€`;
};
//displaySummary(account1.movements);

//Using forEach with a  side and using Map
//Side-effect is adding a new attribute , username, to the account object
//Method to create username attribute with initials of the owner in lowercase.
const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const deposits = account1.movements.filter(function (trans) {
  return trans > 0;
});

const withdraws = account1.movements.filter(function (trans) {
  return trans < 0;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/////////////////////////////////////////////////
/////////////////////////////////////////////////
//SLICE METHOD
//Creates a new array from the source without mutating the orginal array
console.log('****************SLICE*****************');
let arr = ['a', 'b', 'c', 'd', 'e', 'f'];
console.log('Original Array : ', arr);
console.log(`arr.slice(1) `, arr.slice(1));
console.log(`arr.slice(2, 4) `, arr.slice(2, 4));
console.log(`arr.slice(-1) `, arr.slice(-1));
console.log(`arr.slice(-3) `, arr.slice(-3));
console.log(`arr.slice(1, -3) `, arr.slice(1, -3));
//To create a shallow copy of an array .slice() can be used
let arrCopy = arr.slice();
console.log(`Shallow copy using slice() : `, arrCopy);
//Spread operator also can be used for creating shallow copy but when chaining is required .slice()
//can be used as it returns a new array.

//SPLICE METHOD
//Splice works on the source array and thereby mutates the orginal array
console.log('****************SPLICE*****************');
let arr2 = arr.slice(); //Creating a copy to work with

console.log('Original Array : ', arr2);
arr2.splice(1, 2);
console.log(`arr2.splice(1, 2) `, arr2);
arr2.splice(-1, 1);
console.log(`arr2.splice(-1, 1) `, arr2);

//REVERsE METHOD
//Reverse() works on the source array and thereby mutates the orginal array
console.log('****************REVERSE*****************');
let revArr = ['k', 'j', 'i', 'h', 'g'];
console.log(`revArr.reverse() `, revArr.reverse());

console.log('****************CONCAT*****************');
let arr3 = arr.slice(); //Creating a copy to work with
console.log(`arrayone.concat(arraytwo) :`, arr3.concat(revArr));
console.log(`Using spread operator : `, [...arr3, ...revArr]);

console.log('****************JOIN*****************');
console.log(`array.join('-') `, arr3.join('-'));

//Loop over Arrays
console.log('****************************************************');
console.log('****************Looping over Arrays*****************');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

console.log('****************FOR...OF*****************');

//One way of using for...of when index is not required.
//for (let movement of movements) {
//When index is required.
for (let [index, movement] of movements.entries()) {
  if (movement > 0) {
    console.log(`${index + 1}) Deposited : Rs.${movement}/-`);
  } else {
    console.log(`${index + 1}) Withdrew : Rs.${movement}/-`);
  }
}

console.log('****************FOREACH*****************');
//NO BREAKING FROM LOOP POSSIBLE WITH FOREACH.

let sum = 0.0;
//One way of using forEach when index is not required.
//movements.forEach(function (movement) {
//Second way of using forEach when index IS required.
movements.forEach(function (movement, index, fullarray) {
  if (movement > 0) {
    console.log(`${index + 1}) Deposited : Rs.${Math.abs(movement)}/-`);
    sum += movement;
  } else {
    console.log(`${index + 1}) Withdrew : Rs.${Math.abs(movement)}/-`);
    sum -= Math.abs(movement);
  }
});
console.log(`Balance : Rs.${sum}/-`);

console.log(`forEach on Maps and Sets`);
const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies.forEach(function (value, key, map) {
  console.log(`${key} => ${value}`);
});

const currencySet = new Set(['INR', 'GBP', 'USD', 'EUR', 'USD', 'INR']);
console.log(`Currency Set : `, currencySet);

currencySet.forEach(function (value, key, set) {
  console.log(`${key} => ${value}`);
});

console.log('****************MAP*****************');
//Map applies a function on each element of an array and return a new array with the fn applied to all.
const usdEuroRate = 1.1;
console.log(movements);
const usdValues = movements.map(function (val) {
  return val * usdEuroRate;
});
console.log(usdValues);

const usdValues2 = movements.map(value => value * usdEuroRate);
console.log(usdValues2);

const transactionStatments = movements.map((transaction, index, movements) => {
  if (transaction > 0) {
    return `${index + 1}) Deposited : Rs.${Math.abs(transaction)}/-`;
  } else {
    return `${index + 1}) Withdrew : Rs.${Math.abs(transaction)}/-`;
  }
});
console.log(transactionStatments);

console.log('****************REDUCE*****************');
//Reduce method to find minimum and maximum values.
console.log(`Original : ${movements}`);
const minVal = movements.reduce(function (acc, mov, index, movements) {
  return acc > mov ? mov : acc;
}, movements[0]);
console.log(`Min Value : ${minVal}`);
const maxValue = movements.reduce((acc, mov) => {
  return acc < mov ? mov : acc;
}, movements[0]);
console.log(`Max Value : ${maxValue}`);
const totalMovements = movements.reduce((acc, mov) => {
  return acc + mov;
}, 0);
console.log(`Total : ${totalMovements}`);

//Find number of deposits greater than 1000
const totalGreater1000 = movements.reduce((acc, mov, index) => {
  return Number(mov) >= 1000 ? acc + 1 : acc;
}, 0);
console.log('totalGreater1000', totalGreater1000);

console.log('****************CHAINING*****************');

console.log(`Before Chaining: ${movements}`);
const USDDeposits = movements
  .filter(function (mov) {
    return mov > 0;
  })
  .map((val, i, arr) => {
    console.log(`Inside Map Method : ${arr}`);
    return val * 1.2;
  })
  .reduce((acc, trans, i, arr) => {
    console.log(`Inside Reduce Method : ${arr}`);
    return acc + trans;
  }, 0);
console.log(`Deposits in USD : ${USDDeposits}`);

console.log('****************INCLUDES, SOME & EVERY *****************');

console.log(movements);
//Checks Equality
console.log(`Array.includes(-130) :: ${movements.includes(-130)}`);

//Using some() to check if any negative value (withdrawal) is there in the array.
//fnction which returns a boolean is the param
const hasSomeWithdrawal = movements.some(ele => ele < 0);
console.log(`Array.some(ele => ele < 0) :: ${hasSomeWithdrawal}`);

//every() - All elements of the array should satisfy the condistion in the callback funciton
//for the method to return true.
//Checks if all movemtns are deposits
console.log(account4.movements);
console.log(
  `Array.every( mov => mov >0 ) :: ${account4.movements.every(mov => mov > 0)}`
);
//Checks if all movemtns are withdrawals
console.log(
  `Array.every( mov => mov < 0 ) :: ${account4.movements.every(mov => mov < 0)}`
);
console.log('**************** flat and flatmap *****************');
//flat(depth) flattens a nested array taking in the depth argument.
const arrOne = [[1, 2], [3, 4], [5, 6, 7], 8, 9];
console.log('Original Array :', arrOne);
console.log(arrOne.flat()); // or arrOne.flat(1)
const arrtwo = [[1, 2], [3, 4], [[5, 6], 7], 8, 9];
console.log('Original Array :', arrtwo);
console.log('Array.flat(1)', arrtwo.flat()); // or arrOne.flat(1)
console.log('Array.flat(2)', arrtwo.flat(2)); //depth is given 2 so that the [5,6] is also flattened.

const totalTransacation = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov, index) => {
    return acc + mov;
  }, 0);
console.log(`Total Money in bank :: `, totalTransacation);
//Using flatMap()
//Flat map actally combines map() and flat(1) => depth possible is 1
const totalTransacation1 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov, index) => {
    return acc + mov;
  }, 0);
console.log(`Total Money in bank using flatMap() :: `, totalTransacation1);

console.log('**************** sorting *****************');
//sort() function mutates the base array.
//sort() by default sorts based on string , for numbers we have to implement a
//callback function
const namesArray = [
  'Zach',
  'Jesse',
  'Paul',
  'Xavi',
  'Bruno',
  'Cavani',
  'Iniesta',
];
console.log(`Original Array`, namesArray);
//namesArray get mutated in the below step
namesArray.sort();
console.log(`Sorted Array`, namesArray);

const numberArray = [1990, -2000, 3050, 650, -150, 750, -230];
console.log(`Original Number Array :`, numberArray);
numberArray.sort();
//sorting happens on string represented by the number array.
console.log(`sort() without callback : `, numberArray);

/*sort in Ascending order
numberArray.sort((a, b) => {
  if (a > b) return 1;
  if (a < b) return -1;
});
*/
//Simplified
numberArray.sort((a, b) => a - b);
console.log(`sort() with callback Ascending: `, numberArray);
numberArray.sort((a, b) => b - a);
console.log(`sort() with callback Descending: `, numberArray);

console.log('**************** creating and filling arrays *****************');

//Creates an array with 7 elements, all of which are empty
const x = new Array(7);
console.log(x);
//Functions like map() on the above array will not work.
//but fill() method can be used to populate the above array.
//fill() mutates the original array and takes in arguments like slice, fill( val, startindex, endindex)
x.fill(5);
console.log(x);
x.fill(11, 2, 5);
console.log(x);

//Array.from({lenght:xx}, callbackfunction)
const y = Array.from({ length: 7 }, () => 1);
console.log(y);
//can use '_' in place of 'curr' as it is unused and is a throw away
const z = Array.from({ length: 7 }, (curr, index) => index + 1);
console.log(z);

//applying this Array.from() on the dom
labelBalance.addEventListener('click', function () {
  const nodes = document.querySelectorAll('.movements__value');
  const vals = Array.from(nodes, el => el.textContent.replace('€', ''));
  console.log(vals);
});

console.log('**************** More Exercises *****************');

//Find number of deposits greater than or equal to 1000 from all accounts- Method one without reduce
console.log(
  accounts
    .map(acc => acc.movements)
    .flat()
    .filter(mov => mov >= 1000).length
);

console.log(
  accounts.flatMap(acc => acc.movements).filter(mov => mov >= 1000).length
);

//Find number of deposits greater than 1000
const totalGreater10001 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov, index) => {
    return Number(mov) >= 1000 ? ++acc : acc;
  }, 0);
console.log('totalGreater1000', totalGreater10001);

//Evaluate deposits and withdrawals in one go using reduce() and objects
const { deps, withs } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      curr > 0 ? (sums.deps += curr) : (sums.withs += curr);
      //slightly advanced
      //sums[curr > 0 ? 'deps' : 'withs'] += curr;
      return sums;
    },
    { deps: 0, withs: 0 }
  );
console.log(deps, withs);
