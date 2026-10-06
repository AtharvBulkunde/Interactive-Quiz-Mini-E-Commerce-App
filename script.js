(() => {

  /* ==========================================
     PRODUCT DATA
  ========================================== */

  const products = [

    {
      id: "p1",
      name: "AeroPress",
      image:
        "https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&h=600&fit=crop",
      price: 39.99,
      description: "Smooth coffee anywhere"
    },

    {
      id: "p2",
      name: "Notebook",
      image:
        "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=600&fit=crop",
      price: 12.5,
      description: "Dotted, hardcover"
    },

    {
      id: "p3",
      name: "Wireless Buds",
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop",
      price: 89.9,
      description: "Noise cancelling"
    },

    {
      id: "p4",
      name: "Scented Candle",
      image:
        "https://images.unsplash.com/photo-1602874801006-e26a4d0d59b0?w=600&h=600&fit=crop",
      price: 18.75,
      description: "Vanilla & oak"
    },

    {
      id: "p5",
      name: "Water Bottle",
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop",
      price: 24,
      description: "Insulated 750ml"
    },

    {
      id: "p6",
      name: "Backpack",
      image:
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop",
      price: 64.99,
      description: "Urban daypack"
    }

  ];


  /* ==========================================
     CART STATE
  ========================================== */

  let cart =
    JSON.parse(
      localStorage.getItem("luxeCart") || "[]"
    );


  /* ==========================================
     DOM REFERENCES
  ========================================== */

  const productGrid =
    document.getElementById("productGrid");

  const cartCountDisplay =
    document.getElementById(
      "cartCountDisplay"
    );

  const cartTotalDisplay =
    document.getElementById(
      "cartTotalDisplay"
    );

  const openCheckoutBtn =
    document.getElementById(
      "openCheckoutBtn"
    );

  const modalOverlay =
    document.getElementById(
      "modalOverlay"
    );

  const closeModalBtn =
    document.getElementById(
      "closeModalBtn"
    );

  const cartItemsList =
    document.getElementById(
      "cartItemsList"
    );

  const modalTotalAmount =
    document.getElementById(
      "modalTotalAmount"
    );

  const continueShoppingBtn =
    document.getElementById(
      "continueShoppingBtn"
    );

  const placeOrderBtn =
    document.getElementById(
      "placeOrderBtn"
    );

  const toast =
    document.getElementById("toast");


  /* ==========================================
     GET PRODUCT
  ========================================== */

  function getProductById(id) {

    return products.find(
      product => product.id === id
    );

  }


  /* ==========================================
     SAVE CART
  ========================================== */

  function saveCart() {

    localStorage.setItem(
      "luxeCart",
      JSON.stringify(cart)
    );

  }


  /* ==========================================
     TOTAL ITEM COUNT
  ========================================== */

  function getTotalItemCount() {

    return cart.reduce(
      (sum, item) =>
        sum + item.quantity,
      0
    );

  }


  /* ==========================================
     TOTAL PRICE
  ========================================== */

  function getTotalPrice() {

    return cart.reduce(
      (sum, item) => {

        const product =
          getProductById(
            item.productId
          );

        return (
          sum +
          (
            product
              ? product.price *
                item.quantity
              : 0
          )
        );

      },
      0
    );

  }


  /* ==========================================
     RENDER PRODUCTS
  ========================================== */

  function renderProducts() {

    productGrid.innerHTML =
      products
        .map(product => `

          <article
            class="product-card"
            data-product-id="${product.id}"
          >

            <div class="product-image-wrapper">

              <img
                class="product-image"
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.src='https://placehold.co/600x600/1a1f3a/b794f6?text=${encodeURIComponent(product.name)}'"
              />

            </div>


            <div class="product-name">
              ${product.name}
            </div>


            <div class="product-desc">
              ${product.description}
            </div>


            <div class="product-price">
              ${product.price.toFixed(2)}
            </div>


            <button
              class="btn-add"
              data-add-id="${product.id}"
            >

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >

                <circle
                  cx="9"
                  cy="21"
                  r="1"
                ></circle>

                <circle
                  cx="20"
                  cy="21"
                  r="1"
                ></circle>

                <path
                  d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"
                ></path>

              </svg>

              Add to cart

            </button>

          </article>

        `)
        .join("");

  }


  /* ==========================================
     UPDATE CART SUMMARY
  ========================================== */

  function updateCartSummary() {

    const totalCount =
      getTotalItemCount();

    const totalPrice =
      getTotalPrice();


    cartCountDisplay.textContent =
      totalCount;


    cartTotalDisplay.textContent =
      `$${totalPrice.toFixed(2)}`;


    openCheckoutBtn.disabled =
      totalCount === 0;

  }


  /* ==========================================
     ADD TO CART
  ========================================== */

  function addToCart(productId) {

    const product =
      getProductById(productId);

    if (!product) return;


    const existingItem =
      cart.find(
        item =>
          item.productId ===
          productId
      );


    if (existingItem) {

      existingItem.quantity += 1;

    } else {

      cart.push({
        productId: productId,
        quantity: 1
      });

    }


    saveCart();

    updateCartSummary();

    showToast(
      `${product.name} added to cart`
    );

  }


  /* ==========================================
     CHANGE QUANTITY
  ========================================== */

  function changeQuantity(
    productId,
    amount
  ) {

    const item =
      cart.find(
        item =>
          item.productId ===
          productId
      );


    if (!item) return;


    item.quantity += amount;


    if (item.quantity <= 0) {

      cart =
        cart.filter(
          cartItem =>
            cartItem.productId !==
            productId
        );

    }


    saveCart();

    updateCartSummary();

    renderCartModal();

  }


  /* ==========================================
     REMOVE FROM CART
  ========================================== */

  function removeFromCart(productId) {

    const product =
      getProductById(productId);


    cart =
      cart.filter(
        item =>
          item.productId !==
          productId
      );


    saveCart();

    updateCartSummary();

    renderCartModal();


    if (product) {

      showToast(
        `${product.name} removed`
      );

    }

  }


  /* ==========================================
     RENDER CART MODAL
  ========================================== */

  function renderCartModal() {

    const totalPrice =
      getTotalPrice();


    modalTotalAmount.textContent =
      `$${totalPrice.toFixed(2)}`;


    if (cart.length === 0) {

      cartItemsList.innerHTML = `
        <li class="empty-cart-message">
          Your cart is empty
        </li>
      `;

      placeOrderBtn.disabled =
        true;

      return;

    }


    placeOrderBtn.disabled =
      false;


    cartItemsList.innerHTML =
      cart
        .map(item => {

          const product =
            getProductById(
              item.productId
            );


          if (!product) return "";


          const subtotal =
            product.price *
            item.quantity;


          return `

            <li class="cart-item">

              <div class="cart-item-info">

                <img
                  class="cart-item-image"
                  src="${product.image}"
                  alt="${product.name}"
                  onerror="this.src='https://placehold.co/100x100/1a1f3a/b794f6?text=Item'"
                />


                <div class="cart-item-details">

                  <span class="cart-item-name">
                    ${product.name}
                  </span>

                  <span class="cart-item-price">
                    $${product.price.toFixed(2)} each
                  </span>

                </div>

              </div>


              <div class="cart-item-controls">

                <button
                  class="qty-btn"
                  data-minus-id="${product.id}"
                  aria-label="Decrease quantity"
                >
                  −
                </button>


                <span class="cart-item-qty">
                  ${item.quantity}
                </span>


                <button
                  class="qty-btn"
                  data-plus-id="${product.id}"
                  aria-label="Increase quantity"
                >
                  +
                </button>


                <button
                  class="remove-btn"
                  data-remove-id="${product.id}"
                >
                  Remove
                </button>

              </div>


              <div class="cart-item-subtotal">

                $${subtotal.toFixed(2)}

              </div>

            </li>

          `;

        })
        .join("");

  }


  /* ==========================================
     OPEN MODAL
  ========================================== */

  function openModal() {

    renderCartModal();

    modalOverlay.classList.add(
      "active"
    );

    document.body.classList.add(
      "modal-open"
    );

  }


  /* ==========================================
     CLOSE MODAL
  ========================================== */

  function closeModal() {

    modalOverlay.classList.remove(
      "active"
    );

    document.body.classList.remove(
      "modal-open"
    );

  }


  /* ==========================================
     TOAST
  ========================================== */

  let toastTimer;


  function showToast(message) {

    toast.textContent =
      message;


    toast.classList.add(
      "show"
    );


    clearTimeout(
      toastTimer
    );


    toastTimer =
      setTimeout(() => {

        toast.classList.remove(
          "show"
        );

      }, 1800);

  }


  /* ==========================================
     PRODUCT BUTTON EVENT
  ========================================== */

  productGrid.addEventListener(
    "click",
    event => {

      const button =
        event.target.closest(
          "[data-add-id]"
        );


      if (!button) return;


      addToCart(
        button.dataset.addId
      );

    }
  );


  /* ==========================================
     CART BUTTON EVENTS
  ========================================== */

  cartItemsList.addEventListener(
    "click",
    event => {

      const minus =
        event.target.closest(
          "[data-minus-id]"
        );


      const plus =
        event.target.closest(
          "[data-plus-id]"
        );


      const remove =
        event.target.closest(
          "[data-remove-id]"
        );


      if (minus) {

        changeQuantity(
          minus.dataset.minusId,
          -1
        );

      }


      if (plus) {

        changeQuantity(
          plus.dataset.plusId,
          1
        );

      }


      if (remove) {

        removeFromCart(
          remove.dataset.removeId
        );

      }

    }
  );


  /* ==========================================
     CHECKOUT
  ========================================== */

  openCheckoutBtn.addEventListener(
    "click",
    openModal
  );


  closeModalBtn.addEventListener(
    "click",
    closeModal
  );


  continueShoppingBtn.addEventListener(
    "click",
    closeModal
  );


  /* ==========================================
     CLICK OUTSIDE MODAL
  ========================================== */

  modalOverlay.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        modalOverlay
      ) {

        closeModal();

      }

    }
  );


  /* ==========================================
     ESC KEY
  ========================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Escape" &&
        modalOverlay.classList.contains(
          "active"
        )
      ) {

        closeModal();

      }

    }
  );


  /* ==========================================
     PLACE ORDER
  ========================================== */

  placeOrderBtn.addEventListener(
    "click",
    () => {

      if (cart.length === 0)
        return;


      const orderTotal =
        getTotalPrice();


      cart = [];


      saveCart();

      updateCartSummary();

      renderCartModal();

      closeModal();


      showToast(
        `Order placed · $${orderTotal.toFixed(2)}`
      );

    }
  );


  /* ==========================================
     INITIALIZE APPLICATION
  ========================================== */

  renderProducts();

  updateCartSummary();

})();
