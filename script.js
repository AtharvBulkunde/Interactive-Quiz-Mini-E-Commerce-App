// ==========================================
// LUMINA MINI E-COMMERCE
// ==========================================


// PRODUCT DATA
const products = [

  {
    id: "p1",
    name: "AeroPress",
    category: "Lifestyle",
    price: 39.99,
    rating: 4.9,
    tag: "BESTSELLER",
    description: "Smooth coffee, anywhere.",
    image:
      "https://images.unsplash.com/photo-1610889556528-9a770e32642f?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: "p2",
    name: "Cloud Lamp",
    category: "Home",
    price: 64,
    rating: 4.8,
    tag: "NEW",
    description: "Soft light for slow evenings.",
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: "p3",
    name: "Studio Headphones",
    category: "Tech",
    price: 129,
    rating: 4.9,
    tag: "FAVORITE",
    description: "Immersive sound, clean design.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: "p4",
    name: "Ceramic Set",
    category: "Home",
    price: 52.5,
    rating: 4.7,
    tag: "HANDMADE",
    description: "Made for everyday rituals.",
    image:
      "https://images.unsplash.com/photo-1572119865084-43c285814d63?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: "p5",
    name: "Everyday Tote",
    category: "Lifestyle",
    price: 42,
    rating: 4.8,
    tag: "ESSENTIAL",
    description: "Carry more. Keep it simple.",
    image:
      "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: "p6",
    name: "Desk Speaker",
    category: "Tech",
    price: 89,
    rating: 4.6,
    tag: "STUDIO",
    description: "Small speaker, rich atmosphere.",
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: "p7",
    name: "Linen Throw",
    category: "Home",
    price: 58,
    rating: 4.9,
    tag: "SOFT",
    description: "Natural texture for quiet spaces.",
    image:
      "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: "p8",
    name: "Pocket Camera",
    category: "Tech",
    price: 179,
    rating: 4.8,
    tag: "LIMITED",
    description: "Keep everyday moments close.",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=700&q=85"
  }

];


// CART
let cart =
  JSON.parse(
    localStorage.getItem("lumina-cart")
  ) || [];

let activeCategory = "All";


// DOM
const $ = selector =>
  document.querySelector(selector);


const productGrid =
  $("#productGrid");

const cartButton =
  $("#cartButton");

const cartDrawer =
  $("#cartDrawer");

const closeCart =
  $("#closeCart");

const overlay =
  $("#overlay");

const cartItems =
  $("#cartItems");

const emptyCart =
  $("#emptyCart");

const cartSummary =
  $("#cartSummary");

const cartCount =
  $("#cartCount");

const subtotalEl =
  $("#subtotal");

const shippingEl =
  $("#shipping");

const totalEl =
  $("#total");

const checkoutButton =
  $("#checkoutButton");

const checkoutModal =
  $("#checkoutModal");

const closeModal =
  $("#closeModal");

const checkoutList =
  $("#checkoutList");

const checkoutTotal =
  $("#checkoutTotal");

const placeOrder =
  $("#placeOrder");

const continueShopping =
  $("#continueShopping");

const toast =
  $("#toast");


// MONEY FORMAT
function money(value) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD"
    }
  ).format(value);

}


// SAVE CART
function saveCart() {

  localStorage.setItem(
    "lumina-cart",
    JSON.stringify(cart)
  );

}


// RENDER PRODUCTS
function renderProducts() {

  const visibleProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          product =>
            product.category === activeCategory
        );


  productGrid.innerHTML =
    visibleProducts
      .map(product => `

        <article class="product-card">

          <div class="product-image">

            <span class="product-tag">
              ${product.tag}
            </span>

            <img
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
            >

            <button
              class="add-button"
              data-add="${product.id}"
              aria-label="Add ${product.name}">

              +

            </button>

          </div>


          <div class="product-info">

            <h3>
              ${product.name}
            </h3>

            <p>
              ${product.description}
            </p>

            <div class="product-meta">

              <strong>
                ${money(product.price)}
              </strong>

              <span class="rating">
                ★ ${product.rating}
              </span>

            </div>

          </div>

        </article>

      `)
      .join("");

}


// GET CART PRODUCTS
function getCartItems() {

  return cart

    .map(item => {

      const product =
        products.find(
          p => p.id === item.id
        );

      return product
        ? {
            ...product,
            quantity: item.quantity
          }
        : null;

    })

    .filter(Boolean);

}


// RENDER CART
function renderCart() {

  const items =
    getCartItems();


  const count =
    items.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );


  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= 100
        ? 0
        : 6.99;


  const total =
    subtotal + shipping;


  cartCount.textContent =
    count;


  cartItems.innerHTML =
    items
      .map(item => `

        <div class="cart-row">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div>

            <h4>
              ${item.name}
            </h4>

            <div class="row-price">
              ${money(item.price)} each
            </div>

            <div class="qty">

              <button
                data-action="decrease"
                data-id="${item.id}">
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                data-action="increase"
                data-id="${item.id}">
                +
              </button>

            </div>

            <button
              class="remove"
              data-action="remove"
              data-id="${item.id}">

              Remove

            </button>

          </div>

          <strong>
            ${money(
              item.price *
              item.quantity
            )}
          </strong>

        </div>

      `)
      .join("");


  subtotalEl.textContent =
    money(subtotal);


  shippingEl.textContent =
    shipping === 0
      ? "Free"
      : money(shipping);


  totalEl.textContent =
    money(total);


  const hasItems =
    items.length > 0;


  emptyCart.classList.toggle(
    "show",
    !hasItems
  );


  cartSummary.classList.toggle(
    "hidden",
    !hasItems
  );

}


// ADD TO CART
function addToCart(id) {

  const existing =
    cart.find(
      item => item.id === id
    );


  if (existing) {

    existing.quantity++;

  } else {

    cart.push({
      id,
      quantity: 1
    });

  }


  saveCart();

  renderCart();


  const product =
    products.find(
      p => p.id === id
    );


  showToast(
    `${product.name} added to your bag`
  );

}


// CHANGE QUANTITY
function changeQuantity(
  id,
  change
) {

  const item =
    cart.find(
      item => item.id === id
    );


  if (!item) return;


  item.quantity += change;


  if (item.quantity <= 0) {

    cart =
      cart.filter(
        cartItem =>
          cartItem.id !== id
      );

  }


  saveCart();

  renderCart();

}


// REMOVE PRODUCT
function removeItem(id) {

  cart =
    cart.filter(
      item =>
        item.id !== id
    );


  saveCart();

  renderCart();

}


// OPEN CART
function openCart() {

  cartDrawer.classList.add(
    "open"
  );

  overlay.classList.add(
    "show"
  );

  document.body.style.overflow =
    "hidden";

}


// CLOSE CART
function closeCartDrawer() {

  cartDrawer.classList.remove(
    "open"
  );

  overlay.classList.remove(
    "show"
  );

  document.body.style.overflow =
    "";

}


// CHECKOUT
function openCheckout() {

  const items =
    getCartItems();


  if (!items.length) return;


  const subtotal =
    items.reduce(
      (sum, item) =>
        sum +
        item.price *
        item.quantity,
      0
    );


  const shipping =
    subtotal >= 100
      ? 0
      : 6.99;


  const total =
    subtotal + shipping;


  checkoutList.innerHTML =
    items
      .map(item => `

        <div class="checkout-line">

          <img
            src="${item.image}"
            alt="${item.name}"
          >

          <div>

            <strong>
              ${item.name}
            </strong>

            <span>
              Qty ${item.quantity}
              ·
              ${money(item.price)} each
            </span>

          </div>

          <b>
            ${money(
              item.price *
              item.quantity
            )}
          </b>

        </div>

      `)
      .join("");


  checkoutTotal.textContent =
    money(total);


  checkoutModal.classList.add(
    "show"
  );


  cartDrawer.classList.remove(
    "open"
  );


  overlay.classList.remove(
    "show"
  );


  document.body.style.overflow =
    "hidden";

}


// CLOSE CHECKOUT
function closeCheckout() {

  checkoutModal.classList.remove(
    "show"
  );

  document.body.style.overflow =
    "";

}


// TOAST
function showToast(message) {

  toast.textContent =
    message;

  toast.classList.add(
    "show"
  );


  clearTimeout(
    showToast.timer
  );


  showToast.timer =
    setTimeout(
      () =>
        toast.classList.remove(
          "show"
        ),
      2200
    );

}


// PRODUCT ADD EVENT
productGrid.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-add]"
      );


    if (!button) return;


    addToCart(
      button.dataset.add
    );

  }
);


// CART EVENTS
cartItems.addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        "[data-action]"
      );


    if (!button) return;


    const {
      action,
      id
    } = button.dataset;


    if (
      action === "increase"
    ) {

      changeQuantity(
        id,
        1
      );

    }


    if (
      action === "decrease"
    ) {

      changeQuantity(
        id,
        -1
      );

    }


    if (
      action === "remove"
    ) {

      removeItem(id);

    }

  }
);


// CATEGORY FILTER
$("#filters").addEventListener(
  "click",
  event => {

    const button =
      event.target.closest(
        ".filter"
      );


    if (!button) return;


    activeCategory =
      button.dataset.category;


    document
      .querySelectorAll(
        ".filter"
      )
      .forEach(item =>
        item.classList.remove(
          "active"
        )
      );


    button.classList.add(
      "active"
    );


    renderProducts();

  }
);


// CART BUTTON
cartButton.addEventListener(
  "click",
  openCart
);


// CLOSE CART
closeCart.addEventListener(
  "click",
  closeCartDrawer
);


// OVERLAY
overlay.addEventListener(
  "click",
  closeCartDrawer
);


// CONTINUE SHOPPING
continueShopping.addEventListener(
  "click",
  closeCartDrawer
);


// CHECKOUT
checkoutButton.addEventListener(
  "click",
  openCheckout
);


// CLOSE MODAL
closeModal.addEventListener(
  "click",
  closeCheckout
);


// MODAL BACKGROUND
checkoutModal.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      checkoutModal
    ) {

      closeCheckout();

    }

  }
);


// PLACE DEMO ORDER
placeOrder.addEventListener(
  "click",
  () => {

    cart = [];

    saveCart();

    renderCart();

    closeCheckout();

    showToast(
      "Demo order placed — thank you!"
    );

  }
);


// ESCAPE KEY
document.addEventListener(
  "keydown",
  event => {

    if (
      event.key ===
      "Escape"
    ) {

      closeCartDrawer();

      closeCheckout();

    }

  }
);


// INITIAL LOAD
renderProducts();

renderCart();
