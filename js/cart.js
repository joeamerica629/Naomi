// ===== CART PAGE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initCartPage();
});

function initCartPage() {
    displayCartItems();
    setupCartEventListeners();
    loadRecentlyViewed();
}

// ===== CART DISPLAY =====
function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cartEmpty = document.getElementById('cart-empty');
    const cart = window.vmjewels.cart;
    
    if (!cartItemsList || !cartEmpty) return;
    
    if (cart.length === 0) {
        cartItemsList.style.display = 'none';
        cartEmpty.style.display = 'block';
        updateCartSummary(0, 0, 0);
        return;
    }
    
    cartItemsList.style.display = 'block';
    cartEmpty.style.display = 'none';
    
    cartItemsList.innerHTML = '';
    
    cart.forEach(item => {
        const cartItemRow = createCartItemRow(item);
        cartItemsList.appendChild(cartItemRow);
    });
    
    updateCartSummary();
    attachCartPageEventListeners();
}

function createCartItemRow(item) {
    const row = document.createElement('div');
    row.className = 'cart-item-row';
    
    const itemTotal = item.price * item.quantity;
    
    row.innerHTML = `
        <div class="cart-item-product">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <h3>${item.name}</h3>
                ${item.metal ? `<p>Metal: ${formatMetalType(item.metal)}</p>` : ''}
                ${item.size ? `<p>Size: ${item.size}</p>` : ''}
            </div>
        </div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-quantity">
            <button class="cart-qty-btn minus" data-id="${item.id}">-</button>
            <input type="number" class="cart-qty-input" value="${item.quantity}" min="1" max="10" data-id="${item.id}">
            <button class="cart-qty-btn plus" data-id="${item.id}">+</button>
        </div>
        <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
        <button class="cart-remove-btn" data-id="${item.id}">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    return row;
}

function formatMetalType(metal) {
    const metalMap = {
        'white-gold': 'White Gold',
        'yellow-gold': 'Yellow Gold',
        'rose-gold': 'Rose Gold',
        'platinum': 'Platinum',
        'silver': 'Sterling Silver'
    };
    
    return metalMap[metal] || metal;
}

// ===== CART INTERACTIONS =====
function setupCartEventListeners() {
    // Proceed to checkout button
    const checkoutBtn = document.getElementById('proceed-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
    
    // Promo code
    const applyPromoBtn = document.getElementById('apply-promo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }
    
    const promoInput = document.getElementById('promo-input');
    if (promoInput) {
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyPromoCode();
            }
        });
    }
}

function attachCartPageEventListeners() {
    // Quantity buttons
    document.querySelectorAll('.cart-qty-btn.minus').forEach(btn => {
        btn.addEventListener('click', handleCartQuantityChange);
    });
    
    document.querySelectorAll('.cart-qty-btn.plus').forEach(btn => {
        btn.addEventListener('click', handleCartQuantityChange);
    });
    
    // Quantity input changes
    document.querySelectorAll('.cart-qty-input').forEach(input => {
        input.addEventListener('change', handleCartInputChange);
    });
    
    // Remove buttons
    document.querySelectorAll('.cart-remove-btn').forEach(btn => {
        btn.addEventListener('click', handleRemoveItem);
    });
}

function handleCartQuantityChange(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const isIncrease = e.target.classList.contains('plus');
    
    const cart = window.vmjewels.cart;
    const item = cart.find(item => item.id === productId);
    
    if (!item) return;
    
    if (isIncrease) {
        if (item.quantity < 10) {
            item.quantity += 1;
        } else {
            alert('Maximum quantity is 10 per item');
            return;
        }
    } else {
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            // If quantity would become 0, remove the item
            window.vmjewels.cart = cart.filter(item => item.id !== productId);
        }
    }
    
    updateCartPage();
}

function handleCartInputChange(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const newQuantity = parseInt(e.target.value);
    
    if (isNaN(newQuantity) || newQuantity < 1) {
        e.target.value = 1;
        return;
    }
    
    if (newQuantity > 10) {
        e.target.value = 10;
        alert('Maximum quantity is 10 per item');
        return;
    }
    
    const cart = window.vmjewels.cart;
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = newQuantity;
    }
    
    updateCartPage();
}

function handleRemoveItem(e) {
    const productId = parseInt(e.target.closest('.cart-remove-btn').getAttribute('data-id'));
    
    if (confirm('Are you sure you want to remove this item from your cart?')) {
        window.vmjewels.cart = window.vmjewels.cart.filter(item => item.id !== productId);
        updateCartPage();
    }
}

function updateCartPage() {
    window.vmjewels.saveCartToStorage();
    window.vmjewels.updateCart();
    displayCartItems();
}

// ===== CART SUMMARY =====
function updateCartSummary(subtotal = null, shipping = null, tax = null) {
    const cart = window.vmjewels.cart;
    
    if (subtotal === null) {
        subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    if (shipping === null) {
        shipping = subtotal > 0 ? (subtotal >= 500 ? 0 : 15) : 0;
    }
    
    if (tax === null) {
        tax = subtotal * 0.08; // 8% tax rate
    }
    
    const total = subtotal + shipping + tax;
    
    // Update summary elements
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('cart-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Update checkout button state
    const checkoutBtn = document.getElementById('proceed-checkout');
    if (checkoutBtn) {
        checkoutBtn.disabled = cart.length === 0;
    }
}

// ===== PROMO CODE =====
let appliedPromo = null;

function applyPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    if (!promoCode) {
        alert('Please enter a promo code');
        return;
    }
    
    // Mock promo codes - in real app, validate against backend
    const validPromos = {
        'WELCOME10': { discount: 0.1, type: 'percentage' },
        'FREESHIP': { discount: 15, type: 'shipping' },
        'SAVE25': { discount: 25, type: 'fixed' }
    };
    
    if (validPromos[promoCode]) {
        appliedPromo = validPromos[promoCode];
        applyPromoDiscount(appliedPromo);
        
        // Show success message
        showPromoMessage('Promo code applied successfully!', 'success');
        promoInput.value = '';
    } else {
        appliedPromo = null;
        showPromoMessage('Invalid promo code', 'error');
    }
}

function applyPromoDiscount(promo) {
    const cart = window.vmjewels.cart;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    let shipping = subtotal >= 500 ? 0 : 15;
    let discount = 0;
    
    switch(promo.type) {
        case 'percentage':
            discount = subtotal * promo.discount;
            break;
        case 'fixed':
            discount = Math.min(promo.discount, subtotal);
            break;
        case 'shipping':
            shipping = 0;
            break;
    }
    
    const adjustedSubtotal = subtotal - discount;
    const tax = adjustedSubtotal * 0.08;
    const total = adjustedSubtotal + shipping + tax;
    
    updateCartSummary(adjustedSubtotal, shipping, tax);
    
    // Show discount line if applicable
    if (discount > 0) {
        addDiscountLine(discount);
    }
}

function addDiscountLine(discount) {
    let discountLine = document.querySelector('.summary-line.discount');
    
    if (!discountLine) {
        const summaryTotals = document.querySelector('.summary-totals');
        discountLine = document.createElement('div');
        discountLine.className = 'summary-line discount';
        discountLine.innerHTML = `
            <span>Discount</span>
            <span style="color: #4CAF50;">-$${discount.toFixed(2)}</span>
        `;
        summaryTotals.insertBefore(discountLine, summaryTotals.querySelector('.summary-line.total'));
    } else {
        discountLine.querySelector('span:last-child').textContent = `-$${discount.toFixed(2)}`;
    }
}

function showPromoMessage(message, type) {
    // Remove existing message
    const existingMessage = document.querySelector('.promo-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageEl = document.createElement('div');
    messageEl.className = `promo-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        margin-top: 10px;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 14px;
        ${type === 'success' ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : ''}
        ${type === 'error' ? 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;' : ''}
    `;
    
    const promoCodeSection = document.querySelector('.promo-code');
    promoCodeSection.appendChild(messageEl);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 3000);
}

// ===== CHECKOUT =====
function proceedToCheckout() {
    const cart = window.vmjewels.cart;
    
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before proceeding to checkout.');
        return;
    }
    
    // Save current cart state for checkout page
    localStorage.setItem('vmjewels-checkout-cart', JSON.stringify(cart));
    localStorage.setItem('vmjewels-applied-promo', JSON.stringify(appliedPromo));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// ===== RECENTLY VIEWED =====
function loadRecentlyViewed() {
    const recentGrid = document.querySelector('.recent-products-grid');
    if (!recentGrid) return;
    
    // Get recently viewed from localStorage
    const recentlyViewed = JSON.parse(localStorage.getItem('vmjewels-recently-viewed') || '[]');
    
    if (recentlyViewed.length === 0) {
        // Show some featured products if no recently viewed
        const featuredProducts = window.vmjewels.products.slice(0, 4);
        displayRecentProducts(featuredProducts, recentGrid);
        return;
    }
    
    displayRecentProducts(recentlyViewed, recentGrid);
}

function displayRecentProducts(products, container) {
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createRecentProductCard(product);
        container.appendChild(productCard);
    });
    
    // Add event listeners
    setTimeout(() => {
        document.querySelectorAll('.recent-product .add-to-cart').forEach(button => {
            button.addEventListener('click', window.vmjewels.addToCart);
        });
    }, 0);
}

function createRecentProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card recent-product';
    
    const ratingStars = createRatingStars(product.rating);
    
    productCard.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-img">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <div class="product-rating">${ratingStars}</div>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
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