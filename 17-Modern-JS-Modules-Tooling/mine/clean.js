//Object.freeze() - This will shallow freeze the object
//Note that deep freeze will need other libraries
var budget = Object.freeze([
  { value: 250, description: 'Sold old TV 📺', user: 'jonas' },
  { value: -45, description: 'Groceries 🥑', user: 'jonas' },
  { value: 3500, description: 'Monthly salary 👩‍💻', user: 'jonas' },
  { value: 300, description: 'Freelancing 👩‍💻', user: 'jonas' },
  { value: -1100, description: 'New iPhone 📱', user: 'jonas' },
  { value: -20, description: 'Candy 🍭', user: 'matilda' },
  { value: -125, description: 'Toys 🚂', user: 'matilda' },
  { value: -1800, description: 'New Laptop 💻', user: 'jonas' },
]);

//Object.freeze() - This will shallow freeze the object
//Note that deep freeze will need other libraries
var expenseLimit = Object.freeze({
  jonas: 1500,
  matilda: 100,
});

//const getSpendingLimit = user => (expenseLimit[user] ? expenseLimit[user] : 0;
//Using optional chaining and coalescing.
//const getSpendingLimit = user => (expenseLimit?.[user] ?? 0;
//Passing in all parameters required such that no external values are being depended upon
const getSpendingLimit = (expLimits, user) =>
  expLimits[user] ? expLimits[user] : 0;

//Adding default value to the args
var addExpense = function (
  state,
  expLimits,
  value,
  description,
  user = 'jonas'
) {
  const cleanUser = user.toLowerCase();
  if (value <= getSpendingLimit(expLimits, cleanUser)) {
    //Instead of mutatin the oringal budget object an updated copy is returned.
    return [
      ...state,
      { value: -value, description: description, user: cleanUser },
    ];
  } else {
    return state;
  }
};

const budget1 = addExpense(budget, expenseLimit, 10, 'Pizza 🍕');
const budget2 = addExpense(budget1, expenseLimit, 100, 'Movies 🍿', 'Matilda');
const budget3 = addExpense(budget2, expenseLimit, 200, 'Stuff', 'Jay');

//Instead of mutating the incoming budget/state, use map operation and add new parameter 'limit' and return
//the new copy. If limit not reached then retrn the unaltered object.
const checkLimit = (state, limits) => {
  return state.map(entry => {
    return entry.value < -getSpendingLimit(limits, entry.user)
      ? { ...entry, flag: 'limit' }
      : entry;
  });
};
const finalBudget = checkLimit(budget3, expenseLimit);
console.log(`Final Budget : `, finalBudget);

let bigExpenses = function (bigLimit, state) {
  const filtered = state
    .filter(budget => budget.value <= -bigLimit)
    .map(el => el.description.slice(-2))
    .join('/');
  console.log('Using Filter.Map.Join :', filtered);
  //OR using reducers as below
  const newResult = state
    .filter(budget => budget.value <= -bigLimit)
    .reduce((prev, curr) => `${prev} / ${curr.description.slice(-2)}`, '');

  console.log('Using Reduce :', newResult);
};

bigExpenses(500, budget3);
