(function () {
  // ---------- PRODUCT DATA ----------
  const products = [
    {
      id: 'p1',
      name: 'AeroPress',
      image: 'https://images.unsplash.com/photo-1610889556528-9a770e32642f?w=600&h=600&fit=crop',
      price: 39.99,
      description: 'Smooth coffee anywhere',
    },
    {
      id: 'p2',
      name: 'Notebook',
      image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&h=600&fit=crop',
      price: 12.5,
      description: 'Dotted, hardcover',
    },
    {
      id: 'p3',
      name: 'Wireless Buds',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&h=600&fit=crop',
      price: 89.9,
      description: 'Noise cancelling',
    },
    {
      id: 'p4',
      name: 'Scented Candle',
      image: 'https://images.unsplash.com/photo-1602874801006-e26a4d0d59b0?w=600&h=600&fit=crop',
      price: 18.75,
      description: 'Vanilla & oak',
    },
    {
      id: 'p5',
      name: 'Water Bottle',
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=600&fit=crop',
      price: 24.0,
      description: 'Insulated 750ml',
    },
    {
      id: 'p6',
      name: 'Backpack',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
      price: 64.99,
      description: 'Urban daypack',
    },
  ];

  // ---------- CART STATE ----------
  let cart = [];

  // ---------- DOM refs ----------
  const productGrid = document.getElementById('productGrid');
  const cartCountDisplay = document.getElementById('cartCountDisplay');
  const cartTotalDisplay = document.getElementById('cartTotalDisplay');
  const openCheckoutBtn = document.getElementById('openCheckoutBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cartItemsList = document.getElementById('cartItemsList');
  const modalTotalAmount = document.getElementById('modalTotalAmount');
  const continueShoppingBtn = document.getElementById('continueShoppingBtn');
  const placeOrderBtn = document.getElementById('placeOrderBtn');
  const toast = document.getElementById('toast');

  // ---------- RENDER PRODUCTS ----------
  function renderProducts() {
    productGrid.innerHTML = products
      .map(
        (product) => `
        <div class="product-card" data-product-id="${product.id}">
          <div class="product-image-wrapper">
            <img
              class="product-image"
              src="${product.image}"
              alt="${product.name}"
              loading="lazy"
              onerror="this.src='https://placehold.co/600x600/1a1f3a/b794f6?text=${encodeURIComponent(product.name)}'"
            />
          </div>
          <div class="product-name">${product.name}</div>
          <div class="product-desc">${product.description}</div>
          <div class="product-price">${product.price.toFixed(2)}</div>
          <button class="btn-add" data-add-id="${product.id}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            Add to cart
          </button>
        </div>
      `
      )
      .join('');
  }

  // ---------- HELPERS ----------
  function getProductById(id) {
    return products.find((p) => p.id === id);
  }

  function getTotalItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getTotalPrice() {
    return cart.reduce((sum, item) => {
      const product = getProductById(item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);
  }

  function updateCartSummary() {
    const totalCount = getTotalItemCount();
    const totalPrice = getTotalPrice();
    cartCountDisplay.textContent = totalCount;
    cartTotalDisplay.textContent = `$${totalPrice.toFixed(2)}`;
    openCheckoutBtn.disabled = totalCount === 0;
  }

  function addToCart(productId) {
    const existingItem = cart.find((item) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }
    updateCartSummary();
    showToast('✦ added to cart');
  }

  // ---------- MODAL RENDER ----------
  function renderCartModal() {
    const totalPrice = getTotalPrice();
    modalTotalAmount.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
      cartItemsList.innerHTML = `<li class="empty-cart-message">Your cart is empty</li>`;
      placeOrderBtn.disabled = true;
      return;
    }

    cartItemsList.innerHTML = cart
      .map((item) => {
        const product = get
