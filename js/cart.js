// ===== CART PAGE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initCartPage();
});

function initCartPage() {
    displayCartItems();
    setupCartEventListeners();
    updateCartSummary();
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
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    if (isIncrease) {
        if (cart[itemIndex].quantity < 10) {
            cart[itemIndex].quantity += 1;
        } else {
            alert('Maximum quantity is 10 per item');
            return;
        }
    } else {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    
    updateCartPage();
}

function handleCartInputChange(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const newQuantity = parseInt(e.target.value);
    const cart = window.vmjewels.cart;
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex === -1) return;
    
    if (isNaN(newQuantity) || newQuantity < 1) {
        e.target.value = 1;
        return;
    }
    
    if (newQuantity > 10) {
        e.target.value = 10;
        alert('Maximum quantity is 10 per item');
        return;
    }
    
    cart[itemIndex].quantity = newQuantity;
    updateCartPage();
}

function handleRemoveItem(e) {
    const productId = parseInt(e.target.closest('.cart-remove-btn').getAttribute('data-id'));
    const cart = window.vmjewels.cart;
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            cart.splice(itemIndex, 1);
            updateCartPage();
        }
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
        if (cart.length === 0) {
            checkoutBtn.textContent = 'Cart is Empty';
        } else {
            checkoutBtn.textContent = 'Proceed to Checkout';
        }
    }
}

// ===== CHECKOUT =====
function proceedToCheckout() {
    const cart = window.vmjewels.cart;
    
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before proceeding to checkout.');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}