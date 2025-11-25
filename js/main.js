// Product data
const products = [
    {
        id: 1,
        name: "Diamond Solitaire Ring",
        price: 1299.99,
        image: "images/products/rings/diamond-solitaire.jpg",
        category: "rings",
        rating: 5,
        description: "A timeless solitaire ring featuring a brilliant cut diamond set in 18k white gold. Perfect for engagements and special occasions."
    },
    {
        id: 2,
        name: "Pearl Drop Earrings",
        price: 299.99,
        image: "images/products/earrings/pearl-drop.jpg",
        category: "earrings",
        rating: 4,
        description: "Elegant pearl drop earrings with sterling silver settings. These classic earrings add sophistication to any outfit."
    },
    {
        id: 3,
        name: "Gold Chain Necklace",
        price: 599.99,
        image: "images/products/necklaces/gold-chain.jpg",
        category: "necklaces",
        rating: 5,
        description: "A delicate 14k gold chain necklace with a subtle clasp. This versatile piece can be worn alone or layered with other necklaces."
    },
    {
        id: 4,
        name: "Silver Bangle Bracelet",
        price: 199.99,
        image: "images/products/bracelets/silver-bangle.jpg",
        category: "bracelets",
        rating: 4,
        description: "A sleek sterling silver bangle bracelet with a modern design. This piece makes a perfect gift for any occasion."
    },
    {
        id: 5,
        name: "Emerald Cut Diamond Ring",
        price: 1899.99,
        image: "images/products/rings/emerald-cut.jpg",
        category: "rings",
        rating: 5,
        description: "A stunning emerald cut diamond set in a vintage-inspired platinum band. This ring showcases the diamond's clarity and brilliance."
    },
    {
        id: 6,
        name: "Rose Gold Hoop Earrings",
        price: 149.99,
        image: "images/products/earrings/rose-gold-hoops.jpg",
        category: "earrings",
        rating: 4,
        description: "Modern rose gold hoop earrings with a polished finish. These lightweight hoops are comfortable for all-day wear."
    }
];

// Cart functionality
let cart = JSON.parse(localStorage.getItem('vmj-cart')) || [];
const cartIcon = document.getElementById('cart-icon');
const cartSidebar = document.getElementById('cart-sidebar');
const closeCart = document.getElementById('close-cart');
const overlay = document.getElementById('overlay');
const productGrid = document.getElementById('product-grid');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCount = document.querySelector('.cart-count');
const filterBtns = document.querySelectorAll('.filter-btn');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');
const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
const closeMobileNav = document.getElementById('close-mobile-nav');

let currentFilter = 'all';

// Display products
function displayProducts(filter = 'all') {
    productGrid.innerHTML = '';
    const filteredProducts = filter === 'all' 
        ? products 
        : products.filter(product => product.category === filter);
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        // Create rating stars
        let ratingStars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= product.rating) {
                ratingStars += '<i class="fas fa-star"></i>';
            } else {
                ratingStars += '<i class="far fa-star"></i>';
            }
        }
        
        productCard.innerHTML = `
            ${product.id % 4 === 0 ? '<div class="product-badge">New</div>' : ''}
            ${product.id % 3 === 0 ? '<div class="product-badge">Sale</div>' : ''}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">${ratingStars}</div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        productGrid.appendChild(productCard);
    });

    // Add event listeners to Add to Cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
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
    showCart();
    saveCartToStorage();
    
    // Show added to cart feedback
    const button = e.target;
    const originalText = button.textContent;
    button.textContent = 'Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1500);
}

// Update cart display
function updateCart() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    let totalPrice = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your bag is empty</p>
            </div>
        `;
    } else {
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;
            
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
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total price
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    
    // Add event listeners to quantity buttons and remove buttons
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

// Show cart sidebar
function showCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide cart sidebar
function hideCart() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Decrease quantity
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

// Increase quantity
function increaseQuantity(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const item = cart.find(item => item.id === productId);
    item.quantity += 1;
    updateCart();
    saveCartToStorage();
}

// Remove from cart
function removeFromCart(e) {
    const productId = parseInt(e.target.closest('.remove-item').getAttribute('data-id'));
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
}

// Filter products
function filterProducts(e) {
    // Update active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    
    // Filter products
    currentFilter = e.target.getAttribute('data-filter');
    displayProducts(currentFilter);
}

// Show mobile navigation
function showMobileNav() {
    mobileNav.classList.add('active');
    mobileNavOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Hide mobile navigation
function hideMobileNav() {
    mobileNav.classList.remove('active');
    mobileNavOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('vmj-cart', JSON.stringify(cart));
}

// Event listeners
cartIcon.addEventListener('click', showCart);
closeCart.addEventListener('click', hideCart);
overlay.addEventListener('click', hideCart);

filterBtns.forEach(btn => {
    btn.addEventListener('click', filterProducts);
});

mobileMenuBtn.addEventListener('click', showMobileNav);
closeMobileNav.addEventListener('click', hideMobileNav);
mobileNavOverlay.addEventListener('click', hideMobileNav);

// Newsletter form submission
document.querySelector('.newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('.newsletter-input').value;
    alert(`Thank you for subscribing with ${email}! You'll receive our latest updates soon.`);
    this.reset();
});

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    updateCart();
});