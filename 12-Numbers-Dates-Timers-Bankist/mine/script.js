'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2021-04-23T17:01:17.194Z',
    '2021-04-25T01:36:17.929Z',
    '2021-04-26T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
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

/////////////////////////////////////////////////
// Functions

const formatDisplayDate = function (displayDate, locale) {
  const now = new Date();
  const daysPassed = Math.trunc(
    Math.abs(displayDate - now) / (24 * 60 * 60 * 1000)
  );
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterdy';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${displayDate.getDate()}`.padStart(2, 0);
    const month = `${displayDate.getMonth()}`.padStart(2, 0);
    const year = `${displayDate.getFullYear()}`.padStart(2, 0);
    //const hours = `${displayDate.getHours()}`.padStart(2, 0);
    //const seconds = `${displayDate.getMinutes()}`.padStart(2, 0);
    const displayDateString = `${day}-${month}-${year}`;
    return new Intl.DateTimeFormat(locale).format(displayDate);
  }
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const locale = acc.locale;
  const userCurrency = acc.currency;
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const displayDate = new Date(acc.movementsDates[i]);

    const displayDateString = formatDisplayDate(displayDate, locale);
    const currencyConfig = {
      style: 'currency',
      currency: userCurrency,
    };
    const transactionAmount = new Intl.NumberFormat(
      locale,
      currencyConfig
    ).format(mov);
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDateString}</div>
        <div class="movements__value">${transactionAmount}</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  const locale = acc.locale;
  const userCurrency = acc.currency;
  const currencyConfig = {
    style: 'currency',
    currency: userCurrency,
  };
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const accBalanceDisplay = new Intl.NumberFormat(
    locale,
    currencyConfig
  ).format(acc.balance);
  //labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  labelBalance.textContent = accBalanceDisplay;
  const now = new Date();
  const day = `${now.getDate()}`.padStart(2, 0);
  const month = `${now.getMonth()}`.padStart(2, 0);
  const year = `${now.getFullYear()}`.padStart(2, 0);
  const hours = `${now.getHours()}`.padStart(2, 0);
  const seconds = `${now.getMinutes()}`.padStart(2, 0);

  let dateString = `${day}/${month}/${year}, ${hours}:${seconds}`;

  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    //year: '2-digit',
    weekday: 'short',
    // weekday: 'long',
  };
  console.log(`Locale from the browser : ${locale}`);
  //locale = 'en-US' or 'en-GB' or 'pt-PT'
  dateString = new Intl.DateTimeFormat(locale, options).format(now);

  labelDate.textContent = dateString;
};

const calcDisplaySummary = function (acc) {
  const locale = acc.locale;
  const userCurrency = acc.currency;
  const currencyConfig = {
    style: 'currency',
    currency: userCurrency,
  };
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const incomesDisplay = new Intl.NumberFormat(locale, currencyConfig).format(
    incomes
  );
  labelSumIn.textContent = `${incomesDisplay}`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outDisplay = new Intl.NumberFormat(locale, currencyConfig).format(out);
  labelSumOut.textContent = `${outDisplay}`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);

  const interestDisplay = new Intl.NumberFormat(locale, currencyConfig).format(
    interest
  );
  labelSumInterest.textContent = `${interestDisplay}`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;
let logoutTimer;

const startLogoutTimer = function () {
  let timer = 120;
  const tick = function () {
    let min = `${Math.trunc(timer / 60)}`.padStart(2, '0');
    let seconds = `${timer % 60}`.padStart(2, '0');
    labelTimer.textContent = `${min}:${seconds}`;
    if (timer === 0) {
      console.log('Logoutn NOW');
      clearInterval(interval);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    timer--;
  };
  //Assigning the function which does the value update and invoking explicitly once below
  //before th setInterval invokes tick() is because, otherwise tick() will be invoked only after 1 second is elapsed
  //but we want it to start immediately hence calling below for the first time and rest will be handled by setInterval.
  tick();
  //labelTimer.textContent = timer;
  const interval = setInterval(tick, 1000);
  return interval;
};

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Clear any existing timers for other users..
    //Using a global variable for that .
    if (logoutTimer) {
      clearInterval(logoutTimer);
    }
    logoutTimer = startLogoutTimer();

    // Update UI
    updateUI(currentAccount);
  }
});

//Always logged in . Remove later
//currentAccount = account1;
//updateUI(currentAccount);
//containerApp.style.opacity = 100;

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movements.push(amount);
    receiverAcc.movementsDates.push(new Date());
    // Update UI
    updateUI(currentAccount);
    //clear the logout timer
    clearInterval(logoutTimer);
    logoutTimer = startLogoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date());
      // Update UI
      updateUI(currentAccount);
    }, 3000);
  }
  inputLoanAmount.value = '';
  //clear the logout timer
  clearInterval(logoutTimer);
  logoutTimer = startLogoutTimer();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
/////////////////////////////////////////////////
console.log('**************** Converting and Checking Numbers **************');
//In JS numbers are stored as floats
console.log(`23 === 23.0 :: ${23 === 23.0}`);

//Base 2 - 0 and 1 //JS uses binary rep and has issues like below
//0.1 + 0.2 = 0.30000000000000004
console.log(`0.1 + 0.2 = ${0.1 + 0.2}`);
console.log(`0.1 + 0.2 === 0.3 => ${0.1 + 0.2 === 0.3}`);

//Conversion and Coersion
console.log(`Number('23') : ${Number('23')}`);
console.log(`+'23' : ${+'23'}`);

//Parsing
console.log(`Number.parseInt('30px') : ${Number.parseInt('30px')}`);
//specifying base , 10
console.log(`Number.parseInt('30',10) : ${Number.parseInt('30', 10)}`);
console.log(`Number.parseInt('23.5') : ${Number.parseInt('23.5')}`);
console.log(`Number.parseFloat('23.5') : ${Number.parseFloat('23.5')}`);

console.log(`Number.isNaN('30') :  ${Number.isNaN('30')} => ${typeof '30'}`);
console.log(`Number.isNaN(30) : ${Number.isNaN(30)} => ${typeof 30}`);
console.log(`Number.isNaN(+'30X') : ${Number.isNaN(+'30')} => ${typeof +'30'}`);
console.log(
  `Number.isNaN(+'30X') : ${Number.isNaN(+'30X')} => ${typeof +'30X'}`
);

//When you have check for a Number, use Number.isFinite()
console.log(`Number.isFinite('30') : `, Number.isFinite('30'), typeof '30');
console.log(`Number.isFinite(30) : `, Number.isFinite(30), typeof 30);
console.log(`Number.isFinite(+'30') : `, Number.isFinite(+'30'), typeof +'30');
console.log(
  `Number.isFinite(+'30X') : `,
  Number.isFinite(+'30X'),
  typeof +'30X'
);
console.log(`Number.isFinite(23/0) : `, Number.isFinite(23 / 0), `=>`, 23 / 0);

console.log(`Number.isInteger(23) :: `, Number.isInteger(23));
console.log(`Number.isInteger(23.0) :: `, Number.isInteger(23.0));
console.log(`Number.isInteger(23.5) : `, Number.isInteger(23.5));
console.log(`Number.isInteger(23 / 0) : `, Number.isInteger(23 / 0));

console.log('**************** Math and Rounding **************');
console.log(`Math.sqrt(25) : `, Math.sqrt(25));
console.log(`25 ** (1 / 2) : `, 25 ** (1 / 2));
console.log(`27 ** (1 / 3) : `, 27 ** (1 / 3));

console.log(`Math.max(10,8,36,-63, 25) : `, Math.max(10, 8, 36, -63, 25));
console.log(
  `Math.max(10,8,36,-63, '64', 25) : `,
  Math.max(10, 8, 36, -63, '64', 25)
);
console.log(`Math.min(10,8,36,-63, 25) : `, Math.min(10, 8, 36, -63, 25));
console.log(`Math.PI : `, Math.PI);

//Random number generation logic
//Rolling dice, numbers between 1 and 6 (including both)
console.log(Math.trunc(Math.random() * 6 + 1));

//generic logic number between min and max - including both

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
console.log(randomInt(-10, -20));

//Rounding Integers
console.log(`Math.round(23.3) :`, Math.round(23.3));
console.log(`Math.round(23.7) :`, Math.round(23.7));

console.log(`Math.floor(23.3) :`, Math.floor(23.3));
console.log(`Math.floor(23.7) :`, Math.floor(23.7));
console.log(`Math.floor(-23.7) :`, Math.floor(-23.7));

console.log(`Math.ceil(23.3) :`, Math.ceil(23.3));
console.log(`Math.ceil(23.7) :`, Math.ceil(23.7));
console.log(`Math.ceil(-23.7) :`, Math.ceil(-23.7));

//Rounding Decimals - To fixed by default returns as String.
console.log(
  ` (2.7).toFixed(0) (Returns string by default) : `,
  (2.7).toFixed(0)
);
console.log(
  ` (2.7).toFixed(0) (Coerced to a number using + ) : `,
  +(2.7).toFixed(0)
);

console.log(` (2.7).toFixed(1)  : `, +(2.7).toFixed(1));
console.log(` (2.736).toFixed(1)  : `, +(2.736).toFixed(1));
console.log(` (2.736).toFixed(2)  : `, +(2.736).toFixed(2));

console.log('**************** BigInt **************');
//Introduced in ES2020 - primitive
//JS represents numbers in 64bits of whih 53 are for numbers and the reset for sign, decimal etc.

console.log(`Biggest number that can be represented safely 2^53 `, 2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(Number.MIN_SAFE_INTEGER);
// console.log(Number.MAX_VALUE);
// console.log(Number.MIN_VALUE);

console.log(
  `BigInt represented with a trailing n :`,
  23565986541236547869898965477412144n
);
console.log(`Using BigInt constructor : `, BigInt(356263));
//The below output is not same as the first BigInt nmber even the numbers are same.!!
console.log(
  `Using BigInt constructor : `,
  BigInt(23565986541236547869898965477412144)
);

//Operations on BigInt
const bigOne = 113256554n;
const normal = 2;
//Will give error , cannot execute operatins on BigInt with other primitives
//console.log(bigOne * normal);
//console.log(Math.sqrt(20n));

console.log(bigOne * BigInt(normal));

//Logical operators and string concatenation are exceptions. No error caused.
console.log(`20n > 15 => `, 20n > 15);
console.log(`20n === 20 => `, 20n === 20);
console.log(`20n == 20 => `, 20n == 20);
console.log(`20n == 20 => `, 20n == 20);
console.log(bigOne + 'Is a really big number !');

console.log('10 / 3 = ', 10 / 3);
console.log('10n / 3n = ', 10n / 3n);
console.log('11n / 3n = ', 11n / 3n);
console.log('12n / 3n = ', 12n / 3n);

console.log('**************** Dates and Times **************');

const now = new Date();
console.log('Now ', now);

console.log('Unix Origin Date ', new Date(0));
const thirdDay = new Date(3 * 24 * 60 * 60 * 1000);
console.log('Unix Origin Date + 3days ', new Date(3 * 24 * 60 * 60 * 1000));

console.log(
  `new Date('Apr 26 2021 10:11:12') => `,
  new Date('Apr 26 2021 10:11:12')
);

console.log(`Movement dates from account : `, account1.movementsDates[0]);
//When constructor is given as string month, date etc are taken as such
console.log(new Date('2021 10 30 10:15:45'));
//When constructor is used as below, mnth is 0th index based and dates autocorrection is done.
console.log(
  `new Date(2021, 10, 30, 15, 23, 5) => `,
  new Date(2021, 10, 30, 15, 23, 5)
);
//Date auto corrected to next month
console.log(
  `new Date(2021, 10, 33, 15, 23, 5) => `,
  new Date(2021, 10, 33, 15, 23, 5)
);

const futureDate = new Date(2037, 6, 29, 16, 25, 30);
console.log('Future Date :: ', futureDate);
console.log('The Year :: ', futureDate.getFullYear());
console.log('The Month :: ', futureDate.getMonth());
//Day of the week
console.log('The Day :: ', futureDate.getDay());
console.log('The Date :: ', futureDate.getDate());
console.log('Hours :: ', futureDate.getHours());
console.log('Minutes :: ', futureDate.getMinutes());
console.log('Seconds :: ', futureDate.getSeconds());
console.log('ISO String :: ', futureDate.toISOString());
console.log('Time in MS :: ', futureDate.getTime());
//All gets have set methods as well.
futureDate.setMonth(9);
console.log('The Month :: ', futureDate.getMonth());

const date1 = new Date(2037, 10, 21);
const date2 = new Date(2037, 10, 26);

const calcDaysPassed = (d1, d2) => Math.abs(d2 - d1) / (24 * 60 * 60 * 1000);

console.log(calcDaysPassed(date1, date2));

console.log('**************** Internationalizaiton **************');

console.log(new Intl.DateTimeFormat('en-US').format(new Date()));
console.log(new Intl.DateTimeFormat('en-GB').format(new Date()));

const dateFormatConfig = {
  hour: 'numeric',
  minute: 'numeric',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
};
console.log(
  new Intl.DateTimeFormat('en-GB', dateFormatConfig).format(new Date())
);

const number = 30851236.5;

const mphFormat = {
  style: 'unit',
  unit: 'mile-per-hour',
};

const celsiusFormat = {
  style: 'unit',
  unit: 'celsius',
  //unit: 'fahrenheit',
};

const currencyFormat = {
  style: 'currency',
  unit: 'celsius',
  //unit: 'fahrenheit',
  currency: 'EUR',
};
console.log(new Intl.NumberFormat('en-US').format(number));
console.log(new Intl.NumberFormat('de-DE').format(number));
console.log(new Intl.NumberFormat('ar-SY').format(number));
console.log(new Intl.NumberFormat('en-US', currencyFormat).format(number));
const formValue = 35.5;
console.log(new Intl.NumberFormat('en-US', mphFormat).format(formValue));
console.log(new Intl.NumberFormat('en-US', celsiusFormat).format(formValue));

console.log('**************** Timers and Timeouts **************');

console.log('Order for Pizza placed ...');

//setTimeout( callbackFunction, timeout_in_ms, ...args)
const ingredients = ['spinach', 'olives'];
const pizzaTimer = setTimeout(
  (ing1, ing2) =>
    console.log(
      `Here is your delicious pizza with ${ing1} and ${ing2}...Enjoy!!`
    ),
  3000,
  ...ingredients
);
console.log('Waiting ...');
//if condition matches the timer is cleared.
if (ingredients.includes('spinach1')) {
  clearTimeout(pizzaTimer);
  console.log('Pizza order cancelled');
}

//setInterval( callbackFunction, timeout_in_ms, ...args)
setInterval(function () {
  console.log(`Current Time : ${new Date()}`);
}, 30000);
