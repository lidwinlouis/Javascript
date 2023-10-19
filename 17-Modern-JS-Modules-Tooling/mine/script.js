//Exporting module - File extension is required in case of JS unlike TS.
//DO NOT USE NAMED and DEFAULT exports in the same- Bad Practise
//imports are not copies of export, instead they have a live connection.
//importing everything into a Namespace.
import * as ShoppingCart from './shoppingCart.js';
//Using aliases
import { quantity as wishlistqty } from './wishList.js';
//Named Import - Use the exact name as exported.
import { shippingCharge, totalPrice } from './shoppingCart.js';
import { addToWishlist } from './wishList.js';
//Importing a default export can use any name; and {} is not required.
import addAddress from './addressBook.js';
//importing libraries from node_modules and lodash-es
import cloneDeep from './node_modules/lodash-es/cloneDeep.js';

//****Importing babel library for polyfilling Arrays, Promises etc.
//We can import all for polyfilling or cherry pick whats needed.
import 'core-js/stable';
//import 'core-js/stable/array/find';
//import 'core-js/stable/promise';
//****For Polyfilling Async functions****
import 'regenerator-runtime/runtime';

console.log('******Importing Module******');

ShoppingCart.addToCart('bread', 5, 30);
console.log(`Shopping Cart :: Shipping charge : ${shippingCharge}`);
console.log(`Shopping Cart :: Order Total : ${totalPrice}`);

addToWishlist('croissant', 10);
console.log(`Wishlist :: Quantity in my wishlist : ${wishlistqty}`);

addAddress('Lidwin Lewis', 'Thathenkery House', 'Cochin', 'Kerala');

//Module pattern - that was used before ES6 modules
//This sample uses an IIFE, normal functions can also be used.
//This IEFE was executed only once and return values are assigned to a vairable , shoppingCart2.
//But we ar still able execute the methods, addTOcart which refers to private variables like shippingcost becasuse of CLOSURE property
//This pattern has limitations when compared to native modules in ES6, like creating multiple JS files for each module,
//Then link them in HTML , taking care of the order in which import is done.
//All variables will be htere in the Global scope and bundling will not be possible .
const shoppingCart2 = (function () {
  const shippingCost = 10;
  const order = [];
  let quantity = 0;
  let orderTotal = 0.0;

  const addToCart = function (product, qty, basePrice) {
    order.push(product);
    quantity += qty;
    orderTotal = orderTotal + basePrice * qty + shippingCost;
    console.log(orderTotal);
    console.log(
      `Shopping Cart 2 :: ${qty} ${product} added to the cart. Order total : ${orderTotal}`
    );
  };

  return {
    order,
    orderTotal,
    addToCart,
    quantity,
  };
})();
shoppingCart2.addToCart('Ricebran oil', 2, 120);
shoppingCart2.addToCart('Atta', 1, 360);
//Reflecting the lates state of the order array, may be because of reference.
console.log(shoppingCart2.order);
console.log(shoppingCart2.order.find(el => el === 'Atta'));
//Not reflecting the variables latest values, but te assigned value of 0
console.log(shoppingCart2.orderTotal);

console.log('******Using external modules******');
//Javascript cloning leaves the references in the clone which will mutate the new object when the source is updated.

const state = {
  cart: [
    { product: 'apples', quantity: 10 },
    { product: 'coconut', quantity: 4 },
  ],
  user: { id: 1001, loggedIn: true },
};
console.log(`Original Object loggedIn : `, state.user.loggedIn);

//Cloning using plain javascript
const firstClone = Object.assign({}, state);
//Using Lodash deepClone()
const deepCloneObject = cloneDeep(state);

//When the source , state, is updated, the already cloned destination object also gets modified
state.user.loggedIn = false;
console.log(`Javascript Clone : `, firstClone.user.loggedIn);
console.log(`Lodash Clone  : `, deepCloneObject.user.loggedIn);

//THis is for Hot code replace without having to reload the page. Specific to parcel package
if (module.hot) {
  module.hot.accept();
}

class Person {
  greetings = 'Hey';
  constructor(name) {
    this.name = name;
    console.log(`${this.greetings} ${this.name} `);
  }
}
const me = new Person('Jonas');
