// /ShipNGo-frontend/scripts/store.js

let cart = {};

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".cart");
  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const parentDiv = this.closest(".store_item");
      const itemName = parentDiv.dataset.name;
      const itemPrice = parseFloat(parentDiv.dataset.price);
      const quantityChange = parseInt(this.dataset.amount, 10);
      updateCart(itemName, itemPrice, quantityChange);
    });
  });
});

function updateCart(item, price, quantity) {
  if (!cart[item]) {
    cart[item] = { quantity: 0, price: price };
  }
  cart[item].quantity += quantity;
  if (cart[item].quantity < 0) {
    cart[item].quantity = 0;
  }
  updateCheckout();
}

function updateCheckout() {
  let totalItems = 0;
  let totalCost = 0;
  for (const item in cart) {
    totalItems += cart[item].quantity;
    totalCost += cart[item].quantity * cart[item].price;
  }
  document.getElementById("total-items").textContent = totalItems;
  document.getElementById("total-cost").textContent = totalCost.toFixed(2);
}