// ===== GLOBAL VARIABLES =====
let cart = [];
let currentProductId = null;

// ===== DOM ELEMENTS =====
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const modal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const modalImg = document.getElementById('modal-img');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalRating = document.getElementById('modal-rating');
const modalDescription = document.getElementById('modal-description');
const modalAddToCart = document.getElementById('modal-add-to-cart');

// ===== PRODUCT DATA =====
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

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {
    loadCartFromStorage();
    setupEventListeners();
    
    // Initialize product display if on homepage
    if (document.getElementById('product-grid')) {
        displayProducts();
    }
}

// ===== CART FUNCTIONS =====
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
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

function updateCart() {
    updateCartCount();
    updateCartItems();
    updateCartTotal();
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function updateCartItems() {
    if (!cartItems) return;
    
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

function showEmptyCart() {
    cartItems.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-bag"></i>
            <p>Your bag is empty</p>
            <p style="font-size: 14px; margin-top: 10px;">Start shopping to add items</p>
        </div>
    `;
}

function updateCartTotal() {
    if (!cartTotal) return;
    
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
}

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

function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    
    updateCart();
    saveCartToStorage();
}

function removeFromCart(e) {
    const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    
    updateCart();
    saveCartToStorage();
}

// ===== CART STORAGE =====
function saveCartToStorage() {
    localStorage.setItem('vmjewels-cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('vmjewels-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// ===== PRODUCT DISPLAY =====
function displayProducts(filter = 'all') {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return;
    
    productGrid.innerHTML = '';
    
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });

    attachProductEventListeners();
}

function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    productCard.setAttribute('data-category', product.category);
    
    const ratingStars = createRatingStars(product.rating);
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

function createRatingStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
    }
    return stars;
}

function createProductBadge(productId) {
    if (productId % 4 === 0) return '<div class="product-badge">New</div>';
    if (productId % 3 === 0) return '<div class="product-badge">Sale</div>';
    return '';
}

function attachProductEventListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', showQuickView);
    });
}

// ===== MODAL FUNCTIONS =====
function showQuickView(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    currentProductId = productId;
    updateModalContent(product);
    showModal();
}

function updateModalContent(product) {
    modalImg.src = product.image;
    modalTitle.textContent = product.name;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modalRating.innerHTML = createRatingStars(product.rating);
    modalDescription.textContent = product.description;
    modalAddToCart.setAttribute('data-id', product.id);
}

function showModal() {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== CART SIDEBAR =====
function showCart() {
    if (!cartSidebar) return;
    
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideCart() {
    if (!cartSidebar) return;
    
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Cart functionality
    if (cartIcon) {
        cartIcon.addEventListener('click', showCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', hideCart);
    }
    
    if (overlay) {
        overlay.addEventListener('click', hideCart);
    }
    
    // Modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }
    
    if (modalAddToCart) {
        modalAddToCart.addEventListener('click', addToCartFromModal);
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                hideModal();
            }
        });
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

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

function handleNewsletterSubmit(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('.newsletter-input');
    const email = emailInput.value;
    
    if (email && validateEmail(email)) {
        // Here you would typically send the email to your server
        alert(`Thank you for subscribing with: ${email}`);
        emailInput.value = '';
    } else {
        alert('Please enter a valid email address.');
    }
}

// ===== UTILITY FUNCTIONS =====
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// ===== EXPORT FOR OTHER FILES =====
// These functions will be available to other JS files
window.vmjewels = {
    products,
    cart,
    addToCart,
    updateCart,
    saveCartToStorage,
    loadCartFromStorage
};