// ===== CHECKOUT PAGE FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    initCheckoutPage();
});

function initCheckoutPage() {
    loadCheckoutData();
    setupCheckoutEventListeners();
    setupFormValidation();
    updateOrderSummary();
}

// ===== CHECKOUT DATA =====
let checkoutCart = [];
let appliedPromo = null;

function loadCheckoutData() {
    // Load cart data from localStorage
    const savedCart = localStorage.getItem('vmjewels-checkout-cart');
    const savedPromo = localStorage.getItem('vmjewels-applied-promo');
    
    if (savedCart) {
        checkoutCart = JSON.parse(savedCart);
    } else {
        // Fallback to main cart
        checkoutCart = [...window.vmjewels.cart];
    }
    
    if (savedPromo) {
        appliedPromo = JSON.parse(savedPromo);
    }
    
    displayOrderItems();
}

function displayOrderItems() {
    const orderItems = document.querySelector('.order-items');
    if (!orderItems) return;
    
    if (checkoutCart.length === 0) {
        orderItems.innerHTML = '<p>No items in cart</p>';
        return;
    }
    
    orderItems.innerHTML = '';
    
    checkoutCart.forEach(item => {
        const orderItem = createOrderItem(item);
        orderItems.appendChild(orderItem);
    });
}

function createOrderItem(item) {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    orderItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="order-item-image">
        <div class="order-item-info">
            <div class="order-item-name">${item.name}</div>
            ${item.metal ? `<div class="order-item-details">Metal: ${formatMetalType(item.metal)}</div>` : ''}
            ${item.size ? `<div class="order-item-details">Size: ${item.size}</div>` : ''}
            <div class="order-item-details">Qty: ${item.quantity}</div>
        </div>
        <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
    `;
    
    return orderItem;
}

function formatMetalType(metal) {
    const metalMap = {
        'white-gold': 'White Gold',
        'yellow-gold': 'Yellow Gold',
        'rose-gold': 'Rose Gold'
    };
    
    return metalMap[metal] || metal;
}

// ===== CHECKOUT FORM =====
function setupCheckoutEventListeners() {
    // Shipping options
    document.querySelectorAll('input[name="shipping"]').forEach(radio => {
        radio.addEventListener('change', updateShipping);
    });
    
    // Payment methods
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', togglePaymentForm);
    });
    
    // Form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckoutSubmit);
    }
    
    // Place order button
    const placeOrderBtn = document.querySelector('.place-order-btn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', validateAndSubmit);
    }
}

function updateShipping() {
    updateOrderSummary();
}

function togglePaymentForm() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    const cardForm = document.getElementById('card-form');
    
    if (paymentMethod === 'card') {
        cardForm.style.display = 'block';
    } else {
        cardForm.style.display = 'none';
    }
}

// ===== ORDER SUMMARY =====
function updateOrderSummary() {
    if (checkoutCart.length === 0) return;
    
    const subtotal = checkoutCart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate shipping
    const shippingMethod = document.querySelector('input[name="shipping"]:checked');
    let shipping = 0;
    
    if (shippingMethod) {
        shipping = shippingMethod.value === 'express' ? 15 : 0;
    }
    
    // Apply promo discount if any
    let discount = 0;
    if (appliedPromo) {
        switch(appliedPromo.type) {
            case 'percentage':
                discount = subtotal * appliedPromo.discount;
                break;
            case 'fixed':
                discount = Math.min(appliedPromo.discount, subtotal);
                break;
            case 'shipping':
                shipping = 0;
                break;
        }
    }
    
    const adjustedSubtotal = subtotal - discount;
    const tax = adjustedSubtotal * 0.08; // 8% tax
    const total = adjustedSubtotal + shipping + tax;
    
    // Update summary elements
    const subtotalEl = document.getElementById('order-subtotal');
    const shippingEl = document.getElementById('order-shipping');
    const taxEl = document.getElementById('order-tax');
    const totalEl = document.getElementById('order-total');
    
    if (subtotalEl) subtotalEl.textContent = `$${adjustedSubtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    
    // Show discount if applicable
    if (discount > 0) {
        showDiscountInSummary(discount);
    }
}

function showDiscountInSummary(discount) {
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
    }
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    // Real-time validation
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    // Credit card number formatting
    const cardNumberInput = document.querySelector('input[name="card-number"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', formatCardNumber);
    }
    
    // Expiry date formatting
    const expiryInput = document.querySelector('input[name="expiry"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', formatExpiryDate);
    }
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(e);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // ZIP code validation
    if (field.name === 'zip' && value) {
        const zipRegex = /^\d{5}(-\d{4})?$/;
        if (!zipRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid ZIP code';
        }
    }
    
    // Card number validation
    if (field.name === 'card-number' && value) {
        const cardNumber = value.replace(/\s/g, '');
        if (!luhnCheck(cardNumber) || cardNumber.length < 13) {
            isValid = false;
            errorMessage = 'Please enter a valid card number';
        }
    }
    
    // Expiry date validation
    if (field.name === 'expiry' && value) {
        if (!isValidExpiryDate(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid expiry date (MM/YY)';
        }
    }
    
    // CVV validation
    if (field.name === 'cvv' && value) {
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid CVV';
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: #dc3545;
        font-size: 12px;
        margin-top: 5px;
    `;
}

function clearFieldError(e) {
    const field = e.target;
    field.classList.remove('error');
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function formatCardNumber(e) {
    let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
    
    // Add spaces every 4 characters
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    
    // Limit to 19 characters (16 digits + 3 spaces)
    value = value.substring(0, 19);
    
    e.target.value = value;
}

function formatExpiryDate(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
}

// ===== CHECKOUT SUBMISSION =====
function validateAndSubmit(e) {
    e.preventDefault();
    
    const form = document.getElementById('checkout-form');
    const inputs = form.querySelectorAll('input[required], select[required]');
    let isFormValid = true;
    
    // Validate all required fields
    inputs.forEach(input => {
        const event = new Event('blur');
        input.dispatchEvent(event);
        
        if (input.classList.contains('error')) {
            isFormValid = false;
        }
    });
    
    // Validate payment method specific fields
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    if (paymentMethod === 'card') {
        const cardFields = form.querySelectorAll('#card-form input[required]');
        cardFields.forEach(field => {
            const event = new Event('blur');
            field.dispatchEvent(event);
            
            if (field.classList.contains('error')) {
                isFormValid = false;
            }
        });
    }
    
    if (!isFormValid) {
        alert('Please fix the errors in the form before submitting.');
        return;
    }
    
    if (checkoutCart.length === 0) {
        alert('Your cart is empty. Please add items before placing an order.');
        return;
    }
    
    handleCheckoutSubmit(e);
}

function handleCheckoutSubmit(e) {
    e.preventDefault();
    
    // Show loading state
    const placeOrderBtn = document.querySelector('.place-order-btn');
    const originalText = placeOrderBtn.textContent;
    placeOrderBtn.textContent = 'Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        processOrder()
            .then(orderData => {
                showOrderConfirmation(orderData);
                clearCartAndStorage();
            })
            .catch(error => {
                alert('There was an error processing your order. Please try again.');
                console.error('Order processing error:', error);
                
                // Reset button
                placeOrderBtn.textContent = originalText;
                placeOrderBtn.disabled = false;
            });
    }, 2000);
}

function processOrder() {
    return new Promise((resolve, reject) => {
        // Simulate order processing
        const formData = getFormData();
        const orderData = {
            orderId: generateOrderId(),
            customer: formData,
            items: checkoutCart,
            total: calculateOrderTotal(),
            orderDate: new Date().toISOString(),
            status: 'confirmed'
        };
        
        // Simulate random success/failure
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        if (isSuccess) {
            // Save order to localStorage (in real app, send to backend)
            saveOrderToHistory(orderData);
            resolve(orderData);
        } else {
            reject(new Error('Payment processing failed'));
        }
    });
}

function getFormData() {
    const form = document.getElementById('checkout-form');
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    return data;
}

function calculateOrderTotal() {
    const totalElement = document.getElementById('order-total');
    return parseFloat(totalElement.textContent.replace('$', ''));
}

function generateOrderId() {
    return 'VM' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function saveOrderToHistory(orderData) {
    const orderHistory = JSON.parse(localStorage.getItem('vmjewels-order-history') || '[]');
    orderHistory.unshift(orderData);
    localStorage.setItem('vmjewels-order-history', JSON.stringify(orderHistory));
}

function clearCartAndStorage() {
    // Clear cart
    window.vmjewels.cart = [];
    window.vmjewels.saveCartToStorage();
    window.vmjewels.updateCart();
    
    // Clear checkout data
    localStorage.removeItem('vmjewels-checkout-cart');
    localStorage.removeItem('vmjewels-applied-promo');
}

function showOrderConfirmation(orderData) {
    // Create confirmation modal
    const confirmationHTML = `
        <div class="confirmation-modal" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 12px;
                text-align: center;
                max-width: 500px;
                width: 90%;
            ">
                <div style="font-size: 48px; color: #4CAF50; margin-bottom: 20px;">✓</div>
                <h2 style="color: #333; margin-bottom: 15px;">Order Confirmed!</h2>
                <p style="color: #666; margin-bottom: 10px;">Thank you for your purchase!</p>
                <p style="color: #666; margin-bottom: 20px;">Order ID: <strong>${orderData.orderId}</strong></p>
                <p style="color: #666; margin-bottom: 30px;">A confirmation email has been sent to your email address.</p>
                <button onclick="redirectToHome()" style="
                    background: var(--primary-gold);
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-right: 10px;
                ">Continue Shopping</button>
                <button onclick="viewOrderDetails('${orderData.orderId}')" style="
                    background: transparent;
                    color: var(--primary-gold);
                    border: 2px solid var(--primary-gold);
                    padding: 10px 28px;
                    border-radius: 6px;
                    font-size: 16px;
                    cursor: pointer;
                ">View Order</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmationHTML);
}

// ===== UTILITY FUNCTIONS =====
function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));
        
        if (isEven) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
        
        sum += digit;
        isEven = !isEven;
    }
    
    return sum % 10 === 0;
}

function isValidExpiryDate(expiry) {
    const [month, year] = expiry.split('/').map(Number);
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    
    if (!month || !year || month < 1 || month > 12) {
        return false;
    }
    
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        return false;
    }
    
    return true;
}

// ===== GLOBAL FUNCTIONS FOR CONFIRMATION MODAL =====
window.redirectToHome = function() {
    window.location.href = 'index.html';
};

window.viewOrderDetails = function(orderId) {
    // In a real app, this would navigate to an order details page
    alert(`Order details for ${orderId} would be displayed here.`);
    window.location.href = 'index.html';
};