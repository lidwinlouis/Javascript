//Exporting module
console.log('******Exporting Module******');

let order = [];
let quantity = 0;
let orderTotal = 0.0;
const shippingCharge = 10;

export const addToCart = function (product, qty, basePrice) {
  order.push(product);
  quantity += qty;
  orderTotal = orderTotal + basePrice * qty;
  console.log(
    `Shopping Cart :: ${qty} ${product} added to the cart. Order total : ${orderTotal}`
  );
};
//Exporting using aliases and normal named export
export { shippingCharge, orderTotal as totalPrice };
