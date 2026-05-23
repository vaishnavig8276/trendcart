let allProducts = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];


// Fetch Products
async function fetchProducts() {

  const response = await fetch("/api/products");

  const products = await response.json();

  allProducts = products;

  displayProducts(products);
}

fetchProducts();


// Display Products
function displayProducts(products) {

  const container =
    document.getElementById("products-container");

  container.innerHTML = "";

  products.forEach(product => {

    container.innerHTML += `

      <div class="card"
           onclick="openModal(${product.id})">

        <img src="${product.image}"
             alt="${product.name}" />

        <div class="card-content">

          <h2>${product.name}</h2>

          <p>₹${product.price}</p>

          <p>${product.category}</p>

          <button
            onclick="event.stopPropagation();
                     addToCart(${product.id})">

            Add To Cart

          </button>

        </div>

      </div>

    `;
  });
}


// Filter Products
function filterProducts(category) {

  if(category === "All"){
    displayProducts(allProducts);
    return;
  }

  const filtered = allProducts.filter(product =>
    product.category === category
  );

  displayProducts(filtered);
}


// Add To Cart
function addToCart(id){

  console.log("Clicked ID:", id);
  console.log("Products:", allProducts);

  const product = allProducts.find(p => p.id === id);

  if(!product){
    alert("Product not found!");
    return;
  }

  const existing = cart.find(item => item.id === id);

  if(existing){
    existing.quantity += 1;
  } else {
    cart.push({...product, quantity:1});
  }

  saveCart();
  updateCartUI();
}

// Update Cart UI
function updateCartUI(){

  const cartItems = document.getElementById("cart-items");

  cartItems.innerHTML = "";

  cart.forEach(item => {

    cartItems.innerHTML += `
      <div class="cart-item">

        <div>
          <h4>${item.name}</h4>

          <p>₹${item.price}</p>

          <p>Qty: ${item.quantity}</p>
        </div>

        <div>

          <button onclick="increaseQty(${item.id})">+</button>

          <button onclick="decreaseQty(${item.id})">-</button>

        </div>

      </div>
    `;
  });
}



// Remove Item
function removeFromCart(index){

  cart.splice(index,1);

  saveCart();

  updateCartUI();
}


// Save Cart
function saveCart(){

  localStorage.setItem("cart", JSON.stringify(cart));
}


// Initial Load
updateCartUI();

function searchProducts(){

  const input =
    document.getElementById("searchInput").value.toLowerCase();

  const filteredProducts = allProducts.filter(product =>

    product.name.toLowerCase().includes(input)

  );

  displayProducts(filteredProducts);
}

function increaseQty(id){

  const item = cart.find(product => product.id === id);

  item.quantity += 1;

  saveCart();

  updateCartUI();
}


function decreaseQty(id){

  const item = cart.find(product => product.id === id);

  item.quantity -= 1;

  if(item.quantity <= 0){

    cart = cart.filter(product => product.id !== id);
  }

  saveCart();

  updateCartUI();
}

function openModal(id){

  const product = allProducts.find(item => item.id === id);

  document.getElementById("productModal").style.display = "flex";

  document.getElementById("modalImage").src = product.image;

  document.getElementById("modalTitle").innerText = product.name;

  document.getElementById("modalPrice").innerText =
    "Price: ₹" + product.price;

  document.getElementById("modalCategory").innerText =
    "Category: " + product.category;

  document.getElementById("modalCartBtn").onclick = () => {
    addToCart(product.id);
  };
}


function closeModal(){

  document.getElementById("productModal").style.display = "none";
}
function checkout(){

  if(cart.length === 0){

    alert("Cart is empty!");

    return;
  }

  alert("🎉 Order Placed Successfully!");

  cart = [];

  saveCart();

  updateCartUI();
}