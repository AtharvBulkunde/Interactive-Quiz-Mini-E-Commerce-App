// ==========================================
// LUMINA MINI E-COMMERCE + INTERACTIVE QUIZ
const API_BASE_URL = (window.LUMINA_API_BASE_URL || "").replace(/\/$/, "");
// ==========================================


// PRODUCT DATA
let products = [

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

const fallbackProducts = products.map(product => ({ ...product }));

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

const customerNameInput = $("#customerName");
const customerEmailInput = $("#customerEmail");
const quizTitle = $("#quizTitle");
const quizStatus = $("#quizStatus");
const quizProgressBar = $("#quizProgressBar");
const quizQuestionsElement = $("#quizQuestions");
const quizSubmitButton = $("#quizSubmit");
const quizRestartButton = $("#quizRestart");
const quizResult = $("#quizResult");
const quizScore = $("#quizScore");
const quizResultText = $("#quizResultText");


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


// LOAD PRODUCTS FROM API; KEEP THE LOCAL CATALOG AVAILABLE OFFLINE
async function loadProducts() {
  try {
    const response = await fetch(API_BASE_URL + "/api/products", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Product API returned " + response.status);
    const data = await response.json();
    if (Array.isArray(data.products) && data.products.length) {
      products = data.products;
      renderProducts();
      renderCart();
    }
  } catch (error) {
    console.info("Using local product data; connect the API for database-backed products.", error.message);
  }
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
    if (existing.quantity >= 20) {
      showToast("Maximum quantity is 20 per product");
      return;
    }
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


// SAVE ORDER THROUGH THE BACKEND; THIS DOES NOT PROCESS PAYMENT
placeOrder.addEventListener(
  "click",
  async () => {
    if (!cart.length) return;
    if (!customerNameInput.checkValidity()) {
      customerNameInput.reportValidity();
      return;
    }
    if (!customerEmailInput.checkValidity()) {
      customerEmailInput.reportValidity();
      return;
    }

    placeOrder.disabled = true;
    placeOrder.textContent = "Saving order…";
    try {
      const response = await fetch(API_BASE_URL + "/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
          customer: {
            name: customerNameInput.value.trim(),
            email: customerEmailInput.value.trim()
          }
        })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Order API is unavailable");

      cart = [];
      saveCart();
      renderCart();
      closeCheckout();
      showToast("Demo order saved. No payment was processed.");
    } catch (error) {
      console.error("Order was not saved:", error.message);
      showToast("Order not saved — connect the backend and database.");
    } finally {
      placeOrder.disabled = false;
      placeOrder.innerHTML = 'Save demo order <span>↗</span>';
    }
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



/* ==================================================
   INTERACTIVE QUIZ — local fallback + optional API
================================================== */
const fallbackQuiz = {
  title: "Everyday Tech & Shopping",
  questions: [
    { id: "local-q1", prompt: "Which detail should a checkout page always show before an order is placed?", options: ["Only the product image", "The order total", "A hidden fee", "A random product"], correctIndex: 1, points: 1 },
    { id: "local-q2", prompt: "Where should an e-commerce app verify the final product price?", options: ["Only in the browser", "In a URL fragment", "On the server using trusted data", "In a button label"], correctIndex: 2, points: 1 },
    { id: "local-q3", prompt: "What is a good way to protect database credentials?", options: ["Put them in HTML", "Commit them to GitHub", "Use server environment variables", "Share them in the page title"], correctIndex: 2, points: 1 },
    { id: "local-q4", prompt: "What should a demo checkout clearly communicate?", options: ["Payment succeeded", "It is a demo and no payment was processed", "The order is shipped", "No price is needed"], correctIndex: 1, points: 1 }
  ]
};
let quizData = fallbackQuiz.questions;
let activeQuizId = null;
let quizUsesApi = false;
let quizSelections = {};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

async function loadQuiz() {
  try {
    const response = await fetch(API_BASE_URL + "/api/quizzes", {
      headers: { Accept: "application/json" }
    });
    if (!response.ok) throw new Error("Quiz API returned " + response.status);
    const data = await response.json();
    if (Array.isArray(data.quizzes) && data.quizzes.length) {
      activeQuizId = data.quizzes[0].id;
      const quizResponse = await fetch(API_BASE_URL + "/api/quizzes/" + encodeURIComponent(activeQuizId), {
        headers: { Accept: "application/json" }
      });
      if (!quizResponse.ok) throw new Error("Could not load quiz questions");
      const quiz = await quizResponse.json();
      if (Array.isArray(quiz.questions) && quiz.questions.length) {
        quizData = quiz.questions.map(question => ({
          ...question,
          options: Array.isArray(question.options) ? question.options : []
        }));
        quizTitle.textContent = quiz.quiz.title || "LUMINA QUICK QUIZ";
        quizUsesApi = true;
      }
    }
  } catch (error) {
    console.info("Using local quiz data; seed the database and connect the API for stored attempts.", error.message);
    quizData = fallbackQuiz.questions;
    activeQuizId = null;
    quizUsesApi = false;
    quizTitle.textContent = fallbackQuiz.title;
  }
  renderQuiz();
}

function renderQuiz() {
  quizSelections = {};
  quizResult.hidden = true;
  quizSubmitButton.disabled = true;
  quizSubmitButton.textContent = "Submit answers →";
  quizStatus.textContent = "0 of " + quizData.length + " answered";
  quizProgressBar.style.width = "0%";

  quizQuestionsElement.innerHTML = quizData.map((question, index) => {
    const options = question.options.map((option, answerIndex) =>
      '<button type="button" class="quiz-option" data-question="' +
      escapeHTML(question.id) + '" data-answer="' + answerIndex + '">' +
      escapeHTML(option) + '</button>'
    ).join("");
    return '<article class="quiz-question"><h4><span>Q' + (index + 1) +
      '</span>' + escapeHTML(question.prompt) + '</h4><div class="quiz-options">' +
      options + '</div></article>';
  }).join("");
}

quizQuestionsElement.addEventListener("click", event => {
  const button = event.target.closest(".quiz-option");
  if (!button) return;

  const questionId = button.dataset.question;
  quizSelections[questionId] = Number(button.dataset.answer);
  button.closest(".quiz-question").querySelectorAll(".quiz-option").forEach(option => {
    option.classList.toggle("selected", option === button);
    option.setAttribute("aria-pressed", option === button ? "true" : "false");
  });

  const answered = Object.keys(quizSelections).length;
  quizStatus.textContent = answered + " of " + quizData.length + " answered";
  quizProgressBar.style.width = Math.round(answered / quizData.length * 100) + "%";
  quizSubmitButton.disabled = answered !== quizData.length;
});

quizSubmitButton.addEventListener("click", async () => {
  if (Object.keys(quizSelections).length !== quizData.length) return;
  quizSubmitButton.disabled = true;
  quizSubmitButton.textContent = "Checking…";

  try {
    let score = 0;
    let maxScore = 0;
    let percentage = 0;

    if (quizUsesApi && activeQuizId) {
      const response = await fetch(
        API_BASE_URL + "/api/quizzes/" + encodeURIComponent(activeQuizId) + "/attempts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            answers: quizData.map(question => ({
              questionId: question.id,
              answerIndex: quizSelections[question.id]
            }))
          })
        }
      );
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not submit quiz");
      score = Number(result.attempt.score);
      maxScore = Number(result.attempt.max_score);
      percentage = Number(result.percentage);
    } else {
      maxScore = quizData.reduce((sum, question) => sum + Number(question.points || 1), 0);
      score = quizData.reduce((sum, question) => {
        const correctIndex = question.correctIndex;
        return sum + (quizSelections[question.id] === correctIndex ? Number(question.points || 1) : 0);
      }, 0);
      percentage = maxScore ? Math.round(score / maxScore * 100) : 0;
    }

    quizScore.textContent = percentage + "% — " + score + " / " + maxScore + " points";
    quizResultText.textContent = percentage === 100
      ? "Perfect score! Excellent work."
      : percentage >= 60
        ? "Nice work. Keep learning and try again to improve your score."
        : "Keep exploring. Review the questions and give it another try.";
    quizResult.hidden = false;
    quizSubmitButton.textContent = "Submitted ✓";
    quizStatus.textContent = "Attempt complete";
  } catch (error) {
    console.error("Quiz submission failed:", error.message);
    quizResult.hidden = false;
    quizScore.textContent = "Could not save attempt";
    quizResultText.textContent = "The quiz could not reach the server. Please try again or check that the backend is running.";
    quizSubmitButton.disabled = false;
    quizSubmitButton.textContent = "Try submission again →";
  }
});

quizRestartButton.addEventListener("click", renderQuiz);


// INITIAL LOAD
renderProducts();

renderCart();

loadProducts();

loadQuiz();
