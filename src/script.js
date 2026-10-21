console.log("Hello World!");

// I'm just gonna manually do it since sandbox is being stinky
/*
fetch("../json.ProductData.json")
  .then((response) => response.json())
  .then((data) => data.forEach((value) => console.print(value)))
  .catch((error) => console.error(error));
*/

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

const itemsContainer = document.getElementById("grid-container");

class Item {
  constructor(id, name, description, simplified, category, price, image, img_alt) {
    this.id = id;
    this.description = description;
    this.name = name;
    this.simplified = simplified;
    this.category = category;
    this.price = price;
    this.image = image;
    this.img_alt = img_alt;
  }
}

class Cart {
  constructor() {
    this.items = [];
    this.totalCost = 0;
    this.taxPercent = 8.5;
  }

  addItem(id) {
    const product = productData[id];
    let found = this.items[id];

    if (!found) {
      this.items[id] = {
        name: product.name,
        price: product.price,
        amount: 0,
      };

      found = this.items[id];
    }

    found.amount += 1;
  }
}

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
  let item = new Item(
    i,
    product.name,
    product.description,
    product.simplified,
    product.category,
    product.price,
    product.image,
    product.img_alt
  );

  const categoryElement = elementCategories[product.category];

  if (categoryElement) {
    categoryElement.innerHTML += `
        <div class="item">
          <p class="item-title">${product.name} - $${product.price}</p>
          <img class="product-img" alt="${product.img_alt}"
            src="${product.image}"
          />
          <button class="add-button" id="item-${i}">Add to Cart</button>
        </div>
  `;
  }
}

console.log(elementCategories);

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
}

const tabButtons = document.querySelectorAll(`.tab-button`);

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    showCategory(button.textContent.trim());
  })
});

showCategory("Swords");
