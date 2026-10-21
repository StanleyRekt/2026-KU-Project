console.log("Hello World!");
/*
  While I could theoretically just add this to my script.js, however I want to keep my data separate from my code.

  The JSON file contains the data for the products that will display in the "Selections" page.
  These products will have their own attributes that are required to display them properly.
  
*/

const productData = await fetch("../json/ProductData.json")
  .then((response) => response.json())
  .catch((error) => console.error(error));

const productCategories = ["Swords", "Armor", "Protection", "Cooking"];
let productsByCategory = {};
let elementCategories = {};
let elementProducts = {};

const itemsContainer = document.getElementById("grid-container");
const cartContainer = document.getElementById("cart-container");

const netCostResult = document.getElementById("net-cost");
const taxRateResult = document.getElementById("tax-rate");
const finalCostResult = document.getElementById("final-cost");

const cartPurchaseButton = document.getElementById("cart-purchase-button");
const cartClearButton = document.getElementById("cart-clear-button");

let cartElements = {};

class Cart {
  constructor() {
    this.items = [];
    this.totalCost = 0;
    this.taxPercent = 8.5;
    this.elements = {};
  }

  addItem(id, amount) {
    const product = productData[id];

    if (!this.items[id]) {
      this.items[id] = {
        name: product.name,
        price: product.price,
        amount: 0,
      };
    }

    this.items[id].amount += amount;

    let itemInfo = this.items[id] 
    let cartElement = this.elements[id];

    if (!cartElement){
      cartElement = document.createElement("div");
      cartElement.className = "cart-element";

      cartContainer.appendChild(cartElement);

      this.elements[id] = cartElement;
    }

    let totalPrice = (itemInfo.amount * product.price).toFixed(2);

    cartElement.innerHTML = `
      <p><span>Product Name:</span> ${product.name}</p>
      <p><span>Amount:</span> ${itemInfo.amount}</p>
      <p><span>Price:</span> $${product.price}</p>
      <div class="divider"></div>
      <p><span>Total Price:</span> $${totalPrice}</p>
    `

    console.log("test");
  }

  calculateResult() {
    let netCost = 0;

    this.items.forEach((itemInfo) => {
      netCost += itemInfo.price * itemInfo.amount;
    })

    let taxCost = netCost * this.taxPercent / 100;
    let finalCost = netCost + taxCost;

    netCostResult.textContent = `$${netCost}`;
    taxRateResult.textContent = `$${taxCost}`;
    finalCostResult.textContent = `$${finalCost}`;

    this.totalCost = finalCost;
  }

  clearCart() {
    for (const element of this.elements) {
      element.remove();
    }

    this.items = [];
    this.totalCost = 0;
    this.elements = {};

    cartElements.innerHTML = "";
  }
}

const cart = new Cart();

cartPurchaseButton.addEventListener("click", () => {
  cart.calculateResult();
})

cartClearButton.addEventListener("click", () => {
  cart.clearCart();
})

for (const category of productCategories) {
  productCategories[category] = [];
  const categoryElement = document.createElement("section");

  categoryElement.className = "grid hidden";
  categoryElement.id = `grid-${category}`;

  itemsContainer.appendChild(categoryElement);
  elementCategories[category] = categoryElement;
}

for (let i = 0; i < productData.length; i++) {
  const product = productData[i];
  const categoryElement = elementCategories[product.category];

  if (categoryElement) {
    let itemElement = document.createElement("div");
    itemElement.className = "item";

    itemElement.innerHTML += `
      <p class="item-title" id="item-${i}">${product.name} - $${product.price}</p>
      <img class="product-img" id="item-image-${i}" alt="${product.img_alt}"
        src="${product.image}"
      />
      <div class="item-bar">
        <button class="item-button add-button" id="add-to-cart-button">Add to Cart</button>
        <input class="item-quantity" type="number" id="quantity-${i}" value="1" min="1" max="99" step="1">
      </div>
  `;

    categoryElement.appendChild(itemElement);
    const quantityElement = itemElement.querySelector(`#quantity-${i}`);

    itemElement.querySelector(`img.product-img`).addEventListener("click", (itemElement) => {
      setOverlayContent(i);
      setOverlay(true);
    })

    itemElement.querySelector(`#add-to-cart-button`).addEventListener("click", () => {
      cart.addItem(i, Number(quantityElement.value));
    })
  }
}

console.log(elementCategories);

const navbarElements = document.querySelectorAll(".page-nav");
let currentPageElement = null;

function showPage(page) {
  const pageElement = document.getElementById(`page-${page}`);

  if (currentPageElement) {
    if (currentPageElement.id === pageElement.id) {
      return;
    }

    currentPageElement.classList.add("hidden");

  }

  pageElement.classList.remove("hidden");
  currentPageElement = pageElement;
}

navbarElements.forEach((a) => {
  a.addEventListener("click", () => {
    showPage(Number(a.id.replace("nav", "")));
  })
});

showPage(2);


const tabsLabelElement = document.getElementById("tabs-label");
let currentCategoryElement = null;

function showCategory(category) {
  const categoryElement = elementCategories[category];

  if (currentCategoryElement) {
    if (currentCategoryElement.id === categoryElement.id) {
      return;
    }

    currentCategoryElement.classList.add("hidden");

  }

  categoryElement.classList.remove("hidden");
  currentCategoryElement = categoryElement;

  tabsLabelElement.textContent = `Selection: ${category}`;
}

const tabButtons = document.querySelectorAll(`.tab-button`);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showCategory(button.textContent.trim());
  })
});

showCategory("Swords");

const overlayElement = document.getElementById("overlay-container");
let currentOverlayId = 0;

function setOverlay(enable) {
  if (enable) {
    overlayElement.classList.remove("hidden");
  } else {
    overlayElement.classList.add("hidden");
  }
}

function setOverlayContent(itemId) {
  if (currentOverlayId === itemId) {
    return;
  }

  console.log("test");

  currentOverlayId = itemId;
  const product = productData[itemId];

  overlayElement.innerHTML = `
    <div id="overlay-content">
      <h3 id="overlay-label">Product Details</h3>
      <p>This is the placeholder for overlay</p>

      <section class="overlay-details">

        <img class="product-img" id="overlay-img" alt="${product.img_alt}"
          src="${product.image}" />

        <div class="overlay-details-text">
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <h3>Cost: $${product.price}</h3>

          <div id="overlay-buttons">
            <button class="tab-button" id="overlay-close-button">Close</button>
            <button class="tab-button add-button" id="add-to-cart-button">Add to Cart</button>
            <input class="item-quantity" type="number" id="quantity" value="1" min="1" max="99" step="1">
          </div>
        </div>
      </section>
    </div>
  `
}

overlayElement.addEventListener("click", (element) => {
  if (element.target.id === "overlay-container" || element.target.id === "overlay-close-button") {
    setOverlay(false);
  }
  if (element.target.id == "add-to-cart-button") {
    const overlayQuantityElement = document.getElementById("quantity");

    cart.addItem(currentOverlayId, Number(overlayQuantityElement.value));
  }
})
