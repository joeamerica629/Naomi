// ===== PRODUCT DATA =====
// This array contains all product information
// You can add more products by following the same structure
const products = [
    {
        id: 1,
        name: "Diamond Solitaire Ring",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "rings",
        rating: 5,
        description: "A timeless solitaire ring featuring a brilliant cut diamond set in 18k white gold. Perfect for engagements and special occasions."
    },
    {
        id: 2,
        name: "Pearl Drop Earrings",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "earrings",
        rating: 4,
        description: "Elegant pearl drop earrings with sterling silver settings. These classic earrings add sophistication to any outfit."
    },
    {
        id: 3,
        name: "Gold Chain Necklace",
        price: 599.99,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "necklaces",
        rating: 5,
        description: "A delicate 14k gold chain necklace with a subtle clasp. This versatile piece can be worn alone or layered with other necklaces."
    },
    {
        id: 4,
        name: "Silver Bangle Bracelet",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "bracelets",
        rating: 4,
        description: "A sleek sterling silver bangle bracelet with a modern design. This piece makes a perfect gift for any occasion."
    },
    {
        id: 5,
        name: "Emerald Cut Diamond Ring",
        price: 1899.99,
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "rings",
        rating: 5,
        description: "A stunning emerald cut diamond set in a vintage-inspired platinum band. This ring showcases the diamond's clarity and brilliance."
    },
    {
        id: 6,
        name: "Rose Gold Hoop Earrings",
        price: 149.99,
        image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "earrings",
        rating: 4,
        description: "Modern rose gold hoop earrings with a polished finish. These lightweight hoops are comfortable for all-day wear."
    },
    {
        id: 7,
        name: "Sapphire Pendant Necklace",
        price: 799.99,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "necklaces",
        rating: 5,
        description: "A beautiful blue sapphire pendant suspended from a delicate gold chain. This piece makes a statement while remaining elegant."
    },
    {
        id: 8,
        name: "Tennis Bracelet",
        price: 1299.99,
        image: "https://images.unsplash.com/photo-1588444650700-6c7f0c89d36b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        category: "bracelets",
        rating: 5,
        description: "A classic tennis bracelet featuring a continuous line of brilliant cut diamonds set in white gold. The ultimate in luxury and elegance."
    }
];

// ===== CART FUNCTIONALITY =====
// This array stores all items in the shopping cart
let cart = [];

// ===== DOM ELEMENTS =====
// These variables store references to important HTML elements
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalRating = document.getElementById('modal-rating');
const modalDescription = document.getElementById('modal-description');
const modalAddToCart = document.getElementById('modal-add-to-cart');

// ===== GLOBAL VARIABLES =====
let currentFilter = 'all';
let currentProductId = null;

// ===== INITIALIZATION =====
// This function runs when the page loads
function init() {
    displayProducts();
    setupEventListeners();
    loadCartFromStorage();
}

// ===== PRODUCT DISPLAY FUNCTIONS =====

/**
 * Displays products in the product grid
 * @param {string} filter - Category to filter by ('all', 'rings', 'necklaces', etc.)
 */
function displayProducts(filter = 'all') {
    // Clear existing products
    productGrid.innerHTML = '';
    
    // Filter products based on selected category
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    // Create HTML for each product and add to grid
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });

    // Add event listeners to the new buttons
    attachProductEventListeners();
}

/**
 * Creates HTML for a product card
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    
    // Create rating stars
    const ratingStars = createRatingStars(product.rating);
    
    // Create badge if product is new or on sale
    const badge = createProductBadge(product.id);
    
    productCard.innerHTML = `
        ${badge}
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">${ratingStars}</div>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            <button class="btn btn-outline quick-view" data-id="${product.id}" style="width: 100%; margin-top: 10px;">Quick View</button>
        </div>
    `;
    
    return productCard;
}

/**
 * Creates rating stars HTML
 * @param {number} rating - Product rating (1-5)
 * @returns {string} HTML string of rating stars
 */
function createRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

/**
 * Creates product badge HTML
 * @param {number} productId - Product ID
 * @returns {string} Badge HTML or empty string
 */
function createProductBadge(productId) {
    if (productId % 4 === 0) return '<div class="product-badge">New</div>';
    if (productId % 3 === 0) return '<div class="product-badge">Sale</div>';
    return '';
}

/**
 * Attaches event listeners to product buttons
 */
function attachProductEventListeners() {
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Quick view buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', showQuickView);
    });
}

// ===== CART FUNCTIONS =====

/**
 * Adds a product to the shopping cart
 * @param {Event} e - Click event
 */
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    saveCartToStorage();
    showCart();
    showAddToCartFeedback(e.target);
}

/**
 * Shows feedback when product is added to cart
 * @param {HTMLElement} button - The clicked button
 */
function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    const originalBgColor = button.style.backgroundColor;
    
    button.textContent = 'Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalBgColor;
    }, 1500);
}

/**
 * Updates the cart display
 */
function updateCart() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

/**
 * Updates the cart item count in the header
 */
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
}

/**
 * Updates the cart items in the sidebar
 */
function updateCartItems() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        showEmptyCart();
    } else {
        cart.forEach(item => {
            const cartItem = createCartItem(item);
            cartItems.appendChild(cartItem);
        });
    }
    
    attachCartEventListeners();
}

/**
 * Creates HTML for a cart item
 * @param {Object} item - Cart item object
 * @returns {HTMLElement} Cart item element
 */
function createCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="cart-item-quantity">
                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
        </div>
        <button class="remove-item" data-id="${item.id}">
            <i class="fas fa-times"></i>
        </button>
    `;
    return cartItem;
}

/**
 * Shows empty cart message
 */
function showEmptyCart() {
    cartItems.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-bag"></i>
            <p>Your bag is empty</p>
            <p style="font-size: 14px; margin-top: 10px;">Start shopping to add items</p>
        </div>
    `;
}

/**
 * Updates the cart total price
 */
function updateCartTotal() {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

/**
 * Attaches event listeners to cart buttons
 */
function attachCartEventListeners() {
    document.querySelectorAll('.quantity-btn.minus').forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });
    
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeFromCart);
    });
}

/**
 * Decreases item quantity in cart
 * @param {Event} e - Click event
 */
function decreaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    
    if (item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCart();
    saveCartToStorage();
}

/**
 * Increases item quantity in cart
 * @param {Event} e - Click event
 */
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    
    updateCart();
    saveCartToStorage();
}

/**
 * Removes item from cart
 * @param {Event} e - Click event
 */
function removeFromCart(e) {
    const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    updateCart();
    saveCartToStorage();
}

// ===== CART STORAGE FUNCTIONS =====

/**
 * Saves cart to localStorage
 */
function saveCartToStorage() {
    localStorage.setItem('vmjewels-cart', JSON.stringify(cart));
}

/**
 * Loads cart from localStorage
 */
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('vmjewels-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// ===== FILTER FUNCTIONS =====

/**
 * Filters products by category
 * @param {Event} e - Click event
 */
function filterProducts(e) {
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter products
    currentFilter = e.target.getAttribute('data-filter');
    displayProducts(currentFilter);
}

// ===== MODAL FUNCTIONS =====

/**
 * Shows quick view modal for a product
 * @param {Event} e - Click event
 */
function showQuickView(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    currentProductId = productId;
    updateModalContent(product);
    showModal();
}

/**
 * Updates modal content with product details
 * @param {Object} product - Product object
 */
function updateModalContent(product) {
    modalImg.src = product.image;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modalRating.innerHTML = createRatingStars(product.rating);
    modalDescription.textContent = product.description;
    modalAddToCart.setAttribute('data-id', product.id);
}

/**
 * Shows the modal
 */
function showModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Hides the modal
 */
function hideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== CART SIDEBAR FUNCTIONS =====

/**
 * Shows the cart sidebar
 */
function showCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Hides the cart sidebar
 */
function hideCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== EVENT LISTENER SETUP =====

/**
 * Sets up all event listeners
 */
function setupEventListeners() {
    // Cart functionality
    cartIcon.addEventListener('click', showCart);
    closeCart.addEventListener('click', hideCart);
    overlay.addEventListener('click', hideCart);
    
    // Product filtering
    filterBtns.forEach(btn => {
        btn.addEventListener('click', filterProducts);
    });
    
    // Modal functionality
    closeModal.addEventListener('click', hideModal);
    modalAddToCart.addEventListener('click', addToCartFromModal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            hideModal();
        }
    });
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

/**
 * Handles adding to cart from modal
 */
function addToCartFromModal() {
    const product = products.find(p => p.id === currentProductId);
    
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === currentProductId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    saveCartToStorage();
    hideModal();
    showCart();
}

/**
 * Handles newsletter form submission
 * @param {Event} e - Submit event
 */
function handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('.newsletter-input');
    const email = emailInput.value;
    
    if (email) {
        // Here you would typically send the email to your server
        alert(`Thank you for subscribing with: ${email}`);
        emailInput.value = '';
    }
}

// ===== INITIALIZE THE APPLICATION =====
// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', init);

// ===== ADDITIONAL UTILITY FUNCTIONS =====
// These can be used for future enhancements

/**
 * Formats price with currency symbol
 * @param {number} price - The price to format
 * @returns {string} Formatted price string
 */
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

/**
 * Searches products by name
 * @param {string} query - Search query
 */
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
    );
    displaySearchResults(filteredProducts);
}

/**
 * Displays search results
 * @param {Array} results - Filtered products array
 */
function displaySearchResults(results) {
    productGrid.innerHTML = '';
    results.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
    attachProductEventListeners();
}
