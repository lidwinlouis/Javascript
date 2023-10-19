//Exporting module
console.log('******Exporting Module******');

let wishlist = [];
let quantity = 0;

export const addToWishlist = function (product, qty) {
  wishlist.push(product);
  quantity += qty;
  console.log(`Wishlist :: ${qty} ${product} added to the Wish list.`);
};

export { quantity };
